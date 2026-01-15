'use client';

import { useState, useEffect } from 'react';

interface CartonOption {
  cartonCode: string;
  cartonName: string;
  innerDimensions: string;
  deliverySize: string;
  capacity: number;
  isHistorical: boolean;
  priority: number;
  note: string;
  url: string;
}

interface SelectedCarton {
  carton: CartonOption;
  boxCount: number;
  totalBags: number;
}

interface CartonSelectorProps {
  productName: string;
  targetQuantity: number;
  cartonOptions: CartonOption[];
  onSelectionChange?: (selectedCartons: SelectedCarton[], remaining: number) => void;
}

export default function CartonSelector({
  productName,
  targetQuantity,
  cartonOptions,
  onSelectionChange
}: CartonSelectorProps) {
  const [selectedCartons, setSelectedCartons] = useState<SelectedCarton[]>([]);
  const [remaining, setRemaining] = useState(targetQuantity);

  // 残り数量を計算
  useEffect(() => {
    const total = selectedCartons.reduce((sum, sc) => sum + sc.totalBags, 0);
    const newRemaining = targetQuantity - total;
    setRemaining(newRemaining);
    
    if (onSelectionChange) {
      onSelectionChange(selectedCartons, newRemaining);
    }
  }, [selectedCartons, targetQuantity, onSelectionChange]);

  // 段ボールを追加
  const addCarton = (carton: CartonOption, boxCount: number = 1) => {
    const totalBags = carton.capacity * boxCount;
    const newSelected: SelectedCarton = {
      carton,
      boxCount,
      totalBags
    };
    setSelectedCartons([...selectedCartons, newSelected]);
  };

  // 段ボールを削除
  const removeCarton = (index: number) => {
    setSelectedCartons(selectedCartons.filter((_, i) => i !== index));
  };

  // 箱数を変更
  const updateBoxCount = (index: number, newBoxCount: number) => {
    if (newBoxCount < 1) return;
    
    const updated = [...selectedCartons];
    updated[index] = {
      ...updated[index],
      boxCount: newBoxCount,
      totalBags: updated[index].carton.capacity * newBoxCount
    };
    setSelectedCartons(updated);
  };

  // 自動提案を適用
  const applySuggestion = (suggestionType: 'first' | 'optimized') => {
    if (cartonOptions.length === 0) return;
    
    setSelectedCartons([]);
    
    if (suggestionType === 'first') {
      // 第一候補のみで満たす
      const firstCarton = cartonOptions[0];
      const boxCount = Math.ceil(targetQuantity / firstCarton.capacity);
      addCarton(firstCarton, boxCount);
    } else if (suggestionType === 'optimized') {
      // 過剰を最小化
      const firstCarton = cartonOptions[0];
      const secondCarton = cartonOptions[1];
      
      if (!secondCarton) {
        applySuggestion('first');
        return;
      }
      
      let bestCombination = null;
      let minExcess = Infinity;
      
      for (let firstCount = 0; firstCount <= Math.ceil(targetQuantity / firstCarton.capacity); firstCount++) {
        const firstTotal = firstCount * firstCarton.capacity;
        const remaining = targetQuantity - firstTotal;
        
        if (remaining <= 0 && firstCount > 0) {
          const excess = firstTotal - targetQuantity;
          if (excess < minExcess) {
            minExcess = excess;
            bestCombination = { firstCount, secondCount: 0 };
          }
        } else if (remaining > 0) {
          const secondCount = Math.ceil(remaining / secondCarton.capacity);
          const secondTotal = secondCount * secondCarton.capacity;
          const totalBags = firstTotal + secondTotal;
          const excess = totalBags - targetQuantity;
          
          if (excess < minExcess) {
            minExcess = excess;
            bestCombination = { firstCount, secondCount };
          }
        }
      }
      
      if (bestCombination) {
        const newSelected: SelectedCarton[] = [];
        
        if (bestCombination.firstCount > 0) {
          newSelected.push({
            carton: firstCarton,
            boxCount: bestCombination.firstCount,
            totalBags: bestCombination.firstCount * firstCarton.capacity
          });
        }
        
        if (bestCombination.secondCount > 0) {
          newSelected.push({
            carton: secondCarton,
            boxCount: bestCombination.secondCount,
            totalBags: bestCombination.secondCount * secondCarton.capacity
          });
        }
        
        setSelectedCartons(newSelected);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{productName}</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-gray-600">目標数量:</span>
            <span className="ml-2 font-medium text-gray-900">{targetQuantity}袋</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">残り:</span>
            <span className={`ml-2 font-medium ${remaining > 0 ? 'text-red-600' : remaining < 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {remaining}袋
            </span>
          </div>
          {remaining === 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ 完了
            </span>
          )}
        </div>
      </div>

      {/* 自動提案ボタン */}
      <div className="mb-6 flex space-x-3">
        <button
          onClick={() => applySuggestion('first')}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          第一候補で満たす
        </button>
        <button
          onClick={() => applySuggestion('optimized')}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50"
        >
          最適化された組み合わせ
        </button>
        <button
          onClick={() => setSelectedCartons([])}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          クリア
        </button>
      </div>

      {/* 選択中の段ボール */}
      {selectedCartons.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">選択中の段ボール</h4>
          <div className="space-y-3">
            {selectedCartons.map((selected, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{selected.carton.cartonCode}</span>
                    {selected.carton.isHistorical && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        実績あり
                      </span>
                    )}
                    <span className="text-xs text-gray-600">{selected.carton.deliverySize}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {selected.carton.innerDimensions} - {selected.carton.capacity}袋入り
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-600">箱数:</label>
                  <input
                    type="number"
                    min="1"
                    value={selected.boxCount}
                    onChange={(e) => updateBoxCount(index, parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="text-sm font-medium text-indigo-600 w-24 text-right">
                  {selected.totalBags}袋
                </div>

                <button
                  onClick={() => removeCarton(index)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  title="削除"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">合計:</span>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">
                  {selectedCartons.reduce((sum, sc) => sum + sc.boxCount, 0)}箱
                </span>
                <span className="font-medium text-gray-900">
                  {selectedCartons.reduce((sum, sc) => sum + sc.totalBags, 0)}袋
                </span>
                {remaining !== 0 && (
                  <span className={`font-medium ${remaining > 0 ? 'text-red-600' : 'text-orange-600'}`}>
                    ({remaining > 0 ? `不足: ${remaining}袋` : `過剰: ${-remaining}袋`})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 段ボール候補リスト */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">段ボール候補</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {cartonOptions.map((carton, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{carton.cartonCode}</span>
                      {carton.isHistorical && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          実績あり
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        優先度 {carton.priority}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {carton.innerDimensions} - {carton.deliverySize}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium mb-2">
                      {carton.capacity}袋入り - {carton.note}
                    </div>
                    <a
                      href={carton.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      商品ページを開く →
                    </a>
                  </div>

                  <button
                    onClick={() => addCarton(carton, 1)}
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    追加
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

