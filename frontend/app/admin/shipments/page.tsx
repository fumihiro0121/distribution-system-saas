'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Navigation from '@/app/components/Navigation';

interface Shipment {
  id: string;
  name: string;
  manufacturer: string;
  forwarder: string;
  packing?: string;
  shipDate: string;
  estimatedArrival: string;
  status: string;
  progress: number;
  totalCartons: number;
  totalPallets: number;
  totalWeight: string;
  destinations: string[];
  flowPatterns: string[];
  createdDate: string;
  lastUpdated: string;
}

export default function ShipmentsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

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

  // サンプルデータ（より詳細）
  const shipments: Shipment[] = [
    {
      id: 'SHP-2026-0001',
      name: '2026-01-15 米国マルカイ＋米国Amazon-AWD向け輸出',
      manufacturer: 'ABC製造株式会社',
      forwarder: '佐川グローバルロジスティクス',
      packing: '福富運送',
      shipDate: '2026-01-15',
      estimatedArrival: '2026-02-01',
      status: '進行中',
      progress: 65,
      totalCartons: 120,
      totalPallets: 8,
      totalWeight: '1,800 kg',
      destinations: ['米国マルカイ', '米国Amazon-AWD'],
      flowPatterns: ['メーカー→梱包業者→フォワーダー→配送先'],
      createdDate: '2026-01-10',
      lastUpdated: '2026-01-14 15:30',
    },
    {
      id: 'SHP-2026-0002',
      name: '2026-01-18 米国Walmart＋スーパーマーケット向け輸出',
      manufacturer: 'XYZ食品株式会社',
      forwarder: '日本ジャパントラスト',
      packing: '梱包サービス東京',
      shipDate: '2026-01-18',
      estimatedArrival: '2026-02-05',
      status: '梱包中',
      progress: 35,
      totalCartons: 80,
      totalPallets: 5,
      totalWeight: '1,200 kg',
      destinations: ['米国Walmart', 'スーパーマーケット'],
      flowPatterns: ['メーカー→梱包業者→フォワーダー→配送先'],
      createdDate: '2026-01-12',
      lastUpdated: '2026-01-14 10:20',
    },
    {
      id: 'SHP-2026-0003',
      name: '2026-01-20 米国Amazon-FBA向け輸出',
      manufacturer: '日本有機食品株式会社',
      forwarder: '佐川グローバルロジスティクス',
      shipDate: '2026-01-20',
      estimatedArrival: '2026-02-08',
      status: '計画中',
      progress: 15,
      totalCartons: 60,
      totalPallets: 4,
      totalWeight: '900 kg',
      destinations: ['米国Amazon-FBA'],
      flowPatterns: ['メーカー→フォワーダー→配送先'],
      createdDate: '2026-01-13',
      lastUpdated: '2026-01-14 09:15',
    },
    {
      id: 'SHP-2026-0004',
      name: '2026-01-22 カナダ向け健康食品輸出',
      manufacturer: 'ABC製造株式会社',
      forwarder: 'DHLジャパン',
      packing: '福富運送',
      shipDate: '2026-01-22',
      estimatedArrival: '2026-02-10',
      status: '承認待ち',
      progress: 10,
      totalCartons: 100,
      totalPallets: 6,
      totalWeight: '1,500 kg',
      destinations: ['カナダスーパーマーケット'],
      flowPatterns: ['メーカー→梱包業者→フォワーダー→配送先'],
      createdDate: '2026-01-14',
      lastUpdated: '2026-01-14 16:00',
    },
    {
      id: 'SHP-2025-0150',
      name: '2025-12-20 米国Amazon-FBA向け年末配送',
      manufacturer: 'XYZ食品株式会社',
      forwarder: 'FedExジャパン',
      shipDate: '2025-12-20',
      estimatedArrival: '2026-01-05',
      status: '完了',
      progress: 100,
      totalCartons: 150,
      totalPallets: 10,
      totalWeight: '2,250 kg',
      destinations: ['米国Amazon-FBA'],
      flowPatterns: ['メーカー→フォワーダー→配送先'],
      createdDate: '2025-12-10',
      lastUpdated: '2026-01-06 14:30',
    },
  ];

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.forwarder.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '進行中':
        return 'bg-green-100 text-green-800';
      case '梱包中':
        return 'bg-yellow-100 text-yellow-800';
      case '計画中':
        return 'bg-blue-100 text-blue-800';
      case '承認待ち':
        return 'bg-orange-100 text-orange-800';
      case '完了':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-indigo-600"
        subtitle="管理者 - 出荷計画一覧"
        userName={user.name}
      />
      <Navigation 
        items={['ダッシュボード', '出荷計画', '商品マスタ', '取引先', 'ユーザー管理', 'レポート']}
        activeItem="出荷計画"
        activeColor="indigo"
        role="admin"
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">出荷計画一覧</h2>
            <p className="text-sm text-gray-600 mt-1">すべての出荷計画を管理・確認できます</p>
          </div>
          <a
            href="/admin/shipments/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
          >
            <span className="mr-2">+</span>
            新規作成
          </a>
        </div>

        {/* フィルター・検索エリア */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
              <input
                type="text"
                placeholder="出荷コード、名前、メーカー、フォワーダー..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">すべて</option>
                <option value="計画中">計画中</option>
                <option value="承認待ち">承認待ち</option>
                <option value="梱包中">梱包中</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">期間</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">すべて</option>
                <option value="today">今日</option>
                <option value="week">今週</option>
                <option value="month">今月</option>
              </select>
            </div>
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">全出荷計画</p>
            <p className="text-2xl font-bold text-gray-900">{shipments.length}件</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">計画中</p>
            <p className="text-2xl font-bold text-blue-600">
              {shipments.filter(s => s.status === '計画中').length}件
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">進行中</p>
            <p className="text-2xl font-bold text-green-600">
              {shipments.filter(s => s.status === '進行中' || s.status === '梱包中').length}件
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">承認待ち</p>
            <p className="text-2xl font-bold text-orange-600">
              {shipments.filter(s => s.status === '承認待ち').length}件
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">完了</p>
            <p className="text-2xl font-bold text-purple-600">
              {shipments.filter(s => s.status === '完了').length}件
            </p>
          </div>
        </div>

        {/* 出荷計画テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    出荷日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メーカー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    フォワーダー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    物量
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
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/admin/shipments/${shipment.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900 hover:underline"
                      >
                        {shipment.id}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/shipments/${shipment.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-900 hover:text-indigo-600 hover:underline"
                      >
                        {shipment.name}
                      </a>
                      <div className="text-xs text-gray-500 mt-1">
                        {shipment.destinations.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.shipDate}</div>
                      <div className="text-xs text-gray-500">着: {shipment.estimatedArrival}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.forwarder}
                      {shipment.packing && (
                        <div className="text-xs text-gray-500 mt-1">梱包: {shipment.packing}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.totalCartons}箱</div>
                      <div className="text-xs text-gray-500">{shipment.totalPallets}パレット</div>
                      <div className="text-xs text-gray-500">{shipment.totalWeight}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '80px' }}>
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{shipment.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
          
          {filteredShipments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当する出荷計画が見つかりませんでした</p>
            </div>
          )}
        </div>

        {/* ページネーション（将来実装用） */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            全 <span className="font-medium">{filteredShipments.length}</span> 件中 
            <span className="font-medium"> {filteredShipments.length}</span> 件を表示
          </p>
        </div>
      </main>
    </div>
  );
}

