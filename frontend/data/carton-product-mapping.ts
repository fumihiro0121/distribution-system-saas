// 段ボールと商品の詳細紐付けマッピング（自動生成）

export interface ProductCartonDetail {
  productName: string;
  setCount: number; // 1セット分の意味
  bagCount: number; // セット内の袋数（または箱数）
  packingBags: number; // 段ボール1箱に入る袋数
  packingSets: number; // 段ボール1箱に入るセット数
  palletFit: boolean; // パレットにぴったり載るか
}

export const cartonProductMapping: { [cartonCode: string]: ProductCartonDetail[] } = {
  "HIST-540-410-190": [
    {
      "productName": "ヨーグルト種菌1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 120,
      "packingSets": 120,
      "palletFit": false
    },
    {
      "productName": "甘酒酵素1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 120,
      "packingSets": 120,
      "palletFit": false
    }
  ],
  "HIST-545-365-255": [
    {
      "productName": "米麹500g1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 30,
      "packingSets": 30,
      "palletFit": true
    }
  ],
  "HIST-530-380-350": [
    {
      "productName": "黒ゴマアーモンドきな粉150g×1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 110,
      "packingSets": 110,
      "palletFit": false
    },
    {
      "productName": "黒ゴマアーモンドきな粉150g×2袋セット",
      "setCount": 1,
      "bagCount": 2,
      "packingBags": 90,
      "packingSets": 45,
      "palletFit": false
    },
    {
      "productName": "きな粉150g×1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 120,
      "packingSets": 120,
      "palletFit": false
    },
    {
      "productName": "きな粉150g×2袋セット",
      "setCount": 1,
      "bagCount": 2,
      "packingBags": 120,
      "packingSets": 60,
      "palletFit": false
    },
    {
      "productName": "きな粉 500g×1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 40,
      "packingSets": 40,
      "palletFit": false
    },
    {
      "productName": "米の粉 450g×1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 45,
      "packingSets": 45,
      "palletFit": false
    }
  ],
  "HIST-341-226-109": [
    {
      "productName": "黒ゴマアーモンドきな粉150g×10袋セット",
      "setCount": 1,
      "bagCount": 10,
      "packingBags": 10,
      "packingSets": 1,
      "palletFit": true
    }
  ],
  "HIST-354-225-125": [
    {
      "productName": "きな粉150g×20袋セット",
      "setCount": 1,
      "bagCount": 20,
      "packingBags": 20,
      "packingSets": 1,
      "palletFit": true
    }
  ],
  "HIST-330-260-175": [
    {
      "productName": "きな粉 500g×10袋セット",
      "setCount": 1,
      "bagCount": 10,
      "packingBags": 10,
      "packingSets": 1,
      "palletFit": true
    }
  ],
  "HIST-355-260-150": [
    {
      "productName": "米の粉 450g×10袋セット",
      "setCount": 1,
      "bagCount": 10,
      "packingBags": 10,
      "packingSets": 1,
      "palletFit": true
    }
  ],
  "HIST-530-260-440": [
    {
      "productName": "茨城県産べにはるかほしいも1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 120,
      "packingSets": 120,
      "palletFit": false
    },
    {
      "productName": "茨城県産べにはるかほしいも3袋セット",
      "setCount": 1,
      "bagCount": 3,
      "packingBags": 120,
      "packingSets": 40,
      "palletFit": false
    }
  ],
  "HIST-210-140-110": [
    {
      "productName": "茨城県産べにはるかほしいも10袋セット",
      "setCount": 1,
      "bagCount": 10,
      "packingBags": 10,
      "packingSets": 1,
      "palletFit": true
    }
  ],
  "HIST-530-270-380": [
    {
      "productName": "粉黒糖1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 80,
      "packingSets": 80,
      "palletFit": false
    },
    {
      "productName": "かちわり黒糖1袋セット",
      "setCount": 1,
      "bagCount": 1,
      "packingBags": 65,
      "packingSets": 65,
      "palletFit": false
    }
  ],
  "HIST-400-205-100": [
    {
      "productName": "粉黒糖10袋セット",
      "setCount": 1,
      "bagCount": 10,
      "packingBags": 10,
      "packingSets": 1,
      "palletFit": true
    }
  ],
  "HIST-420-185-120": [
    {
      "productName": "かちわり黒糖10袋セット",
      "setCount": 1,
      "bagCount": 10,
      "packingBags": 10,
      "packingSets": 1,
      "palletFit": true
    }
  ]
};
