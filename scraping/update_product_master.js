const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('商品マスタの更新');
console.log('='.repeat(60));

// 商品実績データを読み込む
const productDataPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
const productContent = fs.readFileSync(productDataPath, 'utf-8');

// CSVを適切にパース（ダブルクォート内の改行を考慮）
function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(f => f)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
  }
  
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(f => f)) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

const rows = parseCSV(productContent);

console.log('\n商品データを解析中...\n');
console.log(`総行数: ${rows.length}行\n`);

const products = [];
const productMap = new Map();

// ヘッダーをスキップして処理
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.length < 10) continue;
  
  const productName = row[1];
  const costPrice = row[2];
  const sku = row[3];
  const janCode = row[4];
  const asin = row[5];
  const fnsku = row[6];
  const hsCode = row[7];
  const supplier = row[8];
  const unitWeight = row[9];
  const setCount = row[10];
  const setWeight = row[11];
  const packingQty = row[13];
  const packingSets = row[14];
  
  // 商品名が有効で、HSコードや数値でない場合のみ追加
  if (productName && 
      productName.length > 3 && 
      !productName.match(/^\d+\.?\d*$/) && 
      !productMap.has(productName)) {
    
    // セット個数から袋数を抽出（例: "10袋" → 10）
    const bagCountMatch = setCount.match(/(\d+)袋/);
    const bagCount = bagCountMatch ? parseInt(bagCountMatch[1]) : 1;
    
    // 常に1セットとして扱う（商品名に「×N袋セット」とあるが、これは1セット分の意味）
    const numberOfSets = 1;
    
    products.push({
      id: products.length + 1,
      productName,
      sku: sku || '',
      janCode: janCode || '',
      asin: asin || '',
      fnsku: fnsku || '',
      hsCode: hsCode || '',
      supplier: supplier || '',
      category: extractCategory(productName),
      unitWeight: unitWeight || '',
      numberOfSets: numberOfSets, // セット数（常に1）
      bagsPerSet: bagCount, // セット内の袋数
      setCount: setCount || '', // 元の表記（例: "10袋"）
      setWeight: setWeight || '',
      costPrice: costPrice || '',
      packingQty: packingQty || '',
      packingSets: packingSets || ''
    });
    
    productMap.set(productName, true);
    console.log(`✓ ${productName}`);
  }
}

console.log(`\n抽出された商品: ${products.length}件\n`);

// カテゴリーと仕入先を抽出
const categories = new Set();
const suppliers = new Set();
products.forEach(p => {
  categories.add(p.category);
  if (p.supplier) suppliers.add(p.supplier);
});

// TypeScriptファイルを生成
const tsContent = `// 商品マスタデータ（自動生成）
// 最終更新: ${new Date().toLocaleString('ja-JP')}

export interface Product {
  id: number;
  productName: string;
  sku: string;
  janCode: string;
  asin: string;
  fnsku?: string;
  hsCode?: string;
  supplier?: string;
  category: string;
  unitWeight?: string;
  numberOfSets: number; // セット数（常に1）
  bagsPerSet: number; // セット内の袋数（または箱数）
  setCount?: string; // 元の表記（例: "10袋"）
  setWeight?: string;
  costPrice?: string;
  packingQty?: string;
  packingSets?: string;
  standardCartonSize?: string;
  inputDate?: string;
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const productCategories = ${JSON.stringify(Array.from(categories), null, 2)};

export const suppliers = ${JSON.stringify(Array.from(suppliers), null, 2)};

export default products;
`;

// 既存のカテゴリー抽出関数
function extractCategory(productName) {
  if (productName.includes('ヨーグルト種菌')) return 'ヨーグルト種菌';
  if (productName.includes('甘酒酵素')) return '甘酒酵素';
  if (productName.includes('米麹')) return '米麹';
  if (productName.includes('黒ゴマアーモンドきな粉')) return 'きな粉';
  if (productName.includes('きな粉')) return 'きな粉';
  if (productName.includes('米の粉')) return '米の粉';
  if (productName.includes('ほしいも')) return 'ほしいも';
  if (productName.includes('黒糖')) return '黒糖';
  return 'その他';
}

const outputPath = path.join(__dirname, '..', 'frontend', 'data', 'products.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`✓ 商品マスタファイル作成: ${outputPath}`);
console.log(`  総商品数: ${products.length}件\n`);

console.log('='.repeat(60));
console.log('✓ 完了！');
console.log('='.repeat(60));

