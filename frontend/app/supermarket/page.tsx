'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function SupermarketDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'supermarket') {
      router.push('/login');
      return;
    }
    setUser(parsed);
  }, [router]);

  if (!user) return <div>Loading...</div>;

  const shipments = [
    {
      id: 'SHP-2026-0002',
      name: 'スーパー向け健康食品出荷',
      from: 'ABC製造',
      forwarder: '佐川グローバル',
      shipDate: '2026-01-25',
      arrivalDate: '2026-02-05',
      status: '輸送中',
      totalCartons: 80,
      totalPallets: 5,
      totalWeight: '1200 kg',
      trackingNumber: 'SGXL123456789',
    },
  ];

  const products = [
    {
      name: 'Organic Green Tea',
      nameJa: 'オーガニック緑茶',
      janCode: '4901234567890',
      hsCode: '0902.10',
      quantity: 480,
      unitPrice: 8.50,
      totalPrice: 4080.00,
      weight: 0.5,
      totalWeight: 240,
      dimensions: '10×8×15 cm',
    },
    {
      name: 'Health Snack Bar',
      nameJa: '健康スナックバー',
      janCode: '4901234567891',
      hsCode: '1905.90',
      quantity: 360,
      unitPrice: 2.80,
      totalPrice: 1008.00,
      weight: 0.08,
      totalWeight: 28.8,
      dimensions: '15×5×2 cm',
    },
  ];

  const pallets = [
    {
      code: 'PLT-2026-0010',
      size: '48"×40" (1219×1016mm)',
      height: '150 cm',
      weight: '250 kg',
      cartonCount: 16,
      cartons: [
        { code: 'CTN-2026-0101', contents: 'オーガニック緑茶 24個', weight: '15 kg' },
        { code: 'CTN-2026-0102', contents: 'オーガニック緑茶 24個', weight: '15 kg' },
        { code: 'CTN-2026-0103', contents: 'オーガニック緑茶 24個', weight: '15 kg' },
        { code: 'CTN-2026-0104', contents: '健康スナックバー 30個', weight: '3 kg' },
      ],
    },
    {
      code: 'PLT-2026-0011',
      size: '48"×40" (1219×1016mm)',
      height: '145 cm',
      weight: '240 kg',
      cartonCount: 16,
      cartons: [
        { code: 'CTN-2026-0105', contents: 'オーガニック緑茶 24個', weight: '15 kg' },
        { code: 'CTN-2026-0106', contents: '健康スナックバー 30個', weight: '3 kg' },
        { code: 'CTN-2026-0107', contents: 'オーガニック緑茶 24個', weight: '15 kg' },
        { code: 'CTN-2026-0108', contents: '健康スナックバー 30個', weight: '3 kg' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="🏪"
        iconBgColor="bg-purple-600"
        subtitle={`配送先画面 - ${user.name}`}
        userName={user.name}
      />
      <Navigation 
        items={['入荷予定一覧', '商品詳細', 'パレット構成', '書類', 'トラッキング']}
        activeItem="入荷予定一覧"
        activeColor="purple"
        role="supermarket"
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 出荷概要 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{shipments[0].name}</h3>
                <p className="text-sm text-gray-600 mt-1">出荷コード: {shipments[0].id}</p>
              </div>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {shipments[0].status}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">出荷元</p>
                <p className="text-lg font-semibold text-gray-900">{shipments[0].from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">フォワーダー</p>
                <p className="text-lg font-semibold text-gray-900">{shipments[0].forwarder}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">出荷日</p>
                <p className="text-lg font-semibold text-gray-900">{shipments[0].shipDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">到着予定日</p>
                <p className="text-lg font-semibold text-green-600">{shipments[0].arrivalDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{shipments[0].totalCartons}</p>
                <p className="text-sm text-gray-600">段ボール数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{shipments[0].totalPallets}</p>
                <p className="text-sm text-gray-600">パレット数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{shipments[0].totalWeight}</p>
                <p className="text-sm text-gray-600">総重量</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-mono text-gray-900">{shipments[0].trackingNumber}</p>
                <p className="text-sm text-gray-600">トラッキング番号</p>
              </div>
            </div>
          </div>
        </div>

        {/* 商品リスト */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">📦 商品リスト</h3>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              📄 CSV出力
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    商品名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    JANコード
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    HSコード
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    単価 (USD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    合計金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    重量
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.nameJa}</p>
                        <p className="text-xs text-gray-400 mt-1">{product.dimensions}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">{product.janCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">{product.hsCode}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.quantity}個</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${product.unitPrice}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${product.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.totalWeight} kg</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900">
                    合計
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {products.reduce((sum, p) => sum + p.quantity, 0)}個
                  </td>
                  <td></td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ${products.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {products.reduce((sum, p) => sum + p.totalWeight, 0).toFixed(1)} kg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* パレット構成 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">🗂️ パレット構成</h3>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              📄 PDF出力
            </button>
          </div>
          <div className="p-6 space-y-6">
            {pallets.map((pallet) => (
              <div key={pallet.code} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* パレットヘッダー */}
                <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{pallet.code}</p>
                      <p className="text-sm text-gray-600 mt-1">サイズ: {pallet.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">高さ: <span className="font-semibold">{pallet.height}</span></p>
                      <p className="text-sm text-gray-600">重量: <span className="font-semibold">{pallet.weight}</span></p>
                      <p className="text-sm text-gray-600">段ボール数: <span className="font-semibold">{pallet.cartonCount}箱</span></p>
                    </div>
                  </div>
                </div>
                
                {/* 段ボールリスト */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">積載段ボール一覧:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pallet.cartons.map((carton) => (
                      <div key={carton.code} className="bg-gray-50 border border-gray-200 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{carton.code}</p>
                            <p className="text-xs text-gray-600 mt-1">{carton.contents}</p>
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{carton.weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 積付図プレビュー */}
                <div className="bg-gray-100 p-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">積付図イメージ:</p>
                  <div className="bg-white border-2 border-gray-300 rounded p-4 h-32 flex items-center justify-center">
                    <p className="text-gray-400">3D積付図 (実装予定)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


