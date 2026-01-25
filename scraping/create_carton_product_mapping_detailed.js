const fs = require('fs');
const path = require('path');

function main() {
  console.log('============================================================');
  console.log('段ボールと商品の詳細紐付けマッピング作成');
  console.log('============================================================\n');

  // CSVファイルを読み込み
  const productCsvPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
  const productCsvContent = fs.readFileSync(productCsvPath, 'utf-8');
  
  // 簡易CSVパース
  const lines = productCsvContent.split('\n');
  const headers = lines[0].split(',');
  
  const productRecords = lines.slice(1).map(line => {
    if (!line.trim()) return null;
    const values = line.split(',');
    const record = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index]?.trim() || '';
    });
    return record;
  }).filter(r => r);

  // 段ボールと商品の詳細マッピング
  const cartonProductMapping = {};

  productRecords.forEach(record => {
    const productName = record['商品名']?.trim();
    if (!productName || !isNaN(productName)) return;
    
    // 段ボールサイズ情報を取得
    const lengthCm = parseFloat(record['段ボール縦センチ']);
    const widthCm = parseFloat(record['段ボール横センチ']);
    const heightCm = parseFloat(record['段ボール高さセンチ']);
    
    if (!lengthCm || !widthCm || !heightCm) return;
    
    // セット個数から袋数を抽出（例: "10袋" → 10）
    const setCountStr = record['セット個数'] || '';
    const bagCountMatch = setCountStr.match(/(\d+)袋/);
    const bagCount = bagCountMatch ? parseInt(bagCountMatch[1]) : 1;
    
    // 標準段ボールへの梱包数（袋数）
    const packingQtyStr = record['標準段ボールへの梱包数'] || '';
    const packingBagsMatch = packingQtyStr.match(/(\d+)袋/);
    const packingBags = packingBagsMatch ? parseInt(packingBagsMatch[1]) : 0;
    
    // 標準段ボールへの梱包セット数
    const packingSetsStr = record['標準段ボールへの梱包セット数'] || '';
    const packingSetsMatch = packingSetsStr.match(/(\d+)セット/);
    const packingSets = packingSetsMatch ? parseInt(packingSetsMatch[1]) : 0;
    
    // パレット情報
    const palletFit = record['パレット']?.trim() === 'ぴったり';
    
    // 段ボールコードを生成
    const lengthMm = Math.round(lengthCm * 10);
    const widthMm = Math.round(widthCm * 10);
    const heightMm = Math.round(heightCm * 10);
    
    const cartonCode = `HIST-${lengthMm}-${widthMm}-${heightMm}`;
    
    if (!cartonProductMapping[cartonCode]) {
      cartonProductMapping[cartonCode] = [];
    }
    
    // 詳細情報を含める
    cartonProductMapping[cartonCode].push({
      productName,
      setCount: 1, // 常に1セット（商品名に「×N袋セット」とあるが、これは1セット分の意味）
      bagCount, // セット内の袋数
      packingBags, // 段ボール1箱に入る袋数
      packingSets, // 段ボール1箱に入るセット数
      palletFit
    });
    
    console.log(`✓ ${cartonCode} ← ${productName} (1セット、${bagCount}袋) [段ボール: ${packingBags}袋/${packingSets}セット]${palletFit ? ' [パレットぴったり]' : ''}`);
  });

  console.log(`\n総マッピング数: ${Object.keys(cartonProductMapping).length}件\n`);

  // JSONファイルとして保存
  const outputPath = path.join(__dirname, 'data', 'carton_product_mapping_detailed.json');
  fs.writeFileSync(outputPath, JSON.stringify(cartonProductMapping, null, 2), 'utf-8');

  console.log(`✓ マッピングファイル作成: ${outputPath}`);

  // TypeScriptファイルとしても保存（フロントエンド用）
  const tsContent = `// 段ボールと商品の詳細紐付けマッピング（自動生成）

export interface ProductCartonDetail {
  productName: string;
  setCount: number; // 1セット分の意味
  bagCount: number; // セット内の袋数（または箱数）
  packingBags: number; // 段ボール1箱に入る袋数
  packingSets: number; // 段ボール1箱に入るセット数
  palletFit: boolean; // パレットにぴったり載るか
}

export const cartonProductMapping: { [cartonCode: string]: ProductCartonDetail[] } = ${JSON.stringify(cartonProductMapping, null, 2)};
`;

  const tsMappingPath = path.join(__dirname, '..', 'frontend', 'data', 'carton-product-mapping.ts');
  fs.writeFileSync(tsMappingPath, tsContent, 'utf-8');

  console.log(`✓ TypeScriptマッピングファイル作成: ${tsMappingPath}`);

  console.log('\n============================================================');
  console.log('✓ 完了！');
  console.log('============================================================\n');
}

main();

