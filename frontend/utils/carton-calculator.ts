// 段ボール計算・推奨ユーティリティ

import { Product } from '@/data/products';
import { Carton } from '@/data/all-cartons';

// Amazon FBA規定
export const AMAZON_FBA_LIMITS = {
  // 標準サイズ（Standard-size）
  STANDARD: {
    maxLength: 45.72, // cm
    maxWidth: 35.56,  // cm
    maxHeight: 20.32, // cm
    maxWeight: 9.07,  // kg (20ポンド)
    maxGirth: 130,    // cm (length + 2*(width+height))
  },
  // 大型標準サイズ（Large Standard-size）
  LARGE_STANDARD: {
    maxLength: 60.96, // cm
    maxWidth: 45.72,  // cm
    maxHeight: 45.72, // cm
    maxWeight: 9.07,  // kg (20ポンド)
  },
  // 大型（Oversize）
  OVERSIZE: {
    maxWeight: 22.68, // kg (50ポンド)
  }
};

// 段ボールサイズタイプの判定
export type CartonSizeType = 'STANDARD' | 'LARGE_STANDARD' | 'OVERSIZE' | 'OVER_LIMIT';

export function getCartonSizeType(
  length: number, 
  width: number, 
  height: number,
  weight: number
): CartonSizeType {
  // cm → cmの変換（すでにcmの場合）、mmの場合は /10
  const lengthCm = length > 100 ? length / 10 : length;
  const widthCm = width > 100 ? width / 10 : width;
  const heightCm = height > 100 ? height / 10 : height;
  
  // 重量チェック（kg）
  if (weight > AMAZON_FBA_LIMITS.OVERSIZE.maxWeight) {
    return 'OVER_LIMIT';
  }
  
  // 標準サイズチェック
  if (
    lengthCm <= AMAZON_FBA_LIMITS.STANDARD.maxLength &&
    widthCm <= AMAZON_FBA_LIMITS.STANDARD.maxWidth &&
    heightCm <= AMAZON_FBA_LIMITS.STANDARD.maxHeight &&
    weight <= AMAZON_FBA_LIMITS.STANDARD.maxWeight
  ) {
    return 'STANDARD';
  }
  
  // 大型標準サイズチェック
  if (
    lengthCm <= AMAZON_FBA_LIMITS.LARGE_STANDARD.maxLength &&
    widthCm <= AMAZON_FBA_LIMITS.LARGE_STANDARD.maxWidth &&
    heightCm <= AMAZON_FBA_LIMITS.LARGE_STANDARD.maxHeight &&
    weight <= AMAZON_FBA_LIMITS.LARGE_STANDARD.maxWeight
  ) {
    return 'LARGE_STANDARD';
  }
  
  // それ以外は大型
  if (weight <= AMAZON_FBA_LIMITS.OVERSIZE.maxWeight) {
    return 'OVERSIZE';
  }
  
  return 'OVER_LIMIT';
}

// 段ボールに入る商品数を計算（5袋単位で切り捨て）
export function calculateCartonCapacity(
  product: Product,
  cartonInnerLength: number,
  cartonInnerWidth: number,
  cartonInnerHeight: number,
  cartonMaxWeight: number = 15 // kg, デフォルト15kg
): number {
  // 商品の1セットあたりのサイズ情報がある場合
  const productWeight = parseFloat(product.setWeight?.match(/[\d.]+/)?.[0] || '0');
  
  // 標準箱入数がある場合はそれを使用
  if (product.standardBoxQuantity && product.standardBoxQuantity > 0) {
    return product.standardBoxQuantity;
  }
  
  // 重量制限から計算
  let maxByWeight = Math.floor(cartonMaxWeight / productWeight);
  
  // 容積から推定（簡易計算）
  // 1袋あたりの容積を推定: 通常は10cm x 7cm x 3cm程度と仮定
  const estimatedBagVolume = 10 * 7 * 3; // cm³
  const cartonVolume = (cartonInnerLength / 10) * (cartonInnerWidth / 10) * (cartonInnerHeight / 10); // mm³ to cm³
  const maxByVolume = Math.floor(cartonVolume / estimatedBagVolume);
  
  // 重量と容積の少ない方を採用
  const capacity = Math.min(maxByWeight, maxByVolume);
  
  // 5袋単位で切り捨て
  const roundedCapacity = Math.floor(capacity / 5) * 5;
  
  return Math.max(roundedCapacity, 5); // 最低5袋
}

// 段ボール推奨スコアを計算
export interface CartonRecommendation {
  code: string;
  name: string;
  innerDimensions: string;
  deliverySize: string;
  capacity: number;
  weight: number;
  sizeType: CartonSizeType;
  score: number;
  reasons: string[];
  isPalletFit: boolean;
  palletConfig: {
    boxesPerLayer: number;
    layers: number;
    total: number;
  } | null;
  hasHistory: boolean; // 輸出実績あり
}

export function calculateCartonRecommendations(
  product: Product,
  cartons: Carton[],
  historicalCartonCodes: string[] = [] // 輸出実績のある段ボールコード
): CartonRecommendation[] {
  const recommendations: CartonRecommendation[] = [];
  
  cartons.forEach(carton => {
    // 梱包可能数を計算
    const capacity = calculateCartonCapacity(
      product,
      carton.innerLength,
      carton.innerWidth,
      carton.innerHeight,
      15 // 最大重量15kg
    );
    
    // 総重量を計算
    const productWeightPerBag = parseFloat(product.unitWeight?.match(/[\d.]+/)?.[0] || '0');
    const totalWeight = (productWeightPerBag * capacity) + (carton.weight || 500) / 1000; // g to kg
    
    // Amazon FBAサイズタイプを判定
    const sizeType = getCartonSizeType(
      carton.innerLength,
      carton.innerWidth,
      carton.innerHeight,
      totalWeight
    );
    
    // スコアリング
    let score = 0;
    const reasons: string[] = [];
    
    // 1. 輸出実績があるか (+50点)
    const hasHistory = historicalCartonCodes.includes(carton.code);
    if (hasHistory) {
      score += 50;
      reasons.push('✅ 輸出実績あり');
    }
    
    // 2. Amazon FBA標準サイズか (+30点)
    if (sizeType === 'STANDARD') {
      score += 30;
      reasons.push('⭐ FBA標準サイズ');
    } else if (sizeType === 'LARGE_STANDARD') {
      score += 20;
      reasons.push('📦 FBA大型標準');
    } else if (sizeType === 'OVERSIZE') {
      score += 10;
      reasons.push('📦 FBA大型');
    } else {
      score -= 50;
      reasons.push('⚠️ FBA規定超過');
    }
    
    // 3. パレットぴったりか (+20点)
    if (carton.palletConfig && carton.palletConfig.total > 0) {
      score += 20;
      reasons.push('🏗️ パレット効率◎');
    }
    
    // 4. 容量が多いか (容量に応じて0-20点)
    const capacityScore = Math.min(Math.floor(capacity / 10), 20);
    score += capacityScore;
    if (capacity >= 100) {
      reasons.push(`📦 大容量(${capacity}袋)`);
    } else if (capacity >= 50) {
      reasons.push(`📦 中容量(${capacity}袋)`);
    }
    
    // 5. 価格が安いか (価格に応じて減点)
    if (carton.price > 300) {
      score -= 10;
      reasons.push('💰 やや高価');
    }
    
    recommendations.push({
      code: carton.code,
      name: carton.name,
      innerDimensions: `${Math.round(carton.innerLength/10)}×${Math.round(carton.innerWidth/10)}×${Math.round(carton.innerHeight/10)}cm`,
      deliverySize: carton.deliverySize,
      capacity,
      weight: Math.round(totalWeight * 100) / 100,
      sizeType,
      score,
      reasons,
      isPalletFit: !!carton.palletConfig,
      palletConfig: carton.palletConfig,
      hasHistory
    });
  });
  
  // スコア順にソート（降順）
  recommendations.sort((a, b) => b.score - a.score);
  
  return recommendations;
}

// サイズタイプの日本語ラベル
export function getSizeTypeLabel(sizeType: CartonSizeType): string {
  switch (sizeType) {
    case 'STANDARD':
      return 'FBA標準';
    case 'LARGE_STANDARD':
      return 'FBA大型標準';
    case 'OVERSIZE':
      return 'FBA大型';
    case 'OVER_LIMIT':
      return '規定超過';
    default:
      return '不明';
  }
}

// サイズタイプの色
export function getSizeTypeColor(sizeType: CartonSizeType): string {
  switch (sizeType) {
    case 'STANDARD':
      return 'bg-green-100 text-green-800';
    case 'LARGE_STANDARD':
      return 'bg-blue-100 text-blue-800';
    case 'OVERSIZE':
      return 'bg-yellow-100 text-yellow-800';
    case 'OVER_LIMIT':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}




