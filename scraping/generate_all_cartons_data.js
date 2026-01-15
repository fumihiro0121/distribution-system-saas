const fs = require('fs');
const path = require('path');

// CSVファイルを読み込む
const csvPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// CSVをパース
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

const cartons = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // CSVの行をパース（価格に"7 円"のようなカンマ区切りが含まれるため特別処理）
  const match = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]*),([^,]*),(".*?"|[^,]*),(.*)$/);
  
  if (!match) continue;
  
  const [_, code, name, deliverySize, innerDimStr, outerSum, thickness, format, palletStr, priceStr, url] = match;
  
  // 内寸をパース（例: "450×300×230mm" -> {length: 450, width: 300, height: 230}）
  const innerMatch = innerDimStr.match(/(\d+)×(\d+)×(\d+)/);
  if (!innerMatch) continue;
  
  const innerLength = parseInt(innerMatch[1]);
  const innerWidth = parseInt(innerMatch[2]);
  const innerHeight = parseInt(innerMatch[3]);
  
  // 価格をパース（例: "7 円" -> 7, "" -> 300）
  let price = 300; // デフォルト価格
  const priceMatch = priceStr.match(/(\d+)/);
  if (priceMatch) {
    price = parseInt(priceMatch[1]);
  }
  
  // パレット配置をパース（例: "1段8箱×7段"）
  let palletConfig = null;
  const palletMatch = palletStr.match(/1段(\d+)箱×(\d+)段/);
  if (palletMatch) {
    const boxesPerLayer = parseInt(palletMatch[1]);
    const layers = parseInt(palletMatch[2]);
    palletConfig = {
      boxesPerLayer,
      layers,
      total: boxesPerLayer * layers
    };
  }
  
  cartons.push({
    code: code.trim(),
    name: name.trim(),
    innerLength,
    innerWidth,
    innerHeight,
    deliverySize: deliverySize.trim(),
    thickness: thickness.trim(),
    format: format.trim(),
    price,
    url: url.trim(),
    palletConfig
  });
}

console.log(`✓ ${cartons.length}件の段ボールデータを読み込みました`);

// TypeScriptファイルを生成
const tsContent = `// 全段ボールデータ（cardboard_products_2026-01-14T22-44-17.csvから自動生成）
import { products } from './products';

export interface Carton {
  code: string;
  name: string;
  innerLength: number;
  innerWidth: number;
  innerHeight: number;
  deliverySize: string;
  thickness: string;
  format: string;
  price: number;
  url: string;
  palletConfig: {
    boxesPerLayer: number;
    layers: number;
    total: number;
  } | null;
}

// 内寸から容積を計算（mm³）
export function calculateVolume(length: number, width: number, height: number): number {
  return length * width * height;
}

// 段ボールの重さを推定（kg）
// 内寸から外寸を推定し、表面積から重さを計算
export function estimateCartonWeight(length: number, width: number, height: number, thickness: string): number {
  // 厚み分を追加して外寸を推定（mm）
  const thicknessValue = thickness.includes('3mm') ? 3 : thickness.includes('5mm') ? 5 : thickness.includes('8mm') ? 8 : 5;
  const outerLength = length + thicknessValue * 2;
  const outerWidth = width + thicknessValue * 2;
  const outerHeight = height + thicknessValue * 2;
  
  // 表面積を計算（m²）
  const surfaceArea = 2 * (
    (outerLength * outerWidth) + 
    (outerLength * outerHeight) + 
    (outerWidth * outerHeight)
  ) / 1000000; // mm² to m²
  
  // 段ボールの重さを推定（kg/m²）
  let weightPerM2 = 0.4; // デフォルト 400g/m²
  if (thickness.includes('3mm') || thickness.includes('B/F')) {
    weightPerM2 = 0.25; // 3mm B/F: 約250g/m²
  } else if (thickness.includes('5mm') || thickness.includes('A/F')) {
    weightPerM2 = 0.4; // 5mm A/F: 約400g/m²
  } else if (thickness.includes('8mm') || thickness.includes('W/F')) {
    weightPerM2 = 0.6; // 8mm W/F: 約600g/m²
  } else if (thickness.includes('強化')) {
    weightPerM2 = 0.5; // 強化段ボール: 約500g/m²
  }
  
  return surfaceArea * weightPerM2;
}

// 段ボールがAmazon FBA/AWDの制約を満たすかチェック
// 1辺が63.5cm (635mm)以下、重さが23kg以下
export function checkAmazonFBACompliance(
  length: number, 
  width: number, 
  height: number, 
  cartonWeight: number,
  productWeight: number,
  quantity: number
): {
  isCompliant: boolean;
  sizeOk: boolean;
  weightOk: boolean;
  maxDimension: number;
  totalWeight: number;
} {
  const maxDimension = Math.max(length, width, height) / 10; // mm to cm
  const sizeOk = maxDimension <= 63.5;
  
  const totalWeight = cartonWeight + (productWeight * quantity);
  const weightOk = totalWeight <= 23;
  
  return {
    isCompliant: sizeOk && weightOk,
    sizeOk,
    weightOk,
    maxDimension,
    totalWeight
  };
}

// 全段ボールデータ（${cartons.length}件）
export const allCartons: Carton[] = ${JSON.stringify(cartons, null, 2)};

// 商品マスタの実績データ
const productMasterData: Record<string, {
  historicalCarton: { length: number; width: number; height: number };
  bagsInCarton: number;
}> = {
  'ヨーグルト種菌1袋セット': {
    historicalCarton: { length: 540, width: 410, height: 190 },
    bagsInCarton: 120
  },
  '甘酒酵素1袋セット': {
    historicalCarton: { length: 540, width: 410, height: 190 },
    bagsInCarton: 120
  },
  '米麹1袋セット': {
    historicalCarton: { length: 545, width: 365, height: 255 },
    bagsInCarton: 30
  },
  '黒ゴマアーモンドきな粉150g×1袋セット': {
    historicalCarton: { length: 530, width: 380, height: 350 },
    bagsInCarton: 110
  },
  'きな粉150g×1袋セット': {
    historicalCarton: { length: 530, width: 380, height: 350 },
    bagsInCarton: 120
  },
  'きな粉 500g×1袋セット': {
    historicalCarton: { length: 540, width: 380, height: 350 },
    bagsInCarton: 60
  },
};

// 商品マスタから容量を計算する関数
export function calculateCartonCapacity(
  cartonVolume: number,
  productUnitVolume: number,
  marginPercent: number = 10
): number {
  const usableVolume = cartonVolume * (100 - marginPercent) / 100;
  const rawCapacity = Math.floor(usableVolume / productUnitVolume);
  // 5の単位で切り下げ
  return Math.floor(rawCapacity / 5) * 5;
}

// 商品の単位容積を取得（mm³）
export function getProductUnitVolume(productName: string): number {
  const data = productMasterData[productName];
  
  if (!data) {
    return 500000; // デフォルト値
  }
  
  const { historicalCarton, bagsInCarton } = data;
  const totalVolume = historicalCarton.length * historicalCarton.width * historicalCarton.height;
  const volumePerBag = totalVolume / bagsInCarton;
  
  return volumePerBag;
}

// 商品の単品重さを取得（kg）
export function getProductUnitWeight(productName: string): number {
  const product = products.find(p => p.productName === productName);
  
  if (!product || !product.unitWeight) {
    return 0.2; // デフォルト値 200g
  }
  
  // "0.16kg" のような文字列から数値を抽出
  const match = product.unitWeight.match(/(\\d+\\.?\\d*)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return 0.2;
}
`;

const outputPath = path.join(__dirname, '..', 'frontend', 'data', 'all-cartons.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`✓ ${outputPath} を生成しました`);
console.log(`  全${cartons.length}件の段ボールデータを含んでいます`);

