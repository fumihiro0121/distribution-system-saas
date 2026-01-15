const fs = require('fs');
const path = require('path');

// CSVをパース
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1').replace(/^\uFEFF/, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"(.*)"$/, '$1'));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"(.*)"$/, '$1'));
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }
  
  return data;
}

// 内寸からmmを抽出
function parseDimensions(dimensionStr) {
  if (!dimensionStr) return null;
  const match = dimensionStr.match(/(\d+)×(\d+)×(\d+)mm/);
  if (!match) return null;
  return {
    length: parseInt(match[1]),
    width: parseInt(match[2]),
    height: parseInt(match[3])
  };
}

// cmからmmに変換
function cmToMm(cm) {
  return cm * 10;
}

// mmからcmに変換
function mmToCm(mm) {
  return mm / 10;
}

// 体積を計算
function calculateVolume(dim) {
  return dim.length * dim.width * dim.height;
}

// セット数から1袋あたりの寸法を推定
function estimateSingleBagDimensions(cartonDim, bagCount) {
  // 袋を最も効率的に並べる配置を計算
  const volume = calculateVolume(cartonDim);
  const volumePerBag = volume / bagCount;
  
  // 立方根を取って1袋あたりのおおよそのサイズを計算
  const avgDim = Math.pow(volumePerBag, 1/3);
  
  // より現実的な配置を考慮
  // 例: 120袋 → 10×6×2 や 8×8×2 などの配置
  const arrangements = [];
  
  for (let l = 1; l <= bagCount; l++) {
    for (let w = 1; w <= bagCount / l; w++) {
      const h = bagCount / (l * w);
      if (Number.isInteger(h)) {
        arrangements.push({ l, w, h });
      }
    }
  }
  
  // 最も正方形に近い配置を選択
  let bestArrangement = arrangements[0];
  let bestScore = Infinity;
  
  arrangements.forEach(arr => {
    const dims = [arr.l, arr.w, arr.h].sort((a, b) => b - a);
    const score = Math.pow(dims[0] - dims[2], 2); // 最大と最小の差の2乗
    if (score < bestScore) {
      bestScore = score;
      bestArrangement = arr;
    }
  });
  
  if (bestArrangement) {
    return {
      length: Math.floor(cartonDim.length / bestArrangement.l),
      width: Math.floor(cartonDim.width / bestArrangement.w),
      height: Math.floor(cartonDim.height / bestArrangement.h),
      arrangement: `${bestArrangement.l}×${bestArrangement.w}×${bestArrangement.h}`
    };
  }
  
  // デフォルト: 各辺を立方根で割る
  return {
    length: Math.floor(avgDim),
    width: Math.floor(avgDim),
    height: Math.floor(avgDim),
    arrangement: '推定'
  };
}

// 段ボールが商品の個数分を収容できるかチェック
function canFitQuantity(cartonDim, singleBagDim, quantity, margin = 10) {
  if (!cartonDim || !singleBagDim) return false;
  
  // 必要な体積を計算
  const requiredVolume = calculateVolume(singleBagDim) * quantity;
  const cartonVolume = calculateVolume(cartonDim);
  
  // 体積が十分か（効率70%以上）
  const efficiency = requiredVolume / cartonVolume;
  if (efficiency > 1 || efficiency < 0.3) return false;
  
  return true;
}

async function suggestCartonSizesImproved() {
  console.log('=== 段ボールサイズ提案ツール（改善版） ===\n');
  
  // 商品データを読み込み
  const productDataPath = path.join(__dirname, 'data', 'product_shipping_data.json');
  const productData = JSON.parse(fs.readFileSync(productDataPath, 'utf-8'));
  
  // 段ボールワンのデータを読み込み
  const cartonDataPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
  const cartonCSV = fs.readFileSync(cartonDataPath, 'utf-8');
  const cartonData = parseCSV(cartonCSV);
  
  console.log(`商品データ: ${productData.length}件`);
  console.log(`段ボールデータ: ${cartonData.length}件\n`);
  
  // 商品を製品ファミリーにグループ化
  const productFamilies = {};
  
  productData.forEach(product => {
    const baseName = product['商品名'].replace(/×?\d+袋セット$/, '').trim();
    if (!productFamilies[baseName]) {
      productFamilies[baseName] = [];
    }
    productFamilies[baseName].push(product);
  });
  
  const suggestions = [];
  
  // 各製品ファミリーについて処理
  for (const [baseName, products] of Object.entries(productFamilies)) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`製品ファミリー: ${baseName}`);
    console.log(`${'='.repeat(80)}\n`);
    
    // 1袋セットを見つける
    const singleBagProduct = products.find(p => 
      p['商品名'].includes('1袋セット') || p['セット個数'] === '1袋'
    );
    
    if (!singleBagProduct) {
      console.log(`警告: ${baseName} の1袋セットが見つかりません\n`);
      continue;
    }
    
    console.log(`基準製品: ${singleBagProduct['商品名']}`);
    console.log(`  単品重さ: ${singleBagProduct['単品重さ']}`);
    console.log(`  セット個数: ${singleBagProduct['セット個数']}\n`);
    
    // 過去の出荷実績から1袋あたりのサイズを推定
    let estimatedSingleBagDim = null;
    const shippingHistory = [];
    
    products.forEach(product => {
      if (product['段ボール縦センチ'] && product['段ボール横センチ'] && product['段ボール高さセンチ']) {
        const setCountStr = product['標準段ボールへの梱包セット数'];
        const setCount = setCountStr ? parseInt(setCountStr.replace(/[^\d]/g, '')) : 1;
        
        const cartonDim = {
          length: cmToMm(product['段ボール縦センチ']),
          width: cmToMm(product['段ボール横センチ']),
          height: cmToMm(product['段ボール高さセンチ'])
        };
        
        shippingHistory.push({
          product: product['商品名'],
          setCount: setCount,
          dimensions: cartonDim,
          dimensionsCm: {
            length: product['段ボール縦センチ'],
            width: product['段ボール横センチ'],
            height: product['段ボール高さセンチ']
          }
        });
        
        // 1袋あたりのサイズを推定（最も少ないセット数のデータから）
        if (!estimatedSingleBagDim || setCount < estimatedSingleBagDim.sourceSetCount) {
          estimatedSingleBagDim = {
            ...estimateSingleBagDimensions(cartonDim, setCount),
            sourceSetCount: setCount,
            sourceCarton: cartonDim
          };
        }
      }
    });
    
    if (shippingHistory.length > 0) {
      console.log(`過去の出荷実績:`);
      shippingHistory.forEach(history => {
        console.log(`  - ${history.product}`);
        console.log(`    セット数: ${history.setCount}セット`);
        console.log(`    段ボール: ${history.dimensionsCm.length}cm × ${history.dimensionsCm.width}cm × ${history.dimensionsCm.height}cm\n`);
      });
    }
    
    if (estimatedSingleBagDim) {
      console.log(`推定される1袋あたりのサイズ:`);
      console.log(`  ${mmToCm(estimatedSingleBagDim.length).toFixed(1)}cm × ${mmToCm(estimatedSingleBagDim.width).toFixed(1)}cm × ${mmToCm(estimatedSingleBagDim.height).toFixed(1)}cm`);
      console.log(`  (配置: ${estimatedSingleBagDim.arrangement})\n`);
    }
    
    // 1袋、2袋、3袋、5袋、10袋、20袋用の段ボールを提案
    const quantities = [1, 2, 3, 5, 10, 20];
    
    quantities.forEach(qty => {
      console.log(`\n【${qty}袋セット 用の段ボール候補】\n`);
      
      if (!estimatedSingleBagDim) {
        console.log(`  推定サイズが不明なため、候補を提案できません。\n`);
        return;
      }
      
      const candidates = [];
      
      // 必要な最小サイズを計算（1袋サイズ × 数量、余裕20%）
      const minVolume = calculateVolume(estimatedSingleBagDim) * qty * 1.2;
      
      cartonData.forEach(carton => {
        const cartonDim = parseDimensions(carton['内寸']);
        if (!cartonDim) return;
        
        const cartonVolume = calculateVolume(cartonDim);
        
        // 体積チェック: 必要な体積の1.2〜3倍の範囲
        if (cartonVolume < minVolume || cartonVolume > minVolume * 3) return;
        
        // 各辺が1袋サイズ以上であることを確認
        const minSide = Math.min(estimatedSingleBagDim.length, estimatedSingleBagDim.width, estimatedSingleBagDim.height);
        const cartonMinSide = Math.min(cartonDim.length, cartonDim.width, cartonDim.height);
        
        if (cartonMinSide < minSide * 0.8) return;
        
        // 効率を計算
        const efficiency = (calculateVolume(estimatedSingleBagDim) * qty) / cartonVolume;
        
        // 過去の実績サイズとの類似度を計算
        let similarityScore = 0;
        shippingHistory.forEach(history => {
          const histDim = history.dimensions;
          const dimDiff = Math.abs(cartonDim.length - histDim.length) +
                         Math.abs(cartonDim.width - histDim.width) +
                         Math.abs(cartonDim.height - histDim.height);
          const similarity = 1 / (1 + dimDiff / 1000); // 距離を類似度に変換
          similarityScore = Math.max(similarityScore, similarity);
        });
        
        candidates.push({
          carton: carton,
          efficiency: efficiency,
          volume: cartonVolume,
          wastedSpace: cartonVolume - (calculateVolume(estimatedSingleBagDim) * qty),
          similarityScore: similarityScore
        });
      });
      
      // 候補を効率順にソート
      const sortedCandidates = candidates
        .sort((a, b) => {
          // 類似度が高い（0.8以上）ものを優先
          if (a.similarityScore >= 0.8 && b.similarityScore < 0.8) return -1;
          if (a.similarityScore < 0.8 && b.similarityScore >= 0.8) return 1;
          
          // 効率の良いものを優先（0.5〜0.8が理想）
          const aEffScore = 1 - Math.abs(a.efficiency - 0.65);
          const bEffScore = 1 - Math.abs(b.efficiency - 0.65);
          return bEffScore - aEffScore;
        })
        .slice(0, 5); // 上位5件
      
      if (sortedCandidates.length > 0) {
        console.log(`  見つかった候補: ${sortedCandidates.length}件\n`);
        
        sortedCandidates.forEach((candidate, index) => {
          const carton = candidate.carton;
          const matchType = candidate.similarityScore >= 0.8 ? '実績サイズ近似' : '体積・効率最適';
          
          console.log(`  ${index + 1}. ${carton['商品名'].substring(0, 80)}...`);
          console.log(`     商品番号: ${carton['商品番号']}`);
          console.log(`     内寸: ${carton['内寸']}`);
          console.log(`     宅配サイズ: ${carton['宅配サイズ'] || 'N/A'}`);
          console.log(`     形式: ${carton['形式'] || 'N/A'}`);
          console.log(`     厚み: ${carton['厚み'] || 'N/A'}`);
          console.log(`     効率: ${(candidate.efficiency * 100).toFixed(1)}% (理想: 50-80%)`);
          console.log(`     マッチ理由: ${matchType}`);
          console.log(`     類似度スコア: ${(candidate.similarityScore * 100).toFixed(0)}%`);
          console.log(`     URL: ${carton['URL']}`);
          console.log('');
        });
        
        // 最初の候補のみ保存
        if (!suggestions.find(s => s.productName === singleBagProduct['商品名'] && s.quantity === qty)) {
          suggestions.push({
            productName: singleBagProduct['商品名'],
            baseProduct: baseName,
            quantity: qty,
            sku: singleBagProduct['SKU'],
            janCode: singleBagProduct['JANコード'],
            asin: singleBagProduct['ASIN'],
            weight: singleBagProduct['単品重さ'],
            estimatedSingleBagDimensions: estimatedSingleBagDim ? {
              length: mmToCm(estimatedSingleBagDim.length),
              width: mmToCm(estimatedSingleBagDim.width),
              height: mmToCm(estimatedSingleBagDim.height),
              arrangement: estimatedSingleBagDim.arrangement
            } : null,
            shippingHistory: shippingHistory.map(h => ({
              product: h.product,
              setCount: h.setCount,
              dimensions: `${h.dimensionsCm.length}cm × ${h.dimensionsCm.width}cm × ${h.dimensionsCm.height}cm`
            })),
            suggestedCartons: sortedCandidates.map(c => ({
              productNumber: c.carton['商品番号'],
              productName: c.carton['商品名'],
              innerDimensions: c.carton['内寸'],
              deliverySize: c.carton['宅配サイズ'],
              format: c.carton['形式'],
              thickness: c.carton['厚み'],
              url: c.carton['URL'],
              efficiency: `${(c.efficiency * 100).toFixed(1)}%`,
              matchType: c.similarityScore >= 0.8 ? '実績サイズ近似' : '体積・効率最適',
              similarityScore: `${(c.similarityScore * 100).toFixed(0)}%`
            }))
          });
        }
      } else {
        console.log(`  候補が見つかりませんでした。\n`);
      }
    });
  }
  
  // 提案データをJSONとして保存
  const suggestionsPath = path.join(__dirname, 'data', 'carton_size_suggestions_improved.json');
  fs.writeFileSync(suggestionsPath, JSON.stringify(suggestions, null, 2), 'utf-8');
  console.log(`\n${'='.repeat(80)}`);
  console.log(`提案データを保存しました: ${suggestionsPath}`);
  console.log(`合計 ${suggestions.length} 件の提案を作成しました`);
  console.log(`${'='.repeat(80)}\n`);
  
  return suggestions;
}

if (require.main === module) {
  suggestCartonSizesImproved().catch(console.error);
}

module.exports = suggestCartonSizesImproved;

