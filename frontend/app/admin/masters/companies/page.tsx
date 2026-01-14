'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Navigation from '@/app/components/Navigation';

interface Company {
  id: number;
  name: string;
  type: 'manufacturer' | 'packing' | 'forwarder';
  address: string;
  phone: string;
  email: string;
  contact: string;
  president: string;
}

export default function CompanyMasterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, type: 'manufacturer', name: 'ABC製造株式会社', address: '東京都港区芝1-1-1', phone: '03-1234-5678', email: 'info@abc-mfg.jp', contact: '山田太郎', president: '鈴木一郎' },
    { id: 2, type: 'manufacturer', name: 'XYZ食品株式会社', address: '大阪府大阪市北区梅田2-2-2', phone: '06-9876-5432', email: 'contact@xyz-food.jp', contact: '田中花子', president: '佐藤次郎' },
    { id: 3, type: 'manufacturer', name: '日本有機食品株式会社', address: '京都府京都市下京区四条通3-3-3', phone: '075-1111-2222', email: 'info@nihon-organic.jp', contact: '佐々木健', president: '高橋三郎' },
    { id: 4, type: 'packing', name: '株式会社福富運送', address: '東京都江東区豊洲4-4-4', phone: '03-5555-6666', email: 'info@fukutomi.jp', contact: '福富太郎', president: '福富社長' },
    { id: 5, type: 'packing', name: '梱包サービス東京株式会社', address: '東京都大田区平和島5-5-5', phone: '03-7777-8888', email: 'service@packing-tokyo.jp', contact: '梱包次郎', president: '梱包社長' },
    { id: 6, type: 'forwarder', name: '佐川グローバルロジスティクス株式会社', address: '東京都江東区新木場6-6-6', phone: '03-8888-9999', email: 'global@sagawa.jp', contact: '佐川太郎', president: '佐川社長' },
    { id: 7, type: 'forwarder', name: '日本ジャパントラスト株式会社', address: '横浜市中区山下町7-7-7', phone: '045-1234-5678', email: 'info@japan-trust.jp', contact: 'トラスト花子', president: 'トラスト社長' },
    { id: 8, type: 'forwarder', name: 'DHLジャパン株式会社', address: '東京都品川区東品川8-8-8', phone: '03-0000-1111', email: 'japan@dhl.com', contact: 'DHL太郎', president: 'DHL社長' },
    { id: 9, type: 'forwarder', name: 'FedExジャパン株式会社', address: '千葉市美浜区中瀬9-9-9', phone: '043-2222-3333', email: 'japan@fedex.com', contact: 'FedEx花子', president: 'FedEx社長' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'manufacturer' as 'manufacturer' | 'packing' | 'forwarder',
    address: '',
    phone: '',
    email: '',
    contact: '',
    president: '',
  });

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

  const handleAdd = (type?: string) => {
    setEditingCompany(null);
    setFormData({
      name: '',
      type: (type || 'manufacturer') as 'manufacturer' | 'packing' | 'forwarder',
      address: '',
      phone: '',
      email: '',
      contact: '',
      president: '',
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      address: company.address,
      phone: company.phone,
      email: company.email,
      contact: company.contact,
      president: company.president,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCompany) {
      // 更新
      setCompanies(companies.map(c => 
        c.id === editingCompany.id 
          ? { ...c, ...formData }
          : c
      ));
      alert('取引先情報を更新しました（デモ）');
    } else {
      // 新規追加
      const newCompany: Company = {
        id: Math.max(...companies.map(c => c.id)) + 1,
        ...formData,
      };
      setCompanies([...companies, newCompany]);
      alert('取引先を追加しました（デモ）');
    }
    
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('この取引先を削除してもよろしいですか？')) {
      setCompanies(companies.filter(c => c.id !== id));
      alert('取引先を削除しました（デモ）');
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || c.type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (!user) return <div>Loading...</div>;

  const typeLabels: {[key: string]: string} = {
    manufacturer: 'メーカー',
    packing: '梱包業者',
    forwarder: 'フォワーダー',
  };

  const typeColors: {[key: string]: string} = {
    manufacturer: 'bg-green-100 text-green-800',
    packing: 'bg-yellow-100 text-yellow-800',
    forwarder: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-indigo-600"
        subtitle="管理者 - 取引先マスタ管理"
        userName={user.name}
      />
      <Navigation 
        items={['ダッシュボード', '出荷計画', '商品マスタ', '取引先', 'ユーザー管理', 'レポート']}
        activeItem="取引先"
        activeColor="indigo"
        role="admin"
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">取引先マスタ</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleAdd('manufacturer')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              + メーカーを追加
            </button>
            <button
              onClick={() => handleAdd('packing')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
            >
              + 梱包業者を追加
            </button>
            <button
              onClick={() => handleAdd('forwarder')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              + フォワーダーを追加
            </button>
          </div>
        </div>

        {/* フィルターと検索 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="manufacturer">メーカー</option>
              <option value="packing">梱包業者</option>
              <option value="forwarder">フォワーダー</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <input
              type="text"
              placeholder="取引先名、住所、担当者で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 取引先一覧 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイプ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">会社名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">住所</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">電話番号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">担当者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">社長</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${typeColors[company.type]}`}>
                      {typeLabels[company.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    <div className="text-xs text-gray-500">{company.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{company.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {company.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {company.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {company.president}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(company)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          全{companies.length}件中 {filteredCompanies.length}件を表示
        </div>
      </main>

      {/* 追加・編集モーダル */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCompany ? '取引先を編集' : '取引先を追加'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイプ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'manufacturer' | 'packing' | 'forwarder'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="manufacturer">メーカー</option>
                  <option value="packing">梱包業者</option>
                  <option value="forwarder">フォワーダー</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="例: ABC製造株式会社"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="例: 東京都港区芝1-1-1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="例: 03-1234-5678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="例: info@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    担当者 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="例: 山田太郎"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    社長
                  </label>
                  <input
                    type="text"
                    value={formData.president}
                    onChange={(e) => setFormData({...formData, president: e.target.value})}
                    placeholder="例: 鈴木一郎"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingCompany ? '更新' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


