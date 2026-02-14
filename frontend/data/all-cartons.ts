// 全段ボールデータ（cardboard_products_2026-01-14T22-44-17.csvから自動生成）
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
  volume: number | null; // L
  weight: number | null; // g
  url: string;
  palletConfig: {
    boxesPerLayer: number;
    layers: number;
    total: number;
  } | null;
  // パレット積載詳細情報（実績ベース）
  palletLoadingDetails?: {
    cartonsPerLayer: number; // パレット1段の箱数
    totalLayers: number; // パレット段数
    totalCartons: number; // パレット総箱数
    totalBags: number; // パレット総袋数
    heightMm: number; // パレット高さ（mm）
    widthMm: number; // パレット幅（mm）
    weightKg: number; // パレット重さ（kg）
    productName: string; // 対応商品名
  };
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

// 全段ボールデータ（1101件）
export const allCartons: Carton[] = [
  {
    "code": "MA120-398",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（450×300×230mm）5mm A/F C120×C120",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C120×C120",
    "price": 128.4,
    "volume": 31,
    "weight": 368,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-398",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-458",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（420×310×280mm）5mm A/F C5×C5",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.4,
    "weight": 472,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-458",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA140-150",
    "name": "【宅配140サイズ】ダンボール箱（670×390×230mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 60,
    "weight": 739,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-150",
    "palletConfig": null
  },
  {
    "code": "MA120-131",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（674×194×168mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 194,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 97.5,
    "volume": 21.9,
    "weight": 323,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-131",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-290",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×8段］（530×350×200mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.1,
    "weight": 549,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-290",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MA120-299",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×10段］（530×350×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.6,
    "weight": 679,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-299",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 10,
      "total": 60
    }
  },
  {
    "code": "MA120-473",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（394×324×288mm）3mm B/F C5×C5",
    "innerLength": 394,
    "innerWidth": 324,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.7,
    "weight": 448,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-473",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-474",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（390×320×280mm）5mm A/F K5×K5",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 34.9,
    "weight": 485,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-474",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS140-066",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（670×390×230mm）5mm A/F 白C5×C5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 60,
    "weight": 725,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-066",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-173",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（640×420×280mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 75.2,
    "weight": 831,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-173",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA120-257",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（584×234×168mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 97.6,
    "volume": 22.9,
    "weight": 337,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-257",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA140-337",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（560×500×200mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 56,
    "weight": 831,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-337",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-369",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×4段］（530×350×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 79.7,
    "weight": 1026,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-369",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 3,
      "total": 18
    }
  },
  {
    "code": "MA120-289",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×8段］（534×354×208mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.3,
    "weight": 507,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-289",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 7,
      "total": 42
    }
  },
  {
    "code": "MA120-354",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（480×280×280mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.6,
    "weight": 485,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-354",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-358",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（480×280×230mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.9,
    "weight": 443,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-358",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA140-107",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（710×350×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 69.5,
    "weight": 998,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-107",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-125",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（694×374×288mm）3mm B/F C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 74.7,
    "weight": 714,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-125",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-135",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（690×370×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 51,
    "weight": 906,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-135",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-063",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（694×374×168mm）3mm B/F 白C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 177.3,
    "volume": 43.6,
    "weight": 599,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-063",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-145",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（674×394×288mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 189.9,
    "volume": 76.4,
    "weight": 735,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-145",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-146",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（670×390×280mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 73.1,
    "weight": 796,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-146",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-070",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（670×390×180mm）5mm A/F 白C5×C5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47,
    "weight": 668,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-070",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-169",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（670×190×340mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 159.9,
    "volume": 43.2,
    "weight": 518,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-169",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS140-081",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（644×424×188mm）3mm B/F 白C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 185.1,
    "volume": 51.3,
    "weight": 674,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-081",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-186",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（640×420×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 48.3,
    "weight": 952,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-186",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA120-142",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（640×200×200mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 127.9,
    "volume": 25.6,
    "weight": 386,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-142",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS140-084",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（630×430×280mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 75.8,
    "weight": 827,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-084",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-207",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（634×434×208mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.2,
    "weight": 692,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-207",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MAS140-097",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（634×214×348mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 146.3,
    "volume": 47.2,
    "weight": 495,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-097",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-057",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（630×210×280mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37,
    "weight": 460,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-057",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-161",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（634×214×208mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 115,
    "volume": 28.2,
    "weight": 366,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-161",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA140-231",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（624×444×238mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 191.8,
    "volume": 65.9,
    "weight": 735,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-231",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-101",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（624×444×238mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 188.7,
    "volume": 65.9,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-101",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-102",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（620×440×200mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.5,
    "weight": 748,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-102",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-243",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（624×444×168mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.6,
    "volume": 46.5,
    "weight": 661,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-243",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MAS140-121",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（614×454×168mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.3,
    "volume": 46.8,
    "weight": 685,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-121",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MAS120-089",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（590×230×280mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.9,
    "weight": 468,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-089",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-219",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（590×230×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.9,
    "weight": 634,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-219",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-226",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（590×230×200mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 27.1,
    "weight": 404,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-226",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-096",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（594×234×188mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99.9,
    "volume": 26.1,
    "weight": 365,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-096",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-098",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（594×234×168mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98,
    "volume": 23.3,
    "weight": 348,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-098",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA140-307",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（584×484×288mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 81.4,
    "weight": 831,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-307",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS120-109",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（580×230×160mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 118.2,
    "volume": 21.3,
    "weight": 357,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-109",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-340",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（564×504×188mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.4,
    "weight": 746,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-340",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-348",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（564×244×438mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 166.8,
    "volume": 60.2,
    "weight": 560,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-348",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-266",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（560×240×280mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.6,
    "weight": 474,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-266",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-115",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（560×240×230mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 30.9,
    "weight": 422,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-115",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-274",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（560×240×200mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 26.8,
    "weight": 404,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-274",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-280",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（554×234×168mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 234,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 21.7,
    "weight": 570,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-280",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA140-354",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（530×530×230mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 64.6,
    "weight": 898,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-354",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-355",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（530×530×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 64.6,
    "weight": 1195,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-355",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-368",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（524×524×148mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 524,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40.6,
    "weight": 1215,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-368",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-372",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×5段］（530×350×340mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 63,
    "weight": 684,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-372",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 4,
      "total": 24
    }
  },
  {
    "code": "MAS140-168",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×5段］（530×350×340mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 63,
    "weight": 671,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-168",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 4,
      "total": 24
    }
  },
  {
    "code": "MA140-374",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×5段］（524×344×328mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 344,
    "innerHeight": 328,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.1,
    "weight": 1016,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-374",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 4,
      "total": 24
    }
  },
  {
    "code": "MA120-281",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×6段］（534×354×288mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 54.4,
    "weight": 578,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-281",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 5,
      "total": 30
    }
  },
  {
    "code": "MA120-283",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×6段］（530×350×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 51.9,
    "weight": 833,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-283",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 5,
      "total": 30
    }
  },
  {
    "code": "MA120-286",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×7段］（530×350×230mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 42.6,
    "weight": 578,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-286",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 6,
      "total": 36
    }
  },
  {
    "code": "MAS120-124",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×7段］（534×354×238mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.9,
    "weight": 545,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-124",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 6,
      "total": 36
    }
  },
  {
    "code": "MA120-287",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×7段］（530×350×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 42.6,
    "weight": 769,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-287",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 6,
      "total": 36
    }
  },
  {
    "code": "MA120-288",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×7段］（524×344×218mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 344,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.2,
    "weight": 858,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-288",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 7,
      "total": 42
    }
  },
  {
    "code": "MAS120-125",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×8段］（530×350×200mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.1,
    "weight": 539,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-125",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MAS120-126",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×8段］（534×354×208mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.3,
    "weight": 517,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-126",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 7,
      "total": 42
    }
  },
  {
    "code": "MA120-293",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×9段］（534×354×188mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.5,
    "weight": 489,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-293",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MA120-297",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×10段］（534×354×168mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31.7,
    "weight": 472,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-297",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 9,
      "total": 54
    }
  },
  {
    "code": "MA140-375",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（534×264×438mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 168.9,
    "volume": 61.7,
    "weight": 569,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-375",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-302",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（530×260×340mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 46.8,
    "weight": 538,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-302",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-307",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（530×260×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 38.5,
    "weight": 646,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-307",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-144",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（534×204×348mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 204,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.4,
    "volume": 37.9,
    "weight": 425,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-144",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA140-385",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（504×274×438mm）3mm B/F C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 180.4,
    "volume": 60.4,
    "weight": 563,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-385",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-334",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（500×270×340mm）5mm A/F K5×K5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 45.9,
    "weight": 533,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-334",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-337",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（504×274×288mm）3mm B/F C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.7,
    "weight": 446,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-337",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-338",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（500×270×280mm）5mm A/F K5×K5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.8,
    "weight": 482,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-338",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-341",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（504×274×238mm）3mm B/F C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.1,
    "volume": 32.8,
    "weight": 407,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-341",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-152",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（504×274×238mm）3mm B/F 白C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.4,
    "volume": 32.8,
    "weight": 415,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-152",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-348",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（494×264×188mm）8mm W/F C5×C5",
    "innerLength": 494,
    "innerWidth": 264,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 24.5,
    "weight": 614,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-348",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA140-392",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（484×284×438mm）3mm B/F C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 169.2,
    "volume": 60.2,
    "weight": 563,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-392",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-349",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（484×284×348mm）3mm B/F C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.8,
    "weight": 494,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-349",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-357",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（484×284×238mm）3mm B/F C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 123,
    "volume": 32.7,
    "weight": 409,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-357",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-159",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（480×280×230mm）5mm A/F 白C5×C5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 30.9,
    "weight": 434,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-159",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-361",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（484×184×438mm）3mm B/F C5×C5",
    "innerLength": 484,
    "innerWidth": 184,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 125.2,
    "volume": 39,
    "weight": 425,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-361",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA140-401",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（470×290×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 79,
    "weight": 990,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-401",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-404",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（470×290×430mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 300,
    "volume": null,
    "weight": null,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-404",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-369",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（474×294×348mm）3mm B/F C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48.4,
    "weight": 502,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-369",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-372",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（464×284×328mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 284,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 43.2,
    "weight": 806,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-372",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-172",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（474×194×438mm）3mm B/F 白C5×C5",
    "innerLength": 474,
    "innerWidth": 194,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.5,
    "volume": 40.2,
    "weight": 440,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-172",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-390",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（450×300×340mm）5mm A/F K5×K5",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 45.9,
    "weight": 544,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-390",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-392",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（444×294×328mm）8mm W/F C5×C5",
    "innerLength": 444,
    "innerWidth": 294,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.8,
    "weight": 808,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-392",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-177",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（450×300×280mm）5mm A/F 白C5×C5",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.8,
    "weight": 485,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-177",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-395",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（450×300×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.8,
    "weight": 658,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-395",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-399",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（450×300×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 31,
    "weight": 604,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-399",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA140-415",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（454×194×588mm）3mm B/F C5×C5",
    "innerLength": 454,
    "innerWidth": 194,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 150.2,
    "volume": 51.7,
    "weight": 517,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-415",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-411",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（440×300×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 44.8,
    "weight": 715,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-411",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-413",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（444×304×288mm）3mm B/F C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.8,
    "weight": 451,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-413",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-414",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（440×300×280mm）5mm A/F K5×K5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 36.9,
    "weight": 488,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-414",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-415",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（440×300×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 36.9,
    "weight": 650,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-415",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-417",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（444×304×238mm）3mm B/F C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.1,
    "volume": 32.1,
    "weight": 414,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-417",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-425",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（444×204×348mm）3mm B/F C5×C5",
    "innerLength": 444,
    "innerWidth": 204,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 103,
    "volume": 31.5,
    "weight": 366,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-425",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-197",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（430×310×280mm）5mm A/F 白C5×C5",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.3,
    "weight": 488,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-197",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-199",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（430×310×230mm）5mm A/F 白C5×C5",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 30.6,
    "weight": 447,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-199",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-443",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（430×200×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 36.9,
    "weight": 603,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-443",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-205",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（420×310×430mm）5mm A/F 白C5×C5",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 55.9,
    "weight": 599,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-205",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-451",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（420×310×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 55.9,
    "weight": 813,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-451",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-465",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（394×324×438mm）3mm B/F C5×C5",
    "innerLength": 394,
    "innerWidth": 324,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 55.9,
    "weight": 556,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-465",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS120-215",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（390×320×340mm）5mm A/F 白C5×C5",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.4,
    "weight": 522,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-215",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-217",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（390×320×280mm）5mm A/F 白C5×C5",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.9,
    "weight": 476,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-217",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-218",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（394×324×288mm）3mm B/F 白C5×C5",
    "innerLength": 394,
    "innerWidth": 324,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.7,
    "weight": 458,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-218",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-475",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（390×320×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 34.9,
    "weight": 646,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-475",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-478",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（390×260×430mm）5mm A/F K5×K5",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 43.6,
    "weight": 510,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-478",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MA120-482",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（390×260×340mm）5mm A/F K5×K5",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 34.4,
    "weight": 446,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-482",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA120-490",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（370×340×430mm）5mm A/F K5×K5",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 54,
    "weight": 618,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-490",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS120-226",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（374×344×438mm）3mm B/F 白C5×C5",
    "innerLength": 374,
    "innerWidth": 344,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 56.3,
    "weight": 583,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-226",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS120-227",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（370×340×340mm）5mm A/F 白C5×C5",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.7,
    "weight": 538,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-227",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-510",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×5段］（350×350×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 41.6,
    "weight": 727,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-510",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 4,
      "total": 36
    }
  },
  {
    "code": "MA120-511",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×5段］（344×344×328mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 344,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.8,
    "weight": 811,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-511",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 4,
      "total": 36
    }
  },
  {
    "code": "MA120-513",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×6段］（350×350×280mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 34.3,
    "weight": 500,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-513",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 5,
      "total": 45
    }
  },
  {
    "code": "MA120-530",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×4段］（354×204×438mm）3mm B/F C5×C5",
    "innerLength": 354,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 104.1,
    "volume": 31.6,
    "weight": 368,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-530",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 3,
      "total": 45
    }
  },
  {
    "code": "MA140-105",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（714×354×288mm）3mm B/F C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 72.7,
    "weight": 692,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-105",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-106",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（710×350×280mm）5mm A/F K5×K5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 69.5,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-106",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-044",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（710×350×280mm）5mm A/F 白C5×C5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 69.5,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-044",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-045",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（714×354×288mm）3mm B/F 白C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 72.7,
    "weight": 707,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-045",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-108",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（704×344×268mm）8mm W/F C5×C5",
    "innerLength": 704,
    "innerWidth": 344,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 64.9,
    "weight": 1115,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-108",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-109",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（714×354×238mm）3mm B/F C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 60.1,
    "weight": 640,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-109",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-110",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（710×350×230mm）5mm A/F K5×K5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 57.1,
    "weight": 693,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-110",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-046",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（710×350×230mm）5mm A/F 白C5×C5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.1,
    "weight": 680,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-046",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-047",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（714×354×238mm）3mm B/F 白C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 60.1,
    "weight": 653,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-047",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-111",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（710×350×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 57.1,
    "weight": 922,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-111",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-112",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（704×344×218mm）8mm W/F C5×C5",
    "innerLength": 704,
    "innerWidth": 344,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52.7,
    "weight": 1028,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-112",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-113",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（714×354×208mm）3mm B/F C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 184.5,
    "volume": 52.5,
    "weight": 608,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-113",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-114",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（710×350×200mm）5mm A/F K5×K5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 49.7,
    "weight": 658,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-114",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-048",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（710×350×200mm）5mm A/F 白C5×C5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.7,
    "weight": 645,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-048",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-049",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（714×354×208mm）3mm B/F 白C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 182.5,
    "volume": 52.5,
    "weight": 620,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-049",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-115",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（710×350×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 49.7,
    "weight": 875,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-115",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-116",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（704×344×188mm）8mm W/F C5×C5",
    "innerLength": 704,
    "innerWidth": 344,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.5,
    "weight": 976,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-116",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-117",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（714×354×188mm）3mm B/F C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 180.2,
    "volume": 47.5,
    "weight": 587,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-117",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-118",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（710×350×180mm）5mm A/F K5×K5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 44.7,
    "weight": 635,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-118",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-050",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（710×350×180mm）5mm A/F 白C5×C5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.7,
    "weight": 623,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-050",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-051",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（714×354×188mm）3mm B/F 白C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 177.3,
    "volume": 47.5,
    "weight": 599,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-051",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-119",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（710×350×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 44.7,
    "weight": 845,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-119",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-120",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（704×344×168mm）8mm W/F C5×C5",
    "innerLength": 704,
    "innerWidth": 344,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40.6,
    "weight": 942,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-120",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-121",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（714×354×168mm）3mm B/F C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 171.8,
    "volume": 42.4,
    "weight": 565,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-121",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-122",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（710×350×160mm）5mm A/F K5×K5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 39.7,
    "weight": 612,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-122",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-052",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（710×350×160mm）5mm A/F 白C5×C5",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 39.7,
    "weight": 600,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-052",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-053",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（714×354×168mm）3mm B/F 白C5×C5",
    "innerLength": 714,
    "innerWidth": 354,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 169.1,
    "volume": 42.4,
    "weight": 577,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-053",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-123",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（710×350×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 710,
    "innerWidth": 350,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 39.7,
    "weight": 814,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-123",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-124",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（704×344×148mm）8mm W/F C5×C5",
    "innerLength": 704,
    "innerWidth": 344,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 35.8,
    "weight": 907,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-124",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-126",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（690×370×280mm）5mm A/F K5×K5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 71.4,
    "weight": 224,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-126",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-055",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（694×374×288mm）3mm B/F 白C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 74.7,
    "weight": 295,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-055",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-127",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（690×370×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 71.4,
    "weight": 430,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-127",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-128",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（684×364×268mm）8mm W/F C5×C5",
    "innerLength": 684,
    "innerWidth": 364,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 66.7,
    "weight": 492,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-128",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-129",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（694×374×238mm）3mm B/F C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.6,
    "volume": 61.7,
    "weight": 400,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-129",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-130",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（690×370×230mm）5mm A/F K5×K5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 58.7,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-130",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-056",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（690×370×230mm）5mm A/F 白C5×C5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 58.7,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-056",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-057",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（694×374×238mm）3mm B/F 白C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.3,
    "volume": 61.7,
    "weight": 707,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-057",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-131",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（690×370×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 58.7,
    "weight": 998,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-131",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-132",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（684×364×218mm）8mm W/F C5×C5",
    "innerLength": 684,
    "innerWidth": 364,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.2,
    "weight": 1115,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-132",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-133",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（694×374×208mm）3mm B/F C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.9,
    "weight": 661,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-133",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-134",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（690×370×200mm）5mm A/F K5×K5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 51,
    "weight": 716,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-134",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-058",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（690×370×200mm）5mm A/F 白C5×C5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 51,
    "weight": 668,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-058",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-059",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（694×374×208mm）3mm B/F 白C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.9,
    "weight": 642,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-059",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-136",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（684×364×188mm）8mm W/F C5×C5",
    "innerLength": 684,
    "innerWidth": 364,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 46.8,
    "weight": 1011,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-136",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-137",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（694×374×188mm）3mm B/F C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 184.5,
    "volume": 48.7,
    "weight": 608,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-137",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-138",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（690×370×180mm）5mm A/F K5×K5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 45.9,
    "weight": 658,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-138",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-060",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（690×370×180mm）5mm A/F 白C5×C5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.9,
    "weight": 645,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-060",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-061",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（694×374×188mm）3mm B/F 白C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 182.5,
    "volume": 48.7,
    "weight": 620,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-061",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-139",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（690×370×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 45.9,
    "weight": 875,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-139",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-140",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（684×364×168mm）8mm W/F C5×C5",
    "innerLength": 684,
    "innerWidth": 364,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 41.8,
    "weight": 976,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-140",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-141",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（694×374×168mm）3mm B/F C5×C5",
    "innerLength": 694,
    "innerWidth": 374,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 180.2,
    "volume": 43.6,
    "weight": 587,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-141",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-142",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（690×370×160mm）5mm A/F K5×K5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 40.8,
    "weight": 635,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-142",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-062",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（690×370×160mm）5mm A/F 白C5×C5",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40.8,
    "weight": 623,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-062",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-143",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（690×370×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 690,
    "innerWidth": 370,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 40.8,
    "weight": 845,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-143",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-144",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（684×364×148mm）8mm W/F C5×C5",
    "innerLength": 684,
    "innerWidth": 364,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 36.8,
    "weight": 942,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-144",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-064",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（670×390×280mm）5mm A/F 白C5×C5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 73.1,
    "weight": 781,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-064",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-065",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（674×394×288mm）3mm B/F 白C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 190.6,
    "volume": 76.4,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-065",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-147",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（670×390×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 73.1,
    "weight": 1060,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-147",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-148",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（664×384×268mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 384,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 68.3,
    "weight": 1184,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-148",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-149",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（674×394×238mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 63.2,
    "weight": 682,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-149",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-067",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（674×394×238mm）3mm B/F 白C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 63.2,
    "weight": 696,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-067",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-151",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（670×390×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 60,
    "weight": 983,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-151",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-152",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（664×384×218mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 384,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 55.5,
    "weight": 1098,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-152",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-153",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（674×394×208mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 166.9,
    "volume": 55.2,
    "weight": 650,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-153",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-154",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（670×390×200mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 52.2,
    "weight": 704,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-154",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-068",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（670×390×200mm）5mm A/F 白C5×C5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52.2,
    "weight": 691,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-068",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-069",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（674×394×208mm）3mm B/F 白C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 166,
    "volume": 55.2,
    "weight": 663,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-069",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-155",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（670×390×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 52.2,
    "weight": 937,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-155",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-156",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（664×384×188mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 384,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.9,
    "weight": 1046,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-156",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-157",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（674×394×188mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.9,
    "weight": 629,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-157",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-158",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（670×390×180mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 47,
    "weight": 681,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-158",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-071",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（674×394×188mm）3mm B/F 白C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.9,
    "weight": 642,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-071",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-159",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（670×390×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 47,
    "weight": 906,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-159",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-160",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（664×384×168mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 384,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 42.8,
    "weight": 1011,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-160",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-161",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（674×394×168mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 184.5,
    "volume": 44.6,
    "weight": 608,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-161",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-162",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（670×390×160mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 41.8,
    "weight": 658,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-162",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-072",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（670×390×160mm）5mm A/F 白C5×C5",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 41.8,
    "weight": 645,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-072",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-073",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（674×394×168mm）3mm B/F 白C5×C5",
    "innerLength": 674,
    "innerWidth": 394,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 182.5,
    "volume": 44.6,
    "weight": 620,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-073",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-163",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（670×390×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 390,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 41.8,
    "weight": 875,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-163",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-165",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（670×190×430mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 190.3,
    "volume": 54.7,
    "weight": 603,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-165",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-166",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（670×190×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 54.7,
    "weight": 802,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-166",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-167",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（664×184×418mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 184,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 51,
    "weight": 894,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-167",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-168",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（674×194×348mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 194,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 144.8,
    "volume": 45.5,
    "weight": 479,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-168",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-170",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（670×190×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 178.8,
    "volume": 43.2,
    "weight": 689,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-170",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-171",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（664×184×328mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 184,
    "innerHeight": 328,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40,
    "weight": 768,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-171",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-117",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（674×194×288mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 194,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.6,
    "weight": 427,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-117",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-118",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（670×190×280mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 35.6,
    "weight": 461,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-118",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-119",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（670×190×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 35.6,
    "weight": 614,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-119",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-120",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（664×184×268mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 184,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.7,
    "weight": 683,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-120",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-121",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（670×190×230mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 29.2,
    "weight": 414,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-121",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-122",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（670×190×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.2,
    "weight": 551,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-122",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-123",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（664×184×218mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 184,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 26.6,
    "weight": 613,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-123",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-124",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（670×190×200mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 125.5,
    "volume": 25.4,
    "weight": 386,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-124",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-125",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（670×190×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 25.4,
    "weight": 513,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-125",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-126",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（664×184×188mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 184,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 22.9,
    "weight": 570,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-126",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-127",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（674×194×188mm）3mm B/F C5×C5",
    "innerLength": 674,
    "innerWidth": 194,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 94.6,
    "volume": 24.5,
    "weight": 340,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-127",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-128",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（670×190×180mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 22.9,
    "weight": 367,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-128",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-129",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（670×190×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 22.9,
    "weight": 489,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-129",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-130",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（664×184×168mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 184,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 20.5,
    "weight": 542,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-130",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-132",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（670×190×160mm）5mm A/F K5×K5",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120.8,
    "volume": 20.3,
    "weight": 348,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-132",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-133",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（670×190×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 670,
    "innerWidth": 190,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 20.3,
    "weight": 463,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-133",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-134",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（664×184×148mm）8mm W/F C5×C5",
    "innerLength": 664,
    "innerWidth": 184,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 18,
    "weight": 514,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-134",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-172",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（644×424×288mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 78.6,
    "weight": 767,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-172",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-074",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（640×420×280mm）5mm A/F 白C5×C5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 75.2,
    "weight": 815,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-074",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-075",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（644×424×288mm）3mm B/F 白C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 78.6,
    "weight": 783,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-075",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-174",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（640×420×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 75.2,
    "weight": 1106,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-174",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-175",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（634×414×268mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 414,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 70.3,
    "weight": 1236,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-175",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-176",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（644×424×238mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 64.9,
    "weight": 714,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-176",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-177",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（640×420×230mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 61.8,
    "weight": 774,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-177",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-076",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（640×420×230mm）5mm A/F 白C5×C5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 61.8,
    "weight": 759,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-076",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-077",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（644×424×238mm）3mm B/F 白C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 64.9,
    "weight": 729,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-077",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-178",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（640×420×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 61.8,
    "weight": 1029,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-178",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-179",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（634×414×218mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 414,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.2,
    "weight": 1150,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-179",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-180",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（644×424×208mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 56.7,
    "weight": 682,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-180",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-181",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（640×420×200mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 53.7,
    "weight": 739,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-181",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-078",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（640×420×200mm）5mm A/F 白C5×C5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.7,
    "weight": 725,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-078",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-079",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（644×424×208mm）3mm B/F 白C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 56.7,
    "weight": 696,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-079",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-182",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（640×420×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 53.7,
    "weight": 983,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-182",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-183",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（634×414×188mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 414,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.3,
    "weight": 1098,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-183",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-184",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（644×424×188mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.6,
    "volume": 51.3,
    "weight": 661,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-184",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-185",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（640×420×180mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 48.3,
    "weight": 716,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-185",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-080",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（640×420×180mm）5mm A/F 白C5×C5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 48.3,
    "weight": 702,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-080",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-187",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（634×414×168mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 414,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44,
    "weight": 1063,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-187",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-188",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（644×424×168mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.8,
    "weight": 640,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-188",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-189",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（640×420×160mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 43,
    "weight": 693,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-189",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-082",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（640×420×160mm）5mm A/F 白C5×C5",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 43,
    "weight": 680,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-082",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-083",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（644×424×168mm）3mm B/F 白C5×C5",
    "innerLength": 644,
    "innerWidth": 424,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.8,
    "weight": 653,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-083",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-190",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（640×420×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 420,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 43,
    "weight": 922,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-190",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-192",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（640×200×430mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.5,
    "volume": 55,
    "weight": 599,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-192",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-193",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（640×200×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 55,
    "weight": 797,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-193",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-194",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（634×194×418mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 194,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 51.4,
    "weight": 888,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-194",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-195",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（644×204×348mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 204,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 143.5,
    "volume": 45.7,
    "weight": 476,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-195",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-196",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（640×200×340mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 157.7,
    "volume": 43.5,
    "weight": 516,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-196",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-197",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（640×200×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 176.8,
    "volume": 43.5,
    "weight": 686,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-197",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-198",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（634×194×328mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 194,
    "innerHeight": 328,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40.3,
    "weight": 764,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-198",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-135",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（644×204×288mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 204,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.8,
    "weight": 426,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-135",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-136",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（640×200×280mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 35.8,
    "weight": 460,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-136",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-137",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（640×200×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 35.8,
    "weight": 612,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-137",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-138",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（634×194×268mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 194,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.9,
    "weight": 682,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-138",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-139",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（640×200×230mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 29.4,
    "weight": 414,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-139",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-140",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（640×200×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.4,
    "weight": 551,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-140",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-141",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（634×194×218mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 194,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 26.8,
    "weight": 612,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-141",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-143",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（640×200×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 25.6,
    "weight": 514,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-143",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-144",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（634×194×188mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 194,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 23.1,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-144",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-145",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（644×204×188mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 204,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 95.8,
    "volume": 24.6,
    "weight": 341,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-145",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-146",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（640×200×180mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 124.3,
    "volume": 23,
    "weight": 368,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-146",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-147",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（640×200×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 23,
    "weight": 489,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-147",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-148",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（634×194×168mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 194,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 20.6,
    "weight": 543,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-148",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-149",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（644×204×168mm）3mm B/F C5×C5",
    "innerLength": 644,
    "innerWidth": 204,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98.7,
    "volume": 22,
    "weight": 324,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-149",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-150",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（640×200×160mm）5mm A/F K5×K5",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 122,
    "volume": 20.4,
    "weight": 350,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-150",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-151",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（640×200×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 640,
    "innerWidth": 200,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 20.4,
    "weight": 465,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-151",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-152",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（634×194×148mm）8mm W/F C5×C5",
    "innerLength": 634,
    "innerWidth": 194,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 18.2,
    "weight": 516,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-152",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-199",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（634×434×288mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 79.2,
    "weight": 778,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-199",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-200",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（630×430×280mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 75.8,
    "weight": 843,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-200",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-085",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（634×434×288mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 79.2,
    "weight": 794,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-085",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-201",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（630×430×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 75.8,
    "weight": 1121,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-201",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-202",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（624×424×268mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 424,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 70.9,
    "weight": 1254,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-202",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-203",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（634×434×238mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 65.4,
    "weight": 725,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-203",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-204",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（630×430×230mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 62.3,
    "weight": 785,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-204",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-086",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（630×430×230mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 62.3,
    "weight": 770,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-086",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-087",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（634×434×238mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 65.4,
    "weight": 740,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-087",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-205",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（630×430×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 62.3,
    "weight": 1044,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-205",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-206",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（624×424×218mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 424,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.6,
    "weight": 1167,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-206",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-208",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（630×430×200mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 54.1,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-208",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-088",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（630×430×200mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.1,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-088",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-089",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（634×434×208mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.2,
    "weight": 707,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-089",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-209",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（630×430×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 54.1,
    "weight": 998,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-209",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-210",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（624×424×188mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 424,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.7,
    "weight": 1115,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-210",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-211",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（634×434×188mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.6,
    "volume": 51.7,
    "weight": 671,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-211",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-212",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（630×430×180mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 48.7,
    "weight": 727,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-212",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-090",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（630×430×180mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 48.7,
    "weight": 714,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-090",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-091",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（634×434×188mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.3,
    "volume": 51.7,
    "weight": 685,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-091",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-213",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（630×430×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 48.7,
    "weight": 968,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-213",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-214",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（624×424×168mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 424,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.4,
    "weight": 1080,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-214",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-215",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（634×434×168mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 434,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 166.9,
    "volume": 46.2,
    "weight": 650,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-215",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-216",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（630×430×160mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 43.3,
    "weight": 704,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-216",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-092",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（630×430×160mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 43.3,
    "weight": 691,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-092",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-217",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（630×430×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 430,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 43.3,
    "weight": 937,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-217",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-218",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（624×424×148mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 424,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 39.1,
    "weight": 1046,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-218",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-219",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（634×214×438mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 168,
    "volume": 59.4,
    "weight": 561,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-219",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-220",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（630×210×430mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.5,
    "volume": 56.8,
    "weight": 608,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-220",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-094",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（630×210×430mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 184.5,
    "volume": 56.8,
    "weight": 596,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-094",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-095",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（634×214×438mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 167,
    "volume": 59.4,
    "weight": 573,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-095",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-221",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（630×210×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 56.8,
    "weight": 809,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-221",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-222",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（624×204×418mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 204,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.2,
    "weight": 902,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-222",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-223",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（634×214×348mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 147,
    "volume": 47.2,
    "weight": 485,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-223",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-224",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（630×210×340mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 162.3,
    "volume": 44.9,
    "weight": 525,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-224",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS140-096",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（630×210×340mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 155.5,
    "volume": 44.9,
    "weight": 515,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-096",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-225",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（630×210×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 180.9,
    "volume": 44.9,
    "weight": 698,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-225",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-226",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（624×204×328mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 204,
    "innerHeight": 328,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 41.7,
    "weight": 778,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-226",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-153",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（634×214×288mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 126.3,
    "volume": 39,
    "weight": 434,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-153",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-154",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（630×210×280mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37,
    "weight": 469,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-154",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-058",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（634×214×288mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 125.6,
    "volume": 39,
    "weight": 443,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-058",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-155",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（630×210×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37,
    "weight": 624,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-155",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-156",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（624×204×268mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 204,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.1,
    "weight": 695,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-156",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-157",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（634×214×238mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.5,
    "volume": 32.2,
    "weight": 391,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-157",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-158",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（630×210×230mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.4,
    "weight": 423,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-158",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-059",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（630×210×230mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 127.5,
    "volume": 30.4,
    "weight": 415,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-059",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-060",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（634×214×238mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.3,
    "volume": 32.2,
    "weight": 399,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-060",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-159",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（630×210×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.4,
    "weight": 563,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-159",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-160",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（624×204×218mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 204,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 27.7,
    "weight": 626,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-160",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-162",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（630×210×200mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 26.4,
    "weight": 395,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-162",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-061",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（630×210×200mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 124.4,
    "volume": 26.4,
    "weight": 388,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-061",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-062",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（634×214×208mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 115.2,
    "volume": 28.2,
    "weight": 374,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-062",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-163",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（630×210×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 26.4,
    "weight": 526,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-163",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-164",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（624×204×188mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 204,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 23.9,
    "weight": 585,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-164",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-165",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（634×214×188mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99.7,
    "volume": 25.5,
    "weight": 349,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-165",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-166",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（630×210×180mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 124.3,
    "volume": 23.8,
    "weight": 377,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-166",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-063",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（630×210×180mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 120.2,
    "volume": 23.8,
    "weight": 370,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-063",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-064",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（634×214×188mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98.9,
    "volume": 25.5,
    "weight": 357,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-064",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-167",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（630×210×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 23.8,
    "weight": 502,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-167",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-168",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（624×204×168mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 204,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 21.3,
    "weight": 557,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-168",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-169",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（634×214×168mm）3mm B/F C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 96.1,
    "volume": 22.7,
    "weight": 332,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-169",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-170",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（630×210×160mm）5mm A/F K5×K5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 122,
    "volume": 21.1,
    "weight": 359,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-170",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-065",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（630×210×160mm）5mm A/F 白C5×C5",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 117.1,
    "volume": 21.1,
    "weight": 352,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-065",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-066",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（634×214×168mm）3mm B/F 白C5×C5",
    "innerLength": 634,
    "innerWidth": 214,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 94.9,
    "volume": 22.7,
    "weight": 339,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-066",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-171",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（630×210×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 630,
    "innerWidth": 210,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 21.1,
    "weight": 477,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-171",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-172",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（624×204×148mm）8mm W/F C5×C5",
    "innerLength": 624,
    "innerWidth": 204,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 18.8,
    "weight": 530,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-172",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-227",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（624×444×288mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 79.7,
    "weight": 788,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-227",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-228",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（620×440×280mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 76.3,
    "weight": 854,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-228",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-098",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（620×440×280mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 76.3,
    "weight": 838,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-098",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-099",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（624×444×288mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 79.7,
    "weight": 804,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-099",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-229",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（620×440×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 76.3,
    "weight": 1137,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-229",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-230",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（614×434×268mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 434,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 71.4,
    "weight": 1270,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-230",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-232",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（620×440×230mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 62.7,
    "weight": 796,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-232",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-100",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（620×440×230mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 62.7,
    "weight": 781,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-100",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-234",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（614×434×218mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 434,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 58,
    "weight": 1184,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-234",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-235",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（624×444×208mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.6,
    "weight": 703,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-235",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-236",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（620×440×200mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 54.5,
    "weight": 762,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-236",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-103",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（624×444×208mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.6,
    "weight": 718,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-103",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-237",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（620×440×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 54.5,
    "weight": 1014,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-237",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-238",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（614×434×188mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 434,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 50,
    "weight": 1132,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-238",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-239",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（624×444×188mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52,
    "weight": 682,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-239",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-240",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（620×440×180mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 49.1,
    "weight": 739,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-240",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-104",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（620×440×180mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.1,
    "weight": 725,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-104",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-105",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（624×444×188mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52,
    "weight": 696,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-105",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-241",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（620×440×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 49.1,
    "weight": 983,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-241",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-242",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（614×434×168mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 434,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.7,
    "weight": 1098,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-242",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-244",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（620×440×160mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 43.6,
    "weight": 716,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-244",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-106",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（620×440×160mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 43.6,
    "weight": 702,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-106",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-107",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（624×444×168mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 444,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 176.3,
    "volume": 46.5,
    "weight": 674,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-107",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-245",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（620×440×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 440,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 43.6,
    "weight": 952,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-245",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-246",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（614×434×148mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 434,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 39.4,
    "weight": 1063,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-246",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-247",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（624×214×438mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 166.8,
    "volume": 58.4,
    "weight": 555,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-247",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-248",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（620×210×430mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 191.3,
    "volume": 55.9,
    "weight": 601,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-248",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-108",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（620×210×430mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.7,
    "volume": 55.9,
    "weight": 589,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-108",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-109",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（624×214×438mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 165.1,
    "volume": 58.4,
    "weight": 566,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-109",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-249",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（620×210×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 55.9,
    "weight": 799,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-249",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-250",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（614×204×418mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 204,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52.3,
    "weight": 891,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-250",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-251",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（624×214×348mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 145.8,
    "volume": 46.4,
    "weight": 479,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-251",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-252",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（620×210×340mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 161,
    "volume": 44.2,
    "weight": 519,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-252",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS140-110",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（620×210×340mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 154.5,
    "volume": 44.2,
    "weight": 509,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-110",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS140-111",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（624×214×348mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 145.3,
    "volume": 46.4,
    "weight": 489,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-111",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-253",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（620×210×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 179.9,
    "volume": 44.2,
    "weight": 690,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-253",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-254",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（614×204×328mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 204,
    "innerHeight": 328,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 41,
    "weight": 769,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-254",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-173",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（624×214×288mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 125.2,
    "volume": 38.4,
    "weight": 429,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-173",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-174",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（620×210×280mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 36.4,
    "weight": 464,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-174",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-067",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（620×210×280mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.4,
    "weight": 455,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-067",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-068",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（624×214×288mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.5,
    "volume": 38.4,
    "weight": 438,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-068",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-175",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（620×210×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 36.4,
    "weight": 617,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-175",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-176",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（614×204×268mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 204,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 33.5,
    "weight": 687,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-176",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-177",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（624×214×238mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.4,
    "volume": 31.7,
    "weight": 387,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-177",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-178",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（620×210×230mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 29.9,
    "weight": 418,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-178",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-069",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（620×210×230mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 126.5,
    "volume": 29.9,
    "weight": 410,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-069",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-070",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（624×214×238mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.2,
    "volume": 31.7,
    "weight": 395,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-070",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-179",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（620×210×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.9,
    "weight": 556,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-179",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-180",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（614×204×218mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 204,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 27.3,
    "weight": 619,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-180",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-181",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（624×214×208mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 100.8,
    "volume": 27.7,
    "weight": 362,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-181",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-182",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（620×210×200mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 26,
    "weight": 391,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-182",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-071",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（620×210×200mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 124.4,
    "volume": 26,
    "weight": 384,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-071",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-072",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（624×214×208mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 101,
    "volume": 27.7,
    "weight": 370,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-072",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-183",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（620×210×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 26,
    "weight": 520,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-183",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-184",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（614×204×188mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 204,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 23.5,
    "weight": 578,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-184",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-185",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（624×214×188mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98.7,
    "volume": 25.1,
    "weight": 345,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-185",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-186",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（620×210×180mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 123.1,
    "volume": 23.4,
    "weight": 373,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-186",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-074",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（624×214×188mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99,
    "volume": 25.1,
    "weight": 352,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-074",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-187",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（620×210×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 23.4,
    "weight": 496,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-187",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-188",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（614×204×168mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 204,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 21,
    "weight": 550,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-188",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-189",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（624×214×168mm）3mm B/F C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98.8,
    "volume": 22.4,
    "weight": 328,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-189",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-190",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（620×210×160mm）5mm A/F K5×K5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 122.1,
    "volume": 20.8,
    "weight": 354,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-190",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-075",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（620×210×160mm）5mm A/F 白C5×C5",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 117.1,
    "volume": 20.8,
    "weight": 348,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-075",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-076",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（624×214×168mm）3mm B/F 白C5×C5",
    "innerLength": 624,
    "innerWidth": 214,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 93.7,
    "volume": 22.4,
    "weight": 335,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-076",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-191",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（620×210×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 620,
    "innerWidth": 210,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 20.8,
    "weight": 472,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-191",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-192",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（614×204×148mm）8mm W/F C5×C5",
    "innerLength": 614,
    "innerWidth": 204,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 18.5,
    "weight": 523,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-192",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-255",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（614×454×288mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 80.2,
    "weight": 799,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-255",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-256",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（610×450×280mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 76.8,
    "weight": 866,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-256",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-112",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（610×450×280mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 76.8,
    "weight": 850,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-112",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-113",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（614×454×288mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 80.2,
    "weight": 815,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-113",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-257",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（610×450×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 76.8,
    "weight": 1153,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-257",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-258",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（604×444×268mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 444,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 71.8,
    "weight": 1288,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-258",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-259",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（614×454×238mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 66.3,
    "weight": 746,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-259",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-260",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（610×450×230mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 63.1,
    "weight": 808,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-260",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-114",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（610×450×230mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 63.1,
    "weight": 793,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-114",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-115",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（614×454×238mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 66.3,
    "weight": 761,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-115",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-261",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（610×450×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 63.1,
    "weight": 1075,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-261",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-262",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（604×444×218mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 444,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 58.4,
    "weight": 1202,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-262",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-263",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（614×454×208mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.9,
    "weight": 714,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-263",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-264",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（610×450×200mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 54.9,
    "weight": 774,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-264",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-116",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（610×450×200mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.9,
    "weight": 759,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-116",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-117",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（614×454×208mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.9,
    "weight": 729,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-117",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-265",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（610×450×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 54.9,
    "weight": 1029,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-265",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-266",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（604×444×188mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 444,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 50.4,
    "weight": 1150,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-266",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-267",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（614×454×188mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52.4,
    "weight": 692,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-267",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-268",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（610×450×180mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 49.4,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-268",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-118",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（610×450×180mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.4,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-118",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-119",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（614×454×188mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52.4,
    "weight": 707,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-119",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-269",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（610×450×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 49.4,
    "weight": 998,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-269",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-270",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（604×444×168mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 444,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45,
    "weight": 1115,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-270",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-271",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（614×454×168mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 454,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 178.4,
    "volume": 46.8,
    "weight": 671,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-271",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-272",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（610×450×160mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 43.9,
    "weight": 727,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-272",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-120",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（610×450×160mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 43.9,
    "weight": 714,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-120",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-273",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（610×450×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 450,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 43.9,
    "weight": 968,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-273",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-274",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（604×444×148mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 444,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 39.6,
    "weight": 1080,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-274",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-275",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（614×224×438mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 170.2,
    "volume": 60.2,
    "weight": 563,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-275",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-276",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（610×220×430mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 57.7,
    "weight": 610,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-276",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-122",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（610×220×430mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 187.6,
    "volume": 57.7,
    "weight": 598,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-122",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-123",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（614×224×438mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 169.1,
    "volume": 60.2,
    "weight": 575,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-123",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-277",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（610×220×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 57.7,
    "weight": 811,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-277",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-278",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（604×214×418mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 214,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54,
    "weight": 905,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-278",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-279",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（614×224×348mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 145.8,
    "volume": 47.8,
    "weight": 488,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-279",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-280",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（610×220×340mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 161,
    "volume": 45.6,
    "weight": 528,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-280",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS140-124",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（610×220×340mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 154.5,
    "volume": 45.6,
    "weight": 518,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-124",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS140-125",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（614×224×348mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 145.3,
    "volume": 47.8,
    "weight": 498,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-125",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA140-281",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（610×220×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 179.9,
    "volume": 45.6,
    "weight": 702,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-281",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-193",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（614×224×288mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.6,
    "weight": 437,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-193",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-194",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（610×220×280mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.5,
    "weight": 473,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-194",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-077",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（610×220×280mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.5,
    "weight": 464,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-077",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-078",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（614×224×288mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.6,
    "weight": 446,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-078",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-195",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（610×220×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.5,
    "weight": 629,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-195",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-196",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（604×214×268mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 214,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.6,
    "weight": 701,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-196",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-197",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（614×224×238mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.4,
    "volume": 32.7,
    "weight": 395,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-197",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-198",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（610×220×230mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.8,
    "weight": 427,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-198",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-079",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（610×220×230mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 30.8,
    "weight": 419,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-079",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-080",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（614×224×238mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.2,
    "volume": 32.7,
    "weight": 403,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-080",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-199",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（610×220×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.8,
    "weight": 569,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-199",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-200",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（604×214×218mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 214,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28.1,
    "weight": 633,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-200",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-201",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（614×224×208mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 114.9,
    "volume": 28.6,
    "weight": 370,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-201",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-202",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（610×220×200mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 26.8,
    "weight": 400,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-202",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-081",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（610×220×200mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 124.4,
    "volume": 26.8,
    "weight": 393,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-081",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-082",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（614×224×208mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 114.2,
    "volume": 28.6,
    "weight": 378,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-082",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-203",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（610×220×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 26.8,
    "weight": 532,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-203",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-204",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（604×214×188mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 214,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 24.3,
    "weight": 592,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-204",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-205",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（614×224×188mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98.7,
    "volume": 25.8,
    "weight": 354,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-205",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-206",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（610×220×180mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 126.5,
    "volume": 24.1,
    "weight": 382,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-206",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-083",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（610×220×180mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 121.3,
    "volume": 24.1,
    "weight": 375,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-083",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-084",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（614×224×188mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99,
    "volume": 25.8,
    "weight": 361,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-084",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-207",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（610×220×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 24.1,
    "weight": 508,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-207",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-208",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（604×214×168mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 214,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 21.7,
    "weight": 564,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-208",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-209",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（614×224×168mm）3mm B/F C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 96.4,
    "volume": 23.1,
    "weight": 337,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-209",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-210",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（610×220×160mm）5mm A/F K5×K5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 123.1,
    "volume": 21.4,
    "weight": 363,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-210",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-085",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（610×220×160mm）5mm A/F 白C5×C5",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 119.2,
    "volume": 21.4,
    "weight": 357,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-085",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-086",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（614×224×168mm）3mm B/F 白C5×C5",
    "innerLength": 614,
    "innerWidth": 224,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 95.8,
    "volume": 23.1,
    "weight": 344,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-086",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-211",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（610×220×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 610,
    "innerWidth": 220,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 21.4,
    "weight": 484,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-211",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-212",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（604×214×148mm）8mm W/F C5×C5",
    "innerLength": 604,
    "innerWidth": 214,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 19.1,
    "weight": 537,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-212",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-283",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（594×474×288mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 81,
    "weight": 820,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-283",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-284",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（590×470×280mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 77.6,
    "weight": 889,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-284",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-126",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（590×470×280mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 77.6,
    "weight": 872,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-126",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-127",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（594×474×288mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 288,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 81,
    "weight": 837,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-127",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-285",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（590×470×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 77.6,
    "weight": 1183,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-285",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-286",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（584×464×268mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 464,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 72.6,
    "weight": 1322,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-286",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-287",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（594×474×238mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67,
    "weight": 767,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-287",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-288",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（590×470×230mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 63.7,
    "weight": 831,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-288",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-128",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（590×470×230mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 63.7,
    "weight": 815,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-128",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-129",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（594×474×238mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67,
    "weight": 783,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-129",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-289",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（590×470×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 63.7,
    "weight": 1106,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-289",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-290",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（584×464×218mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 464,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59,
    "weight": 1236,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-290",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-291",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（594×474×208mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 189.9,
    "volume": 58.5,
    "weight": 735,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-291",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-292",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（590×470×200mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 55.4,
    "weight": 796,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-292",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-130",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（590×470×200mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 55.4,
    "weight": 781,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-130",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-131",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（594×474×208mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 188.7,
    "volume": 58.5,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-131",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-293",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（590×470×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 55.4,
    "weight": 1060,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-293",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-294",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（584×464×188mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 464,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 50.9,
    "weight": 1184,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-294",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-295",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（594×474×188mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52.9,
    "weight": 714,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-295",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-132",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（590×470×180mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.9,
    "weight": 759,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-132",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-133",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（594×474×188mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 52.9,
    "weight": 729,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-133",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-297",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（590×470×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 49.9,
    "weight": 1029,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-297",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-298",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（584×464×168mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 464,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.5,
    "weight": 1150,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-298",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-299",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（594×474×168mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.3,
    "weight": 692,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-299",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-300",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（590×470×160mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 44.3,
    "weight": 750,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-300",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-134",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（590×470×160mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.3,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-134",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-135",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（594×474×168mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 474,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.3,
    "weight": 707,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-135",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-301",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（590×470×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 470,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 44.3,
    "weight": 998,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-301",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-302",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（584×464×148mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 464,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40.1,
    "weight": 1115,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-302",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-303",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（594×234×438mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 169.1,
    "volume": 60.8,
    "weight": 565,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-303",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-304",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（590×230×430mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 58.3,
    "weight": 612,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-304",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-136",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（590×230×430mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 186.6,
    "volume": 58.3,
    "weight": 600,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-136",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-137",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（594×234×438mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 168,
    "volume": 60.8,
    "weight": 576,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-137",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-305",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（590×230×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 58.3,
    "weight": 814,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-305",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-306",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（584×224×418mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 224,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.6,
    "weight": 908,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-306",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-213",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（594×234×348mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48.3,
    "weight": 490,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-213",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-214",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（590×230×340mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 46.1,
    "weight": 530,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-214",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-087",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（590×230×340mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 46.1,
    "weight": 520,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-087",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-088",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（594×234×348mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48.3,
    "weight": 500,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-088",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-215",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（590×230×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 46.1,
    "weight": 706,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-215",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-216",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（584×224×328mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 224,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.9,
    "weight": 786,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-216",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-217",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（594×234×288mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 40,
    "weight": 441,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-217",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-218",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（590×230×280mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.9,
    "weight": 477,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-218",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-090",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（594×234×288mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 127.6,
    "volume": 40,
    "weight": 450,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-090",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-220",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（584×224×268mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 224,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35,
    "weight": 706,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-220",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-221",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（594×234×238mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 120.7,
    "volume": 33,
    "weight": 399,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-221",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-222",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（590×230×230mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 31.2,
    "weight": 431,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-222",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-091",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（590×230×230mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31.2,
    "weight": 423,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-091",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-092",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（594×234×238mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 120.2,
    "volume": 33,
    "weight": 407,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-092",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-223",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（590×230×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 31.2,
    "weight": 574,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-223",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-224",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（584×224×218mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 224,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28.5,
    "weight": 638,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-224",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-225",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（594×234×208mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116,
    "volume": 28.9,
    "weight": 374,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-225",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MAS120-093",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（590×230×200mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 125.4,
    "volume": 27.1,
    "weight": 397,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-093",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-094",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（594×234×208mm）3mm B/F 白C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 115.2,
    "volume": 28.9,
    "weight": 382,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-094",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-227",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（590×230×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 27.1,
    "weight": 538,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-227",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-228",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（584×224×188mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 224,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 24.5,
    "weight": 598,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-228",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-229",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（594×234×188mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 100.7,
    "volume": 26.1,
    "weight": 358,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-229",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-230",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（590×230×180mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 127.7,
    "volume": 24.4,
    "weight": 386,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-230",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-095",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（590×230×180mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 123.4,
    "volume": 24.4,
    "weight": 379,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-095",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-231",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（590×230×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 24.4,
    "weight": 514,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-231",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-232",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（584×224×168mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 224,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 21.9,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-232",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-233",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（594×234×168mm）3mm B/F C5×C5",
    "innerLength": 594,
    "innerWidth": 234,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98.6,
    "volume": 23.3,
    "weight": 341,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-233",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-234",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（590×230×160mm）5mm A/F K5×K5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 123.1,
    "volume": 21.7,
    "weight": 368,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-234",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-097",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（590×230×160mm）5mm A/F 白C5×C5",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 118.2,
    "volume": 21.7,
    "weight": 361,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-097",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-235",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（590×230×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 590,
    "innerWidth": 230,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 21.7,
    "weight": 490,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-235",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-236",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（584×224×148mm）8mm W/F C5×C5",
    "innerLength": 584,
    "innerWidth": 224,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 19.3,
    "weight": 544,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-236",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-308",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（580×480×280mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 77.9,
    "weight": 901,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-308",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MAS140-138",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（580×480×280mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 77.9,
    "weight": 884,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-138",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-309",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（580×480×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 77.9,
    "weight": 1199,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-309",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-310",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（574×474×268mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 474,
    "innerHeight": 268,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 72.9,
    "weight": 1340,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-310",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-311",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（584×484×238mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67.2,
    "weight": 778,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-311",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-312",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（580×480×230mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 64,
    "weight": 843,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-312",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-140",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（580×480×230mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 64,
    "weight": 827,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-140",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-141",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（584×484×238mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67.2,
    "weight": 794,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-141",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-313",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（580×480×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 64,
    "weight": 1121,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-313",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-314",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（574×474×218mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 474,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.3,
    "weight": 1254,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-314",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-315",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（584×484×208mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 58.7,
    "weight": 746,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-315",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-316",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（580×480×200mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 55.6,
    "weight": 808,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-316",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-142",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（580×480×200mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 55.6,
    "weight": 793,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-142",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-143",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（584×484×208mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 58.7,
    "weight": 761,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-143",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-317",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（580×480×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 55.6,
    "weight": 1075,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-317",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-318",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（574×474×188mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 474,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 51.1,
    "weight": 1202,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-318",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-319",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（584×484×188mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.1,
    "weight": 725,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-319",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-320",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（580×480×180mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 50.1,
    "weight": 785,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-320",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-144",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（580×480×180mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 50.1,
    "weight": 770,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-144",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-145",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（584×484×188mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.1,
    "weight": 740,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-145",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-321",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（580×480×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 50.1,
    "weight": 1044,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-321",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-322",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（574×474×168mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 474,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.7,
    "weight": 1167,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-322",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-323",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（584×484×168mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.4,
    "weight": 703,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-323",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-324",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（580×480×160mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 44.5,
    "weight": 762,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-324",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-146",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（580×480×160mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.5,
    "weight": 748,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-146",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-147",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（584×484×168mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 484,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.4,
    "weight": 718,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-147",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-325",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（580×480×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 480,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 44.5,
    "weight": 1014,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-325",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-326",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（574×474×148mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 474,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40.2,
    "weight": 1132,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-326",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-327",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（584×234×438mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 168,
    "volume": 59.8,
    "weight": 558,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-327",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-328",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（580×230×430mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.5,
    "volume": 57.3,
    "weight": 604,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-328",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-148",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（580×230×430mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 185.6,
    "volume": 57.3,
    "weight": 593,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-148",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-149",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（584×234×438mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 167,
    "volume": 59.8,
    "weight": 570,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-149",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-329",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（580×230×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 57.3,
    "weight": 804,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-329",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-330",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（574×224×418mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 224,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.7,
    "weight": 898,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-330",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-237",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（584×234×348mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.5,
    "weight": 485,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-237",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-238",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（580×230×340mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 45.3,
    "weight": 524,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-238",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-099",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（580×230×340mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.3,
    "weight": 514,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-099",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-100",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（584×234×348mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.5,
    "weight": 495,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-100",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-239",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（580×230×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 45.3,
    "weight": 697,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-239",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-240",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（574×224×328mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 224,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.1,
    "weight": 778,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-240",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-241",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（584×234×288mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 126.4,
    "volume": 39.3,
    "weight": 435,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-241",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-242",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（580×230×280mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.3,
    "weight": 471,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-242",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-101",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（580×230×280mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.3,
    "weight": 462,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-101",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-102",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（584×234×288mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 126.6,
    "volume": 39.3,
    "weight": 444,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-102",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-243",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（580×230×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.3,
    "weight": 627,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-243",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-244",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（574×224×268mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 224,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.4,
    "weight": 698,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-244",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-245",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（584×234×238mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.5,
    "volume": 32.5,
    "weight": 394,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-245",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-246",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（580×230×230mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.6,
    "weight": 426,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-246",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-103",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（580×230×230mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 30.6,
    "weight": 418,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-103",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-104",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（584×234×238mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 119.3,
    "volume": 32.5,
    "weight": 402,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-104",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-247",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（580×230×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.6,
    "weight": 567,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-247",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-249",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（584×234×208mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 114.8,
    "volume": 28.4,
    "weight": 370,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-249",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-250",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（580×230×200mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 26.6,
    "weight": 400,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-250",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-105",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（580×230×200mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 124.4,
    "volume": 26.6,
    "weight": 392,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-105",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-106",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（584×234×208mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 115.1,
    "volume": 28.4,
    "weight": 377,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-106",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-251",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（580×230×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 26.6,
    "weight": 532,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-251",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-252",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（574×224×188mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 224,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 24.1,
    "weight": 591,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-252",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-253",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（584×234×188mm）3mm B/F C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99.7,
    "volume": 25.6,
    "weight": 353,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-253",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-254",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（580×230×180mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 126.6,
    "volume": 24,
    "weight": 382,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-254",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-107",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（580×230×180mm）5mm A/F 白C5×C5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 122.3,
    "volume": 24,
    "weight": 375,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-107",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-108",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（584×234×188mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99,
    "volume": 25.6,
    "weight": 361,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-108",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-255",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（580×230×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 24,
    "weight": 508,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-255",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-256",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（574×224×168mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 224,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 21.6,
    "weight": 565,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-256",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-258",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（580×230×160mm）5mm A/F K5×K5",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 121.9,
    "volume": 21.3,
    "weight": 364,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-258",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MAS120-110",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（584×234×168mm）3mm B/F 白C5×C5",
    "innerLength": 584,
    "innerWidth": 234,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 96.9,
    "volume": 22.9,
    "weight": 344,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-110",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA120-259",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（580×230×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 580,
    "innerWidth": 230,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 21.3,
    "weight": 484,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-259",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA120-260",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（574×224×148mm）8mm W/F C5×C5",
    "innerLength": 574,
    "innerWidth": 224,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 19,
    "weight": 538,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-260",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 10,
      "total": 80
    }
  },
  {
    "code": "MA140-331",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（560×500×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 78.4,
    "weight": 1229,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-331",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-332",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（564×504×238mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67.6,
    "weight": 799,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-332",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-333",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（560×500×230mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 64.4,
    "weight": 866,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-333",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-150",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（560×500×230mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 64.4,
    "weight": 850,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-150",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-151",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（564×504×238mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67.6,
    "weight": 815,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-151",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-334",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（560×500×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 64.4,
    "weight": 1153,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-334",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-335",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（554×494×218mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 494,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.6,
    "weight": 1288,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-335",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-336",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（564×504×208mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.1,
    "weight": 767,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-336",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MAS140-152",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（560×500×200mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 56,
    "weight": 815,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-152",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-153",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（564×504×208mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.1,
    "weight": 783,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-153",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-338",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（560×500×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 56,
    "weight": 1106,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-338",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-339",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（554×494×188mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 494,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 51.4,
    "weight": 1236,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-339",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-341",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（560×500×180mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 50.4,
    "weight": 808,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-341",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-154",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（560×500×180mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 50.4,
    "weight": 793,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-154",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-155",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（564×504×188mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.4,
    "weight": 761,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-155",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-342",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（560×500×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 50.4,
    "weight": 1075,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-342",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-343",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（554×494×168mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 494,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.9,
    "weight": 1202,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-343",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-344",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（564×504×168mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.7,
    "weight": 725,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-344",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-345",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（560×500×160mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 44.8,
    "weight": 785,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-345",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-156",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（560×500×160mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.8,
    "weight": 770,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-156",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-157",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（564×504×168mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 504,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.7,
    "weight": 740,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-157",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-346",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（560×500×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 500,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 44.8,
    "weight": 1044,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-346",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-347",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（554×494×148mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 494,
    "innerHeight": 148,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 40.5,
    "weight": 1167,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-347",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-349",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（560×240×430mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 191.3,
    "volume": 57.7,
    "weight": 606,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-349",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-158",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（560×240×430mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 183.5,
    "volume": 57.7,
    "weight": 595,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-158",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-159",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（564×244×438mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 166,
    "volume": 60.2,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-159",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-350",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（560×240×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 57.7,
    "weight": 806,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-350",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-351",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（554×234×418mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 234,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.1,
    "weight": 899,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-351",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-261",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（564×244×348mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.8,
    "weight": 487,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-261",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-262",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（560×240×340mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 45.6,
    "weight": 527,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-262",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-111",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（560×240×340mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.6,
    "weight": 517,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-111",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-112",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（564×244×348mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.8,
    "weight": 497,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-112",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-263",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（560×240×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 45.6,
    "weight": 701,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-263",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-265",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（564×244×288mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 126.3,
    "volume": 39.6,
    "weight": 438,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-265",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-113",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（560×240×280mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.6,
    "weight": 465,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-113",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-114",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（564×244×288mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.6,
    "weight": 447,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-114",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-267",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（560×240×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.6,
    "weight": 631,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-267",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-268",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（554×234×268mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 234,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.7,
    "weight": 702,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-268",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-269",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（564×244×238mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 125.5,
    "volume": 32.7,
    "weight": 398,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-269",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-270",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（560×240×230mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.9,
    "weight": 430,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-270",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-116",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（564×244×238mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 118.3,
    "volume": 32.7,
    "weight": 406,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-116",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-271",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（560×240×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.9,
    "weight": 572,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-271",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-272",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（554×234×218mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 234,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28.2,
    "weight": 637,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-272",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-273",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（564×244×208mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 123,
    "volume": 28.6,
    "weight": 374,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-273",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MAS120-117",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（560×240×200mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 124.4,
    "volume": 26.8,
    "weight": 396,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-117",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-118",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（564×244×208mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116.2,
    "volume": 28.6,
    "weight": 381,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-118",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-275",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（560×240×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 26.8,
    "weight": 537,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-275",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-276",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（554×234×188mm）8mm W/F C5×C5",
    "innerLength": 554,
    "innerWidth": 234,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 24.3,
    "weight": 597,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-276",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-277",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（564×244×188mm）3mm B/F C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 98.6,
    "volume": 25.8,
    "weight": 357,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-277",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-278",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（560×240×180mm）5mm A/F K5×K5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 126.5,
    "volume": 24.1,
    "weight": 386,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-278",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-119",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（560×240×180mm）5mm A/F 白C5×C5",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 122.3,
    "volume": 24.1,
    "weight": 379,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-119",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-120",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（564×244×188mm）3mm B/F 白C5×C5",
    "innerLength": 564,
    "innerWidth": 244,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 100,
    "volume": 25.8,
    "weight": 365,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-120",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-279",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（560×240×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 560,
    "innerWidth": 240,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 24.1,
    "weight": 514,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-279",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA140-352",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］（530×530×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 280,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 78.6,
    "weight": 1272,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-352",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 5,
      "total": 20
    }
  },
  {
    "code": "MA140-353",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（534×534×238mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67.8,
    "weight": 829,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-353",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-160",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（530×530×230mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 230,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 64.6,
    "weight": 881,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-160",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MAS140-161",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（534×534×238mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 238,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 67.8,
    "weight": 846,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-161",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 6,
      "total": 24
    }
  },
  {
    "code": "MA140-356",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（524×524×218mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 524,
    "innerHeight": 218,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.8,
    "weight": 1337,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-356",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-357",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（534×534×208mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.3,
    "weight": 797,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-357",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-358",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（530×530×200mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 56.1,
    "weight": 863,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-358",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-162",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（530×530×200mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 56.1,
    "weight": 847,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-162",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-163",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（534×534×208mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 208,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 59.3,
    "weight": 813,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-163",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 7,
      "total": 28
    }
  },
  {
    "code": "MA140-359",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（530×530×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 200,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 56.1,
    "weight": 1149,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-359",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-360",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×8段］（524×524×188mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 524,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 51.6,
    "weight": 1285,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-360",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-361",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（534×534×188mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.6,
    "weight": 775,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-361",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-362",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（530×530×180mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 50.5,
    "weight": 841,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-362",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-164",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（530×530×180mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 50.5,
    "weight": 825,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-164",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MAS140-165",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（534×534×188mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 188,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.6,
    "weight": 791,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-165",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-363",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（530×530×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 180,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 50.5,
    "weight": 1119,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-363",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 8,
      "total": 32
    }
  },
  {
    "code": "MA140-364",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］（524×524×168mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 524,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 46.1,
    "weight": 1250,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-364",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-365",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（534×534×168mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.9,
    "weight": 754,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-365",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-366",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（530×530×160mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 44.9,
    "weight": 817,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-366",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-166",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（530×530×160mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.9,
    "weight": 802,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-166",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MAS140-167",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（534×534×168mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 534,
    "innerHeight": 168,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.9,
    "weight": 770,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-167",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 9,
      "total": 36
    }
  },
  {
    "code": "MA140-367",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］（530×530×160mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 530,
    "innerHeight": 160,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 44.9,
    "weight": 1087,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-367",
    "palletConfig": {
      "boxesPerLayer": 4,
      "layers": 10,
      "total": 40
    }
  },
  {
    "code": "MA140-370",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×4段］（524×344×418mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 344,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 75.3,
    "weight": 1146,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-370",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 3,
      "total": 18
    }
  },
  {
    "code": "MA140-371",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×5段］（534×354×348mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 186.4,
    "volume": 65.7,
    "weight": 631,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-371",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 4,
      "total": 24
    }
  },
  {
    "code": "MAS140-169",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×5段］（534×354×348mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 348,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 183.5,
    "volume": 65.7,
    "weight": 644,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-169",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 4,
      "total": 24
    }
  },
  {
    "code": "MA140-373",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×5段］（530×350×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 340,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 63,
    "weight": 910,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-373",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 4,
      "total": 24
    }
  },
  {
    "code": "MA120-282",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×6段］（530×350×280mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 51.9,
    "weight": 626,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-282",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 5,
      "total": 30
    }
  },
  {
    "code": "MAS120-121",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×6段］（530×350×280mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 51.9,
    "weight": 614,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-121",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 5,
      "total": 30
    }
  },
  {
    "code": "MAS120-122",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×6段］（534×354×288mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 54.4,
    "weight": 590,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-122",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 5,
      "total": 30
    }
  },
  {
    "code": "MA120-285",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×7段］（534×354×238mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.9,
    "weight": 534,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-285",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 6,
      "total": 36
    }
  },
  {
    "code": "MAS120-123",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×7段］（530×350×230mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.6,
    "weight": 567,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-123",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 6,
      "total": 36
    }
  },
  {
    "code": "MA120-291",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×8段］（530×350×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.1,
    "weight": 731,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-291",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MA120-292",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×8段］（524×344×188mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 344,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 33.8,
    "weight": 814,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-292",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MA120-294",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×9段］（530×350×180mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 33.3,
    "weight": 529,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-294",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MAS120-127",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×9段］（530×350×180mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 33.3,
    "weight": 519,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-127",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MAS120-128",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×9段］（534×354×188mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.5,
    "weight": 499,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-128",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MA120-295",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×9段］（530×350×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 33.3,
    "weight": 704,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-295",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 8,
      "total": 48
    }
  },
  {
    "code": "MA120-296",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×9段］（524×344×168mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 344,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 30.2,
    "weight": 785,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-296",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 9,
      "total": 54
    }
  },
  {
    "code": "MA120-298",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×10段］（530×350×160mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 29.6,
    "weight": 510,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-298",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 10,
      "total": 60
    }
  },
  {
    "code": "MAS120-129",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×10段］（530×350×160mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 350,
    "innerHeight": 160,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 29.6,
    "weight": 501,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-129",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 10,
      "total": 60
    }
  },
  {
    "code": "MAS120-130",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×10段］（534×354×168mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 354,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31.7,
    "weight": 482,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-130",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 9,
      "total": 54
    }
  },
  {
    "code": "MA120-300",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×10段］（524×344×148mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 344,
    "innerHeight": 148,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 26.6,
    "weight": 756,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-300",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 10,
      "total": 60
    }
  },
  {
    "code": "MA140-376",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（530×260×430mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 59.2,
    "weight": 616,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-376",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-170",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（530×260×430mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 186.6,
    "volume": 59.2,
    "weight": 604,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-170",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-171",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（534×264×438mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 168,
    "volume": 61.7,
    "weight": 581,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-171",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-377",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（530×260×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 59.2,
    "weight": 820,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-377",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-378",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（524×254×418mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 254,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 55.6,
    "weight": 914,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-378",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-301",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（534×264×348mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 49,
    "weight": 497,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-301",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-131",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（530×260×340mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 46.8,
    "weight": 528,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-131",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-132",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（534×264×348mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 49,
    "weight": 507,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-132",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-303",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（530×260×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 46.8,
    "weight": 716,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-303",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-304",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（524×254×328mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 254,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 43.6,
    "weight": 798,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-304",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-305",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（534×264×288mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 40.6,
    "weight": 449,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-305",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-306",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（530×260×280mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 38.5,
    "weight": 486,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-306",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-133",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（530×260×280mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.5,
    "weight": 477,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-133",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-134",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（534×264×288mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 127.6,
    "volume": 40.6,
    "weight": 458,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-134",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-308",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（524×254×268mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 254,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.6,
    "weight": 720,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-308",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-309",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（534×264×238mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.9,
    "volume": 33.5,
    "weight": 409,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-309",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-310",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（530×260×230mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 31.6,
    "weight": 442,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-310",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-135",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（530×260×230mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31.6,
    "weight": 434,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-135",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-136",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（534×264×238mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.4,
    "volume": 33.5,
    "weight": 417,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-136",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-311",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（530×260×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 31.6,
    "weight": 588,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-311",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-312",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（524×254×218mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 254,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 29,
    "weight": 654,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-312",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-313",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（534×264×208mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 118.2,
    "volume": 29.3,
    "weight": 385,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-313",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-314",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（530×260×200mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 27.5,
    "weight": 416,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-314",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-137",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（530×260×200mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 127.5,
    "volume": 27.5,
    "weight": 408,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-137",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-138",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（534×264×208mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 118.2,
    "volume": 29.3,
    "weight": 393,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-138",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-315",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（530×260×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 27.5,
    "weight": 554,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-315",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-316",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（524×254×188mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 254,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 25,
    "weight": 616,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-316",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-317",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（534×264×188mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116.2,
    "volume": 26.5,
    "weight": 369,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-317",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-318",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（530×260×180mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 127.7,
    "volume": 24.8,
    "weight": 399,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-318",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-139",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（530×260×180mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 123.4,
    "volume": 24.8,
    "weight": 392,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-139",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-140",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（534×264×188mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 264,
    "innerHeight": 188,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 115.2,
    "volume": 26.5,
    "weight": 376,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-140",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-319",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（530×260×180mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 180,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 24.8,
    "weight": 531,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-319",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA120-320",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（524×254×168mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 254,
    "innerHeight": 168,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 22.3,
    "weight": 590,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-320",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 9,
      "total": 72
    }
  },
  {
    "code": "MA140-379",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×3段］（530×200×580mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 61.4,
    "weight": 643,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-379",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 2,
      "total": 20
    }
  },
  {
    "code": "MA140-380",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×3段］（530×200×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 61.4,
    "weight": 856,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-380",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 2,
      "total": 20
    }
  },
  {
    "code": "MA140-381",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×3段］（524×194×568mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 194,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 57.7,
    "weight": 955,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-381",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 2,
      "total": 20
    }
  },
  {
    "code": "MA120-322",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（530×200×430mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 45.5,
    "weight": 522,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-322",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MAS120-141",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（530×200×430mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.5,
    "weight": 513,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-141",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MAS120-142",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（534×204×438mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.7,
    "weight": 493,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-142",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MA120-323",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（530×200×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 45.5,
    "weight": 695,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-323",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MA120-324",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（524×194×418mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 194,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.4,
    "weight": 775,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-324",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MA120-325",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（534×204×348mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 204,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.9,
    "volume": 37.9,
    "weight": 416,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-325",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA120-326",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（530×200×340mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 36,
    "weight": 450,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-326",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MAS120-143",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（530×200×340mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36,
    "weight": 442,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-143",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA120-327",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（530×200×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 36,
    "weight": 599,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-327",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA120-328",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（524×194×328mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 194,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 33.3,
    "weight": 666,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-328",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA120-329",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×6段］（534×204×288mm）3mm B/F C5×C5",
    "innerLength": 534,
    "innerWidth": 204,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116.1,
    "volume": 31.3,
    "weight": 372,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-329",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 5,
      "total": 50
    }
  },
  {
    "code": "MA120-330",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×6段］（530×200×280mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 29.6,
    "weight": 402,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-330",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 5,
      "total": 50
    }
  },
  {
    "code": "MAS120-145",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×6段］（530×200×280mm）5mm A/F 白C5×C5",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 125.4,
    "volume": 29.6,
    "weight": 394,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-145",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 5,
      "total": 50
    }
  },
  {
    "code": "MAS120-146",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×6段］（534×204×288mm）3mm B/F 白C5×C5",
    "innerLength": 534,
    "innerWidth": 204,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116.2,
    "volume": 31.3,
    "weight": 379,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-146",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 5,
      "total": 50
    }
  },
  {
    "code": "MA120-331",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×6段］（530×200×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 530,
    "innerWidth": 200,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.6,
    "weight": 535,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-331",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 5,
      "total": 50
    }
  },
  {
    "code": "MA120-332",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×6段］（524×194×268mm）8mm W/F C5×C5",
    "innerLength": 524,
    "innerWidth": 194,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 27.2,
    "weight": 594,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-332",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 5,
      "total": 50
    }
  },
  {
    "code": "MA140-382",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（500×270×580mm）5mm A/F K5×K5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 78.3,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-382",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-383",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（500×270×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 78.3,
    "weight": 980,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-383",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-384",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（494×264×568mm）8mm W/F C5×C5",
    "innerLength": 494,
    "innerWidth": 264,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 74,
    "weight": 1095,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-384",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-386",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（500×270×430mm）5mm A/F K5×K5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 58,
    "weight": 609,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-386",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-172",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（500×270×430mm）5mm A/F 白C5×C5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 58,
    "weight": 598,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-172",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-173",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（504×274×438mm）3mm B/F 白C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 169.1,
    "volume": 60.4,
    "weight": 574,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-173",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-387",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（500×270×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 58,
    "weight": 811,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-387",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-388",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（494×264×418mm）8mm W/F C5×C5",
    "innerLength": 494,
    "innerWidth": 264,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.5,
    "weight": 905,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-388",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-333",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（504×274×348mm）3mm B/F C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48,
    "weight": 492,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-333",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-147",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（500×270×340mm）5mm A/F 白C5×C5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.9,
    "weight": 523,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-147",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-148",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（504×274×348mm）3mm B/F 白C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48,
    "weight": 502,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-148",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-335",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（500×270×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 45.9,
    "weight": 709,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-335",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-336",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（494×264×328mm）8mm W/F C5×C5",
    "innerLength": 494,
    "innerWidth": 264,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.7,
    "weight": 790,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-336",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-149",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（500×270×280mm）5mm A/F 白C5×C5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.8,
    "weight": 473,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-149",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-150",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（504×274×288mm）3mm B/F 白C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.7,
    "weight": 455,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-150",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-339",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（500×270×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.8,
    "weight": 641,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-339",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-340",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（494×264×268mm）8mm W/F C5×C5",
    "innerLength": 494,
    "innerWidth": 264,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.9,
    "weight": 714,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-340",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-342",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（500×270×230mm）5mm A/F K5×K5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 31,
    "weight": 440,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-342",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-151",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（500×270×230mm）5mm A/F 白C5×C5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31,
    "weight": 432,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-151",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-343",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（500×270×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 31,
    "weight": 586,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-343",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-344",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（494×264×218mm）8mm W/F C5×C5",
    "innerLength": 494,
    "innerWidth": 264,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28.4,
    "weight": 651,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-344",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-345",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（504×274×208mm）3mm B/F C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116.1,
    "volume": 28.7,
    "weight": 384,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-345",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-346",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（500×270×200mm）5mm A/F K5×K5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 27,
    "weight": 414,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-346",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-153",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（500×270×200mm）5mm A/F 白C5×C5",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 126.5,
    "volume": 27,
    "weight": 407,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-153",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MAS120-154",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（504×274×208mm）3mm B/F 白C5×C5",
    "innerLength": 504,
    "innerWidth": 274,
    "innerHeight": 208,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116.2,
    "volume": 28.7,
    "weight": 391,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-154",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA120-347",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（500×270×200mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 500,
    "innerWidth": 270,
    "innerHeight": 200,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 27,
    "weight": 552,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-347",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 8,
      "total": 64
    }
  },
  {
    "code": "MA140-389",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（480×280×580mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 77.9,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-389",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-390",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（480×280×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 77.9,
    "weight": 979,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-390",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-391",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（474×274×568mm）8mm W/F C5×C5",
    "innerLength": 474,
    "innerWidth": 274,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 73.7,
    "weight": 1094,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-391",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-393",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（480×280×430mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.4,
    "volume": 57.7,
    "weight": 610,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-393",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-174",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（480×280×430mm）5mm A/F 白C5×C5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 185.6,
    "volume": 57.7,
    "weight": 599,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-174",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-175",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（484×284×438mm）3mm B/F 白C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 167,
    "volume": 60.2,
    "weight": 575,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-175",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-394",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（480×280×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 57.7,
    "weight": 812,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-394",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-350",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（480×280×340mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 45.6,
    "weight": 535,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-350",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-155",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（480×280×340mm）5mm A/F 白C5×C5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.6,
    "weight": 525,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-155",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-156",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（484×284×348mm）3mm B/F 白C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.8,
    "weight": 504,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-156",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-351",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（480×280×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 45.6,
    "weight": 712,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-351",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-352",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（474×274×328mm）8mm W/F C5×C5",
    "innerLength": 474,
    "innerWidth": 274,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.5,
    "weight": 794,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-352",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-353",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（484×284×288mm）3mm B/F C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.5,
    "weight": 448,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-353",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-157",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（480×280×280mm）5mm A/F 白C5×C5",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.6,
    "weight": 476,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-157",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-158",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（484×284×288mm）3mm B/F 白C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.5,
    "weight": 457,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-158",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-355",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（480×280×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.6,
    "weight": 645,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-355",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-356",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（474×274×268mm）8mm W/F C5×C5",
    "innerLength": 474,
    "innerWidth": 274,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.8,
    "weight": 718,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-356",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-160",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（484×284×238mm）3mm B/F 白C5×C5",
    "innerLength": 484,
    "innerWidth": 284,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.4,
    "volume": 32.7,
    "weight": 418,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-160",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-359",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（480×280×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 280,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.9,
    "weight": 589,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-359",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-360",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（474×274×218mm）8mm W/F C5×C5",
    "innerLength": 474,
    "innerWidth": 274,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28.3,
    "weight": 656,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-360",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA140-396",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（484×184×588mm）3mm B/F C5×C5",
    "innerLength": 484,
    "innerWidth": 184,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 161.9,
    "volume": 52.3,
    "weight": 526,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-396",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-397",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（480×180×580mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 183.4,
    "volume": 50.1,
    "weight": 569,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-397",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MAS140-176",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（480×180×580mm）5mm A/F 白C5×C5",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 176.2,
    "volume": 50.1,
    "weight": 559,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-176",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MAS140-177",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（484×184×588mm）3mm B/F 白C5×C5",
    "innerLength": 484,
    "innerWidth": 184,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 161.9,
    "volume": 52.3,
    "weight": 536,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-177",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-398",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（480×180×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 50.1,
    "weight": 758,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-398",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-399",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（474×174×568mm）8mm W/F C5×C5",
    "innerLength": 474,
    "innerWidth": 174,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 46.8,
    "weight": 845,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-399",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-362",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（480×180×430mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.1,
    "weight": 460,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-362",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-161",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（480×180×430mm）5mm A/F 白C5×C5",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.1,
    "weight": 451,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-161",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-162",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（484×184×438mm）3mm B/F 白C5×C5",
    "innerLength": 484,
    "innerWidth": 184,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.5,
    "volume": 39,
    "weight": 433,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-162",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-363",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（480×180×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.1,
    "weight": 612,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-363",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-364",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（474×174×418mm）8mm W/F C5×C5",
    "innerLength": 474,
    "innerWidth": 174,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.4,
    "weight": 681,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-364",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-365",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（484×184×348mm）3mm B/F C5×C5",
    "innerLength": 484,
    "innerWidth": 184,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99.7,
    "volume": 30.9,
    "weight": 364,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-365",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-366",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（480×180×340mm）5mm A/F K5×K5",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 127.7,
    "volume": 29.3,
    "weight": 394,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-366",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-163",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（480×180×340mm）5mm A/F 白C5×C5",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 122.3,
    "volume": 29.3,
    "weight": 386,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-163",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-164",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（484×184×348mm）3mm B/F 白C5×C5",
    "innerLength": 484,
    "innerWidth": 184,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 100,
    "volume": 30.9,
    "weight": 372,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-164",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-367",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（480×180×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 480,
    "innerWidth": 180,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.3,
    "weight": 524,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-367",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-368",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（474×174×328mm）8mm W/F C5×C5",
    "innerLength": 474,
    "innerWidth": 174,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 27,
    "weight": 582,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-368",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA140-400",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（470×290×580mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 79,
    "weight": 744,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-400",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-402",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］（464×284×568mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 284,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 74.8,
    "weight": 1106,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-402",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 2,
      "total": 16
    }
  },
  {
    "code": "MA140-403",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（474×294×438mm）3mm B/F C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 169.1,
    "volume": 61,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-403",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-178",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（470×290×430mm）5mm A/F 白C5×C5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 185.6,
    "volume": 58.6,
    "weight": 607,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-178",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-179",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（474×294×438mm）3mm B/F 白C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 167,
    "volume": 61,
    "weight": 583,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-179",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-405",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（470×290×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 58.6,
    "weight": 823,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-405",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-406",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（464×284×418mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 284,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 55,
    "weight": 918,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-406",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-370",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（470×290×340mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 46.3,
    "weight": 543,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-370",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-165",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（470×290×340mm）5mm A/F 白C5×C5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 46.3,
    "weight": 533,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-165",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-166",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（474×294×348mm）3mm B/F 白C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48.4,
    "weight": 512,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-166",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-371",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（470×290×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 46.3,
    "weight": 723,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-371",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-373",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（474×294×288mm）3mm B/F C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 40.1,
    "weight": 456,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-373",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-374",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（470×290×280mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 38.1,
    "weight": 493,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-374",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-167",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（470×290×280mm）5mm A/F 白C5×C5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.1,
    "weight": 483,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-167",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-168",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（474×294×288mm）3mm B/F 白C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 40.1,
    "weight": 465,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-168",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-375",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（470×290×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 38.1,
    "weight": 656,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-375",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-376",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（464×284×268mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 284,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.3,
    "weight": 730,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-376",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-377",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（474×294×238mm）3mm B/F C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.8,
    "volume": 33.1,
    "weight": 417,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-377",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-378",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（470×290×230mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 31.3,
    "weight": 451,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-378",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-170",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（474×294×238mm）3mm B/F 白C5×C5",
    "innerLength": 474,
    "innerWidth": 294,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.4,
    "volume": 33.1,
    "weight": 426,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-170",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-379",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（470×290×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 290,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 31.3,
    "weight": 600,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-379",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-380",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（464×284×218mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 284,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28.7,
    "weight": 668,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-380",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA140-407",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（474×194×588mm）3mm B/F C5×C5",
    "innerLength": 474,
    "innerWidth": 194,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 161.9,
    "volume": 54,
    "weight": 532,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-407",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-408",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（470×190×580mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 183.4,
    "volume": 51.7,
    "weight": 576,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-408",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MAS140-180",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（470×190×580mm）5mm A/F 白C5×C5",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 176.2,
    "volume": 51.7,
    "weight": 565,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-180",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MAS140-181",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（474×194×588mm）3mm B/F 白C5×C5",
    "innerLength": 474,
    "innerWidth": 194,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 161.9,
    "volume": 54,
    "weight": 543,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-181",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-409",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（470×190×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 51.7,
    "weight": 767,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-409",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-410",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（464×184×568mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 184,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 48.4,
    "weight": 855,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-410",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-381",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（474×194×438mm）3mm B/F C5×C5",
    "innerLength": 474,
    "innerWidth": 194,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124,
    "volume": 40.2,
    "weight": 431,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-381",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-382",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（470×190×430mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 38.3,
    "weight": 467,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-382",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-171",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（470×190×430mm）5mm A/F 白C5×C5",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.3,
    "weight": 458,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-171",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-383",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（470×190×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 38.3,
    "weight": 621,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-383",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-384",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（464×184×418mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 184,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.6,
    "weight": 692,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-384",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-385",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（474×194×348mm）3mm B/F C5×C5",
    "innerLength": 474,
    "innerWidth": 194,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 116,
    "volume": 32,
    "weight": 371,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-385",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-386",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（470×190×340mm）5mm A/F K5×K5",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.3,
    "weight": 401,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-386",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-173",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（470×190×340mm）5mm A/F 白C5×C5",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 125.4,
    "volume": 30.3,
    "weight": 394,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-173",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-174",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（474×194×348mm）3mm B/F 白C5×C5",
    "innerLength": 474,
    "innerWidth": 194,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 115.2,
    "volume": 32,
    "weight": 378,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-174",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-387",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（470×190×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 470,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.3,
    "weight": 534,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-387",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-388",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（464×184×328mm）8mm W/F C5×C5",
    "innerLength": 464,
    "innerWidth": 184,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28,
    "weight": 594,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-388",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA140-411",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（454×304×438mm）3mm B/F C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 171.3,
    "volume": 60.4,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-411",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-412",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（450×300×430mm）5mm A/F K5×K5",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 58,
    "weight": 619,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-412",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-182",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（450×300×430mm）5mm A/F 白C5×C5",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 187.6,
    "volume": 58,
    "weight": 607,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-182",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-183",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（454×304×438mm）3mm B/F 白C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 169.1,
    "volume": 60.4,
    "weight": 583,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-183",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-413",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（450×300×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 58,
    "weight": 823,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-413",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-414",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（444×294×418mm）8mm W/F C5×C5",
    "innerLength": 444,
    "innerWidth": 294,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 54.5,
    "weight": 919,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-414",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-389",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（454×304×348mm）3mm B/F C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48,
    "weight": 503,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-389",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-175",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（450×300×340mm）5mm A/F 白C5×C5",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.9,
    "weight": 534,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-175",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-176",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（454×304×348mm）3mm B/F 白C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 48,
    "weight": 513,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-176",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-391",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（450×300×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 45.9,
    "weight": 724,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-391",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-393",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（454×304×288mm）3mm B/F C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.7,
    "weight": 457,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-393",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-394",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（450×300×280mm）5mm A/F K5×K5",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.8,
    "weight": 495,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-394",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-178",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（454×304×288mm）3mm B/F 白C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.7,
    "weight": 467,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-178",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-396",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（444×294×268mm）8mm W/F C5×C5",
    "innerLength": 444,
    "innerWidth": 294,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.9,
    "weight": 734,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-396",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-397",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（454×304×238mm）3mm B/F C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124,
    "volume": 32.8,
    "weight": 419,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-397",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-179",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（450×300×230mm）5mm A/F 白C5×C5",
    "innerLength": 450,
    "innerWidth": 300,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31,
    "weight": 445,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-179",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-180",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（454×304×238mm）3mm B/F 白C5×C5",
    "innerLength": 454,
    "innerWidth": 304,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.8,
    "weight": 428,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-180",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-400",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（444×294×218mm）8mm W/F C5×C5",
    "innerLength": 444,
    "innerWidth": 294,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28.4,
    "weight": 672,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-400",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA140-416",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（450×190×580mm）5mm A/F K5×K5",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 180,
    "volume": 49.5,
    "weight": 560,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-416",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MAS140-184",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（450×190×580mm）5mm A/F 白C5×C5",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 174.2,
    "volume": 49.5,
    "weight": 549,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-184",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MAS140-185",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（454×194×588mm）3mm B/F 白C5×C5",
    "innerLength": 454,
    "innerWidth": 194,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 149.5,
    "volume": 51.7,
    "weight": 527,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-185",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-417",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（450×190×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 49.5,
    "weight": 745,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-417",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-418",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（444×184×568mm）8mm W/F C5×C5",
    "innerLength": 444,
    "innerWidth": 184,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 46.4,
    "weight": 830,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-418",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-401",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（454×194×438mm）3mm B/F C5×C5",
    "innerLength": 454,
    "innerWidth": 194,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.8,
    "volume": 38.5,
    "weight": 419,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-401",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-402",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（450×190×430mm）5mm A/F K5×K5",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 36.7,
    "weight": 453,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-402",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-181",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（450×190×430mm）5mm A/F 白C5×C5",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.7,
    "weight": 445,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-181",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-182",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（454×194×438mm）3mm B/F 白C5×C5",
    "innerLength": 454,
    "innerWidth": 194,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.4,
    "volume": 38.5,
    "weight": 427,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-182",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-403",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（450×190×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 36.7,
    "weight": 603,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-403",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-404",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（444×184×418mm）8mm W/F C5×C5",
    "innerLength": 444,
    "innerWidth": 184,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.1,
    "weight": 671,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-404",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-406",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（450×190×340mm）5mm A/F K5×K5",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 127.8,
    "volume": 29,
    "weight": 389,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-406",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-183",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（450×190×340mm）5mm A/F 白C5×C5",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 123.4,
    "volume": 29,
    "weight": 382,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-183",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-184",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（454×194×348mm）3mm B/F 白C5×C5",
    "innerLength": 454,
    "innerWidth": 194,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 101,
    "volume": 30.6,
    "weight": 368,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-184",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-407",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（450×190×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 450,
    "innerWidth": 190,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29,
    "weight": 518,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-407",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-408",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（444×184×328mm）8mm W/F C5×C5",
    "innerLength": 444,
    "innerWidth": 184,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 26.7,
    "weight": 576,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-408",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA140-419",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（444×304×438mm）3mm B/F C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 170.2,
    "volume": 59.1,
    "weight": 564,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-419",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-420",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（440×300×430mm）5mm A/F K5×K5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 56.7,
    "weight": 611,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-420",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-186",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（440×300×430mm）5mm A/F 白C5×C5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 186.6,
    "volume": 56.7,
    "weight": 599,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-186",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-187",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（444×304×438mm）3mm B/F 白C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 168,
    "volume": 59.1,
    "weight": 576,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-187",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-421",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（440×300×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 56.7,
    "weight": 813,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-421",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-422",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（434×294×418mm）8mm W/F C5×C5",
    "innerLength": 434,
    "innerWidth": 294,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.3,
    "weight": 907,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-422",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-409",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（444×304×348mm）3mm B/F C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 46.9,
    "weight": 496,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-409",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-410",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（440×300×340mm）5mm A/F K5×K5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 44.8,
    "weight": 537,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-410",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-185",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（440×300×340mm）5mm A/F 白C5×C5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.8,
    "weight": 527,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-185",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-186",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（444×304×348mm）3mm B/F 白C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 46.9,
    "weight": 506,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-186",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-412",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（434×294×328mm）8mm W/F C5×C5",
    "innerLength": 434,
    "innerWidth": 294,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 41.8,
    "weight": 798,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-412",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-187",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（440×300×280mm）5mm A/F 白C5×C5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.9,
    "weight": 479,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-187",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-188",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（444×304×288mm）3mm B/F 白C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.8,
    "weight": 461,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-188",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-416",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（434×294×268mm）8mm W/F C5×C5",
    "innerLength": 434,
    "innerWidth": 294,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.1,
    "weight": 724,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-416",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-418",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（440×300×230mm）5mm A/F K5×K5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.3,
    "weight": 448,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-418",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-189",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（440×300×230mm）5mm A/F 白C5×C5",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 30.3,
    "weight": 440,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-189",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-190",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（444×304×238mm）3mm B/F 白C5×C5",
    "innerLength": 444,
    "innerWidth": 304,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.7,
    "volume": 32.1,
    "weight": 422,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-190",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-419",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（440×300×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 440,
    "innerWidth": 300,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.3,
    "weight": 596,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-419",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-420",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（434×294×218mm）8mm W/F C5×C5",
    "innerLength": 434,
    "innerWidth": 294,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 27.8,
    "weight": 663,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-420",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA140-423",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（440×200×580mm）5mm A/F K5×K5",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 183.5,
    "volume": 51,
    "weight": 567,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-423",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-424",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（440×200×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 51,
    "weight": 754,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-424",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-425",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（434×194×568mm）8mm W/F C5×C5",
    "innerLength": 434,
    "innerWidth": 194,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 47.8,
    "weight": 841,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-425",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-421",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（444×204×438mm）3mm B/F C5×C5",
    "innerLength": 444,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 126.3,
    "volume": 39.6,
    "weight": 426,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-421",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-422",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（440×200×430mm）5mm A/F K5×K5",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.8,
    "weight": 460,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-422",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-191",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（440×200×430mm）5mm A/F 白C5×C5",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.8,
    "weight": 452,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-191",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-192",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（444×204×438mm）3mm B/F 白C5×C5",
    "innerLength": 444,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.5,
    "volume": 39.6,
    "weight": 434,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-192",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-423",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（440×200×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.8,
    "weight": 612,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-423",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-424",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（434×194×418mm）8mm W/F C5×C5",
    "innerLength": 434,
    "innerWidth": 194,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.1,
    "weight": 682,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-424",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-426",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（440×200×340mm）5mm A/F K5×K5",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 127.8,
    "volume": 29.9,
    "weight": 396,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-426",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-193",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（440×200×340mm）5mm A/F 白C5×C5",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 123.4,
    "volume": 29.9,
    "weight": 389,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-193",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-194",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（444×204×348mm）3mm B/F 白C5×C5",
    "innerLength": 444,
    "innerWidth": 204,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 103.1,
    "volume": 31.5,
    "weight": 374,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-194",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-427",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（440×200×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 440,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.9,
    "weight": 527,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-427",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-428",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（434×194×328mm）8mm W/F C5×C5",
    "innerLength": 434,
    "innerWidth": 194,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 27.6,
    "weight": 586,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-428",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA140-426",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（434×314×438mm）3mm B/F C5×C5",
    "innerLength": 434,
    "innerWidth": 314,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 170.2,
    "volume": 59.6,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-426",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-427",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（430×310×430mm）5mm A/F K5×K5",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 57.3,
    "weight": 619,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-427",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS140-189",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（434×314×438mm）3mm B/F 白C5×C5",
    "innerLength": 434,
    "innerWidth": 314,
    "innerHeight": 438,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 168,
    "volume": 59.6,
    "weight": 583,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-189",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-428",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（430×310×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 430,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 57.3,
    "weight": 824,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-428",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA140-429",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（424×304×418mm）8mm W/F C5×C5",
    "innerLength": 424,
    "innerWidth": 304,
    "innerHeight": 418,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 53.8,
    "weight": 919,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-429",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-429",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（434×314×348mm）3mm B/F C5×C5",
    "innerLength": 434,
    "innerWidth": 314,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.4,
    "weight": 504,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-429",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-430",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（430×310×340mm）5mm A/F K5×K5",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 45.3,
    "weight": 546,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-430",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-195",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（430×310×340mm）5mm A/F 白C5×C5",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.3,
    "weight": 536,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-195",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-196",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（434×314×348mm）3mm B/F 白C5×C5",
    "innerLength": 434,
    "innerWidth": 314,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 47.4,
    "weight": 514,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-196",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-431",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（430×310×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 45.3,
    "weight": 726,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-431",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-432",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（424×304×328mm）8mm W/F C5×C5",
    "innerLength": 424,
    "innerWidth": 304,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 42.2,
    "weight": 810,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-432",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-434",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（430×310×280mm）5mm A/F K5×K5",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.3,
    "weight": 497,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-434",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-198",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（434×314×288mm）3mm B/F 白C5×C5",
    "innerLength": 434,
    "innerWidth": 314,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.2,
    "weight": 469,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-198",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-435",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（430×310×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.3,
    "weight": 661,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-435",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-436",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（424×304×268mm）8mm W/F C5×C5",
    "innerLength": 424,
    "innerWidth": 304,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.5,
    "weight": 736,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-436",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-437",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（434×314×238mm）3mm B/F C5×C5",
    "innerLength": 434,
    "innerWidth": 314,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.4,
    "weight": 422,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-437",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-438",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（430×310×230mm）5mm A/F K5×K5",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.6,
    "weight": 456,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-438",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MAS120-200",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（434×314×238mm）3mm B/F 白C5×C5",
    "innerLength": 434,
    "innerWidth": 314,
    "innerHeight": 238,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.4,
    "weight": 430,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-200",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-439",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（430×310×230mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 430,
    "innerWidth": 310,
    "innerHeight": 230,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.6,
    "weight": 607,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-439",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 6,
      "total": 48
    }
  },
  {
    "code": "MA120-440",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（424×304×218mm）8mm W/F C5×C5",
    "innerLength": 424,
    "innerWidth": 304,
    "innerHeight": 218,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 28,
    "weight": 675,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-440",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 7,
      "total": 56
    }
  },
  {
    "code": "MA140-430",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（434×204×588mm）3mm B/F C5×C5",
    "innerLength": 434,
    "innerWidth": 204,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 151.5,
    "volume": 52,
    "weight": 515,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-430",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-431",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（430×200×580mm）5mm A/F K5×K5",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 182.3,
    "volume": 49.8,
    "weight": 558,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-431",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-432",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（430×200×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 49.8,
    "weight": 743,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-432",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-433",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（424×194×568mm）8mm W/F C5×C5",
    "innerLength": 424,
    "innerWidth": 194,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 46.7,
    "weight": 828,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-433",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-441",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（434×204×438mm）3mm B/F C5×C5",
    "innerLength": 434,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124,
    "volume": 38.7,
    "weight": 419,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-441",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-442",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（430×200×430mm）5mm A/F K5×K5",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 36.9,
    "weight": 453,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-442",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-201",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（430×200×430mm）5mm A/F 白C5×C5",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.9,
    "weight": 445,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-201",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-202",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（434×204×438mm）3mm B/F 白C5×C5",
    "innerLength": 434,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 123.5,
    "volume": 38.7,
    "weight": 428,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-202",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-444",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（424×194×418mm）8mm W/F C5×C5",
    "innerLength": 424,
    "innerWidth": 194,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.3,
    "weight": 672,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-444",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-445",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（434×204×348mm）3mm B/F C5×C5",
    "innerLength": 434,
    "innerWidth": 204,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 99.7,
    "volume": 30.8,
    "weight": 361,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-445",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-446",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（430×200×340mm）5mm A/F K5×K5",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 127.7,
    "volume": 29.2,
    "weight": 390,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-446",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-203",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（430×200×340mm）5mm A/F 白C5×C5",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 122.3,
    "volume": 29.2,
    "weight": 383,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-203",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MAS120-204",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（434×204×348mm）3mm B/F 白C5×C5",
    "innerLength": 434,
    "innerWidth": 204,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 100,
    "volume": 30.8,
    "weight": 369,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-204",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-447",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（430×200×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 430,
    "innerWidth": 200,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 29.2,
    "weight": 520,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-447",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-448",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×5段］（424×194×328mm）8mm W/F C5×C5",
    "innerLength": 424,
    "innerWidth": 194,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 26.9,
    "weight": 578,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-448",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 4,
      "total": 48
    }
  },
  {
    "code": "MA120-449",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（424×314×438mm）3mm B/F C5×C5",
    "innerLength": 424,
    "innerWidth": 314,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 58.3,
    "weight": 564,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-449",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-450",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（420×310×430mm）5mm A/F K5×K5",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 55.9,
    "weight": 611,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-450",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS120-206",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（424×314×438mm）3mm B/F 白C5×C5",
    "innerLength": 424,
    "innerWidth": 314,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 58.3,
    "weight": 576,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-206",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-452",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（414×304×418mm）8mm W/F C5×C5",
    "innerLength": 414,
    "innerWidth": 304,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 52.6,
    "weight": 907,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-452",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-453",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（424×314×348mm）3mm B/F C5×C5",
    "innerLength": 424,
    "innerWidth": 314,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 46.3,
    "weight": 497,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-453",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-454",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（420×310×340mm）5mm A/F K5×K5",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 44.2,
    "weight": 538,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-454",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-207",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（420×310×340mm）5mm A/F 白C5×C5",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.2,
    "weight": 528,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-207",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-208",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（424×314×348mm）3mm B/F 白C5×C5",
    "innerLength": 424,
    "innerWidth": 314,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 46.3,
    "weight": 507,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-208",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-455",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（420×310×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 44.2,
    "weight": 716,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-455",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-456",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（414×304×328mm）8mm W/F C5×C5",
    "innerLength": 414,
    "innerWidth": 304,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 41.2,
    "weight": 799,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-456",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-457",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（424×314×288mm）3mm B/F C5×C5",
    "innerLength": 424,
    "innerWidth": 314,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.3,
    "weight": 453,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-457",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-209",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（420×310×280mm）5mm A/F 白C5×C5",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.4,
    "weight": 481,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-209",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-210",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（424×314×288mm）3mm B/F 白C5×C5",
    "innerLength": 424,
    "innerWidth": 314,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 38.3,
    "weight": 462,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-210",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-459",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（420×310×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 420,
    "innerWidth": 310,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 36.4,
    "weight": 652,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-459",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-460",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（414×304×268mm）8mm W/F C5×C5",
    "innerLength": 414,
    "innerWidth": 304,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 33.7,
    "weight": 726,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-460",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA140-434",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（424×204×588mm）3mm B/F C5×C5",
    "innerLength": 424,
    "innerWidth": 204,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 149.3,
    "volume": 50.8,
    "weight": 508,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-434",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-435",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（420×200×580mm）5mm A/F K5×K5",
    "innerLength": 420,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 180,
    "volume": 48.7,
    "weight": 550,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-435",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-436",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（420×200×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 420,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 300,
    "volume": null,
    "weight": null,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-436",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-437",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（414×194×568mm）8mm W/F C5×C5",
    "innerLength": 414,
    "innerWidth": 194,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 45.6,
    "weight": 815,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-437",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-461",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（424×204×438mm）3mm B/F C5×C5",
    "innerLength": 424,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.9,
    "volume": 37.8,
    "weight": 413,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-461",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-462",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（420×200×430mm）5mm A/F K5×K5",
    "innerLength": 420,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 36.1,
    "weight": 446,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-462",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-211",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（420×200×430mm）5mm A/F 白C5×C5",
    "innerLength": 420,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.1,
    "weight": 438,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-211",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-212",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（424×204×438mm）3mm B/F 白C5×C5",
    "innerLength": 424,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 122.4,
    "volume": 37.8,
    "weight": 421,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-212",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-463",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（420×200×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 420,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 36.1,
    "weight": 594,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-463",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-464",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（414×194×418mm）8mm W/F C5×C5",
    "innerLength": 414,
    "innerWidth": 194,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 33.5,
    "weight": 662,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-464",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-213",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（390×320×430mm）5mm A/F 白C5×C5",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 53.6,
    "weight": 591,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-213",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS120-214",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（394×324×438mm）3mm B/F 白C5×C5",
    "innerLength": 394,
    "innerWidth": 324,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 55.9,
    "weight": 568,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-214",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-467",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（390×320×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 53.6,
    "weight": 802,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-467",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-468",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（384×314×418mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 314,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 50.4,
    "weight": 894,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-468",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-469",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（394×324×348mm）3mm B/F C5×C5",
    "innerLength": 394,
    "innerWidth": 324,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.4,
    "weight": 491,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-469",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-470",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（390×320×340mm）5mm A/F K5×K5",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 42.4,
    "weight": 532,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-470",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-216",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（394×324×348mm）3mm B/F 白C5×C5",
    "innerLength": 394,
    "innerWidth": 324,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.4,
    "weight": 501,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-216",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-471",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（390×320×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 320,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 42.4,
    "weight": 708,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-471",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-472",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（384×314×328mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 314,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.5,
    "weight": 790,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-472",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-476",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（384×314×268mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 314,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.3,
    "weight": 719,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-476",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA140-438",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×3段］（394×264×588mm）3mm B/F C5×C5",
    "innerLength": 394,
    "innerWidth": 264,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 166.7,
    "volume": 61.1,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-438",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 2,
      "total": 20
    }
  },
  {
    "code": "MA140-439",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×3段］（390×260×580mm）5mm A/F K5×K5",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 192.9,
    "volume": 58.8,
    "weight": 618,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-439",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 2,
      "total": 20
    }
  },
  {
    "code": "MA140-440",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×3段］（390×260×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 58.8,
    "weight": 823,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-440",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 2,
      "total": 20
    }
  },
  {
    "code": "MA140-441",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×3段］（384×254×568mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 254,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 55.4,
    "weight": 918,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-441",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 2,
      "total": 20
    }
  },
  {
    "code": "MA120-477",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（394×264×438mm）3mm B/F C5×C5",
    "innerLength": 394,
    "innerWidth": 264,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.5,
    "weight": 471,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-477",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MAS120-219",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（390×260×430mm）5mm A/F 白C5×C5",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 43.6,
    "weight": 501,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-219",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MAS120-220",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（394×264×438mm）3mm B/F 白C5×C5",
    "innerLength": 394,
    "innerWidth": 264,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 45.5,
    "weight": 481,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-220",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MA120-479",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（390×260×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 43.6,
    "weight": 679,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-479",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MA120-480",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×4段］（384×254×418mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 254,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 40.7,
    "weight": 757,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-480",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 3,
      "total": 30
    }
  },
  {
    "code": "MA120-481",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（394×264×348mm）3mm B/F C5×C5",
    "innerLength": 394,
    "innerWidth": 264,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 124.2,
    "volume": 36.1,
    "weight": 412,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-481",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MAS120-221",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（390×260×340mm）5mm A/F 白C5×C5",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.4,
    "weight": 437,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-221",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MAS120-222",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（394×264×348mm）3mm B/F 白C5×C5",
    "innerLength": 394,
    "innerWidth": 264,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 123.4,
    "volume": 36.1,
    "weight": 420,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-222",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA120-483",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（390×260×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 260,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 34.4,
    "weight": 593,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-483",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA120-484",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段10箱×5段］（384×254×328mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 254,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31.9,
    "weight": 660,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-484",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 4,
      "total": 40
    }
  },
  {
    "code": "MA140-442",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（390×210×580mm）5mm A/F K5×K5",
    "innerLength": 390,
    "innerWidth": 210,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 177.8,
    "volume": 47.5,
    "weight": 539,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-442",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-443",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（390×210×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 210,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 47.5,
    "weight": 718,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-443",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-444",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（384×204×568mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 204,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.4,
    "weight": 800,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-444",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-485",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（394×214×438mm）3mm B/F C5×C5",
    "innerLength": 394,
    "innerWidth": 214,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 120.7,
    "volume": 36.9,
    "weight": 406,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-485",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-486",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（390×210×430mm）5mm A/F K5×K5",
    "innerLength": 390,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 35.2,
    "weight": 439,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-486",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-223",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（390×210×430mm）5mm A/F 白C5×C5",
    "innerLength": 390,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.2,
    "weight": 431,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-223",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-224",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（394×214×438mm）3mm B/F 白C5×C5",
    "innerLength": 394,
    "innerWidth": 214,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 120.4,
    "volume": 36.9,
    "weight": 414,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-224",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-487",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（390×210×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 390,
    "innerWidth": 210,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 35.2,
    "weight": 585,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-487",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-488",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（384×204×418mm）8mm W/F C5×C5",
    "innerLength": 384,
    "innerWidth": 204,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.7,
    "weight": 651,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-488",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-489",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（374×344×438mm）3mm B/F C5×C5",
    "innerLength": 374,
    "innerWidth": 344,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 56.3,
    "weight": 571,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-489",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MAS120-225",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（370×340×430mm）5mm A/F 白C5×C5",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 54,
    "weight": 607,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-225",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-491",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（370×340×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 54,
    "weight": 823,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-491",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-492",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×4段］（364×334×418mm）8mm W/F C5×C5",
    "innerLength": 364,
    "innerWidth": 334,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 50.8,
    "weight": 918,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-492",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 3,
      "total": 24
    }
  },
  {
    "code": "MA120-493",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（374×344×348mm）3mm B/F C5×C5",
    "innerLength": 374,
    "innerWidth": 344,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.7,
    "weight": 506,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-493",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-494",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（370×340×340mm）5mm A/F K5×K5",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 42.7,
    "weight": 548,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-494",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MAS120-228",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（374×344×348mm）3mm B/F 白C5×C5",
    "innerLength": 374,
    "innerWidth": 344,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 44.7,
    "weight": 516,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-228",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-495",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（370×340×340mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 42.7,
    "weight": 729,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-495",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-496",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］（364×334×328mm）8mm W/F C5×C5",
    "innerLength": 364,
    "innerWidth": 334,
    "innerHeight": 328,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.8,
    "weight": 813,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-496",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 4,
      "total": 32
    }
  },
  {
    "code": "MA120-497",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（374×344×288mm）3mm B/F C5×C5",
    "innerLength": 374,
    "innerWidth": 344,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37,
    "weight": 463,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-497",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-498",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（370×340×280mm）5mm A/F K5×K5",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 35.2,
    "weight": 501,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-498",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-229",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（370×340×280mm）5mm A/F 白C5×C5",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.2,
    "weight": 491,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-229",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MAS120-230",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（374×344×288mm）3mm B/F 白C5×C5",
    "innerLength": 374,
    "innerWidth": 344,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37,
    "weight": 472,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-230",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-499",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（370×340×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 370,
    "innerWidth": 340,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 35.2,
    "weight": 666,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-499",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA120-500",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（364×334×268mm）8mm W/F C5×C5",
    "innerLength": 364,
    "innerWidth": 334,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.5,
    "weight": 742,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-500",
    "palletConfig": {
      "boxesPerLayer": 8,
      "layers": 5,
      "total": 40
    }
  },
  {
    "code": "MA140-445",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（370×220×580mm）5mm A/F K5×K5",
    "innerLength": 370,
    "innerWidth": 220,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 178.9,
    "volume": 47.2,
    "weight": 537,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-445",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-447",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（364×214×568mm）8mm W/F C5×C5",
    "innerLength": 364,
    "innerWidth": 214,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 44.2,
    "weight": 797,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-447",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-501",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（374×224×438mm）3mm B/F C5×C5",
    "innerLength": 374,
    "innerWidth": 224,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.7,
    "volume": 36.6,
    "weight": 406,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-501",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-502",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（370×220×430mm）5mm A/F K5×K5",
    "innerLength": 370,
    "innerWidth": 220,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 35,
    "weight": 439,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-502",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-231",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（370×220×430mm）5mm A/F 白C5×C5",
    "innerLength": 370,
    "innerWidth": 220,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35,
    "weight": 431,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-231",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-232",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（374×224×438mm）3mm B/F 白C5×C5",
    "innerLength": 374,
    "innerWidth": 224,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.4,
    "volume": 36.6,
    "weight": 414,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-232",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-503",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（370×220×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 370,
    "innerWidth": 220,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 35,
    "weight": 584,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-503",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-504",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（364×214×418mm）8mm W/F C5×C5",
    "innerLength": 364,
    "innerWidth": 214,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.5,
    "weight": 650,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-504",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA140-448",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×3段］（354×354×588mm）3mm B/F C5×C5",
    "innerLength": 354,
    "innerWidth": 354,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 73.6,
    "weight": 675,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-448",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 2,
      "total": 18
    }
  },
  {
    "code": "MAS140-190",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×3段］（354×354×588mm）3mm B/F 白C5×C5",
    "innerLength": 354,
    "innerWidth": 354,
    "innerHeight": 588,
    "deliverySize": "宅配140サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 73.6,
    "weight": 689,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS140-190",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 2,
      "total": 18
    }
  },
  {
    "code": "MA120-505",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×4段］（350×350×430mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 52.6,
    "weight": 616,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-505",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 3,
      "total": 27
    }
  },
  {
    "code": "MA120-506",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×4段］（350×350×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 52.6,
    "weight": 820,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-506",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 3,
      "total": 27
    }
  },
  {
    "code": "MA120-507",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×4段］（344×344×418mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 344,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 49.4,
    "weight": 915,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-507",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 3,
      "total": 27
    }
  },
  {
    "code": "MA120-508",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×5段］（354×354×348mm）3mm B/F C5×C5",
    "innerLength": 354,
    "innerWidth": 354,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 43.6,
    "weight": 505,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-508",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 4,
      "total": 36
    }
  },
  {
    "code": "MA120-509",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×5段］（350×350×340mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 41.6,
    "weight": 546,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-509",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 4,
      "total": 36
    }
  },
  {
    "code": "MAS120-233",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×5段］（350×350×340mm）5mm A/F 白C5×C5",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 340,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 41.6,
    "weight": 536,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-233",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 4,
      "total": 36
    }
  },
  {
    "code": "MAS120-234",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×5段］（354×354×348mm）3mm B/F 白C5×C5",
    "innerLength": 354,
    "innerWidth": 354,
    "innerHeight": 348,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 43.6,
    "weight": 515,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-234",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 4,
      "total": 36
    }
  },
  {
    "code": "MA120-512",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×6段］（354×354×288mm）3mm B/F C5×C5",
    "innerLength": 354,
    "innerWidth": 354,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36,
    "weight": 462,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-512",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 5,
      "total": 45
    }
  },
  {
    "code": "MAS120-235",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×6段］（350×350×280mm）5mm A/F 白C5×C5",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.3,
    "weight": 491,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-235",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 5,
      "total": 45
    }
  },
  {
    "code": "MAS120-236",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×6段］（354×354×288mm）3mm B/F 白C5×C5",
    "innerLength": 354,
    "innerWidth": 354,
    "innerHeight": 288,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36,
    "weight": 472,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-236",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 5,
      "total": 45
    }
  },
  {
    "code": "MA120-514",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×6段］（350×350×280mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 350,
    "innerHeight": 280,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 34.3,
    "weight": 666,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-514",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 5,
      "total": 45
    }
  },
  {
    "code": "MA120-515",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段9箱×6段］（344×344×268mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 344,
    "innerHeight": 268,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 31.7,
    "weight": 742,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-515",
    "palletConfig": {
      "boxesPerLayer": 9,
      "layers": 5,
      "total": 45
    }
  },
  {
    "code": "MA140-449",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（350×260×580mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 260,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 184.6,
    "volume": 52.7,
    "weight": 582,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-449",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-450",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（350×260×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 260,
    "innerHeight": 580,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 192.9,
    "volume": 52.7,
    "weight": 775,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-450",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA140-451",
    "name": "【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×3段］（344×254×568mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 254,
    "innerHeight": 568,
    "deliverySize": "宅配140サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 192.9,
    "volume": 49.6,
    "weight": 863,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA140-451",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 2,
      "total": 24
    }
  },
  {
    "code": "MA120-516",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（354×264×438mm）3mm B/F C5×C5",
    "innerLength": 354,
    "innerWidth": 264,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 40.9,
    "weight": 444,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-516",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-517",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（350×260×430mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 39.1,
    "weight": 480,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-517",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-237",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（350×260×430mm）5mm A/F 白C5×C5",
    "innerLength": 350,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 39.1,
    "weight": 471,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-237",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MAS120-238",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（354×264×438mm）3mm B/F 白C5×C5",
    "innerLength": 354,
    "innerWidth": 264,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 126.5,
    "volume": 40.9,
    "weight": 453,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-238",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-518",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（350×260×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 260,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 39.1,
    "weight": 639,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-518",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-519",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段12箱×4段］（344×254×418mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 254,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 36.5,
    "weight": 712,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-519",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 3,
      "total": 36
    }
  },
  {
    "code": "MA120-520",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×3段］（350×230×580mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 230,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 46.6,
    "weight": 535,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-520",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 2,
      "total": 26
    }
  },
  {
    "code": "MA120-521",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×3段］（350×230×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 230,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 46.6,
    "weight": 712,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-521",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 2,
      "total": 26
    }
  },
  {
    "code": "MA120-522",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×3段］（344×224×568mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 224,
    "innerHeight": 568,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 43.7,
    "weight": 794,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-522",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 2,
      "total": 26
    }
  },
  {
    "code": "MA120-523",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×4段］（354×234×438mm）3mm B/F C5×C5",
    "innerLength": 354,
    "innerWidth": 234,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 120.7,
    "volume": 36.2,
    "weight": 405,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-523",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 3,
      "total": 39
    }
  },
  {
    "code": "MA120-524",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×4段］（350×230×430mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 34.6,
    "weight": 438,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-524",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 3,
      "total": 39
    }
  },
  {
    "code": "MAS120-239",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×4段］（350×230×430mm）5mm A/F 白C5×C5",
    "innerLength": 350,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 34.6,
    "weight": 430,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-239",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 3,
      "total": 39
    }
  },
  {
    "code": "MAS120-240",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×4段］（354×234×438mm）3mm B/F 白C5×C5",
    "innerLength": 354,
    "innerWidth": 234,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 120.2,
    "volume": 36.2,
    "weight": 413,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-240",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 3,
      "total": 39
    }
  },
  {
    "code": "MA120-525",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×4段］（350×230×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 230,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 34.6,
    "weight": 583,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-525",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 3,
      "total": 39
    }
  },
  {
    "code": "MA120-526",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段13箱×4段］（344×224×418mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 224,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.2,
    "weight": 649,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-526",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 3,
      "total": 39
    }
  },
  {
    "code": "MA120-527",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×3段］（350×200×580mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 40.6,
    "weight": 490,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-527",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 2,
      "total": 30
    }
  },
  {
    "code": "MA120-528",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×3段］（350×200×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 40.6,
    "weight": 652,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-528",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 2,
      "total": 30
    }
  },
  {
    "code": "MA120-529",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×3段］（344×194×568mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 194,
    "innerHeight": 568,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 37.9,
    "weight": 726,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-529",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 2,
      "total": 30
    }
  },
  {
    "code": "MA120-531",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×4段］（350×200×430mm）5mm A/F K5×K5",
    "innerLength": 350,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 30.1,
    "weight": 398,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-531",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 3,
      "total": 45
    }
  },
  {
    "code": "MAS120-241",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×4段］（350×200×430mm）5mm A/F 白C5×C5",
    "innerLength": 350,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 124.4,
    "volume": 30.1,
    "weight": 390,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-241",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 3,
      "total": 45
    }
  },
  {
    "code": "MAS120-242",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×4段］（354×204×438mm）3mm B/F 白C5×C5",
    "innerLength": 354,
    "innerWidth": 204,
    "innerHeight": 438,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 103.1,
    "volume": 31.6,
    "weight": 375,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-242",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 3,
      "total": 45
    }
  },
  {
    "code": "MA120-532",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×4段］（350×200×430mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 350,
    "innerWidth": 200,
    "innerHeight": 430,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 30.1,
    "weight": 530,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-532",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 3,
      "total": 45
    }
  },
  {
    "code": "MA120-533",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段15箱×4段］（344×194×418mm）8mm W/F C5×C5",
    "innerLength": 344,
    "innerWidth": 194,
    "innerHeight": 418,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 27.8,
    "weight": 590,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-533",
    "palletConfig": {
      "boxesPerLayer": 15,
      "layers": 3,
      "total": 45
    }
  },
  {
    "code": "MA120-534",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（324×194×588mm）3mm B/F C5×C5",
    "innerLength": 324,
    "innerWidth": 194,
    "innerHeight": 588,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.7,
    "volume": 36.9,
    "weight": 416,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-534",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-535",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（320×190×580mm）5mm A/F K5×K5",
    "innerLength": 320,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 35.2,
    "weight": 451,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-535",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MAS120-243",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（320×190×580mm）5mm A/F 白C5×C5",
    "innerLength": 320,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.2,
    "weight": 442,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-243",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MAS120-244",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（324×194×588mm）3mm B/F 白C5×C5",
    "innerLength": 324,
    "innerWidth": 194,
    "innerHeight": 588,
    "deliverySize": "宅配120サイズ",
    "thickness": "3mm B/F",
    "format": "C5×C5",
    "price": 121.4,
    "volume": 36.9,
    "weight": 425,
    "url": "https://www.notosiki.co.jp/item/detail?num=MAS120-244",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-536",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（320×190×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 320,
    "innerWidth": 190,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 35.2,
    "weight": 600,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-536",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-537",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（314×184×568mm）8mm W/F C5×C5",
    "innerLength": 314,
    "innerWidth": 184,
    "innerHeight": 568,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 32.8,
    "weight": 667,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-537",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-538",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（310×200×580mm）5mm A/F K5×K5",
    "innerLength": 310,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 35.9,
    "weight": 456,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-538",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-539",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（310×200×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 310,
    "innerWidth": 200,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 35.9,
    "weight": 607,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-539",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-540",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（304×194×568mm）8mm W/F C5×C5",
    "innerLength": 304,
    "innerWidth": 194,
    "innerHeight": 568,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 33.4,
    "weight": 676,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-540",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-541",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（310×210×580mm）5mm A/F K5×K5",
    "innerLength": 310,
    "innerWidth": 210,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 128.4,
    "volume": 37.7,
    "weight": 470,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-541",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-542",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（310×210×580mm）5mm A/F K6×強化芯180g×K6",
    "innerLength": 310,
    "innerWidth": 210,
    "innerHeight": 580,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K6×強化芯180g×K6",
    "price": 128.4,
    "volume": 37.7,
    "weight": 626,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-542",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "MA120-543",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（304×204×568mm）8mm W/F C5×C5",
    "innerLength": 304,
    "innerWidth": 204,
    "innerHeight": 568,
    "deliverySize": "宅配120サイズ",
    "thickness": "8mm W/F",
    "format": "C5×C5",
    "price": 128.4,
    "volume": 35.2,
    "weight": 698,
    "url": "https://www.notosiki.co.jp/item/detail?num=MA120-543",
    "palletConfig": {
      "boxesPerLayer": 16,
      "layers": 2,
      "total": 32
    }
  },
  {
    "code": "HIST-540-410-190",
    "name": "【宅配120サイズ】実績サイズダンボール箱（540×410×190mm）5mm A/F K5×K5",
    "innerLength": 540,
    "innerWidth": 410,
    "innerHeight": 190,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 42.1,
    "weight": 322,
    "url": "",
    "palletConfig": null
  },
  {
    "code": "HIST-530-380-350",
    "name": "【宅配140サイズ】実績サイズダンボール箱（530×380×350mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 380,
    "innerHeight": 350,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 180,
    "volume": 70.5,
    "weight": 416,
    "url": "",
    "palletConfig": null
  },
  {
    "code": "HIST-341-226-109",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（341×226×109mm）5mm A/F K5×K5",
    "innerLength": 341,
    "innerWidth": 226,
    "innerHeight": 109,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 8.4,
    "weight": 111,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 10,
      "total": 130
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 13,
      "totalLayers": 10,
      "totalCartons": 130,
      "totalBags": 1300,
      "heightMm": 1150,
      "widthMm": 1100,
      "weightKg": 247.0,
      "productName": "黒ゴマアーモンドきな粉150g×10袋セット"
    }
  },
  {
    "code": "HIST-354-225-125",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（354×225×125mm）5mm A/F K5×K5",
    "innerLength": 354,
    "innerWidth": 225,
    "innerHeight": 125,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 10,
    "weight": 122,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 13,
      "layers": 10,
      "total": 135
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 13,
      "totalLayers": 10,
      "totalCartons": 135,
      "totalBags": 2700,
      "heightMm": 1300,
      "widthMm": 1100,
      "weightKg": 469.13,
      "productName": "きな粉150g×20袋セット"
    }
  },
  {
    "code": "HIST-330-260-175",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（330×260×175mm）5mm A/F K5×K5",
    "innerLength": 330,
    "innerWidth": 260,
    "innerHeight": 175,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 15,
    "weight": 151,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 6,
      "total": 72
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 12,
      "totalLayers": 6,
      "totalCartons": 72,
      "totalBags": 720,
      "heightMm": 1225,
      "widthMm": 1100,
      "weightKg": 389.88,
      "productName": "きな粉 500g×10袋セット"
    }
  },
  {
    "code": "HIST-355-260-150",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（355×260×150mm）5mm A/F K5×K5",
    "innerLength": 355,
    "innerWidth": 260,
    "innerHeight": 150,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 13.8,
    "weight": 148,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 10,
      "layers": 8,
      "total": 80
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 10,
      "totalLayers": 8,
      "totalCartons": 80,
      "totalBags": 800,
      "heightMm": 1260,
      "widthMm": 1100,
      "weightKg": 392.0,
      "productName": "米の粉 450g×10袋セット"
    }
  },
  {
    "code": "HIST-530-260-440",
    "name": "【宅配140サイズ】実績サイズダンボール箱（530×260×440mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 260,
    "innerHeight": 440,
    "deliverySize": "宅配140サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 180,
    "volume": 60.6,
    "weight": 388,
    "url": "",
    "palletConfig": null
  },
  {
    "code": "HIST-210-140-110",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（210×140×110mm）5mm A/F K5×K5",
    "innerLength": 210,
    "innerWidth": 140,
    "innerHeight": 110,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 3.2,
    "weight": 54,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 36,
      "layers": 10,
      "total": 360
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 36,
      "totalLayers": 10,
      "totalCartons": 360,
      "totalBags": 3600,
      "heightMm": 1100,
      "widthMm": 1100,
      "weightKg": 304.0,
      "productName": "茨城県産べにはるかほしいも10袋セット"
    }
  },
  {
    "code": "HIST-530-270-380",
    "name": "【宅配120サイズ】実績サイズダンボール箱（530×270×380mm）5mm A/F K5×K5",
    "innerLength": 530,
    "innerWidth": 270,
    "innerHeight": 380,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 54.4,
    "weight": 358,
    "url": "",
    "palletConfig": null
  },
  {
    "code": "HIST-400-205-100",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（400×205×100mm）5mm A/F K5×K5",
    "innerLength": 400,
    "innerWidth": 205,
    "innerHeight": 100,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 8.2,
    "weight": 114,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 10,
      "total": 120
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 12,
      "totalLayers": 10,
      "totalCartons": 120,
      "totalBags": 1200,
      "heightMm": 1000,
      "widthMm": 1100,
      "weightKg": 334.8,
      "productName": "粉黒糖10袋セット"
    }
  },
  {
    "code": "HIST-420-185-120",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（420×185×120mm）5mm A/F K5×K5",
    "innerLength": 420,
    "innerWidth": 185,
    "innerHeight": 120,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 120,
    "volume": 9.3,
    "weight": 120,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 12,
      "layers": 10,
      "total": 120
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 12,
      "totalLayers": 10,
      "totalCartons": 120,
      "totalBags": 1200,
      "heightMm": 1200,
      "widthMm": 1100,
      "weightKg": 397.2,
      "productName": "かちわり黒糖10袋セット"
    }
  },
  {
    "code": "HIST-545-365-255",
    "name": "【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱（545×365×255mm）5mm A/F K5×K5",
    "innerLength": 545,
    "innerWidth": 365,
    "innerHeight": 255,
    "deliverySize": "宅配120サイズ",
    "thickness": "5mm A/F",
    "format": "K5×K5",
    "price": 300,
    "volume": 50.7,
    "weight": 550,
    "url": "",
    "palletConfig": {
      "boxesPerLayer": 6,
      "layers": 6,
      "total": 36
    },
    "palletLoadingDetails": {
      "cartonsPerLayer": 6,
      "totalLayers": 6,
      "totalCartons": 36,
      "totalBags": 1080,
      "heightMm": 1530,
      "widthMm": 1100,
      "weightKg": 576.0,
      "productName": "米麹500g30袋セット"
    }
  }
];

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
  const match = product.unitWeight.match(/(\d+\.?\d*)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return 0.2;
}
