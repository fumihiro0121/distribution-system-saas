// 全段ボールデータ（cardboard_products_2026-01-14T22-44-17.csvから）
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

// パレット配置情報を抽出
function extractPalletConfig(name: string): {
  boxesPerLayer: number;
  layers: number;
  total: number;
} | null {
  const match = name.match(/［1段(\d+)箱×(\d+)段］/);
  if (match) {
    const boxesPerLayer = parseInt(match[1]);
    const layers = parseInt(match[2]);
    return {
      boxesPerLayer,
      layers,
      total: boxesPerLayer * layers
    };
  }
  return null;
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

// サンプルデータ（実際には全1109件をインポート）
// ここでは主要な段ボールのみを含めます
export const allCartons: Carton[] = [
  // ヨーグルト種菌・甘酒酵素向け
  {
    code: 'MAS140-070',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（670×390×180mm）5mm A/F 白C5×C5',
    innerLength: 670,
    innerWidth: 390,
    innerHeight: 180,
    deliverySize: '宅配140サイズ',
    thickness: '5mm A/F',
    format: '白C5×C5',
    price: 350,
    url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-070',
    palletConfig: extractPalletConfig('［1段4箱×9段］')
  },
  {
    code: 'MAS140-121',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（614×454×168mm）3mm B/F 白C5×C5',
    innerLength: 614,
    innerWidth: 454,
    innerHeight: 168,
    deliverySize: '宅配140サイズ',
    thickness: '3mm B/F',
    format: '白C5×C5',
    price: 320,
    url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-121',
    palletConfig: extractPalletConfig('［1段4箱×10段］')
  },
  {
    code: 'MA120-302',
    name: '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（530×260×340mm）5mm A/F K5×K5',
    innerLength: 530,
    innerWidth: 260,
    innerHeight: 340,
    deliverySize: '宅配120サイズ',
    thickness: '5mm A/F',
    format: 'K5×K5',
    price: 280,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA120-302',
    palletConfig: extractPalletConfig('［1段8箱×5段］')
  },
  // 黒ゴマアーモンドきな粉・きな粉向け
  {
    code: 'MA140-172',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（644×424×288mm）3mm B/F C5×C5',
    innerLength: 644,
    innerWidth: 424,
    innerHeight: 288,
    deliverySize: '宅配140サイズ',
    thickness: '3mm B/F',
    format: 'C5×C5',
    price: 380,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-172',
    palletConfig: extractPalletConfig('［1段4箱×6段］')
  },
  {
    code: 'MAS140-075',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（644×424×288mm）3mm B/F 白C5×C5',
    innerLength: 644,
    innerWidth: 424,
    innerHeight: 288,
    deliverySize: '宅配140サイズ',
    thickness: '3mm B/F',
    format: '白C5×C5',
    price: 400,
    url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-075',
    palletConfig: extractPalletConfig('［1段4箱×6段］')
  },
  {
    code: 'MA140-331',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（560×500×280mm）5mm A/F K6×強化芯180g×K6',
    innerLength: 560,
    innerWidth: 500,
    innerHeight: 280,
    deliverySize: '宅配140サイズ',
    thickness: '5mm A/F',
    format: 'K6×強化芯180g×K6',
    price: 450,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-331',
    palletConfig: extractPalletConfig('［1段4箱×6段］')
  },
  // きな粉 500g向け
  {
    code: 'MA140-369',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×4段］（530×350×430mm）5mm A/F K6×強化芯180g×K6',
    innerLength: 530,
    innerWidth: 350,
    innerHeight: 430,
    deliverySize: '宅配140サイズ',
    thickness: '5mm A/F',
    format: 'K6×強化芯180g×K6',
    price: 420,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-369',
    palletConfig: extractPalletConfig('［1段6箱×4段］')
  },
  {
    code: 'MA140-401',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（470×290×580mm）5mm A/F K6×強化芯180g×K6',
    innerLength: 470,
    innerWidth: 290,
    innerHeight: 580,
    deliverySize: '宅配140サイズ',
    thickness: '5mm A/F',
    format: 'K6×強化芯180g×K6',
    price: 400,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-401',
    palletConfig: extractPalletConfig('［1段8箱×3段］')
  },
  // 追加の段ボール（様々なサイズ）
  {
    code: 'MA120-134',
    name: '【宅配120サイズ】ダンボール箱（664×184×148mm）5mm A/F K5×K5',
    innerLength: 664,
    innerWidth: 184,
    innerHeight: 148,
    deliverySize: '宅配120サイズ',
    thickness: '5mm A/F',
    format: 'K5×K5',
    price: 250,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA120-134',
    palletConfig: null
  },
  {
    code: 'MA120-152',
    name: '【宅配120サイズ】ダンボール箱（634×194×148mm）5mm A/F K5×K5',
    innerLength: 634,
    innerWidth: 194,
    innerHeight: 148,
    deliverySize: '宅配120サイズ',
    thickness: '5mm A/F',
    format: 'K5×K5',
    price: 250,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA120-152',
    palletConfig: null
  },
  {
    code: 'MA140-259',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（614×454×238mm）3mm B/F C5×C5',
    innerLength: 614,
    innerWidth: 454,
    innerHeight: 238,
    deliverySize: '宅配140サイズ',
    thickness: '3mm B/F',
    format: 'C5×C5',
    price: 360,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-259',
    palletConfig: extractPalletConfig('［1段4箱×7段］')
  },
  {
    code: 'MA140-287',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（594×474×238mm）3mm B/F C5×C5',
    innerLength: 594,
    innerWidth: 474,
    innerHeight: 238,
    deliverySize: '宅配140サイズ',
    thickness: '3mm B/F',
    format: 'C5×C5',
    price: 360,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-287',
    palletConfig: extractPalletConfig('［1段4箱×7段］')
  },
  {
    code: 'MA140-311',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（584×484×238mm）3mm B/F C5×C5',
    innerLength: 584,
    innerWidth: 484,
    innerHeight: 238,
    deliverySize: '宅配140サイズ',
    thickness: '3mm B/F',
    format: 'C5×C5',
    price: 360,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-311',
    palletConfig: extractPalletConfig('［1段4箱×7段］')
  },
  {
    code: 'MA140-332',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（564×504×238mm）3mm B/F C5×C5',
    innerLength: 564,
    innerWidth: 504,
    innerHeight: 238,
    deliverySize: '宅配140サイズ',
    thickness: '3mm B/F',
    format: 'C5×C5',
    price: 360,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-332',
    palletConfig: extractPalletConfig('［1段4箱×7段］')
  },
  {
    code: 'MA120-418',
    name: '【宅配120サイズ】ダンボール箱（440×300×230mm）5mm A/F K5×K5',
    innerLength: 440,
    innerWidth: 300,
    innerHeight: 230,
    deliverySize: '宅配120サイズ',
    thickness: '5mm A/F',
    format: 'K5×K5',
    price: 240,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA120-418',
    palletConfig: null
  },
  {
    code: 'MA140-128',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（684×364×268mm）8mm W/F C5×C5',
    innerLength: 684,
    innerWidth: 364,
    innerHeight: 268,
    deliverySize: '宅配140サイズ',
    thickness: '8mm W/F',
    format: 'C5×C5',
    price: 420,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-128',
    palletConfig: extractPalletConfig('［1段4箱×6段］')
  },
  {
    code: 'MA140-148',
    name: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（664×384×268mm）8mm W/F C5×C5',
    innerLength: 664,
    innerWidth: 384,
    innerHeight: 268,
    deliverySize: '宅配140サイズ',
    thickness: '8mm W/F',
    format: 'C5×C5',
    price: 420,
    url: 'https://www.notosiki.co.jp/item/detail?num=MA140-148',
    palletConfig: extractPalletConfig('［1段4箱×6段］')
  }
];

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
    historicalCarton: { length: 545, width: 365, height: 255 }, // 54.5×36.5×25.5cm
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
  const match = product.unitWeight.match(/(\d+\.?\d*)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return 0.2;
}

