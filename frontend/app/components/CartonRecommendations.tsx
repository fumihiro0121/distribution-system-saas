'use client';

import { Product } from '@/data/products';
import { allCartons } from '@/data/all-cartons';
import { 
  calculateCartonRecommendations, 
  CartonRecommendation,
  getSizeTypeLabel,
  getSizeTypeColor
} from '@/utils/carton-calculator';

interface CartonRecommendationsProps {
  product: Product;
  onSelectCarton: (recommendation: CartonRecommendation) => void;
}

export default function CartonRecommendations({ product, onSelectCarton }: CartonRecommendationsProps) {
  // 輸出実績のある段ボールコード（ここではサンプル、実際はAPIから取得）
  const historicalCartonCodes = [
    'MAS140-070',
    'MAS140-121',
    'MA120-302',
    'MA140-070',
    'MA140-121'
  ];
  
  // 推奨段ボールを計算（上位3件）
  const recommendations = calculateCartonRecommendations(
    product,
    allCartons,
    historicalCartonCodes
  ).slice(0, 3);
  
  return (
    <div className="space-y-2">
      
      <div className="space-y-2">
        {recommendations.map((rec, index) => {
          // 段ボールマスタから詳細情報を取得
          const cartonDetail = allCartons.find(c => c.code === rec.code);
          
          // パレット積載実績がある場合は、実績と標準の両方を表示
          const hasLoadingDetails = cartonDetail?.palletLoadingDetails;
          const hasStandardPallet = cartonDetail?.palletConfig;
          
          // 表示するパレット情報のリスト
          const palletOptions: Array<{
            type: 'actual' | 'standard';
            label: string;
            description: string;
            priority: number;
          }> = [];
          
          if (hasLoadingDetails) {
            palletOptions.push({
              type: 'actual',
              label: 'パレット積載実績',
              description: `1段${cartonDetail.palletLoadingDetails!.cartonsPerLayer}箱×${cartonDetail.palletLoadingDetails!.totalLayers}段 / 高さ${cartonDetail.palletLoadingDetails!.heightMm}mm`,
              priority: 1
            });
          }
          
          if (hasStandardPallet && (!hasLoadingDetails || 
              cartonDetail.palletConfig!.boxesPerLayer !== cartonDetail.palletLoadingDetails?.cartonsPerLayer ||
              cartonDetail.palletConfig!.layers !== cartonDetail.palletLoadingDetails?.totalLayers)) {
            palletOptions.push({
              type: 'standard',
              label: 'パレット配置',
              description: `1段${cartonDetail.palletConfig!.boxesPerLayer}箱×${cartonDetail.palletConfig!.layers}段`,
              priority: 2
            });
          }
          
          return (
            <div
              key={rec.code}
              className={`border rounded p-2 ${
                index === 0 ? 'border-green-400 bg-green-50' : 
                index === 1 ? 'border-blue-300 bg-blue-50' :
                'border-gray-200 bg-white'
              }`}
            >
              {/* ヘッダー */}
              <div className="flex items-start gap-2 mb-1">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-gray-300 text-gray-700' :
                  'bg-orange-400 text-orange-900'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900">
                    {rec.name}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    {rec.code}
                  </div>
                  <div className={`inline-block text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 ${getSizeTypeColor(rec.sizeType)}`}>
                    {getSizeTypeLabel(rec.sizeType)}
                  </div>
                </div>
              </div>
              
              {/* 段ボールマスタ情報 */}
              {cartonDetail && (
                <div className="text-xs text-gray-600 space-y-0.5 mt-2 mb-2 p-2 bg-white bg-opacity-50 rounded">
                  <div>📦 {cartonDetail.deliverySize}</div>
                  <div>📏 内寸: {cartonDetail.innerDimensions}</div>
                  <div>3辺合計: {cartonDetail.totalDimensions}</div>
                  {cartonDetail.weight && <div>⚖️ 段ボール重量: {cartonDetail.weight}g</div>}
                  {cartonDetail.price && <div>💰 価格: ¥{cartonDetail.price}</div>}
                </div>
              )}
              
              {/* 梱包情報 */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs mt-1 mb-2">
                <div className="flex justify-between text-gray-600">
                  <span>梱包数:</span>
                  <span className="font-bold text-indigo-600">{rec.capacity}袋</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>総重量:</span>
                  <span className="font-medium">{rec.weight}kg</span>
                </div>
              </div>
              
              {/* パレット情報オプション */}
              {palletOptions.length > 0 && (
                <div className="mt-2 mb-2 border-t border-gray-200 pt-2">
                  <div className="text-xs font-semibold text-gray-700 mb-1">🏗️ パレット積付パターン</div>
                  <div className="space-y-1">
                    {palletOptions.map((option) => (
                      <div key={option.type} className={`text-xs p-1.5 rounded ${
                        option.type === 'actual' ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'
                      }`}>
                        <div className={`font-semibold ${option.type === 'actual' ? 'text-green-800' : 'text-gray-700'}`}>
                          {option.type === 'actual' && '⭐ '}{option.label}
                        </div>
                        <div className="text-gray-600">{option.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 推奨理由 */}
              <div className="mt-2 flex flex-wrap gap-1">
                {rec.reasons.map((reason, i) => (
                  <span
                    key={i}
                    className="text-xs px-1.5 py-0.5 bg-white text-gray-600 rounded border border-gray-200"
                  >
                    {reason}
                  </span>
                ))}
              </div>
              
              {/* 追加ボタン */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCarton(rec);
                }}
                className="w-full mt-2 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-medium"
              >
                ➕ この段ボールで梱包（複数選択可）
              </button>
            </div>
          );
        })}
      </div>
      
      {recommendations.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          推奨段ボールが見つかりませんでした
        </div>
      )}
    </div>
  );
}

