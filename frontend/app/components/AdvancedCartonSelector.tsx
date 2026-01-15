'use client';

import { useState, useMemo } from 'react';
import { allCartons, Carton, calculateCartonCapacity, calculateVolume, getProductUnitVolume } from '@/data/all-cartons';

interface SelectedCarton {
  code: string;
  name: string;
  innerDimensions: string;
  deliverySize: string;
  capacity: number;
  boxCount: number;
  totalBags: number;
  price: number;
  palletConfig: {
    boxesPerLayer: number;
    layers: number;
    total: number;
  } | null;
}

interface AdvancedCartonSelectorProps {
  productName: string;
  productId: number;
  targetQuantity: number;
  recommendedCartonCodes: string[]; // おすすめの段ボールコード
  selectedCartons: SelectedCarton[];
  onCartonsChange: (cartons: SelectedCarton[]) => void;
}

type SortOption = 'recommended' | 'volume-asc' | 'volume-desc' | 'price-asc' | 'price-desc' | 'capacity-asc' | 'capacity-desc';

export default function AdvancedCartonSelector({
  productName,
  productId,
  targetQuantity,
  recommendedCartonCodes,
  selectedCartons,
  onCartonsChange
}: AdvancedCartonSelectorProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showAllCartons, setShowAllCartons] = useState(false);

  // 商品の単位容積を取得
  const productUnitVolume = getProductUnitVolume(productName);

  // 各段ボールの容量を計算
  const cartonsWithCapacity = useMemo(() => {
    return allCartons.map(carton => {
      const cartonVolume = calculateVolume(carton.innerLength, carton.innerWidth, carton.innerHeight);
      const capacity = calculateCartonCapacity(cartonVolume, productUnitVolume);
      const isRecommended = recommendedCartonCodes.includes(carton.code);
      
      return {
        ...carton,
        volume: cartonVolume,
        capacity,
        isRecommended
      };
    }).filter(carton => carton.capacity > 0); // 容量0以下は除外
  }, [productUnitVolume, recommendedCartonCodes]);

  // 検索とソートを適用
  const filteredAndSortedCartons = useMemo(() => {
    // 検索フィルター
    let filtered = cartonsWithCapacity;
    
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(carton =>
        carton.code.toLowerCase().includes(keyword) ||
        carton.name.toLowerCase().includes(keyword) ||
        carton.deliverySize.toLowerCase().includes(keyword) ||
        carton.thickness.toLowerCase().includes(keyword)
      );
    }

    // ソート
    const sorted = [...filtered];
    
    switch (sortBy) {
      case 'recommended':
        sorted.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return b.capacity - a.capacity; // 容量の降順
        });
        break;
      case 'volume-asc':
        sorted.sort((a, b) => a.volume - b.volume);
        break;
      case 'volume-desc':
        sorted.sort((a, b) => b.volume - a.volume);
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'capacity-asc':
        sorted.sort((a, b) => a.capacity - b.capacity);
        break;
      case 'capacity-desc':
        sorted.sort((a, b) => b.capacity - a.capacity);
        break;
    }
    
    return sorted;
  }, [cartonsWithCapacity, searchKeyword, sortBy]);

  // 選択された段ボールの合計
  const totalSelected = selectedCartons.reduce((sum, c) => sum + c.totalBags, 0);
  const remaining = targetQuantity - totalSelected;
  const status = remaining === 0 ? 'exact' : remaining > 0 ? 'short' : 'over';

  // 段ボールを追加
  const addCarton = (carton: typeof cartonsWithCapacity[0], quantity: number = 1) => {
    const newCarton: SelectedCarton = {
      code: carton.code,
      name: carton.name,
      innerDimensions: `${carton.innerLength}×${carton.innerWidth}×${carton.innerHeight}mm`,
      deliverySize: carton.deliverySize,
      capacity: carton.capacity,
      boxCount: quantity,
      totalBags: carton.capacity * quantity,
      price: carton.price,
      palletConfig: carton.palletConfig
    };
    onCartonsChange([...selectedCartons, newCarton]);
  };

  // 段ボールを削除
  const removeCarton = (index: number) => {
    onCartonsChange(selectedCartons.filter((_, i) => i !== index));
  };

  // 箱数を変更
  const updateBoxCount = (index: number, newBoxCount: number) => {
    if (newBoxCount < 0) return;
    
    const updated = [...selectedCartons];
    updated[index] = {
      ...updated[index],
      boxCount: newBoxCount,
      totalBags: updated[index].capacity * newBoxCount
    };
    onCartonsChange(updated);
  };

  // 自動提案（第一候補）
  const applySuggestion = () => {
    if (filteredAndSortedCartons.length === 0) return;
    
    const firstCarton = filteredAndSortedCartons[0];
    const boxCount = Math.ceil(targetQuantity / firstCarton.capacity);
    addCarton(firstCarton, boxCount);
  };

  return (
    <div className="space-y-3">
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              出荷数量: <span className="text-indigo-600">{targetQuantity}袋</span>
            </span>
            <span className="text-sm font-medium text-gray-700">
              選択済み: <span className="text-indigo-600">{totalSelected}袋</span>
            </span>
            <span className={`text-sm font-bold ${
              status === 'exact' ? 'text-green-600' :
              status === 'short' ? 'text-red-600' :
              'text-orange-600'
            }`}>
              {status === 'exact' && '✓ ぴったり'}
              {status === 'short' && `不足: ${remaining}袋`}
              {status === 'over' && `過剰: ${-remaining}袋`}
            </span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={applySuggestion}
          className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          おすすめを追加
        </button>
      </div>

      {/* 選択された段ボール */}
      {selectedCartons.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">選択中の段ボール</h5>
          <div className="space-y-2">
            {selectedCartons.map((carton, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-white border border-gray-300 rounded text-xs">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{carton.code}</span>
                    {carton.palletConfig && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        パレット○
                      </span>
                    )}
                    <span className="text-gray-600">{carton.deliverySize}</span>
                  </div>
                  <div className="text-gray-600 truncate">
                    {carton.innerDimensions} - {carton.capacity}袋入り
                    {carton.palletConfig && (
                      <span className="ml-2 text-indigo-600">
                        (1段{carton.palletConfig.boxesPerLayer}箱×{carton.palletConfig.layers}段)
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 mt-0.5">
                    単価: ¥{carton.price}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={carton.boxCount}
                    onChange={(e) => updateBoxCount(index, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-xs text-gray-600 w-8">箱</span>
                </div>
                
                <div className="text-xs font-medium text-indigo-600 w-20 text-right">
                  {carton.totalBags}袋
                </div>
                
                <button
                  type="button"
                  onClick={() => removeCarton(index)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            <div className="pt-2 border-t border-indigo-300 flex justify-between text-sm">
              <span className="text-gray-700">合計:</span>
              <span className="font-medium text-gray-900">
                {selectedCartons.reduce((sum, c) => sum + c.boxCount, 0)}箱 / {totalSelected}袋 / ¥{selectedCartons.reduce((sum, c) => sum + c.price * c.boxCount, 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 検索・フィルター・ソート */}
      <div className="border border-gray-300 rounded-lg p-3 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-gray-900">
            段ボール候補を選択
            <button
              type="button"
              onClick={() => setShowAllCartons(!showAllCartons)}
              className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
            >
              {showAllCartons ? '▼ 閉じる' : '▶ 表示'}
            </button>
          </h5>
          <span className="text-xs text-gray-600">
            {filteredAndSortedCartons.length}件
          </span>
        </div>

        {showAllCartons && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              {/* 検索 */}
              <div>
                <input
                  type="text"
                  placeholder="キーワードで検索..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* ソート */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="recommended">おすすめ順</option>
                  <option value="capacity-desc">収容数が多い順</option>
                  <option value="capacity-asc">収容数が少ない順</option>
                  <option value="volume-asc">サイズが小さい順</option>
                  <option value="volume-desc">サイズが大きい順</option>
                  <option value="price-asc">価格が安い順</option>
                  <option value="price-desc">価格が高い順</option>
                </select>
              </div>
            </div>

            {/* 段ボールリスト */}
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded">
              {filteredAndSortedCartons.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  条件に合う段ボールが見つかりません
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAndSortedCartons.map((carton, index) => (
                    <div key={carton.code} className={`p-3 hover:bg-gray-50 ${carton.isRecommended ? 'bg-yellow-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 text-xs min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{carton.code}</span>
                            {carton.isRecommended && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-200 text-yellow-800">
                                おすすめ
                              </span>
                            )}
                            {carton.palletConfig && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                パレット○
                              </span>
                            )}
                            <span className="text-gray-600">{carton.deliverySize}</span>
                          </div>
                          <div className="text-gray-700 mb-1">
                            {carton.innerLength}×{carton.innerWidth}×{carton.innerHeight}mm
                            <span className="ml-2 font-medium text-indigo-600">
                              約{carton.capacity}袋入り
                            </span>
                          </div>
                          {carton.palletConfig && (
                            <div className="text-indigo-600 mb-1">
                              パレット: 1段{carton.palletConfig.boxesPerLayer}箱×{carton.palletConfig.layers}段 = {carton.palletConfig.total}箱
                            </div>
                          )}
                          <div className="text-gray-600">
                            {carton.thickness} | {carton.format}
                          </div>
                          <div className="text-gray-700 font-medium mt-1">
                            単価: ¥{carton.price}
                          </div>
                        </div>
                        
                        <div className="ml-3 flex flex-col space-y-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => addCarton(carton, 1)}
                            className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 whitespace-nowrap"
                          >
                            + 1箱
                          </button>
                          <button
                            type="button"
                            onClick={() => addCarton(carton, Math.ceil(remaining / carton.capacity))}
                            className="px-3 py-1 text-xs font-medium text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50 whitespace-nowrap"
                            disabled={remaining <= 0}
                          >
                            不足分
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

