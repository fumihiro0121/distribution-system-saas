'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Navigation from '@/app/components/Navigation';
import { allCartons } from '@/data/all-cartons';
import { cartonProductMapping } from '@/data/carton-product-mapping';

export default function CartonMasterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newCarton, setNewCarton] = useState({
    code: '',
    name: '',
    deliverySize: '宅配120サイズ',
    innerLength: '',
    innerWidth: '',
    innerHeight: '',
    thickness: '5mm A/F',
    format: 'K5×K5',
    palletConfig: '',
    price: '',
    volume: '',
    weight: '',
    url: ''
  });

  // フィルタリングとソート
  const filteredCartons = allCartons.filter(carton => {
    const matchesSearch = 
      carton.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carton.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carton.innerDimensions.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSize = filterSize === 'all' || carton.deliverySize === filterSize;
    
    const isHistorical = carton.code.startsWith('HIST-');
    const matchesSource = 
      filterSource === 'all' || 
      (filterSource === 'historical' && isHistorical) ||
      (filterSource === 'standard' && !isHistorical);
    
    return matchesSearch && matchesSize && matchesSource;
  }).sort((a, b) => {
    // 実績段ボール（HIST-）を優先的に上部に表示
    const aIsHistorical = a.code.startsWith('HIST-');
    const bIsHistorical = b.code.startsWith('HIST-');
    
    if (aIsHistorical && !bIsHistorical) return -1;
    if (!aIsHistorical && bIsHistorical) return 1;
    
    // 同じ種類の場合は商品番号順
    return a.code.localeCompare(b.code);
  });

  const handleAddCarton = () => {
    // 実際にはAPIを呼び出してデータベースに追加
    alert(`新規段ボール追加:\n${newCarton.name}\n内寸: ${newCarton.innerLength}×${newCarton.innerWidth}×${newCarton.innerHeight}mm\n価格: ¥${newCarton.price}`);
    setShowAddModal(false);
    setNewCarton({
      code: '',
      name: '',
      deliverySize: '宅配120サイズ',
      innerLength: '',
      innerWidth: '',
      innerHeight: '',
      thickness: '5mm A/F',
      format: 'K5×K5',
      palletConfig: '',
      price: '',
      volume: '',
      weight: '',
      url: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeItem="出荷計画" role="admin" />
      <Navigation 
        items={['ダッシュボード', '出荷計画', '商品マスタ', '段ボールマスタ', '取引先', 'ユーザー管理', 'レポート']}
        activeItem="段ボールマスタ" 
        activeColor="indigo"
        role="admin" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📦 段ボールマスタ管理</h1>
            <p className="mt-1 text-sm text-gray-600">
              段ボールの登録・編集・削除を行います
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + 新規段ボール追加
          </button>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">総登録数</div>
            <div className="text-2xl font-bold text-gray-900">{allCartons.length}件</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">実績段ボール</div>
            <div className="text-2xl font-bold text-indigo-600">
              {allCartons.filter(c => c.code.startsWith('HIST-')).length}件
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">標準段ボール</div>
            <div className="text-2xl font-bold text-green-600">
              {allCartons.filter(c => !c.code.startsWith('HIST-')).length}件
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">検索結果</div>
            <div className="text-2xl font-bold text-gray-900">{filteredCartons.length}件</div>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                キーワード検索
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="商品番号、商品名、サイズで検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                宅配サイズ
              </label>
              <select
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">すべて</option>
                <option value="宅配120サイズ">宅配120サイズ</option>
                <option value="宅配140サイズ">宅配140サイズ</option>
                <option value="宅配160サイズ">宅配160サイズ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                データソース
              </label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">すべて</option>
                <option value="historical">実績データ</option>
                <option value="standard">標準カタログ</option>
              </select>
            </div>
          </div>
        </div>

        {/* 段ボール一覧テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-scroll overflow-y-auto max-h-[600px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    内寸 (mm)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    外形三辺合計
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    パレット配置
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種別
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[400px]">
                    実績商品
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    単価 (円)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    容量 (L)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    重量 (g)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品番号
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    宅配サイズ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    厚み
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    形式
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCartons.map((carton, index) => {
                  // 外形三辺合計を計算
                  const outerSum = carton.innerLength + carton.innerWidth + carton.innerHeight;
                  const outerSumCm = (outerSum / 10).toFixed(0);
                  
                  // パレット配置情報を取得
                  let palletInfo = '-';
                  if (carton.palletConfig) {
                    palletInfo = `1段${carton.palletConfig.boxesPerLayer}箱×${carton.palletConfig.layers}段`;
                    
                    // 高さ情報を追加
                    let heightMm: number;
                    if (carton.palletLoadingDetails) {
                      // パレット積載実績がある場合はその高さを使用
                      heightMm = carton.palletLoadingDetails.heightMm;
                    } else {
                      // パレット積載実績がない場合は段ボール高さ×段数で計算
                      heightMm = carton.innerHeight * carton.palletConfig.layers;
                    }
                    palletInfo += ` / 高さ${heightMm}mm`;
                  }
                  
                  // 実績商品を取得
                  const relatedProducts = cartonProductMapping[carton.code] || [];
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 min-w-[400px]">
                        <div className="break-words whitespace-normal">
                          {carton.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {carton.innerLength}×{carton.innerWidth}×{carton.innerHeight}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {outerSumCm}cm
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {palletInfo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {carton.code.startsWith('HIST-') ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            実績
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            標準
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 min-w-[400px]">
                        {relatedProducts.length > 0 ? (
                          <div className="space-y-2">
                            {relatedProducts.map((productDetail, idx) => (
                              <div key={idx} className="whitespace-normal break-words">
                                <div className="font-medium text-gray-900">{productDetail.productName}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-semibold text-indigo-600 mx-1">
                                    {productDetail.packingSets}セット（{productDetail.packingBags}袋）
                                  </span>
                                  入れて輸出実績あり
                                </div>
                                {productDetail.palletFit && (
                                  <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    パレットぴったり
                                  </span>
                                )}
                                {carton.palletLoadingDetails && (
                                  <div className="mt-2 text-xs text-gray-600 bg-green-50 p-2 rounded">
                                    <div className="font-semibold text-green-800 mb-1">📦 パレット積載実績</div>
                                    <div>1段{carton.palletLoadingDetails.cartonsPerLayer}箱 × {carton.palletLoadingDetails.totalLayers}段 = {carton.palletLoadingDetails.totalCartons}箱</div>
                                    <div>総袋数: {carton.palletLoadingDetails.totalBags}袋</div>
                                    <div>高さ{carton.palletLoadingDetails.heightMm}mm × 幅{carton.palletLoadingDetails.widthMm}mm</div>
                                    <div className="font-medium text-green-700">重量: {carton.palletLoadingDetails.weightKg}kg</div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        ¥{carton.price}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {carton.volume ? carton.volume.toFixed(1) : ((carton.innerLength * carton.innerWidth * carton.innerHeight) / 1000).toFixed(1)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {carton.weight ? Math.round(carton.weight) : (() => {
                          const thicknessValue = carton.thickness.includes('3mm') ? 3 : carton.thickness.includes('5mm') ? 5 : carton.thickness.includes('8mm') ? 8 : 5;
                          const outerL = carton.innerLength + thicknessValue * 2;
                          const outerW = carton.innerWidth + thicknessValue * 2;
                          const outerH = carton.innerHeight + thicknessValue * 2;
                          const surfaceArea = 2 * ((outerL * outerW) + (outerL * outerH) + (outerW * outerH)) / 1000000;
                          let weightPerM2 = 0.4;
                          if (carton.thickness.includes('3mm') || carton.thickness.includes('B/F')) weightPerM2 = 0.25;
                          else if (carton.thickness.includes('5mm') || carton.thickness.includes('A/F')) weightPerM2 = 0.4;
                          else if (carton.thickness.includes('8mm') || carton.thickness.includes('W/F')) weightPerM2 = 0.6;
                          return Math.round(surfaceArea * weightPerM2 * 1000);
                        })()}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800 max-w-xs truncate">
                        {carton.url ? (
                          <a href={carton.url} target="_blank" rel="noopener noreferrer" title={carton.url}>
                            リンク
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {carton.code}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {carton.deliverySize}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {carton.thickness}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {carton.format}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                          編集
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          削除
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 新規追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">新規段ボール追加</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品番号 *
                  </label>
                  <input
                    type="text"
                    value={newCarton.code}
                    onChange={(e) => setNewCarton({...newCarton, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="例: CUST-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    宅配サイズ *
                  </label>
                  <select
                    value={newCarton.deliverySize}
                    onChange={(e) => setNewCarton({...newCarton, deliverySize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="宅配120サイズ">宅配120サイズ</option>
                    <option value="宅配140サイズ">宅配140サイズ</option>
                    <option value="宅配160サイズ">宅配160サイズ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名 *
                </label>
                <input
                  type="text"
                  value={newCarton.name}
                  onChange={(e) => setNewCarton({...newCarton, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="例: カスタム段ボール箱"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内寸 縦 (mm) *
                  </label>
                  <input
                    type="number"
                    value={newCarton.innerLength}
                    onChange={(e) => setNewCarton({...newCarton, innerLength: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内寸 横 (mm) *
                  </label>
                  <input
                    type="number"
                    value={newCarton.innerWidth}
                    onChange={(e) => setNewCarton({...newCarton, innerWidth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内寸 高さ (mm) *
                  </label>
                  <input
                    type="number"
                    value={newCarton.innerHeight}
                    onChange={(e) => setNewCarton({...newCarton, innerHeight: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    厚み
                  </label>
                  <select
                    value={newCarton.thickness}
                    onChange={(e) => setNewCarton({...newCarton, thickness: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="3mm B/F">3mm B/F</option>
                    <option value="5mm A/F">5mm A/F</option>
                    <option value="8mm W/F">8mm W/F</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    形式
                  </label>
                  <input
                    type="text"
                    value={newCarton.format}
                    onChange={(e) => setNewCarton({...newCarton, format: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    単価 (円) *
                  </label>
                  <input
                    type="number"
                    value={newCarton.price}
                    onChange={(e) => setNewCarton({...newCarton, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    パレット配置
                  </label>
                  <input
                    type="text"
                    value={newCarton.palletConfig}
                    onChange={(e) => setNewCarton({...newCarton, palletConfig: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="例: 1段8箱×7段"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddCarton}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

