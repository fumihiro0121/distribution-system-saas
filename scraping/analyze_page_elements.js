const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function analyzePageElements() {
  console.log('ブラウザを起動中...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const url = 'https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet?tagIds=1521%2112%2C13';
  
  console.log('ページにアクセス中...');
  await page.goto(url, { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  // さらに待機
  await page.waitForTimeout(5000);
  
  // ページ上のすべてのテキストを含む要素を分析
  const analysis = await page.evaluate(() => {
    const results = {
      links: [],
      images: [],
      priceElements: [],
      allClasses: new Set(),
      dataAttributes: []
    };
    
    // すべてのaタグを調査
    document.querySelectorAll('a').forEach(a => {
      const text = a.innerText.trim();
      const href = a.href;
      if (text && text.length < 200 && (href.includes('item') || href.includes('product'))) {
        results.links.push({ text, href: href.substring(0, 100) });
      }
    });
    
    // すべての画像を調査
    document.querySelectorAll('img').forEach(img => {
      const src = img.src;
      const alt = img.alt;
      if (src && (src.includes('product') || alt)) {
        results.images.push({ src: src.substring(0, 100), alt });
      }
    });
    
    // 価格らしいテキストを検索
    document.querySelectorAll('*').forEach(elem => {
      const text = elem.innerText || elem.textContent;
      if (text && text.match(/^\s*\d{1,3}(,\d{3})*\s*円\s*$/)) {
        results.priceElements.push({
          text: text.trim(),
          tagName: elem.tagName,
          className: elem.className,
          parentClass: elem.parentElement?.className || ''
        });
      }
      
      // クラス名を収集
      if (elem.className && typeof elem.className === 'string') {
        elem.className.split(' ').forEach(cls => {
          if (cls) results.allClasses.add(cls);
        });
      }
      
      // data属性を収集
      Array.from(elem.attributes || []).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          results.dataAttributes.push({
            name: attr.name,
            value: attr.value.substring(0, 50)
          });
        }
      });
    });
    
    results.allClasses = Array.from(results.allClasses);
    
    return results;
  });
  
  console.log('\n=== 分析結果 ===\n');
  
  console.log(`商品リンク (最初の10件):`);
  analysis.links.slice(0, 10).forEach((link, i) => {
    console.log(`  ${i + 1}. ${link.text}`);
    console.log(`     ${link.href}`);
  });
  
  console.log(`\n商品画像 (最初の10件):`);
  analysis.images.slice(0, 10).forEach((img, i) => {
    console.log(`  ${i + 1}. alt: ${img.alt}`);
    console.log(`     src: ${img.src}`);
  });
  
  console.log(`\n価格要素 (最初の10件):`);
  analysis.priceElements.slice(0, 10).forEach((price, i) => {
    console.log(`  ${i + 1}. ${price.text}`);
    console.log(`     タグ: ${price.tagName}, クラス: ${price.className}`);
    console.log(`     親クラス: ${price.parentClass}`);
  });
  
  console.log(`\n商品関連のクラス名:`);
  const relevantClasses = analysis.allClasses.filter(cls => 
    cls.includes('item') || 
    cls.includes('product') || 
    cls.includes('card') || 
    cls.includes('goods') ||
    cls.includes('Item') ||
    cls.includes('Product') ||
    cls.includes('Card')
  );
  relevantClasses.slice(0, 20).forEach(cls => {
    console.log(`  - ${cls}`);
  });
  
  console.log(`\ndata属性 (ユニークな最初の20件):`);
  const uniqueDataAttrs = [...new Set(analysis.dataAttributes.map(d => d.name))];
  uniqueDataAttrs.slice(0, 20).forEach(attr => {
    console.log(`  - ${attr}`);
  });
  
  // 結果をファイルに保存
  const outputPath = path.join(__dirname, 'data', 'page_analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(`\n分析結果を保存: ${outputPath}`);
  
  await browser.close();
  
  console.log('\n完了しました！');
}

analyzePageElements().catch(console.error);

