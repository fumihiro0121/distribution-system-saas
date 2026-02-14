'use client';

import { useState } from 'react';

interface CartonOption {
  cartonCode: string;
  cartonName: string;
  innerDimensions: string;
  deliverySize: string;
  capacity: number;
  isPalletFit: boolean;
  palletConfiguration: {
    boxesPerLayer: number;
    layers: number;
    totalBoxes: number;
  } | null;
  url: string;
}

interface SelectedCarton {
  cartonCode: string;
  cartonName: string;
  innerDimensions: string;
  deliverySize: string;
  capacity: number;
  boxCount: number;
  totalBags: number;
  isPalletFit: boolean;
  palletConfiguration: {
    boxesPerLayer: number;
    layers: number;
    totalBoxes: number;
  } | null;
}

interface ProductCartonSelectorProps {
  productName: string;
  productId: number;
  targetQuantity: number;
  cartonOptions: CartonOption[];
  selectedCartons: SelectedCarton[];
  onCartonsChange: (cartons: SelectedCarton[]) => void;
}

export default function ProductCartonSelector({
  productName,
  productId,
  targetQuantity,
  cartonOptions,
  selectedCartons,
  onCartonsChange
}: ProductCartonSelectorProps) {
  const [showCartonList, setShowCartonList] = useState(false);

  // 残り数量を計算
  const totalSelected = selectedCartons.reduce((sum, c) => sum + c.totalBags, 0);
  const remaining = targetQuantity - totalSelected;

  // 段ボールを追加
  const addCarton = (carton: CartonOption) => {
    const boxCount = Math.ceil((remaining > 0 ? remaining : targetQuantity) / carton.capacity);
    const newCarton: SelectedCarton = {
      cartonCode: carton.cartonCode,
      cartonName: carton.cartonName,
      innerDimensions: carton.innerDimensions,
      deliverySize: carton.deliverySize,
      capacity: carton.capacity,
      boxCount: boxCount,
      totalBags: boxCount * carton.capacity,
      isPalletFit: carton.isPalletFit,
      palletConfiguration: carton.palletConfiguration
    };
    onCartonsChange([...selectedCartons, newCarton]);
  };

  // 段ボールを削除
  const removeCarton = (index: number) => {
    onCartonsChange(selectedCartons.filter((_, i) => i !== index));
  };

  // 箱数を変更
  const updateBoxCount = (index: number, newBoxCount: number) => {
    if (newBoxCount < 1) return;
    
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
    if (cartonOptions.length === 0) return;
    
    const firstCarton = cartonOptions[0];
    const boxCount = Math.ceil(targetQuantity / firstCarton.capacity);
    
    onCartonsChange([{
      cartonCode: firstCarton.cartonCode,
      cartonName: firstCarton.cartonName,
      innerDimensions: firstCarton.innerDimensions,
      deliverySize: firstCarton.deliverySize,
      capacity: firstCarton.capacity,
      boxCount: boxCount,
      totalBags: boxCount * firstCarton.capacity,
      isPalletFit: firstCarton.isPalletFit,
      palletConfiguration: firstCarton.palletConfiguration
    }]);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-gray-900">段ボール選択</h4>
          <p className="text-xs text-gray-600 mt-1">
            出荷数量: {targetQuantity}袋 | 
            選択済み: {totalSelected}袋 | 
            <span className={remaining > 0 ? 'text-red-600 font-medium' : remaining < 0 ? 'text-orange-600 font-medium' : 'text-green-600 font-medium'}>
              {remaining > 0 ? `不足: ${remaining}袋` : remaining < 0 ? `過剰: ${-remaining}袋` : '完了'}
            </span>
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={applySuggestion}
            className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            自動提案
          </button>
          <button
            type="button"
            onClick={() => setShowCartonList(!showCartonList)}
            className="px-3 py-1 text-xs font-medium text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50"
          >
            {showCartonList ? '候補を隠す' : '候補を表示'}
          </button>
        </div>
      </div>

      {/* 選択された段ボール */}
      {selectedCartons.length > 0 && (
        <div className="space-y-2 mb-3">
          {selectedCartons.map((carton, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-white border border-gray-300 rounded text-xs">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{carton.cartonCode}</span>
                  {carton.isPalletFit && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      パレット○
                    </span>
                  )}
                  <span className="text-gray-600">{carton.deliverySize}</span>
                </div>
                <div className="text-gray-600 mt-0.5">
                  {carton.innerDimensions} - {carton.capacity}袋入り
                  {carton.palletConfiguration && (
                    <span className="ml-2 text-indigo-600">
                      (1段{carton.palletConfiguration.boxesPerLayer}箱×{carton.palletConfiguration.layers}段)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={carton.boxCount}
                  onChange={(e) => updateBoxCount(index, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-xs text-gray-600">箱</span>
              </div>
              
              <div className="text-xs font-medium text-indigo-600 w-16 text-right">
                {carton.totalBags}袋
              </div>
              
              <button
                type="button"
                onClick={() => removeCarton(index)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          <div className="pt-2 border-t border-gray-300 flex justify-between text-xs">
            <span className="text-gray-600">合計:</span>
            <span className="font-medium text-gray-900">
              {selectedCartons.reduce((sum, c) => sum + c.boxCount, 0)}箱 / {totalSelected}袋
            </span>
          </div>
        </div>
      )}

      {/* 段ボール候補リスト */}
      {showCartonList && (
        <div className="border border-gray-300 rounded bg-white">
          <div className="max-h-64 overflow-y-auto">
            {cartonOptions.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                この商品の段ボール候補がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cartonOptions.slice(0, 5).map((carton, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 text-xs">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{carton.cartonCode}</span>
                          {carton.isPalletFit && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              パレット○
                            </span>
                          )}
                          <span className="text-gray-600">{carton.deliverySize}</span>
                        </div>
                        <div className="text-gray-600">
                          {carton.innerDimensions} - {carton.capacity}袋入り
                          {carton.palletConfiguration && (
                            <span className="ml-2 text-indigo-600">
                              (1段{carton.palletConfiguration.boxesPerLayer}箱×{carton.palletConfiguration.layers}段)
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addCarton(carton)}
                        className="ml-2 px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                      >
                        追加
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}






