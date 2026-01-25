'use client';

import { useState, useMemo } from 'react';
import { 
  allCartons, 
  Carton, 
  calculateCartonCapacity, 
  calculateVolume, 
  getProductUnitVolume, 
  getProductUnitWeight,
  estimateCartonWeight,
  checkAmazonFBACompliance 
} from '@/data/all-cartons';
import { cartonProductMapping } from '@/data/carton-product-mapping';

interface SelectedCarton {
  code: string;
  name: string;
  innerDimensions: string;
  deliverySize: string;
  capacity: number;
  volume: number; // 容積 (L)
  boxCount: number;
  bagsPerBox: number; // 各段ボールに入れる実際の袋数
  totalBags: number;
  price: number;
  cartonWeight: number; // 段ボール自体の重さ (kg)
  totalWeight: number; // 商品を入れた総重量 (kg)
  palletConfig: {
    boxesPerLayer: number;
    layers: number;
    total: number;
  } | null;
}

interface AdvancedCartonSelectorProps {
  productName: string;
  productId: number;
  targetQuantity: number; // 袋数
  bagsPerSet: number; // 1セット内の袋数
  recommendedCartonCodes: string[]; // おすすめの段ボールコード
  selectedCartons: SelectedCarton[];
  onCartonsChange: (cartons: SelectedCarton[]) => void;
}

type SortOption = 'recommended' | 'volume-asc' | 'volume-desc' | 'price-asc' | 'price-desc' | 'capacity-asc' | 'capacity-desc';

export default function AdvancedCartonSelector({
  productName,
  productId,
  targetQuantity,
  bagsPerSet,
  recommendedCartonCodes,
  selectedCartons,
  onCartonsChange
}: AdvancedCartonSelectorProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showAllCartons, setShowAllCartons] = useState(false);

  // 商品の単位容積と重さを取得
  const productUnitVolume = getProductUnitVolume(productName);
  const productUnitWeight = getProductUnitWeight(productName);

  // 各段ボールの容量を計算
  const cartonsWithCapacity = useMemo(() => {
    // まず、その商品について実績データがある段ボールを見つける
    let volumePerBag = productUnitVolume; // デフォルトは商品の単位容積
    
    for (const [cartonCode, details] of Object.entries(cartonProductMapping)) {
      const detail = details.find(d => d.productName === productName);
      if (detail && detail.packingBags > 0) {
        // 実績段ボールを見つけた
        const historicalCarton = allCartons.find(c => c.code === cartonCode);
        if (historicalCarton) {
          // 実績段ボールの容積を計算
          const historicalVolume = historicalCarton.volume || 
            calculateVolume(historicalCarton.innerLength, historicalCarton.innerWidth, historicalCarton.innerHeight);
          // 1袋あたりの必要容積を計算（リットル単位）
          volumePerBag = historicalVolume / detail.packingBags;
          break; // 最初の実績データを使用
        }
      }
    }
    
    return allCartons.map(carton => {
      // 実績データがある場合はそれを優先
      const historicalDetail = cartonProductMapping[carton.code]?.find(
        detail => detail.productName === productName
      );
      
      // 容積を計算（リットル単位）
      const cartonVolume = carton.volume || calculateVolume(carton.innerLength, carton.innerWidth, carton.innerHeight);
      
      let capacity: number;
      if (historicalDetail) {
        // 実績データがある場合は、実績の袋数をそのまま使用
        capacity = historicalDetail.packingBags;
      } else {
        // 実績データがない場合は、容積比から計算
        const estimatedBags = cartonVolume / volumePerBag;
        // 5の倍数で切り下げ
        capacity = Math.floor(estimatedBags / 5) * 5;
      }
      
      const isRecommended = recommendedCartonCodes.includes(carton.code);
      
      // 段ボールの重さ：マスタデータがあればそれを使用、なければ推定
      const cartonWeight = carton.weight 
        ? carton.weight / 1000  // gをkgに変換
        : estimateCartonWeight(
            carton.innerLength, 
            carton.innerWidth, 
            carton.innerHeight, 
            carton.thickness
          );
      
      // Amazon FBA/AWD制約をチェック
      const fbaCompliance = checkAmazonFBACompliance(
        carton.innerLength,
        carton.innerWidth,
        carton.innerHeight,
        cartonWeight,
        productUnitWeight,
        capacity
      );
      
      return {
        ...carton,
        volume: cartonVolume,
        capacity,
        isRecommended,
        cartonWeight,
        fbaCompliance
      };
    }).filter(carton => carton.capacity > 0); // 容量0以下は除外
  }, [productName, productUnitVolume, productUnitWeight, recommendedCartonCodes]);

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
    let sorted = [...filtered];
    
    switch (sortBy) {
      case 'recommended':
        sorted.sort((a, b) => {
          // この商品に対する実績データ（HIST-）を最優先
          const aIsProductHistorical = cartonProductMapping[a.code]?.some(
            detail => detail.productName === productName
          ) ?? false;
          const bIsProductHistorical = cartonProductMapping[b.code]?.some(
            detail => detail.productName === productName
          ) ?? false;
          
          if (aIsProductHistorical && !bIsProductHistorical) return -1;
          if (!aIsProductHistorical && bIsProductHistorical) return 1;
          
          // FBA/AWD制約外のものは除外（おすすめには表示しない）
          // ただし実績段ボールは制約外でも表示する
          if (!aIsProductHistorical && !bIsProductHistorical) {
            if (!a.fbaCompliance.isCompliant && !b.fbaCompliance.isCompliant) {
              return 0; // 両方とも制約外なら順序維持
            }
            if (!a.fbaCompliance.isCompliant) return 1; // aが制約外なら後ろへ
            if (!b.fbaCompliance.isCompliant) return -1; // bが制約外なら後ろへ
          }
          
          // 実績データ以外の場合、パレット配置効率でソート
          if (!aIsProductHistorical && !bIsProductHistorical) {
            // パレット配置効率を計算
            // 効率 = パレット1台に積める商品のセット数
            const calcPalletEfficiency = (carton: typeof a) => {
              if (!carton.palletConfig) return 0;
              
              // パレット1台に積める段ボール箱数
              const totalBoxes = carton.palletConfig.boxesPerLayer * carton.palletConfig.layers;
              
              // 段ボール1箱に入る商品のセット数
              const setsPerBox = Math.floor(carton.capacity / bagsPerSet);
              
              // パレット1台に積める商品のセット数
              return totalBoxes * setsPerBox;
            };
            
            const aEfficiency = calcPalletEfficiency(a);
            const bEfficiency = calcPalletEfficiency(b);
            
            // 効率が高い方を優先
            if (aEfficiency !== bEfficiency) {
              return bEfficiency - aEfficiency;
            }
          }
          
          // FBA/AWD○ かつ パレット○ を次に優先
          const aHasPallet = a.palletConfig !== null;
          const bHasPallet = b.palletConfig !== null;
          if (aHasPallet && !bHasPallet) return -1;
          if (!aHasPallet && bHasPallet) return 1;
          
          // データベースからのおすすめを優先
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          
          // 容量の降順
          return b.capacity - a.capacity;
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
    
    // おすすめ順の場合は上位100件に制限（パフォーマンスのため）
    if (sortBy === 'recommended' && !searchKeyword.trim()) {
      sorted = sorted.slice(0, 100);
    }
    
    return sorted;
  }, [cartonsWithCapacity, searchKeyword, sortBy]);

  // 選択された段ボールの合計
  const totalSelected = selectedCartons.reduce((sum, c) => sum + c.totalBags, 0);
  const remaining = targetQuantity - totalSelected;
  const status = remaining === 0 ? 'exact' : remaining > 0 ? 'short' : 'over';

  // 段ボールを追加
  const addCarton = (carton: typeof cartonsWithCapacity[0], quantity: number = 1) => {
    const bagsPerBox = carton.capacity;
    const cartonWeight = carton.cartonWeight;
    const totalWeight = cartonWeight + (productUnitWeight * bagsPerBox);
    
    const newCarton: SelectedCarton = {
      code: carton.code,
      name: carton.name,
      innerDimensions: `${carton.innerLength}×${carton.innerWidth}×${carton.innerHeight}mm`,
      deliverySize: carton.deliverySize,
      capacity: carton.capacity,
      volume: carton.volume,
      boxCount: quantity,
      bagsPerBox: bagsPerBox,
      totalBags: bagsPerBox * quantity,
      price: carton.price,
      cartonWeight: cartonWeight,
      totalWeight: totalWeight,
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
    const bagsPerBox = updated[index].bagsPerBox ?? updated[index].capacity;
    updated[index] = {
      ...updated[index],
      boxCount: newBoxCount,
      bagsPerBox: bagsPerBox,
      totalBags: bagsPerBox * newBoxCount
    };
    onCartonsChange(updated);
  };

  // 各段ボールに入れる袋数を変更
  const updateBagsPerBox = (index: number, newBagsPerBox: number) => {
    if (newBagsPerBox < 0 || newBagsPerBox > selectedCartons[index].capacity) return;
    
    const updated = [...selectedCartons];
    const cartonData = cartonsWithCapacity.find(c => c.code === updated[index].code);
    const cartonWeight = updated[index].cartonWeight ?? (cartonData?.cartonWeight || 0.5);
    const totalWeight = cartonWeight + (productUnitWeight * newBagsPerBox);
    
    updated[index] = {
      ...updated[index],
      bagsPerBox: newBagsPerBox,
      totalBags: newBagsPerBox * updated[index].boxCount,
      cartonWeight: cartonWeight,
      totalWeight: totalWeight
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
              出荷セット数: <span className="text-indigo-600">{Math.ceil(targetQuantity / bagsPerSet)}セット ({targetQuantity}袋)</span>
            </span>
            <span className="text-sm font-medium text-gray-700">
              選択済み: <span className="text-indigo-600">{Math.floor(totalSelected / bagsPerSet)}セット ({totalSelected}袋)</span>
            </span>
            <span className={`text-sm font-bold ${
              status === 'exact' ? 'text-green-600' :
              status === 'short' ? 'text-red-600' :
              'text-orange-600'
            }`}>
              {status === 'exact' && '✓ ぴったり'}
              {status === 'short' && `不足: ${Math.ceil(remaining / bagsPerSet)}セット (${remaining}袋)`}
              {status === 'over' && `過剰: ${Math.ceil(-remaining / bagsPerSet)}セット (${-remaining}袋)`}
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
            {selectedCartons.map((carton, index) => {
              // この段ボールのAmazon FBA/AWD制約をチェック
              const cartonData = cartonsWithCapacity.find(c => c.code === carton.code);
              
              // 新しいフィールドが存在しない場合は計算する（後方互換性）
              const bagsPerBox = carton.bagsPerBox ?? carton.capacity;
              const cartonWeight = carton.cartonWeight ?? (cartonData?.cartonWeight || 0.5);
              const totalWeight = carton.totalWeight ?? (cartonWeight + (productUnitWeight * bagsPerBox));
              
              const fbaCheck = cartonData ? checkAmazonFBACompliance(
                cartonData.innerLength,
                cartonData.innerWidth,
                cartonData.innerHeight,
                cartonWeight,
                productUnitWeight,
                bagsPerBox
              ) : null;
              
              return (
                <div key={index} className="p-2 bg-white border border-gray-300 rounded text-xs">
                  <div className="flex items-start space-x-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1 flex-wrap">
                        <span className="font-medium text-gray-900">{carton.code}</span>
                        {(() => {
                          const historicalDetail = cartonProductMapping[carton.code]?.find(
                            detail => detail.productName === productName
                          );
                          return historicalDetail && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-900">
                              ✓ 実績: {historicalDetail.packingSets}セット({historicalDetail.packingBags}袋)
                            </span>
                          );
                        })()}
                        {carton.palletConfig && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            パレット○
                          </span>
                        )}
                        {fbaCheck && fbaCheck.isCompliant && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            FBA/AWD○
                          </span>
                        )}
                        {fbaCheck && !fbaCheck.isCompliant && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            FBA/AWD×
                          </span>
                        )}
                        <span className="text-gray-600">{carton.deliverySize}</span>
                      </div>
                      <div className="text-gray-700 mb-1">
                        {carton.innerDimensions}
                        <span className="ml-2 text-gray-600">
                          ({carton.volume.toFixed(1)}L)
                        </span>
                        {carton.palletConfig && (
                          <span className="ml-2 text-indigo-600">
                            (1段{carton.palletConfig.boxesPerLayer}箱×{carton.palletConfig.layers}段)
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 mb-1">
                        <span className="font-medium">最大収容:</span> {Math.floor(carton.capacity / bagsPerSet)}セット ({carton.capacity}袋) | 
                        <span className="font-medium ml-2">実際梱包:</span> {Math.floor(bagsPerBox / bagsPerSet)}セット/箱 ({bagsPerBox}袋)
                      </div>
                      <div className="text-gray-700 font-medium">
                        1箱重量: {totalWeight.toFixed(2)}kg 
                        <span className="text-gray-500 ml-2 text-xs">
                          (段ボール{cartonWeight.toFixed(2)}kg + 商品{(productUnitWeight * bagsPerBox).toFixed(2)}kg)
                        </span>
                      </div>
                      <div className="text-gray-600 mt-1">
                        単価: ¥{carton.price} | 小計: ¥{carton.price * carton.boxCount}
                      </div>
                    </div>
                    
                      <div className="flex flex-col space-y-1 flex-shrink-0">
                      <div className="flex items-center space-x-1">
                        <label className="text-xs text-gray-600 w-10">箱数:</label>
                        <input
                          type="number"
                          min="0"
                          value={carton.boxCount}
                          onChange={(e) => updateBoxCount(index, parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-center space-x-1">
                        <label className="text-xs text-gray-600 w-10">袋/箱:</label>
                        <input
                          type="number"
                          min="0"
                          max={carton.capacity}
                          value={bagsPerBox}
                          onChange={(e) => updateBagsPerBox(index, parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="text-xs font-medium text-indigo-600 text-right">
                        合計: {Math.floor(carton.totalBags / bagsPerSet)}セット ({carton.totalBags}袋)
                      </div>
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
                </div>
              );
            })}
            
            <div className="pt-2 border-t border-indigo-300 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">合計:</span>
                <span className="font-medium text-gray-900">
                  {selectedCartons.reduce((sum, c) => sum + c.boxCount, 0)}箱 / {Math.floor(totalSelected / bagsPerSet)}セット ({totalSelected}袋)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">総重量:</span>
                <span className="font-medium text-gray-900">
                  {selectedCartons.reduce((sum, c) => {
                    const cartonData = cartonsWithCapacity.find(cd => cd.code === c.code);
                    const bagsPerBox = c.bagsPerBox ?? c.capacity;
                    const cartonWeight = c.cartonWeight ?? (cartonData?.cartonWeight || 0.5);
                    const totalWeight = c.totalWeight ?? (cartonWeight + (productUnitWeight * bagsPerBox));
                    return sum + (totalWeight * c.boxCount);
                  }, 0).toFixed(2)}kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">総額:</span>
                <span className="font-medium text-gray-900">
                  ¥{selectedCartons.reduce((sum, c) => sum + c.price * c.boxCount, 0)}
                </span>
              </div>
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
          <div className="text-xs text-gray-600">
            {filteredAndSortedCartons.length}件
            {sortBy === 'recommended' && !searchKeyword.trim() && (
              <span className="ml-2 text-purple-600">(実績優先 → パレット効率順)</span>
            )}
          </div>
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
                  {filteredAndSortedCartons.map((carton, index) => {
                    const totalWeightWithProduct = carton.cartonWeight + (productUnitWeight * carton.capacity);
                    
                    return (
                      <div key={carton.code} className={`p-3 hover:bg-gray-50 ${
                        carton.fbaCompliance.isCompliant ? 'bg-blue-50' : 
                        carton.isRecommended ? 'bg-yellow-50' : ''
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 text-xs min-w-0">
                            <div className="flex items-center space-x-2 mb-1 flex-wrap">
                              <span className="font-medium text-gray-900">{carton.code}</span>
                              {(() => {
                                const historicalDetail = cartonProductMapping[carton.code]?.find(
                                  detail => detail.productName === productName
                                );
                                return historicalDetail && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-200 text-purple-900">
                                    ✓ 実績: {historicalDetail.packingSets}セット({historicalDetail.packingBags}袋)
                                  </span>
                                );
                              })()}
                              {carton.fbaCompliance.isCompliant && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-200 text-blue-900">
                                  FBA/AWD○
                                </span>
                              )}
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
                              <span className="ml-2 text-gray-600">
                                ({carton.volume.toFixed(1)}L)
                              </span>
                              <span className="ml-2 font-medium text-indigo-600">
                                約{Math.floor(carton.capacity / bagsPerSet)}セット入り ({carton.capacity}袋)
                              </span>
                            </div>
                            <div className="text-gray-700 mb-1">
                              <span className="font-medium">1箱重量:</span> {totalWeightWithProduct.toFixed(2)}kg
                              <span className="text-gray-500 ml-2">
                                (段ボール{carton.cartonWeight.toFixed(2)}kg + 商品{(productUnitWeight * carton.capacity).toFixed(2)}kg)
                              </span>
                            </div>
                            {(() => {
                              const historicalDetail = cartonProductMapping[carton.code]?.find(
                                detail => detail.productName === productName
                              );
                              return historicalDetail && (
                                <div className="text-purple-700 mb-1 bg-purple-50 p-2 rounded border border-purple-200">
                                  📦 <span className="font-semibold">{historicalDetail.packingSets}セット（{historicalDetail.packingBags}袋）</span>入れて出荷実績あり
                                  {historicalDetail.palletFit && (
                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      パレットぴったり
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                            {!carton.fbaCompliance.isCompliant && (
                              <div className="text-red-600 mb-1 font-medium">
                                ⚠️ FBA/AWD制約外
                                {!carton.fbaCompliance.sizeOk && ` (最大辺: ${carton.fbaCompliance.maxDimension.toFixed(1)}cm > 63.5cm)`}
                                {!carton.fbaCompliance.weightOk && ` (重量: ${carton.fbaCompliance.totalWeight.toFixed(2)}kg > 23kg)`}
                              </div>
                            )}
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
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

