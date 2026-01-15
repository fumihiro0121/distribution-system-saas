const fs = require('fs');
const path = require('path');

class AdvancedCartonRecommender {
  constructor() {
    this.products = [];
    this.cartons = [];
  }

  // CSVファイルを読み込む
  loadCSV(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.replace(/^\uFEFF/, '').split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    const headers = this.parseCSVLine(lines[0]);
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length > 0) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }
    
    return data;
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  load() {
    const productPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
    const cartonPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
    
    this.products = this.loadCSV(productPath);
    this.cartons = this.loadCSV(cartonPath);
    
    console.log(`✓ 商品データ: ${this.products.length}件`);
    console.log(`✓ 段ボールデータ: ${this.cartons.length}件\n`);
  }

  // センチメートルをミリメートルに変換
  cmToMm(cm) {
    const value = parseFloat(cm.replace('センチ', '').replace('cm', '').trim());
    return isNaN(value) ? 0 : value * 10;
  }

  // 内寸をパース
  parseInnerDimensions(dimStr) {
    if (!dimStr) return null;
    const match = dimStr.match(/(\d+)×(\d+)×(\d+)/);
    if (!match) return null;
    return {
      length: parseInt(match[1]),
      width: parseInt(match[2]),
      height: parseInt(match[3])
    };
  }

  // 2つの段ボールサイズが近いかチェック
  isSimilarSize(dims1, dims2, toleranceMm = 50) {
    if (!dims1 || !dims2) return false;
    
    // 3辺をソート
    const sorted1 = [dims1.length, dims1.width, dims1.height].sort((a, b) => a - b);
    const sorted2 = [dims2.length, dims2.width, dims2.height].sort((a, b) => a - b);
    
    // 各辺の差が許容範囲内か
    return sorted1.every((val, idx) => Math.abs(val - sorted2[idx]) <= toleranceMm);
  }

  // 段ボールの容積を計算
  getVolume(dims) {
    if (!dims) return 0;
    return dims.length * dims.width * dims.height;
  }

  // 実績データから1袋あたりの必要スペースを計算
  calculateUnitSpace(product) {
    const historicalLength = this.cmToMm(product['段ボール縦センチ']);
    const historicalWidth = this.cmToMm(product['段ボール横センチ']);
    const historicalHeight = this.cmToMm(product['段ボール高さセンチ']);
    
    if (!historicalLength || !historicalWidth || !historicalHeight) {
      return null;
    }
    
    // 商品名から袋数を抽出
    const productName = product['商品名'];
    const setMatch = productName.match(/×(\d+)袋セット/);
    const bagsInSet = setMatch ? parseInt(setMatch[1]) : 1;
    
    // 標準梱包セット数を取得
    const standardSetsStr = product['標準段ボールへの梱包セット数'];
    const standardSets = standardSetsStr ? parseInt(standardSetsStr.replace('セット', '')) : 0;
    
    if (!standardSets) return null;
    
    // この段ボールに何袋入ったか計算
    const totalBags = standardSets * bagsInSet;
    
    // 1袋あたりの容積
    const totalVolume = historicalLength * historicalWidth * historicalHeight;
    const volumePerBag = totalVolume / totalBags;
    
    return {
      historicalCarton: {
        length: historicalLength,
        width: historicalWidth,
        height: historicalHeight,
        volume: totalVolume
      },
      bagsInHistoricalCarton: totalBags,
      volumePerBag: volumePerBag,
      bagsInSet: bagsInSet
    };
  }

  // 指定された段ボールに何袋入るか計算
  calculateCapacity(cartonDims, unitSpace, marginPercent = 10) {
    if (!cartonDims || !unitSpace) return 0;
    
    const cartonVolume = this.getVolume(cartonDims);
    const usableVolume = cartonVolume * (100 - marginPercent) / 100;
    
    // 容積ベースで計算
    const capacity = Math.floor(usableVolume / unitSpace.volumePerBag);
    
    return Math.max(1, capacity);
  }

  // 同じベース商品名の全ての実績を取得
  getAllHistoricalData(baseProductName) {
    // ベース商品名を抽出（例: 「黒ゴマアーモンドきな粉150g」）
    const baseName = baseProductName.replace(/×\d+袋セット/, '');
    
    // 同じベース名を持つ全商品を検索
    const relatedProducts = this.products.filter(p => {
      const pBaseName = p['商品名'].replace(/×\d+袋セット/, '');
      return pBaseName === baseName;
    });
    
    const historicalData = [];
    
    for (const prod of relatedProducts) {
      const unitSpace = this.calculateUnitSpace(prod);
      if (unitSpace) {
        historicalData.push({
          productName: prod['商品名'],
          unitSpace: unitSpace
        });
      }
    }
    
    return historicalData;
  }

  // 商品に対する段ボール推奨を生成
  recommendCartonsForProduct(product, targetQuantity = null) {
    const productName = product['商品名'];
    const baseProductName = productName.replace(/×\d+袋セット/, '×1袋セット');
    
    // 同じベース商品名の全実績を取得
    const allHistoricalData = this.getAllHistoricalData(baseProductName);
    
    if (allHistoricalData.length === 0) {
      console.log(`⚠ 実績データが不足しています: ${productName}`);
      return null;
    }
    
    // 最初の実績をメインとして使用
    const unitSpace = allHistoricalData[0].unitSpace;
    
    console.log(`\n商品: ${baseProductName}`);
    console.log(`  実績データ数: ${allHistoricalData.length}件\n`);
    
    const recommendations = [];
    const addedCartonCodes = new Set();
    
    // 1. 全ての実績段ボールと完全一致する段ボールを検索
    for (const historicalData of allHistoricalData) {
      const hist = historicalData.unitSpace;
      
      console.log(`  実績: ${historicalData.productName}`);
      console.log(`    段ボール: ${hist.historicalCarton.length}×${hist.historicalCarton.width}×${hist.historicalCarton.height}mm`);
      console.log(`    梱包数: ${hist.bagsInHistoricalCarton}袋（${hist.bagsInSet}袋×${hist.bagsInHistoricalCarton / hist.bagsInSet}セット）`);
      console.log(`    1袋あたり容積: ${hist.volumePerBag.toFixed(0)}mm³`);
      
      const historicalMatches = this.cartons.filter(carton => {
        const dims = this.parseInnerDimensions(carton['内寸']);
        if (!dims) return false;
        
        // 5mm以内の誤差を許容
        const tolerance = 5;
        return Math.abs(dims.length - hist.historicalCarton.length) <= tolerance &&
               Math.abs(dims.width - hist.historicalCarton.width) <= tolerance &&
               Math.abs(dims.height - hist.historicalCarton.height) <= tolerance;
      });
      
      if (historicalMatches.length > 0) {
        const carton = historicalMatches[0];
        const cartonCode = carton['商品番号'];
        
        if (!addedCartonCodes.has(cartonCode)) {
          addedCartonCodes.add(cartonCode);
          
          // 1袋セット換算での収容数を計算
          const capacityPerBag = hist.bagsInHistoricalCarton / hist.bagsInSet;
          
          recommendations.push({
            cartonCode: cartonCode,
            cartonName: carton['商品名'],
            innerDimensions: carton['内寸'],
            deliverySize: carton['宅配サイズ'],
            thickness: carton['厚み'],
            format: carton['形式'],
            url: carton['URL'],
            capacity: Math.floor(capacityPerBag), // 1袋セット換算
            isHistorical: true,
            priority: recommendations.length + 1,
            note: `実績: ${hist.bagsInHistoricalCarton}袋入り（${hist.bagsInSet}袋セットの場合）`,
            historicalSource: historicalData.productName
          });
          
          console.log(`    ✓ マッチング段ボール: ${cartonCode}`);
          console.log(`      ${carton['内寸']} - 1袋セット換算で約${Math.floor(capacityPerBag)}袋入り\n`);
        }
      }
    }
    
    // 2. 実績段ボールと似たサイズの段ボールを検索（第二候補以降）
    const similarCartonsMap = new Map();
    
    for (const historicalData of allHistoricalData) {
      const hist = historicalData.unitSpace;
      
      const similarCartons = this.cartons.filter(carton => {
        const dims = this.parseInnerDimensions(carton['内寸']);
        if (!dims) return false;
        
        // すでに追加されている場合は除外
        if (addedCartonCodes.has(carton['商品番号'])) {
          return false;
        }
        
        // 容積が実績段ボールの70%〜200%の範囲
        const volume = this.getVolume(dims);
        const historicalVolume = hist.historicalCarton.volume;
        return volume >= historicalVolume * 0.7 && volume <= historicalVolume * 2.0;
      });
      
      // 収容数を計算
      for (const carton of similarCartons) {
        const dims = this.parseInnerDimensions(carton['内寸']);
        const capacity = this.calculateCapacity(dims, hist);
        
        if (capacity > 0) {
          const cartonCode = carton['商品番号'];
          
          // すでに追加されている場合は、より良い推定値を保持
          if (!similarCartonsMap.has(cartonCode) || similarCartonsMap.get(cartonCode).capacity < capacity) {
            similarCartonsMap.set(cartonCode, {
              carton: carton,
              dims: dims,
              capacity: capacity,
              source: historicalData.productName
            });
          }
        }
      }
    }
    
    // 収容数順にソート
    const cartonsWithCapacity = Array.from(similarCartonsMap.values()).sort((a, b) => {
      // 収容数が近いものを優先（最初の実績データの収容数を基準）
      const targetCapacity = unitSpace.bagsInHistoricalCarton / unitSpace.bagsInSet;
      const diffA = Math.abs(a.capacity - targetCapacity);
      const diffB = Math.abs(b.capacity - targetCapacity);
      return diffA - diffB;
    });
    
    // 上位10個を追加
    cartonsWithCapacity.slice(0, 10).forEach((item, index) => {
      const carton = item.carton;
      recommendations.push({
        cartonCode: carton['商品番号'],
        cartonName: carton['商品名'],
        innerDimensions: carton['内寸'],
        deliverySize: carton['宅配サイズ'],
        thickness: carton['厚み'],
        format: carton['形式'],
        url: carton['URL'],
        capacity: item.capacity,
        isHistorical: false,
        priority: recommendations.length + 1,
        note: `推定: 約${item.capacity}袋入り（${item.source}の実績から計算）`
      });
    });
    
    console.log(`  ✓ 類似段ボール候補: ${cartonsWithCapacity.length}件\n`);
    
    // 3. 目標数量が指定されている場合、組み合わせを提案
    let combinations = [];
    if (targetQuantity && recommendations.length > 0) {
      combinations = this.generateCombinations(recommendations, targetQuantity);
    }
    
    return {
      productName: baseProductName,
      sku: product['SKU'],
      unitSpace: unitSpace,
      recommendations: recommendations,
      combinations: combinations
    };
  }

  // 段ボールの組み合わせを生成
  generateCombinations(recommendations, targetQuantity) {
    const combinations = [];
    
    // 組み合わせ1: 第一候補のみ
    if (recommendations.length > 0) {
      const firstCarton = recommendations[0];
      const boxCount = Math.ceil(targetQuantity / firstCarton.capacity);
      const totalBags = boxCount * firstCarton.capacity;
      
      combinations.push({
        name: '第一候補のみ',
        cartons: [{
          cartonCode: firstCarton.cartonCode,
          cartonName: firstCarton.cartonName,
          innerDimensions: firstCarton.innerDimensions,
          deliverySize: firstCarton.deliverySize,
          capacity: firstCarton.capacity,
          boxCount: boxCount,
          totalBags: totalBags,
          url: firstCarton.url
        }],
        totalBoxes: boxCount,
        totalBags: totalBags,
        excess: totalBags - targetQuantity
      });
    }
    
    // 組み合わせ2: 第一候補 + 第二候補
    if (recommendations.length >= 2) {
      const firstCarton = recommendations[0];
      const secondCarton = recommendations[1];
      
      // 第一候補を優先的に使用
      const firstBoxCount = Math.floor(targetQuantity * 0.7 / firstCarton.capacity);
      const remainingBags = targetQuantity - (firstBoxCount * firstCarton.capacity);
      const secondBoxCount = Math.ceil(remainingBags / secondCarton.capacity);
      
      const totalBags = (firstBoxCount * firstCarton.capacity) + (secondBoxCount * secondCarton.capacity);
      
      combinations.push({
        name: '第一候補 + 第二候補',
        cartons: [
          {
            cartonCode: firstCarton.cartonCode,
            cartonName: firstCarton.cartonName,
            innerDimensions: firstCarton.innerDimensions,
            deliverySize: firstCarton.deliverySize,
            capacity: firstCarton.capacity,
            boxCount: firstBoxCount,
            totalBags: firstBoxCount * firstCarton.capacity,
            url: firstCarton.url
          },
          {
            cartonCode: secondCarton.cartonCode,
            cartonName: secondCarton.cartonName,
            innerDimensions: secondCarton.innerDimensions,
            deliverySize: secondCarton.deliverySize,
            capacity: secondCarton.capacity,
            boxCount: secondBoxCount,
            totalBags: secondBoxCount * secondCarton.capacity,
            url: secondCarton.url
          }
        ],
        totalBoxes: firstBoxCount + secondBoxCount,
        totalBags: totalBags,
        excess: totalBags - targetQuantity
      });
    }
    
    // 組み合わせ3: 最適化された組み合わせ
    if (recommendations.length >= 2) {
      const firstCarton = recommendations[0];
      const secondCarton = recommendations[1];
      
      // 過剰を最小化する組み合わせを探す
      let bestCombination = null;
      let minExcess = Infinity;
      
      for (let firstCount = 0; firstCount <= Math.ceil(targetQuantity / firstCarton.capacity); firstCount++) {
        const firstTotal = firstCount * firstCarton.capacity;
        const remaining = targetQuantity - firstTotal;
        
        if (remaining <= 0 && firstCount > 0) {
          const excess = firstTotal - targetQuantity;
          if (excess < minExcess) {
            minExcess = excess;
            bestCombination = {
              firstCount: firstCount,
              secondCount: 0,
              totalBags: firstTotal
            };
          }
        } else if (remaining > 0) {
          const secondCount = Math.ceil(remaining / secondCarton.capacity);
          const secondTotal = secondCount * secondCarton.capacity;
          const totalBags = firstTotal + secondTotal;
          const excess = totalBags - targetQuantity;
          
          if (excess < minExcess) {
            minExcess = excess;
            bestCombination = {
              firstCount: firstCount,
              secondCount: secondCount,
              totalBags: totalBags
            };
          }
        }
      }
      
      if (bestCombination && bestCombination.firstCount + bestCombination.secondCount > 0) {
        const cartons = [];
        
        if (bestCombination.firstCount > 0) {
          cartons.push({
            cartonCode: firstCarton.cartonCode,
            cartonName: firstCarton.cartonName,
            innerDimensions: firstCarton.innerDimensions,
            deliverySize: firstCarton.deliverySize,
            capacity: firstCarton.capacity,
            boxCount: bestCombination.firstCount,
            totalBags: bestCombination.firstCount * firstCarton.capacity,
            url: firstCarton.url
          });
        }
        
        if (bestCombination.secondCount > 0) {
          cartons.push({
            cartonCode: secondCarton.cartonCode,
            cartonName: secondCarton.cartonName,
            innerDimensions: secondCarton.innerDimensions,
            deliverySize: secondCarton.deliverySize,
            capacity: secondCarton.capacity,
            boxCount: bestCombination.secondCount,
            totalBags: bestCombination.secondCount * secondCarton.capacity,
            url: secondCarton.url
          });
        }
        
        combinations.push({
          name: '最適化された組み合わせ',
          cartons: cartons,
          totalBoxes: bestCombination.firstCount + bestCombination.secondCount,
          totalBags: bestCombination.totalBags,
          excess: minExcess
        });
      }
    }
    
    return combinations;
  }

  // すべての商品に対して推奨を生成
  generateAllRecommendations(targetQuantity = 1000) {
    console.log('=== 改良版段ボールサイズ推奨 ===\n');
    console.log(`目標数量: ${targetQuantity}袋\n`);
    
    const results = [];
    const processedBaseNames = new Set();
    
    for (const product of this.products) {
      // ベース商品名を抽出
      const baseName = product['商品名'].replace(/×\d+袋セット/, '');
      
      // すでに処理済みの場合はスキップ
      if (processedBaseNames.has(baseName)) {
        continue;
      }
      
      processedBaseNames.add(baseName);
      
      const result = this.recommendCartonsForProduct(product, targetQuantity);
      if (result) {
        results.push(result);
        
        // 組み合わせを表示
        if (result.combinations.length > 0) {
          console.log(`  【${targetQuantity}袋を送る場合の組み合わせ】`);
          result.combinations.forEach((combo, index) => {
            console.log(`\n  パターン${index + 1}: ${combo.name}`);
            combo.cartons.forEach(carton => {
              console.log(`    - ${carton.cartonCode}: ${carton.capacity}袋入り × ${carton.boxCount}箱 = ${carton.totalBags}袋`);
              console.log(`      ${carton.innerDimensions} (${carton.deliverySize})`);
            });
            console.log(`    合計: ${combo.totalBoxes}箱、${combo.totalBags}袋（過剰: ${combo.excess}袋）`);
          });
          console.log('');
        }
      }
    }
    
    return results;
  }

  // 結果を保存
  saveResults(results, targetQuantity) {
    const outputPath = path.join(__dirname, 'data', 'advanced_carton_recommendations.json');
    const output = {
      targetQuantity: targetQuantity,
      generatedAt: new Date().toISOString(),
      products: results
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n✓ 推奨結果を保存しました: ${outputPath}`);
    
    // CSV形式でも保存
    const csvLines = ['商品名,SKU,段ボールコード,段ボール名,内寸,宅配サイズ,収容数,優先度,備考,URL'];
    
    for (const result of results) {
      for (const rec of result.recommendations) {
        csvLines.push([
          result.productName,
          result.sku,
          rec.cartonCode,
          `"${rec.cartonName}"`,
          rec.innerDimensions,
          rec.deliverySize,
          rec.capacity,
          rec.priority,
          `"${rec.note}"`,
          rec.url
        ].join(','));
      }
    }
    
    const csvPath = path.join(__dirname, 'data', 'advanced_carton_recommendations.csv');
    fs.writeFileSync(csvPath, '\uFEFF' + csvLines.join('\n'), 'utf-8');
    console.log(`✓ CSV形式でも保存しました: ${csvPath}\n`);
  }

  run(targetQuantity = 1000) {
    this.load();
    const results = this.generateAllRecommendations(targetQuantity);
    this.saveResults(results, targetQuantity);
    console.log(`完了しました！`);
  }
}

if (require.main === module) {
  const recommender = new AdvancedCartonRecommender();
  // デフォルトは1000袋
  const targetQuantity = process.argv[2] ? parseInt(process.argv[2]) : 1000;
  recommender.run(targetQuantity);
}

module.exports = AdvancedCartonRecommender;

