const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugPage() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const url = 'https://www.notosiki.co.jp/item/detail?num=MA120-398';
  console.log('ページにアクセス中...');
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // HTMLを保存
  const html = await page.content();
  const htmlPath = path.join(__dirname, 'data', 'debug_carton_detail.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`HTMLを保存: ${htmlPath}`);
  
  // スクリーンショットを保存
  const screenshotPath = path.join(__dirname, 'data', 'debug_carton_detail.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`スクリーンショットを保存: ${screenshotPath}`);
  
  // ページ内のテキストを解析
  const pageText = await page.evaluate(() => {
    // テーブル要素を探す
    const tables = document.querySelectorAll('table');
    const result = [];
    
    tables.forEach((table, idx) => {
      const rows = table.querySelectorAll('tr');
      result.push(`\n=== テーブル ${idx + 1} ===`);
      rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const cellTexts = Array.from(cells).map(c => c.textContent.trim());
        if (cellTexts.length > 0) {
          result.push(cellTexts.join(' | '));
        }
      });
    });
    
    return result.join('\n');
  });
  
  console.log('\n=== ページ内のテーブル内容 ===');
  console.log(pageText);
  
  await browser.close();
}

debugPage();

