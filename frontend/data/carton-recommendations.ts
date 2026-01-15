// 段ボール推奨データ（pallet_optimized_recommendations.csvから抽出）

interface CartonOption {
  cartonCode: string;
  cartonName: string;
  innerDimensions: string;
  deliverySize: string;
  capacity: number;
  isPalletFit: boolean;
  palletConfiguration: {
    boxesPerLayer: number;
    layers: number;
    totalBoxes: number;
  } | null;
  url: string;
}

// パレット配置情報をパース（例: "1段4箱×9段" → {boxesPerLayer: 4, layers: 9, totalBoxes: 36}）
function parsePalletConfiguration(palletStr: string): {
  boxesPerLayer: number;
  layers: number;
  totalBoxes: number;
} | null {
  if (!palletStr) return null;
  const match = palletStr.match(/1段(\d+)箱×(\d+)段/);
  if (match) {
    const boxesPerLayer = parseInt(match[1]);
    const layers = parseInt(match[2]);
    return {
      boxesPerLayer,
      layers,
      totalBoxes: boxesPerLayer * layers
    };
  }
  return null;
}

// 商品名をキーとした段ボール推奨マップ
export const cartonRecommendationsByProduct: Record<string, CartonOption[]> = {
  'ヨーグルト種菌1袋セット': [
    {
      cartonCode: 'MAS140-070',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］',
      innerDimensions: '670×390×180mm',
      deliverySize: '宅配140サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×9段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-070'
    },
    {
      cartonCode: 'MAS140-121',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］',
      innerDimensions: '614×454×168mm',
      deliverySize: '宅配140サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×10段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-121'
    },
    {
      cartonCode: 'MA120-302',
      cartonName: '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］',
      innerDimensions: '530×260×340mm',
      deliverySize: '宅配120サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段8箱×5段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA120-302'
    }
  ],
  '甘酒酵素1袋セット': [
    {
      cartonCode: 'MAS140-070',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×9段］',
      innerDimensions: '670×390×180mm',
      deliverySize: '宅配140サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×9段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-070'
    },
    {
      cartonCode: 'MAS140-121',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×10段］',
      innerDimensions: '614×454×168mm',
      deliverySize: '宅配140サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×10段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-121'
    },
    {
      cartonCode: 'MA120-302',
      cartonName: '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×5段］',
      innerDimensions: '530×260×340mm',
      deliverySize: '宅配120サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段8箱×5段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA120-302'
    }
  ],
  '黒ゴマアーモンドきな粉150g×1袋セット': [
    {
      cartonCode: 'MA140-172',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］',
      innerDimensions: '644×424×288mm',
      deliverySize: '宅配140サイズ',
      capacity: 110,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×6段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-172'
    },
    {
      cartonCode: 'MAS140-075',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］',
      innerDimensions: '644×424×288mm',
      deliverySize: '宅配140サイズ',
      capacity: 110,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×6段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-075'
    },
    {
      cartonCode: 'MA140-331',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］',
      innerDimensions: '560×500×280mm',
      deliverySize: '宅配140サイズ',
      capacity: 110,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×6段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-331'
    }
  ],
  'きな粉150g×1袋セット': [
    {
      cartonCode: 'MA140-172',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］',
      innerDimensions: '644×424×288mm',
      deliverySize: '宅配140サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×6段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-172'
    },
    {
      cartonCode: 'MAS140-075',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］',
      innerDimensions: '644×424×288mm',
      deliverySize: '宅配140サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×6段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-075'
    },
    {
      cartonCode: 'MA140-331',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］',
      innerDimensions: '560×500×280mm',
      deliverySize: '宅配140サイズ',
      capacity: 120,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×6段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-331'
    }
  ],
  'きな粉 500g×1袋セット': [
    {
      cartonCode: 'MA140-369',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段6箱×4段］',
      innerDimensions: '530×350×430mm',
      deliverySize: '宅配140サイズ',
      capacity: 40,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段6箱×4段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-369'
    },
    {
      cartonCode: 'MA140-401',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×3段］',
      innerDimensions: '470×290×580mm',
      deliverySize: '宅配140サイズ',
      capacity: 40,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段8箱×3段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-401'
    },
    {
      cartonCode: 'MA140-172',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×6段］',
      innerDimensions: '644×424×288mm',
      deliverySize: '宅配140サイズ',
      capacity: 40,
      isPalletFit: true,
      palletConfiguration: parsePalletConfiguration('1段4箱×6段'),
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-172'
    }
  ]
};

// 商品名から段ボール推奨を取得
export function getCartonRecommendations(productName: string): CartonOption[] {
  return cartonRecommendationsByProduct[productName] || [];
}

