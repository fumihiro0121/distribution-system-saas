'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function PackingDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'packing') {
      router.push('/login');
      return;
    }
    setUser(parsed);
  }, [router]);

  if (!user) return <div>Loading...</div>;

  const shipments = [
    {
      id: 'SHP-2026-0001',
      name: '2026-01-15 米国マルカイ＋米国Amazon-AWD向け輸出',
      manufacturer: 'ABC製造',
      dueDate: '2026-01-20',
      status: 'in_progress',
      incomingCartons: 10,
      products: [
        { name: 'オーガニック緑茶', quantity: 240, labels: ['FNSKU', '栄養成分'] },
      ],
      outputCartons: 10,
      destination: '佐川グローバルロジスティクス',
    },
  ];

  const incomingSchedule = [
    {
      from: 'ABC製造',
      arrivalDate: '2026-01-18',
      products: 'オーガニック緑茶 240個',
      cartons: 10,
    },
    {
      from: 'XYZ食品',
      arrivalDate: '2026-01-19',
      products: '健康スナック 180個',
      cartons: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-green-600"
        subtitle={`梱包業者画面 - ${user.name}`}
        userName={user.name}
      />
      <Navigation 
        items={['出荷計画一覧', '入荷予定', '作業報告', '履歴']}
        activeItem="出荷計画一覧"
        activeColor="green"
        role="packing"
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">未完了作業</p>
            <p className="text-3xl font-bold text-gray-900">1件</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">今日の作業予定</p>
            <p className="text-3xl font-bold text-gray-900">2件</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">入荷予定（今週）</p>
            <p className="text-3xl font-bold text-gray-900">5件</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">完了した作業（今月）</p>
            <p className="text-3xl font-bold text-gray-900">18件</p>
          </div>
        </div>

        {/* 出荷計画詳細 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">出荷計画一覧</h3>
          </div>
          <div className="p-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="border border-gray-200 rounded-lg p-6">
                {/* ヘッダー */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{shipment.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>出荷コード: <span className="font-medium">{shipment.id}</span></span>
                      <span>メーカー: <span className="font-medium">{shipment.manufacturer}</span></span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        進行中
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">納期</p>
                    <p className="text-lg font-semibold text-gray-900">{shipment.dueDate}</p>
                  </div>
                </div>

                {/* 入荷情報 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">📥 入荷予定商品</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">入荷元段ボール数</p>
                      <p className="text-2xl font-bold text-gray-900">{shipment.incomingCartons}箱</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">商品総数</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {shipment.products.reduce((sum, p) => sum + p.quantity, 0)}個
                      </p>
                    </div>
                  </div>
                </div>

                {/* 商品別作業指示 */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">🏷️ 商品別作業指示</h5>
                  <div className="space-y-4">
                    {shipment.products.map((product, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">数量: {product.quantity}個</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            1箱あたり24個
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-600 mb-2">貼付ラベル:</p>
                          <div className="flex gap-2">
                            {product.labels.map((label, labelIdx) => (
                              <span key={labelIdx} className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium">
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 梱包指示 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">📦 梱包指示</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">詰替え先段ボールサイズ</p>
                      <p className="text-lg font-bold text-gray-900">M (40×30×30cm)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">1箱あたり商品数</p>
                      <p className="text-lg font-bold text-gray-900">24個</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">必要段ボール数</p>
                      <p className="text-lg font-bold text-gray-900">{shipment.outputCartons}箱</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-yellow-300">
                    <p className="text-xs text-gray-600 mb-2">各段ボールに貼付する書類:</p>
                    <div className="flex gap-2">
                      {['FBA送り状', 'FDA事前通知書', '配送ラベル'].map((doc, docIdx) => (
                        <span key={docIdx} className="px-2 py-1 bg-white border border-yellow-300 rounded text-xs font-medium">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 出荷先情報 */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-gray-900 mb-2">🚚 出荷先情報</h5>
                  <p className="text-sm text-gray-600">出荷先: <span className="font-medium text-gray-900">{shipment.destination}</span></p>
                  <p className="text-sm text-gray-600">住所: 東京都港区芝大門1-1-1</p>
                  <p className="text-sm text-gray-600">出荷期限: {shipment.dueDate}</p>
                </div>

                {/* アクションボタン */}
                <div className="flex space-x-3">
                  <a
                    href={`/packing/shipments/${shipment.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-center"
                  >
                    📋 詳細作業画面を開く
                  </a>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                    📸 写真をアップロード
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                    🖨️ 作業指示書を印刷
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 入荷予定 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">入荷予定（今週）</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    入荷元（メーカー）
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    到着予定日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    段ボール数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomingSchedule.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.from}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.arrivalDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.products}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.cartons}箱</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-green-600 hover:text-green-900">詳細</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

