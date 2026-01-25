const puppeteer = require('puppeteer');

async function debugPrice() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const url = 'https://www.notosiki.co.jp/item/detail?num=MA120-398';
  console.log('ページにアクセス中...\n');
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // ページ内のすべての価格らしきテキストを探す
  const priceInfo = await page.evaluate(() => {
    const results = [];
    
    // 方法1: すべてのテキストノードから価格を探す
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text.match(/\d+[,.]?\d*\s*円/) || text.match(/単価/) || text.match(/枚あたり/)) {
        textNodes.push(text);
      }
    }
    
    results.push({ method: 'テキストノード', data: textNodes.slice(0, 20) });
    
    // 方法2: data属性を持つ要素から探す
    const dataElements = document.querySelectorAll('[data-property-key]');
    const dataAttrs = [];
    dataElements.forEach(el => {
      const key = el.getAttribute('data-property-key');
      const text = el.textContent.trim();
      if (key === 'unit-price' || key === 'quantity' || text.match(/\d+[,.]?\d*\s*円/)) {
        dataAttrs.push({ key, text: text.substring(0, 50) });
      }
    });
    
    results.push({ method: 'data属性', data: dataAttrs });
    
    // 方法3: classNameに price を含む要素
    const priceElements = document.querySelectorAll('[class*="price"], [class*="Price"]');
    const priceClasses = [];
    priceElements.forEach(el => {
      const text = el.textContent.trim();
      if (text) {
        priceClasses.push({ className: el.className, text: text.substring(0, 50) });
      }
    });
    
    results.push({ method: 'priceクラス', data: priceClasses.slice(0, 10) });
    
    // 方法4: 「円」を含むspan要素
    const yenElements = document.querySelectorAll('span');
    const yenTexts = [];
    yenElements.forEach(el => {
      const text = el.textContent.trim();
      if (text.includes('円') && text.match(/\d/)) {
        yenTexts.push(text);
      }
    });
    
    results.push({ method: '円を含むspan', data: yenTexts.slice(0, 20) });
    
    return results;
  });
  
  console.log('=== 価格情報の検索結果 ===\n');
  priceInfo.forEach(info => {
    console.log(`【${info.method}】`);
    console.log(JSON.stringify(info.data, null, 2));
    console.log('');
  });
  
  await browser.close();
}

debugPrice();

