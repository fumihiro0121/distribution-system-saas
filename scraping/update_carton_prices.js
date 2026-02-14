const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// CSVファイルを読み込む
const csvPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');

// 1つの段ボール詳細を取得
async function fetchCartonDetails(url, code, browser) {
  const page = await browser.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
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
      
      // 価格データをscriptタグから取得
      let prices = [];
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        const content = script.textContent;
        // unit-priceとquantityのペアを探す
        const priceMatches = [...content.matchAll(/"quantity"[^}]*"value":"([^"]+)"[^}]*"unit-price"[^}]*"value":"([^"]+)"/g)];
        priceMatches.forEach(match => {
          const quantity = match[1];
          const price = match[2];
          const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
          if (!isNaN(priceNum)) {
            prices.push({ quantity, price: priceNum });
          }
        });
        
        // 逆パターンも試す
        const priceMatches2 = [...content.matchAll(/"unit-price"[^}]*"value":"([^"]+)"[^}]*"quantity"[^}]*"value":"([^"]+)"/g)];
        priceMatches2.forEach(match => {
          const price = match[1];
          const quantity = match[2];
          const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
          if (!isNaN(priceNum)) {
            prices.push({ quantity, price: priceNum });
          }
        });
      });
      
      // 最安値を取得
      let minPrice = null;
      if (prices.length > 0) {
        prices.sort((a, b) => a.price - b.price);
        minPrice = prices[0].price;
      }
      
      return { volume, weight, minPrice };
    });
    
    await page.close();
    return details;
    
  } catch (error) {
    console.error(`  ${code}: エラー - ${error.message}`);
    await page.close();
    return { volume: null, weight: null, minPrice: null };
  }
}

// 全件処理
async function updateAllCartons() {
  console.log('=== 段ボール価格・容量・重量の更新を開始 ===\n');
  console.log(`総件数: ${lines.length - 1}件\n`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const updatedLines = [lines[0]]; // ヘッダー
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSVの行をパース
    const match = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]*),([^,]*),(".*?"|[^,]*),(.*)$/);
    if (!match) {
      updatedLines.push(line);
      continue;
    }
    
    const [_, code, name, deliverySize, innerDimStr, outerSum, thickness, format, palletStr, priceStr, url] = match;
    
    console.log(`[${i}/${lines.length - 1}] ${code.trim()}...`);
    
    // 詳細を取得
    const details = await fetchCartonDetails(url.trim(), code.trim(), browser);
    
    // 取得した情報を表示
    console.log(`  容量: ${details.volume}L, 重量: ${details.weight}g, 最安単価: ${details.minPrice}円`);
    
    // CSVの行を更新
    const newPrice = details.minPrice || 300; // デフォルト300円
    const volume = details.volume || '';
    const weight = details.weight || '';
    
    const updatedLine = `${code},${name},${deliverySize},${innerDimStr},${outerSum},${thickness},${format},${palletStr},"${newPrice} 円","${volume}","${weight}",${url}`;
    updatedLines.push(updatedLine);
    
    results.push({
      code: code.trim(),
      price: newPrice,
      volume: volume,
      weight: weight
    });
    
    // 10件ごとに中間保存
    if (i % 10 === 0) {
      const backupPath = path.join(__dirname, 'data', `cardboard_products_backup_${i}.csv`);
      fs.writeFileSync(backupPath, updatedLines.join('\n'));
      console.log(`  → 中間保存: ${backupPath}\n`);
    }
    
    // サーバー負荷を考慮して少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  await browser.close();
  
  // 新しいヘッダー（容量と重量の列を追加）
  const newHeader = '商品番号,商品名,宅配サイズ,内寸,外形三辺合計,厚み,形式,パレット配置,価格,容量(L),重量(g),URL';
  updatedLines[0] = newHeader;
  
  // 更新されたCSVを保存
  const newCsvPath = path.join(__dirname, 'data', 'cardboard_products_updated.csv');
  fs.writeFileSync(newCsvPath, updatedLines.join('\n'));
  console.log(`\n✓ 更新完了: ${newCsvPath}`);
  
  // 元のファイルをバックアップ
  const backupPath = path.join(__dirname, 'data', 'cardboard_products_original_backup.csv');
  fs.copyFileSync(csvPath, backupPath);
  console.log(`✓ バックアップ作成: ${backupPath}`);
  
  // 元のファイルを置き換え
  fs.copyFileSync(newCsvPath, csvPath);
  console.log(`✓ 元のファイルを更新: ${csvPath}`);
  
  // 統計情報
  const withPrice = results.filter(r => r.price && r.price !== 300).length;
  const withVolume = results.filter(r => r.volume).length;
  const withWeight = results.filter(r => r.weight).length;
  
  console.log(`\n=== 統計 ===`);
  console.log(`価格取得成功: ${withPrice}件 / ${results.length}件`);
  console.log(`容量取得成功: ${withVolume}件 / ${results.length}件`);
  console.log(`重量取得成功: ${withWeight}件 / ${results.length}件`);
}

// 実行
updateAllCartons().catch(console.error);






