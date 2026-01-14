const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function saveRenderedHTML() {
  console.log('ブラウザを起動中...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const url = 'https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet?tagIds=1521%2112%2C13';
  
  console.log('ページにアクセス中...');
  console.log(`URL: ${url}\n`);
  
  await page.goto(url, { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  // JavaScriptが実行されるまで待機
  await page.waitForTimeout(5000);
  
  // スクリーンショットを保存
  const screenshotPath = path.join(__dirname, 'data', 'rendered_page.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`✓ スクリーンショットを保存: ${screenshotPath}\n`);
  
  // レンダリング後のHTMLを取得
  const html = await page.content();
  
  // HTMLを保存
  const htmlPath = path.join(__dirname, 'data', 'rendered_page.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`✓ レンダリング後のHTMLを保存: ${htmlPath}\n`);
  
  // ページタイトルを表示
  const title = await page.title();
  console.log(`ページタイトル: ${title}\n`);
  
  // 商品要素の数を確認
  const productSelectors = [
    '[class*="product"]',
    '[class*="item"]',
    '[class*="goods"]',
    '[class*="card"]',
    'article'
  ];
  
  console.log('商品要素を検索中...\n');
  for (const selector of productSelectors) {
    const count = await page.$$eval(selector, elements => elements.length);
    if (count > 0) {
      console.log(`  ${selector}: ${count}個の要素`);
      
      // 最初の要素のHTMLを表示
      const firstElemHTML = await page.$eval(selector, elem => elem.outerHTML);
      const htmlSnippet = firstElemHTML.substring(0, 500);
      console.log(`\n  最初の要素のHTML (抜粋):\n${htmlSnippet}...\n`);
    }
  }
  
  await browser.close();
  
  console.log('\n完了しました！');
  console.log('rendered_page.html と rendered_page.png を確認してください。');
}

saveRenderedHTML().catch(console.error);

