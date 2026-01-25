const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// CSVファイルを読み込む
const csvPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');

// バッチサイズ（一度に処理する件数）
const BATCH_SIZE = 50;

// 1つの段ボール詳細を取得（リトライ機能付き）
async function fetchCartonDetails(url, code, browser, retryCount = 0) {
  const MAX_RETRIES = 1; // リトライ回数を1回に削減
  let page = null;
  
  try {
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // 60秒に短縮
    await page.setDefaultTimeout(60000);
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // domcontentloadedに変更してさらに早く処理
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // ページの内容を取得
    const details = await page.evaluate(() => {
      // 容量と重量をテーブルから取得
      let volume = null;
      let weight = null;
      
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 2) {
            const label = cells[0].textContent.trim();
            const value = cells[1].textContent.trim();
            
            if (label.includes('容量')) {
              const volumeMatch = value.match(/([\d,]+\.?\d*)/);
              if (volumeMatch) {
                volume = parseFloat(volumeMatch[1].replace(/,/g, ''));
              }
            }
            
            if (label.includes('重量')) {
              const weightMatch = value.match(/([\d,]+\.?\d*)/);
              if (weightMatch) {
                weight = parseFloat(weightMatch[1].replace(/,/g, ''));
              }
            }
          }
        });
      });
      
      // 価格データをdata属性から取得
      const prices = [];
      const priceElements = document.querySelectorAll('[data-property-key="unit-price"]');
      priceElements.forEach(el => {
        const text = el.textContent.trim();
        const priceMatch = text.match(/([\d,]+\.?\d*)\s*円/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1].replace(/,/g, ''));
          prices.push(price);
        }
      });
      
      // 最安値を取得
      let minPrice = null;
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
      }
      
      // minPriceが取れなかった場合、spanから「円」を含むテキストを探す
      if (!minPrice) {
        const yenElements = document.querySelectorAll('span');
        const yenPrices = [];
        yenElements.forEach(el => {
          const text = el.textContent.trim();
          // 「XX円」または「XX.X円」の形式
          const match = text.match(/^([\d,]+\.?\d*)\s*円$/);
          if (match) {
            const price = parseFloat(match[1].replace(/,/g, ''));
            if (!isNaN(price) && price > 0 && price < 10000) { // 妥当な範囲の価格のみ
              yenPrices.push(price);
            }
          }
        });
        
        if (yenPrices.length > 0) {
          minPrice = Math.min(...yenPrices);
        }
      }
      
      return { volume, weight, minPrice };
    });
    
    await page.close();
    return details;
    
  } catch (error) {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        // ページクローズのエラーは無視
      }
    }
    
    if (retryCount < MAX_RETRIES) {
      console.error(`  ${code}: エラー発生、リトライします (${retryCount + 1}/${MAX_RETRIES}): ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
      return fetchCartonDetails(url, code, browser, retryCount + 1);
    } else {
      console.error(`  ${code}: 最大リトライ回数に達しました - ${error.message}`);
      return { volume: null, weight: null, minPrice: null };
    }
  }
}

// メイン処理
async function main() {
  const startIndex = process.argv[2] ? parseInt(process.argv[2]) : 1;
  const endIndex = process.argv[3] ? parseInt(process.argv[3]) : lines.length;
  
  console.log(`=== 段ボール価格・容量・重量の更新 (${startIndex}〜${endIndex}件目) ===\n`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 60000, // プロトコルタイムアウトを60秒に短縮
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });
  
  const updatedLines = [];
  const results = [];
  
  for (let i = startIndex; i < Math.min(endIndex, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVの行をパース
    const match = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]*),([^,]*),(".*?"|[^,]*),(.*)$/);
    if (!match) {
      updatedLines.push(line);
      continue;
    }
    
    const [_, code, name, deliverySize, innerDimStr, outerSum, thickness, format, palletStr, priceStr, url] = match;
    
    console.log(`[${i}/${endIndex-1}] ${code.trim()}...`);
    
    // 詳細を取得
    const details = await fetchCartonDetails(url.trim(), code.trim(), browser);
    
    // 取得した情報を表示
    console.log(`  容量: ${details.volume || 'N/A'}L, 重量: ${details.weight || 'N/A'}g, 最安単価: ${details.minPrice || 'N/A'}円`);
    
    // CSVの行を更新
    const newPrice = details.minPrice || 300; // デフォルト300円
    const volume = details.volume !== null ? details.volume : '';
    const weight = details.weight !== null ? details.weight : '';
    
    const updatedLine = `${code},${name},${deliverySize},${innerDimStr},${outerSum},${thickness},${format},${palletStr},"${newPrice}","${volume}","${weight}",${url}`;
    updatedLines.push(updatedLine);
    
    results.push({
      code: code.trim(),
      price: newPrice,
      volume: volume,
      weight: weight
    });
    
    // サーバー負荷を考慮して少し待機
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  await browser.close();
  
  // 結果を保存
  const outputPath = path.join(__dirname, 'data', `cardboard_batch_${startIndex}_${endIndex}.csv`);
  const newHeader = '商品番号,商品名,宅配サイズ,内寸,外形三辺合計,厚み,形式,パレット配置,価格,容量(L),重量(g),URL';
  fs.writeFileSync(outputPath, newHeader + '\n' + updatedLines.join('\n'));
  console.log(`\n✓ バッチ処理完了: ${outputPath}`);
  
  // 統計情報
  const withPrice = results.filter(r => r.price && r.price !== 300).length;
  const withVolume = results.filter(r => r.volume !== '').length;
  const withWeight = results.filter(r => r.weight !== '').length;
  
  console.log(`\n=== 統計 ===`);
  console.log(`総処理数: ${results.length}件`);
  console.log(`価格取得成功: ${withPrice}件 (${(withPrice/results.length*100).toFixed(1)}%)`);
  console.log(`容量取得成功: ${withVolume}件 (${(withVolume/results.length*100).toFixed(1)}%)`);
  console.log(`重量取得成功: ${withWeight}件 (${(withWeight/results.length*100).toFixed(1)}%)`);
}

main().catch(console.error);

