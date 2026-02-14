'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(parsed);
  }, [router]);

  if (!user) return <div>Loading...</div>;

  const stats = [
    { label: '今月の出荷予定', value: '15件', icon: '📦', color: 'bg-blue-500' },
    { label: '進行中の出荷', value: '8件', icon: '🚚', color: 'bg-green-500' },
    { label: '遅延中の出荷', value: '2件', icon: '⚠️', color: 'bg-yellow-500' },
    { label: '完了した出荷', value: '45件', icon: '✅', color: 'bg-purple-500' },
  ];

  const recentShipments = [
    { id: 'SHP-2026-0001', name: '2026-01-15 米国マルカイ＋米国Amazon-AWD向け輸出', status: '進行中', manufacturer: 'ABC製造', forwarder: '佐川グローバル', progress: 65 },
    { id: 'SHP-2026-0002', name: '2026-01-18 米国Walmart＋スーパーマーケット向け輸出', status: '梱包中', manufacturer: 'XYZ食品', forwarder: '日本ジャパントラスト', progress: 35 },
    { id: 'SHP-2026-0003', name: '2026-01-20 米国Amazon-FBA向け輸出', status: '計画中', manufacturer: '日本有機食品', forwarder: '佐川グローバル', progress: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-indigo-600"
        subtitle="管理者ダッシュボード"
        userName={user.name}
      />
      <Navigation 
        items={['ダッシュボード', '出荷計画', '商品マスタ', '段ボールマスタ', '取引先', 'ユーザー管理', 'レポート']}
        activeItem="ダッシュボード"
        activeColor="indigo"
        role="admin"
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* グラフエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">月別出荷実績</h3>
            <div className="h-64 flex items-end justify-around space-x-2">
              {[65, 75, 85, 70, 90, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{9 + i}月</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">配送先別内訳</h3>
            <div className="space-y-4">
              {[
                { name: 'Amazon FBA', value: 45, color: 'bg-blue-500' },
                { name: 'アメリカスーパー', value: 30, color: 'bg-green-500' },
                { name: '一般輸出', value: 25, color: 'bg-yellow-500' },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近の出荷計画 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">出荷計画一覧</h3>
            <a
              href="/admin/shipments/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm inline-block"
            >
              + 新規作成
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    出荷コード
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    出荷名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メーカー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    フォワーダー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    進捗
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={`/admin/shipments/${shipment.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 hover:underline"
                      >
                        {shipment.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={`/admin/shipments/${shipment.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-indigo-600 hover:underline"
                      >
                        {shipment.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.forwarder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        shipment.status === '進行中' ? 'bg-green-100 text-green-800' :
                        shipment.status === '梱包中' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '100px' }}>
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{shipment.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <a
                        href={`/admin/shipments/${shipment.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        詳細
                      </a>
                      <a
                        href={`/admin/shipments/${shipment.id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        編集
                      </a>
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

