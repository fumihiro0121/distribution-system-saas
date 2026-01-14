'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function ForwarderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'forwarder') {
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
      status: 'pending',
      cartons: 120,
      pallets: 8,
      container: 'CNT-2026-0001',
    },
    {
      id: 'SHP-2026-0002',
      name: '2026-01-18 米国Walmart＋スーパーマーケット向け輸出',
      manufacturer: 'XYZ食品',
      dueDate: '2026-01-22',
      status: 'in_progress',
      cartons: 80,
      pallets: 5,
      container: '-',
    },
  ];

  const incomingShipments = [
    {
      from: 'ABC製造（メーカー直送）',
      arrivalDate: '2026-01-18',
      cartons: 50,
      pallets: 3,
      status: '予定',
    },
    {
      from: '福富運送（梱包業者）',
      arrivalDate: '2026-01-19',
      cartons: 70,
      pallets: 5,
      status: '予定',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="🚚"
        iconBgColor="bg-blue-600"
        subtitle={`フォワーダー画面 - ${user.name}`}
        userName={user.name}
      />
      <Navigation 
        items={['出荷計画一覧', '入荷予定', 'パレット管理', 'コンテナ管理', '出荷管理']}
        activeItem="出荷計画一覧"
        activeColor="blue"
        role="forwarder"
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">未完了作業指示</p>
            <p className="text-3xl font-bold text-gray-900">2件</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">入荷予定（今週）</p>
            <p className="text-3xl font-bold text-gray-900">5件</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">積載待ちパレット</p>
            <p className="text-3xl font-bold text-gray-900">13個</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">出荷予定コンテナ</p>
            <p className="text-3xl font-bold text-gray-900">3台</p>
          </div>
        </div>

        {/* 出荷計画一覧 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">出荷計画一覧</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <a
                          href={`/forwarder/shipments/${shipment.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                        >
                          {shipment.name}
                        </a>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          shipment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {shipment.status === 'pending' ? '未着手' : shipment.status === 'in_progress' ? '進行中' : '完了'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        出荷コード: 
                        <a
                          href={`/forwarder/shipments/${shipment.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline ml-1"
                        >
                          {shipment.id}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">メーカー: {shipment.manufacturer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">納期</p>
                      <p className="text-sm font-medium text-gray-900">{shipment.dueDate}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-xs text-gray-600">段ボール数</p>
                      <p className="text-lg font-semibold text-gray-900">{shipment.cartons}箱</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">パレット数</p>
                      <p className="text-lg font-semibold text-gray-900">{shipment.pallets}個</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">コンテナ</p>
                      <p className="text-lg font-semibold text-gray-900">{shipment.container}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={`/forwarder/shipments/${shipment.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium text-center"
                    >
                      作業詳細を見る
                    </a>
                    {shipment.status === 'pending' && (
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
                        作業開始
                      </button>
                    )}
                    {shipment.status === 'in_progress' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                        完了報告
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                    入荷元
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    到着予定日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    段ボール数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    パレット数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomingShipments.map((shipment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.from}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.arrivalDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.cartons}箱</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.pallets}個</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-900">詳細</button>
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

