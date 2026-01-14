'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { flowPatterns as initialFlowPatterns, FlowPattern } from '@/data/flow-patterns';
import Header from '@/app/components/Header';

export default function FlowPatternMasterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [patterns, setPatterns] = useState<FlowPattern[]>(initialFlowPatterns);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<FlowPattern | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    requiresPacking: false,
    description: '',
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

  const handleAdd = () => {
    setEditingPattern(null);
    setFormData({
      name: '',
      code: '',
      requiresPacking: false,
      description: '',
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (pattern: FlowPattern) => {
    setEditingPattern(pattern);
    setFormData({
      name: pattern.name,
      code: pattern.code,
      requiresPacking: pattern.requiresPacking,
      description: pattern.description,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPattern) {
      // 更新
      setPatterns(patterns.map(p => 
        p.id === editingPattern.id 
          ? { ...p, ...formData }
          : p
      ));
      alert('フローパターン情報を更新しました（デモ）');
    } else {
      // 新規追加
      const newPattern: FlowPattern = {
        id: Math.max(...patterns.map(p => p.id)) + 1,
        ...formData,
      };
      setPatterns([...patterns, newPattern]);
      alert('フローパターンを追加しました（デモ）');
    }
    
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('このフローパターンを削除してもよろしいですか？')) {
      setPatterns(patterns.filter(p => p.id !== id));
      alert('フローパターンを削除しました（デモ）');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-indigo-600"
        subtitle="管理者 - フローパターン管理"
        userName={user.name}
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">業務フローパターン</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + 新規パターンを追加
          </button>
        </div>

        {/* パターン一覧 */}
        <div className="grid grid-cols-1 gap-6">
          {patterns.map((pattern) => (
            <div key={pattern.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pattern.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {pattern.code}
                    </span>
                    {pattern.requiresPacking && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                        梱包業者あり
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{pattern.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pattern)}
                    className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 border border-indigo-300 rounded hover:bg-indigo-50"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(pattern.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-900 border border-red-300 rounded hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              </div>

              {/* フロー図 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                    メーカー
                  </div>
                  <div className="text-gray-400">→</div>
                  {pattern.requiresPacking && (
                    <>
                      <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                        梱包業者
                      </div>
                      <div className="text-gray-400">→</div>
                    </>
                  )}
                  <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                    フォワーダー
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                    配送先
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {patterns.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">フローパターンが登録されていません</p>
            <button
              onClick={handleAdd}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              最初のパターンを追加
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          全{patterns.length}件
        </div>
      </main>

      {/* 追加・編集モーダル */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPattern ? 'フローパターンを編集' : 'フローパターンを追加'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パターン名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="例: 直送（メーカー → フォワーダー）"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  コード <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="例: direct"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">半角英数字、アンダースコアのみ</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="このフローパターンの説明を入力してください"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.requiresPacking}
                    onChange={(e) => setFormData({...formData, requiresPacking: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    梱包業者を経由する
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  チェックすると、出荷計画作成時に梱包業者の選択が必須になります
                </p>
              </div>

              {/* プレビュー */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-700 mb-3">フロー図プレビュー</p>
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm font-medium">
                    メーカー
                  </div>
                  <div className="text-gray-400">→</div>
                  {formData.requiresPacking && (
                    <>
                      <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                        梱包業者
                      </div>
                      <div className="text-gray-400">→</div>
                    </>
                  )}
                  <div className="px-3 py-2 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                    フォワーダー
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    配送先
                  </div>
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
                  {editingPattern ? '更新' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

