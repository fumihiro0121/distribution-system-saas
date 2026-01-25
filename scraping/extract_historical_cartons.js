const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('実績段ボールサイズの抽出と追加');
console.log('='.repeat(60));

// 商品実績データを読み込む
const productDataPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
const productContent = fs.readFileSync(productDataPath, 'utf-8');
const productLines = productContent.split('\n');

// 既存の段ボールデータを読み込む
const cartonDataPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
const cartonContent = fs.readFileSync(cartonDataPath, 'utf-8');
const cartonLines = cartonContent.split('\n');
const cartonHeader = cartonLines[0];

console.log('\n実績段ボールを抽出中...\n');

const historicalCartons = [];
const cartonMap = new Map(); // 重複チェック用

// 商品データから実績段ボールを抽出
for (let i = 1; i < productLines.length; i++) {
  const line = productLines[i].trim();
  if (!line) continue;
  
  const parts = line.split(',');
  if (parts.length < 19) continue;
  
  const productName = parts[1];
  const cartonLength = parts[16]; // 段ボール縦センチ
  const cartonWidth = parts[17];  // 段ボール横センチ
  const cartonHeight = parts[18]; // 段ボール高さセンチ
  const palletFit = parts[15];    // パレット
  const packingQty = parts[13];   // 標準段ボールへの梱包数
  const packingSets = parts[14];  // 標準段ボールへの梱包セット数
  
  // 段ボールサイズがある場合のみ
  if (cartonLength && cartonWidth && cartonHeight && 
      cartonLength !== '' && cartonWidth !== '' && cartonHeight !== '') {
    
    // センチメートル表記から数値を抽出
    const lengthCm = parseFloat(cartonLength.replace('センチ', ''));
    const widthCm = parseFloat(cartonWidth.replace('センチ', ''));
    const heightCm = parseFloat(cartonHeight.replace('センチ', ''));
    
    if (isNaN(lengthCm) || isNaN(widthCm) || isNaN(heightCm)) continue;
    
    // mm単位に変換
    const lengthMm = Math.round(lengthCm * 10);
    const widthMm = Math.round(widthCm * 10);
    const heightMm = Math.round(heightCm * 10);
    
    // ユニークキーを作成
    const key = `${lengthMm}x${widthMm}x${heightMm}`;
    
    if (!cartonMap.has(key)) {
      // 外形三辺合計を計算
      const outerSum = lengthMm + widthMm + heightMm;
      
      // 宅配サイズを判定
      let deliverySize = '宅配120サイズ';
      if (outerSum > 1400) deliverySize = '宅配160サイズ';
      else if (outerSum > 1200) deliverySize = '宅配140サイズ';
      
      // 容量を計算（L）
      const volumeL = (lengthMm * widthMm * heightMm) / 1000000;
      
      // 重量を推定（段ボールの表面積から）
      const surfaceArea = 2 * ((lengthMm * widthMm) + (lengthMm * heightMm) + (widthMm * heightMm)) / 1000000; // m²
      const estimatedWeight = Math.round(surfaceArea * 400); // 5mm A/Fを想定、約400g/m²
      
      // パレット配置情報
      let palletConfig = '';
      if (palletFit && palletFit.includes('ぴったり')) {
        // 1100mm x 1100mm パレットへの配置を計算
        const boxesPerLayer = Math.floor(1100 / lengthMm) * Math.floor(1100 / widthMm);
        const layers = 7; // 仮定
        palletConfig = `1段${boxesPerLayer}箱×${layers}段`;
      }
      
      // 商品番号を生成（実績データ用）
      const code = `HIST-${lengthMm}-${widthMm}-${heightMm}`;
      
      // 商品名を生成
      const name = `【${deliverySize}${palletFit && palletFit.includes('ぴったり') ? '】1100×1100パレットぴったりサイズダンボール箱' : '】実績サイズダンボール箱'}（${lengthMm}×${widthMm}×${heightMm}mm）5mm A/F K5×K5`;
      
      // 価格を推定（サイズに応じて）
      let estimatedPrice = 100;
      if (outerSum <= 1200) estimatedPrice = 120;
      else if (outerSum <= 1400) estimatedPrice = 180;
      else estimatedPrice = 220;
      
      historicalCartons.push({
        code,
        name,
        deliverySize,
        innerDim: `${lengthMm}×${widthMm}×${heightMm}mm`,
        outerSum: `${outerSum}cm`,
        thickness: '5mm A/F',
        format: 'K5×K5',
        palletConfig,
        price: estimatedPrice,
        volume: volumeL.toFixed(1),
        weight: estimatedWeight,
        url: '',
        source: 'historical',
        productName,
        packingQty: packingQty || '',
        packingSets: packingSets || ''
      });
      
      cartonMap.set(key, true);
      
      console.log(`✓ ${productName}: ${lengthCm}×${widthCm}×${heightCm}cm (${packingSets})`);
    }
  }
}

console.log(`\n抽出された実績段ボール: ${historicalCartons.length}件\n`);

// 既存の段ボールデータと実績段ボールを結合
const allLines = [cartonHeader];

// 既存データを追加
for (let i = 1; i < cartonLines.length; i++) {
  const line = cartonLines[i].trim();
  if (line) {
    allLines.push(line);
  }
}

// 実績段ボールを追加
for (const carton of historicalCartons) {
  const line = `${carton.code},"${carton.name}",${carton.deliverySize},${carton.innerDim},${carton.outerSum},${carton.thickness},${carton.format},"${carton.palletConfig}","${carton.price}","${carton.volume}","${carton.weight}",${carton.url}`;
  allLines.push(line);
}

// 新しいCSVファイルに保存
const outputPath = path.join(__dirname, 'data', 'cardboard_products_with_historical.csv');
fs.writeFileSync(outputPath, allLines.join('\n'));

console.log(`✓ 統合ファイル作成: ${outputPath}`);
console.log(`  総件数: ${allLines.length - 1}件（ヘッダー除く）`);
console.log(`  既存: ${cartonLines.length - 1}件`);
console.log(`  実績追加: ${historicalCartons.length}件\n`);

// 元のファイルを置き換え
fs.copyFileSync(outputPath, cartonDataPath);
console.log(`✓ 元のファイルを更新: ${cartonDataPath}`);

// 実績段ボールマッピングファイルを作成（商品名 → 段ボールコード）
const mappingData = {};
for (const carton of historicalCartons) {
  if (!mappingData[carton.productName]) {
    mappingData[carton.productName] = [];
  }
  mappingData[carton.productName].push({
    cartonCode: carton.code,
    packingSets: carton.packingSets,
    packingQty: carton.packingQty
  });
}

const mappingPath = path.join(__dirname, 'data', 'historical_carton_mapping.json');
fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2));
console.log(`✓ 実績段ボールマッピング作成: ${mappingPath}\n`);

console.log('='.repeat(60));
console.log('✓ 完了！');
console.log('='.repeat(60));

