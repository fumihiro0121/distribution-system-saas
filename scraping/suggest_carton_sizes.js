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

// 段ボールサイズが商品を収容できるかチェック（余裕5mm）
function canFit(cartonDim, requiredDim, margin = 5) {
  if (!cartonDim || !requiredDim) return false;
  
  // 商品の寸法をソート（小さい順）
  const productDims = [requiredDim.length, requiredDim.width, requiredDim.height].sort((a, b) => a - b);
  // 段ボールの寸法をソート（小さい順）
  const cartonDims = [cartonDim.length, cartonDim.width, cartonDim.height].sort((a, b) => a - b);
  
  // 各寸法が収まるかチェック
  return cartonDims[0] >= productDims[0] - margin &&
         cartonDims[1] >= productDims[1] - margin &&
         cartonDims[2] >= productDims[2] - margin;
}

// 体積を計算
function calculateVolume(dim) {
  return dim.length * dim.width * dim.height;
}

// 寸法の無駄スペースを計算
function calculateWastedSpace(cartonDim, requiredDim) {
  const cartonVol = calculateVolume(cartonDim);
  const requiredVol = calculateVolume(requiredDim);
  return cartonVol - requiredVol;
}

async function suggestCartonSizes() {
  console.log('=== 段ボールサイズ提案ツール ===\n');
  
  // 商品データを読み込み
  const productDataPath = path.join(__dirname, 'data', 'product_shipping_data.json');
  const productData = JSON.parse(fs.readFileSync(productDataPath, 'utf-8'));
  
  // 段ボールワンのデータを読み込み
  const cartonDataPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
  const cartonCSV = fs.readFileSync(cartonDataPath, 'utf-8');
  const cartonData = parseCSV(cartonCSV);
  
  console.log(`商品データ: ${productData.length}件`);
  console.log(`段ボールデータ: ${cartonData.length}件\n`);
  
  // 商品ごとに基本製品（1袋セット）を特定し、段ボール提案を作成
  const productFamilies = {};
  
  // 商品を製品ファミリーにグループ化
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
    
    // 過去の出荷実績（段ボールサイズ）を収集
    const shippingHistory = [];
    
    products.forEach(product => {
      if (product['段ボール縦センチ'] && product['段ボール横センチ'] && product['段ボール高さセンチ']) {
        const setCount = product['標準段ボールへの梱包セット数'] || product['商品名'];
        shippingHistory.push({
          product: product['商品名'],
          setCount: setCount,
          dimensions: {
            length: cmToMm(product['段ボール縦センチ']),
            width: cmToMm(product['段ボール横センチ']),
            height: cmToMm(product['段ボール高さセンチ'])
          },
          dimensionsCm: {
            length: product['段ボール縦センチ'],
            width: product['段ボール横センチ'],
            height: product['段ボール高さセンチ']
          }
        });
      }
    });
    
    if (shippingHistory.length > 0) {
      console.log(`過去の出荷実績:`);
      shippingHistory.forEach(history => {
        console.log(`  - ${history.product}`);
        console.log(`    セット数: ${history.setCount}`);
        console.log(`    段ボール: ${history.dimensionsCm.length}cm × ${history.dimensionsCm.width}cm × ${history.dimensionsCm.height}cm\n`);
      });
    }
    
    // 実績のある段ボールサイズから、1袋セット用の段ボールを提案
    console.log(`\n【${singleBagProduct['商品名']} 用の段ボール候補】\n`);
    
    const candidates = new Map(); // 商品番号をキーにして重複を排除
    
    // 過去の実績サイズを候補に追加
    shippingHistory.forEach(history => {
      const targetDim = history.dimensions;
      
      // ダンボールワンのデータから類似サイズを検索
      cartonData.forEach(carton => {
        const cartonDim = parseDimensions(carton['内寸']);
        if (!cartonDim) return;
        
        // 実績サイズと±20mmの範囲で一致するもの
        const lengthDiff = Math.abs(cartonDim.length - targetDim.length);
        const widthDiff = Math.abs(cartonDim.width - targetDim.width);
        const heightDiff = Math.abs(cartonDim.height - targetDim.height);
        
        const productKey = carton['商品番号'];
        
        if (lengthDiff <= 20 && widthDiff <= 20 && heightDiff <= 20) {
          if (!candidates.has(productKey)) {
            candidates.set(productKey, {
              carton: carton,
              matchType: '実績サイズ近似',
              sourceDim: history.dimensionsCm,
              sourceProduct: history.product,
              wastedSpace: 0
            });
          }
        }
      });
    });
    
    // 候補を整理して表示
    const sortedCandidates = Array.from(candidates.values())
      .sort((a, b) => {
        const dimA = parseDimensions(a.carton['内寸']);
        const dimB = parseDimensions(b.carton['内寸']);
        return calculateVolume(dimA) - calculateVolume(dimB);
      })
      .slice(0, 10); // 上位10件
    
    if (sortedCandidates.length > 0) {
      console.log(`見つかった候補: ${sortedCandidates.length}件\n`);
      
      sortedCandidates.forEach((candidate, index) => {
        const carton = candidate.carton;
        const dim = parseDimensions(carton['内寸']);
        
        console.log(`${index + 1}. ${carton['商品名']}`);
        console.log(`   商品番号: ${carton['商品番号']}`);
        console.log(`   内寸: ${carton['内寸']}`);
        console.log(`   宅配サイズ: ${carton['宅配サイズ'] || 'N/A'}`);
        console.log(`   形式: ${carton['形式'] || 'N/A'}`);
        console.log(`   厚み: ${carton['厚み'] || 'N/A'}`);
        console.log(`   マッチ理由: ${candidate.matchType}`);
        console.log(`   参考元: ${candidate.sourceProduct}`);
        console.log(`   参考サイズ: ${candidate.sourceDim.length}cm × ${candidate.sourceDim.width}cm × ${candidate.sourceDim.height}cm`);
        console.log(`   URL: ${carton['URL']}`);
        console.log('');
      });
      
      // 提案データを保存
      suggestions.push({
        productName: singleBagProduct['商品名'],
        baseProduct: baseName,
        sku: singleBagProduct['SKU'],
        janCode: singleBagProduct['JANコード'],
        asin: singleBagProduct['ASIN'],
        weight: singleBagProduct['単品重さ'],
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
          matchType: c.matchType,
          referenceProduct: c.sourceProduct,
          referenceDimensions: `${c.sourceDim.length}cm × ${c.sourceDim.width}cm × ${c.sourceDim.height}cm`
        }))
      });
    } else {
      console.log(`候補が見つかりませんでした。\n`);
    }
  }
  
  // 提案データをJSONとして保存
  const suggestionsPath = path.join(__dirname, 'data', 'carton_size_suggestions.json');
  fs.writeFileSync(suggestionsPath, JSON.stringify(suggestions, null, 2), 'utf-8');
  console.log(`\n${'='.repeat(80)}`);
  console.log(`提案データを保存しました: ${suggestionsPath}`);
  console.log(`${'='.repeat(80)}\n`);
  
  return suggestions;
}

if (require.main === module) {
  suggestCartonSizes().catch(console.error);
}

module.exports = suggestCartonSizes;

