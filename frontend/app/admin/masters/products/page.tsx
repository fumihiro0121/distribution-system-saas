'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { products as initialProducts, productCategories, suppliers, Product } from '@/data/products';
import Header from '@/app/components/Header';

export default function ProductMasterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    inputDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
    productName: '',
    costPrice: 0,
    sku: '',
    janCode: '',
    asin: '',
    fnsku: '',
    hsCode: '',
    supplier: '',
    unitWeight: '',
    setQuantity: '',
    setWeight: '',
    setWeightPounds: '',
    standardBoxQuantity: 0,
    standardBoxSetQuantity: 0,
    boxLengthCm: 0,
    boxWidthCm: 0,
    boxHeightCm: 0,
    boxLengthInch: 0,
    boxWidthInch: 0,
    boxHeightInch: 0,
    category: '',
    notes: '',
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
    setEditingProduct(null);
    setFormData({
      inputDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      productName: '',
      costPrice: 0,
      sku: '',
      janCode: '',
      asin: '',
      fnsku: '',
      hsCode: '',
      supplier: '',
      unitWeight: '',
      setQuantity: '',
      setWeight: '',
      setWeightPounds: '',
      standardBoxQuantity: 0,
      standardBoxSetQuantity: 0,
      boxLengthCm: 0,
      boxWidthCm: 0,
      boxHeightCm: 0,
      boxLengthInch: 0,
      boxWidthInch: 0,
      boxHeightInch: 0,
      category: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // 更新
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData } as Product
          : p
      ));
      alert('商品情報を更新しました（デモ）');
    } else {
      // 新規追加
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...formData,
      } as Product;
      setProducts([...products, newProduct]);
      alert('商品を追加しました（デモ）');
    }
    
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('この商品を削除してもよろしいですか？')) {
      setProducts(products.filter(p => p.id !== id));
      alert('商品を削除しました（デモ）');
    }
  };

  // フィルタリング
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.janCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.asin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesSupplier = !supplierFilter || product.supplier === supplierFilter;
    
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-indigo-600"
        subtitle="管理者 - 商品マスタ管理"
        userName={user.name}
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">商品マスタ</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + 新規商品を追加
          </button>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品名・SKU・JANコード・ASINで検索
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="検索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリで絞り込み
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">すべてのカテゴリ</option>
                {productCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                仕入先で絞り込み
              </label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">すべての仕入先</option>
                {suppliers.map(sup => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 商品一覧テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU / JAN</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ASIN / FNSKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HSコード</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入先</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入金額</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">重量</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">段ボール</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                      <div className="text-xs text-gray-500">
                        {product.setQuantity && `${product.setQuantity}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{product.sku || '-'}</div>
                      {product.janCode && (
                        <div className="text-xs text-gray-500">{product.janCode}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{product.asin || '-'}</div>
                      {product.fnsku && (
                        <div className="text-xs text-gray-500">{product.fnsku}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.hsCode || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.supplier || '-'}</td>
                    <td className="px-4 py-3">
                      {product.category && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {product.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">¥{product.costPrice.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{product.setWeight}</div>
                      <div className="text-xs text-gray-500">{product.setWeightPounds}</div>
                    </td>
                    <td className="px-4 py-3">
                      {product.standardBoxSetQuantity > 0 ? (
                        <div>
                          <div className="text-sm text-gray-900">{product.standardBoxSetQuantity}セット</div>
                          <div className="text-xs text-gray-500">
                            {product.boxLengthCm > 0 && `${product.boxLengthCm}×${product.boxWidthCm}×${product.boxHeightCm}cm`}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          表示中: {filteredProducts.length}件 / 全{products.length}件
        </div>
      </main>

      {/* 追加・編集モーダル */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? '商品を編集' : '商品を追加'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 基本情報 */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">基本情報</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      商品名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      仕入金額 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">選択してください</option>
                      {productCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">仕入先</label>
                    <select
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">選択してください</option>
                      {suppliers.map(sup => (
                        <option key={sup} value={sup}>{sup}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Amazon情報 */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Amazon情報</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">JANコード</label>
                    <input
                      type="text"
                      value={formData.janCode}
                      onChange={(e) => setFormData({...formData, janCode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ASIN</label>
                    <input
                      type="text"
                      value={formData.asin}
                      onChange={(e) => setFormData({...formData, asin: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">FNSKU</label>
                    <input
                      type="text"
                      value={formData.fnsku}
                      onChange={(e) => setFormData({...formData, fnsku: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HSコード</label>
                    <input
                      type="text"
                      value={formData.hsCode}
                      onChange={(e) => setFormData({...formData, hsCode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 重量情報 */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">重量情報</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">単品重さ</label>
                    <input
                      type="text"
                      value={formData.unitWeight}
                      onChange={(e) => setFormData({...formData, unitWeight: e.target.value})}
                      placeholder="例: 0.51kg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">セット個数</label>
                    <input
                      type="text"
                      value={formData.setQuantity}
                      onChange={(e) => setFormData({...formData, setQuantity: e.target.value})}
                      placeholder="例: 1袋"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">セット重さ</label>
                    <input
                      type="text"
                      value={formData.setWeight}
                      onChange={(e) => setFormData({...formData, setWeight: e.target.value})}
                      placeholder="例: 0.51kg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 段ボール情報 */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">標準段ボール情報</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">梱包数（袋）</label>
                    <input
                      type="number"
                      value={formData.standardBoxQuantity}
                      onChange={(e) => setFormData({...formData, standardBoxQuantity: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">梱包セット数</label>
                    <input
                      type="number"
                      value={formData.standardBoxSetQuantity}
                      onChange={(e) => setFormData({...formData, standardBoxSetQuantity: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">縦（cm）</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.boxLengthCm}
                      onChange={(e) => setFormData({...formData, boxLengthCm: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">横（cm）</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.boxWidthCm}
                      onChange={(e) => setFormData({...formData, boxWidthCm: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">高さ（cm）</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.boxHeightCm}
                      onChange={(e) => setFormData({...formData, boxHeightCm: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">縦（inch）</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.boxLengthInch}
                      onChange={(e) => setFormData({...formData, boxLengthInch: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">横（inch）</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.boxWidthInch}
                      onChange={(e) => setFormData({...formData, boxWidthInch: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">高さ（inch）</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.boxHeightInch}
                      onChange={(e) => setFormData({...formData, boxHeightInch: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">備考</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
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
                  {editingProduct ? '更新' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

