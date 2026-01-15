const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function fetchSpreadsheetWithPuppeteer() {
  console.log('ブラウザを起動中...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const url = 'https://docs.google.com/spreadsheets/d/1nu71ZJOTy_hcMVRYnZbHGkU2OirBKeXmdAUQmpbrTFc/edit?gid=0#gid=0';
  
  console.log('スプレッドシートにアクセス中...');
  console.log(`URL: ${url}\n`);
  
  try {
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    // 少し待機
    await page.waitForTimeout(3000);
    
    // スクリーンショットを保存
    const screenshotPath = path.join(__dirname, 'data', 'spreadsheet_screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`スクリーンショットを保存: ${screenshotPath}\n`);
    
    // ページのHTMLを保存
    const html = await page.content();
    const htmlPath = path.join(__dirname, 'data', 'spreadsheet_page.html');
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`HTMLを保存: ${htmlPath}\n`);
    
    // ページタイトルを確認
    const title = await page.title();
    console.log(`ページタイトル: ${title}\n`);
    
    // テーブルデータを抽出（公開されている場合）
    const data = await page.evaluate(() => {
      const rows = [];
      
      // 複数の方法でデータを探す
      
      // 方法1: テーブル要素から
      const tables = document.querySelectorAll('table');
      if (tables.length > 0) {
        tables.forEach(table => {
          const tableRows = table.querySelectorAll('tr');
          tableRows.forEach(tr => {
            const cells = [];
            tr.querySelectorAll('td, th').forEach(cell => {
              cells.push(cell.innerText.trim());
            });
            if (cells.length > 0) {
              rows.push(cells);
            }
          });
        });
      }
      
      // 方法2: Google Sheetsの特定の要素から
      const gridCells = document.querySelectorAll('[role="gridcell"]');
      if (gridCells.length > 0 && rows.length === 0) {
        console.log(`Found ${gridCells.length} grid cells`);
      }
      
      return {
        rowCount: rows.length,
        rows: rows.slice(0, 10), // 最初の10行を返す
        hasData: rows.length > 0
      };
    });
    
    console.log(`データ抽出結果:`);
    console.log(`  行数: ${data.rowCount}`);
    console.log(`  データ取得: ${data.hasData ? '成功' : '失敗'}\n`);
    
    if (data.hasData) {
      console.log('最初の10行:');
      data.rows.forEach((row, i) => {
        console.log(`  ${i + 1}. ${row.join(' | ')}`);
      });
      
      // CSVとして保存
      const csvData = data.rows.map(row => 
        row.map(cell => {
          // カンマや改行を含む場合はダブルクォートで囲む
          if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      ).join('\n');
      
      const csvPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
      fs.writeFileSync(csvPath, '\uFEFF' + csvData, 'utf-8');
      console.log(`\nCSVファイルとして保存: ${csvPath}`);
    } else {
      console.log('スプレッドシートが非公開または、ログインが必要です。');
      console.log('スプレッドシートの共有設定を「リンクを知っている全員が閲覧可能」に変更してください。');
    }
    
    await browser.close();
    
    return data.hasData;
    
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    await browser.close();
    throw error;
  }
}

if (require.main === module) {
  fetchSpreadsheetWithPuppeteer();
}

module.exports = fetchSpreadsheetWithPuppeteer;

