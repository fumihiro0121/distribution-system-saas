const fs = require('fs');
const path = require('path');

function main() {
  console.log('============================================================');
  console.log('段ボールと商品の紐付けマッピング作成');
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

  // 実績段ボールと商品のマッピング
  const cartonProductMapping = {};

  productRecords.forEach(record => {
    const productName = record['商品名']?.trim();
    if (!productName || !isNaN(productName)) return;
    
    // 段ボールサイズ情報を取得
    const lengthCm = parseFloat(record['段ボール縦センチ']);
    const widthCm = parseFloat(record['段ボール横センチ']);
    const heightCm = parseFloat(record['段ボール高さセンチ']);
    
    if (!lengthCm || !widthCm || !heightCm) return;
    
    // 段ボールコードを生成（実績段ボールのコード形式に合わせる）
    // 小数点を含むサイズを整数化（例: 34.1 → 341, 22.6 → 226）
    const lengthMm = Math.round(lengthCm * 10);
    const widthMm = Math.round(widthCm * 10);
    const heightMm = Math.round(heightCm * 10);
    
    const cartonCode = `HIST-${lengthMm}-${widthMm}-${heightMm}`;
    
    if (!cartonProductMapping[cartonCode]) {
      cartonProductMapping[cartonCode] = [];
    }
    
    cartonProductMapping[cartonCode].push(productName);
    
    console.log(`✓ ${cartonCode} ← ${productName}`);
  });

  console.log(`\n総マッピング数: ${Object.keys(cartonProductMapping).length}件\n`);

  // JSONファイルとして保存
  const outputPath = path.join(__dirname, 'data', 'carton_product_mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(cartonProductMapping, null, 2), 'utf-8');

  console.log(`✓ マッピングファイル作成: ${outputPath}`);

  // TypeScriptファイルとしても保存（フロントエンド用）
  const tsContent = `// 段ボールと商品の紐付けマッピング（自動生成）

export const cartonProductMapping: { [cartonCode: string]: string[] } = ${JSON.stringify(cartonProductMapping, null, 2)};
`;

  const tsMappingPath = path.join(__dirname, '..', 'frontend', 'data', 'carton-product-mapping.ts');
  fs.writeFileSync(tsMappingPath, tsContent, 'utf-8');

  console.log(`✓ TypeScriptマッピングファイル作成: ${tsMappingPath}`);

  console.log('\n============================================================');
  console.log('✓ 完了！');
  console.log('============================================================\n');
}

main();

