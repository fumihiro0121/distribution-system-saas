'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Navigation from '@/app/components/Navigation';
import CartonSelector from '@/app/components/CartonSelector';

// サンプルデータ（実際にはAPIから取得）
const sampleCartonOptions = {
  '黒ゴマアーモンドきな粉150g×1袋セット': [
    {
      cartonCode: 'CUSTOM-341x226x109',
      cartonName: '実績段ボール（10袋セット用）',
      innerDimensions: '341×226×109mm',
      deliverySize: '宅配80サイズ相当',
      capacity: 10,
      isHistorical: true,
      priority: 1,
      note: '実績: 10袋入り（黒ゴマアーモンドきな粉150g×10袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/'
    },
    {
      cartonCode: 'MA140-288',
      cartonName: '【宅配140サイズ】ダンボール箱',
      innerDimensions: '590×470×230mm',
      deliverySize: '宅配140サイズ',
      capacity: 114,
      isHistorical: true,
      priority: 2,
      note: '実績: 約114袋入り（黒ゴマアーモンドきな粉150g×1袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-288'
    },
    {
      cartonCode: 'MAS140-128',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱',
      innerDimensions: '590×470×230mm',
      deliverySize: '宅配140サイズ',
      capacity: 114,
      isHistorical: false,
      priority: 3,
      note: '推定: 約114袋入り（黒ゴマアーモンドきな粉150g×1袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-128'
    },
    {
      cartonCode: 'MA140-307',
      cartonName: '【宅配140サイズ】ダンボール箱',
      innerDimensions: '584×484×288mm',
      deliverySize: '宅配140サイズ',
      capacity: 145,
      isHistorical: false,
      priority: 4,
      note: '推定: 約145袋入り（黒ゴマアーモンドきな粉150g×2袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/item/detail?num=MA140-307'
    },
    {
      cartonCode: 'MAS140-139',
      cartonName: '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱',
      innerDimensions: '584×484×288mm',
      deliverySize: '宅配140サイズ',
      capacity: 145,
      isHistorical: false,
      priority: 5,
      note: '推定: 約145袋入り（黒ゴマアーモンドきな粉150g×2袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/item/detail?num=MAS140-139'
    }
  ],
  'きな粉150g×1袋セット': [
    {
      cartonCode: 'CUSTOM-354x225x125',
      cartonName: '実績段ボール（20袋セット用）',
      innerDimensions: '354×225×125mm',
      deliverySize: '宅配80サイズ相当',
      capacity: 20,
      isHistorical: true,
      priority: 1,
      note: '実績: 20袋入り（きな粉150g×20袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/'
    },
    {
      cartonCode: 'MA120-236',
      cartonName: '【宅配120サイズ】ダンボール箱',
      innerDimensions: '584×224×148mm',
      deliverySize: '宅配120サイズ',
      capacity: 35,
      isHistorical: false,
      priority: 2,
      note: '推定: 約35袋入り（きな粉150g×20袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/item/detail?num=MA120-236'
    },
    {
      cartonCode: 'MA120-172',
      cartonName: '【宅配120サイズ】ダンボール箱',
      innerDimensions: '624×204×148mm',
      deliverySize: '宅配120サイズ',
      capacity: 34,
      isHistorical: false,
      priority: 3,
      note: '推定: 約34袋入り（きな粉150g×20袋セットの実績から計算）',
      url: 'https://www.notosiki.co.jp/item/detail?num=MA120-172'
    }
  ]
};

export default function CartonSelectorPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('管理者');
  const [selectedProduct, setSelectedProduct] = useState('黒ゴマアーモンドきな粉150g×1袋セット');
  const [targetQuantity, setTargetQuantity] = useState(1000);
  const [allSelections, setAllSelections] = useState<{[key: string]: any}>({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSelectionChange = (productName: string, selectedCartons: any[], remaining: number) => {
    setAllSelections(prev => ({
      ...prev,
      [productName]: {
        selectedCartons,
        remaining,
        targetQuantity
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        icon="📦"
        iconBgColor="bg-indigo-500"
        subtitle="段ボール選択"
        userName={userName}
      />
      
      <Navigation
        items={['ダッシュボード', '出荷計画', '商品マスタ', '取引先', 'ユーザー管理', 'レポート']}
        activeItem="出荷計画"
        activeColor="indigo"
        role="admin"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">段ボールサイズ選択システム</h1>
          <p className="text-gray-600">
            実績データを基に、最適な段ボールサイズを選択できます。複数種類の段ボールを組み合わせることも可能です。
          </p>
        </div>

        {/* 商品・数量選択 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">商品と数量を選択</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Object.keys(sampleCartonOptions).map((productName) => (
                  <option key={productName} value={productName}>
                    {productName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送付数量（袋）
              </label>
              <input
                type="number"
                min="1"
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 段ボール選択コンポーネント */}
        <CartonSelector
          productName={selectedProduct}
          targetQuantity={targetQuantity}
          cartonOptions={sampleCartonOptions[selectedProduct as keyof typeof sampleCartonOptions] || []}
          onSelectionChange={(selectedCartons, remaining) => 
            handleSelectionChange(selectedProduct, selectedCartons, remaining)
          }
        />

        {/* 使用例 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 使用例</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>例1: 実績段ボールを優先</strong></p>
            <p className="ml-4">
              「黒ゴマアーモンドきな粉150g×1袋セット」を1000袋送る場合、
              341×226×109mmの段ボール（10袋入り）を100箱使用するのが第一候補です。
            </p>
            
            <p className="mt-4"><strong>例2: 複数種類の組み合わせ</strong></p>
            <p className="ml-4">
              341×226×109mmの段ボール60箱（600袋）+ 590×470×230mmの段ボール4箱（456袋）で
              合計1056袋（過剰56袋）とすることも可能です。
            </p>
            
            <p className="mt-4"><strong>例3: 箱数の調整</strong></p>
            <p className="ml-4">
              選択後に箱数を増減して、過剰や不足を最小化できます。
            </p>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => router.push('/admin/shipments/new')}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              alert('この選択内容で出荷計画を作成します（実装予定）');
            }}
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            この内容で出荷計画を作成
          </button>
        </div>
      </main>
    </div>
  );
}

