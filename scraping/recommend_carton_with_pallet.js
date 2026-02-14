const fs = require('fs');
const path = require('path');

class PalletOptimizedCartonRecommender {
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

  // パレット配置情報を抽出（例: "1段8箱×7段" → {boxesPerLayer: 8, layers: 7}）
  parsePalletConfiguration(cartonName) {
    const match = cartonName.match(/1段(\d+)箱×(\d+)段/);
    if (match) {
      return {
        boxesPerLayer: parseInt(match[1]),
        layers: parseInt(match[2]),
        totalBoxes: parseInt(match[1]) * parseInt(match[2])
      };
    }
    return null;
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
    
    // パレット情報を取得
    const isPalletFit = product['パレット'] === 'ぴったり';
    
    return {
      historicalCarton: {
        length: historicalLength,
        width: historicalWidth,
        height: historicalHeight,
        volume: totalVolume
      },
      bagsInHistoricalCarton: totalBags,
      volumePerBag: volumePerBag,
      bagsInSet: bagsInSet,
      isPalletFit: isPalletFit
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
    const baseName = baseProductName.replace(/×\d+袋セット/, '');
    
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
    
    // パレットぴったりの実績を優先
    const palletFitHistorical = allHistoricalData.filter(h => h.unitSpace.isPalletFit);
    const nonPalletFitHistorical = allHistoricalData.filter(h => !h.unitSpace.isPalletFit);
    
    // 最初の実績をメインとして使用
    const unitSpace = allHistoricalData[0].unitSpace;
    
    console.log(`\n商品: ${baseProductName}`);
    console.log(`  実績データ数: ${allHistoricalData.length}件`);
    console.log(`  パレットぴったり実績: ${palletFitHistorical.length}件\n`);
    
    const recommendations = [];
    const addedCartonCodes = new Set();
    
    // 1. パレットぴったりの実績段ボールを最優先
    for (const historicalData of palletFitHistorical) {
      const hist = historicalData.unitSpace;
      
      console.log(`  【パレットぴったり実績】${historicalData.productName}`);
      console.log(`    段ボール: ${hist.historicalCarton.length}×${hist.historicalCarton.width}×${hist.historicalCarton.height}mm`);
      console.log(`    梱包数: ${hist.bagsInHistoricalCarton}袋（${hist.bagsInSet}袋×${hist.bagsInHistoricalCarton / hist.bagsInSet}セット）`);
      
      // cardboard_products_2026-01-14T22-44-17.csvから類似サイズを検索
      const matchingCartons = this.cartons.filter(carton => {
        const dims = this.parseInnerDimensions(carton['内寸']);
        if (!dims) return false;
        
        // 10mm以内の誤差を許容
        const tolerance = 10;
        return Math.abs(dims.length - hist.historicalCarton.length) <= tolerance &&
               Math.abs(dims.width - hist.historicalCarton.width) <= tolerance &&
               Math.abs(dims.height - hist.historicalCarton.height) <= tolerance;
      });
      
      if (matchingCartons.length > 0) {
        for (const carton of matchingCartons.slice(0, 1)) {
          const cartonCode = carton['商品番号'];
          
          if (!addedCartonCodes.has(cartonCode)) {
            addedCartonCodes.add(cartonCode);
            
            const capacityPerBag = hist.bagsInHistoricalCarton / hist.bagsInSet;
            const palletConfig = this.parsePalletConfiguration(carton['商品名']);
            
            recommendations.push({
              cartonCode: cartonCode,
              cartonName: carton['商品名'],
              innerDimensions: carton['内寸'],
              deliverySize: carton['宅配サイズ'],
              thickness: carton['厚み'],
              format: carton['形式'],
              url: carton['URL'],
              capacity: Math.floor(capacityPerBag),
              isPalletFit: true,
              isHistorical: true,
              priority: recommendations.length + 1,
              palletConfiguration: palletConfig,
              note: `【パレットぴったり】実績: ${hist.bagsInHistoricalCarton}袋入り（${hist.bagsInSet}袋セットの場合）`,
              historicalSource: historicalData.productName
            });
            
            console.log(`    ✓ マッチング段ボール: ${cartonCode}`);
            if (palletConfig) {
              console.log(`      パレット配置: 1段${palletConfig.boxesPerLayer}箱×${palletConfig.layers}段 = ${palletConfig.totalBoxes}箱`);
            }
            console.log(`      ${carton['内寸']} - 1袋セット換算で約${Math.floor(capacityPerBag)}袋入り\n`);
          }
        }
      }
    }
    
    // 2. パレットぴったりではない実績段ボールから、cardboard_products_2026-01-14T22-44-17.csvの段ボールを提案
    for (const historicalData of nonPalletFitHistorical) {
      const hist = historicalData.unitSpace;
      
      console.log(`  【実績】${historicalData.productName}`);
      console.log(`    段ボール: ${hist.historicalCarton.length}×${hist.historicalCarton.width}×${hist.historicalCarton.height}mm`);
      console.log(`    梱包数: ${hist.bagsInHistoricalCarton}袋（${hist.bagsInSet}袋×${hist.bagsInHistoricalCarton / hist.bagsInSet}セット）`);
      
      // cardboard_products_2026-01-14T22-44-17.csvから類似容積の段ボールを検索
      const similarCartons = this.cartons.filter(carton => {
        const dims = this.parseInnerDimensions(carton['内寸']);
        if (!dims) return false;
        
        if (addedCartonCodes.has(carton['商品番号'])) {
          return false;
        }
        
        // 容積が実績段ボールの70%〜130%の範囲
        const volume = this.getVolume(dims);
        const historicalVolume = hist.historicalCarton.volume;
        return volume >= historicalVolume * 0.7 && volume <= historicalVolume * 1.3;
      });
      
      // 収容数を計算してソート
      const cartonsWithCapacity = similarCartons.map(carton => {
        const dims = this.parseInnerDimensions(carton['内寸']);
        const capacity = this.calculateCapacity(dims, hist);
        const palletConfig = this.parsePalletConfiguration(carton['商品名']);
        return { carton, dims, capacity, palletConfig };
      }).filter(item => item.capacity > 0);
      
      // 収容数が実績に近い順にソート
      cartonsWithCapacity.sort((a, b) => {
        const targetCapacity = hist.bagsInHistoricalCarton / hist.bagsInSet;
        const diffA = Math.abs(a.capacity - targetCapacity);
        const diffB = Math.abs(b.capacity - targetCapacity);
        return diffA - diffB;
      });
      
      // 上位3つを追加
      for (const item of cartonsWithCapacity.slice(0, 3)) {
        const carton = item.carton;
        const cartonCode = carton['商品番号'];
        
        if (!addedCartonCodes.has(cartonCode)) {
          addedCartonCodes.add(cartonCode);
          
          recommendations.push({
            cartonCode: cartonCode,
            cartonName: carton['商品名'],
            innerDimensions: carton['内寸'],
            deliverySize: carton['宅配サイズ'],
            thickness: carton['厚み'],
            format: carton['形式'],
            url: carton['URL'],
            capacity: item.capacity,
            isPalletFit: true, // cardboard_products_2026-01-14T22-44-17.csvは全てパレットぴったり
            isHistorical: false,
            priority: recommendations.length + 1,
            palletConfiguration: item.palletConfig,
            note: `【パレットぴったり】推定: 約${item.capacity}袋入り（${historicalData.productName}の実績から計算）`,
            historicalSource: historicalData.productName
          });
          
          console.log(`    ✓ 推奨段ボール: ${cartonCode}`);
          if (item.palletConfig) {
            console.log(`      パレット配置: 1段${item.palletConfig.boxesPerLayer}箱×${item.palletConfig.layers}段 = ${item.palletConfig.totalBoxes}箱`);
          }
          console.log(`      ${carton['内寸']} - 推定${item.capacity}袋入り`);
        }
      }
      
      console.log('');
    }
    
    console.log(`  ✓ 合計推奨候補: ${recommendations.length}件\n`);
    
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
    
    // 組み合わせ1: 第一候補（パレットぴったり優先）のみ
    if (recommendations.length > 0) {
      const firstCarton = recommendations[0];
      const boxCount = Math.ceil(targetQuantity / firstCarton.capacity);
      const totalBags = boxCount * firstCarton.capacity;
      
      const palletInfo = firstCarton.palletConfiguration 
        ? `パレット配置: 1段${firstCarton.palletConfiguration.boxesPerLayer}箱×${firstCarton.palletConfiguration.layers}段` 
        : '';
      
      combinations.push({
        name: '第一候補（パレットぴったり優先）のみ',
        cartons: [{
          cartonCode: firstCarton.cartonCode,
          cartonName: firstCarton.cartonName,
          innerDimensions: firstCarton.innerDimensions,
          deliverySize: firstCarton.deliverySize,
          capacity: firstCarton.capacity,
          boxCount: boxCount,
          totalBags: totalBags,
          url: firstCarton.url,
          isPalletFit: firstCarton.isPalletFit,
          palletConfiguration: firstCarton.palletConfiguration,
          palletInfo: palletInfo
        }],
        totalBoxes: boxCount,
        totalBags: totalBags,
        excess: totalBags - targetQuantity
      });
    }
    
    // 組み合わせ2: パレットぴったり段ボールの組み合わせ
    if (recommendations.length >= 2) {
      const firstCarton = recommendations[0];
      const secondCarton = recommendations[1];
      
      // 第一候補を優先的に使用
      const firstBoxCount = Math.floor(targetQuantity * 0.7 / firstCarton.capacity);
      const remainingBags = targetQuantity - (firstBoxCount * firstCarton.capacity);
      const secondBoxCount = Math.ceil(remainingBags / secondCarton.capacity);
      
      const totalBags = (firstBoxCount * firstCarton.capacity) + (secondBoxCount * secondCarton.capacity);
      
      combinations.push({
        name: 'パレットぴったり段ボールの組み合わせ',
        cartons: [
          {
            cartonCode: firstCarton.cartonCode,
            cartonName: firstCarton.cartonName,
            innerDimensions: firstCarton.innerDimensions,
            deliverySize: firstCarton.deliverySize,
            capacity: firstCarton.capacity,
            boxCount: firstBoxCount,
            totalBags: firstBoxCount * firstCarton.capacity,
            url: firstCarton.url,
            isPalletFit: firstCarton.isPalletFit,
            palletConfiguration: firstCarton.palletConfiguration,
            palletInfo: firstCarton.palletConfiguration 
              ? `パレット配置: 1段${firstCarton.palletConfiguration.boxesPerLayer}箱×${firstCarton.palletConfiguration.layers}段` 
              : ''
          },
          {
            cartonCode: secondCarton.cartonCode,
            cartonName: secondCarton.cartonName,
            innerDimensions: secondCarton.innerDimensions,
            deliverySize: secondCarton.deliverySize,
            capacity: secondCarton.capacity,
            boxCount: secondBoxCount,
            totalBags: secondBoxCount * secondCarton.capacity,
            url: secondCarton.url,
            isPalletFit: secondCarton.isPalletFit,
            palletConfiguration: secondCarton.palletConfiguration,
            palletInfo: secondCarton.palletConfiguration 
              ? `パレット配置: 1段${secondCarton.palletConfiguration.boxesPerLayer}箱×${secondCarton.palletConfiguration.layers}段` 
              : ''
          }
        ],
        totalBoxes: firstBoxCount + secondBoxCount,
        totalBags: totalBags,
        excess: totalBags - targetQuantity
      });
    }
    
    // 組み合わせ3: 最適化された組み合わせ（過剰最小化）
    if (recommendations.length >= 2) {
      const firstCarton = recommendations[0];
      const secondCarton = recommendations[1];
      
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
            url: firstCarton.url,
            isPalletFit: firstCarton.isPalletFit,
            palletConfiguration: firstCarton.palletConfiguration,
            palletInfo: firstCarton.palletConfiguration 
              ? `パレット配置: 1段${firstCarton.palletConfiguration.boxesPerLayer}箱×${firstCarton.palletConfiguration.layers}段` 
              : ''
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
            url: secondCarton.url,
            isPalletFit: secondCarton.isPalletFit,
            palletConfiguration: secondCarton.palletConfiguration,
            palletInfo: secondCarton.palletConfiguration 
              ? `パレット配置: 1段${secondCarton.palletConfiguration.boxesPerLayer}箱×${secondCarton.palletConfiguration.layers}段` 
              : ''
          });
        }
        
        combinations.push({
          name: '最適化（過剰最小化）',
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
    console.log('=== パレット最適化段ボールサイズ推奨 ===\n');
    console.log(`目標数量: ${targetQuantity}袋\n`);
    console.log(`優先順位:`);
    console.log(`  1. パレット1100mm×1100mmにぴったり載る実績段ボール`);
    console.log(`  2. パレット1100mm×1100mmにぴったり載る段ボール（実績から推定）\n`);
    
    const results = [];
    const processedBaseNames = new Set();
    
    for (const product of this.products) {
      const baseName = product['商品名'].replace(/×\d+袋セット/, '');
      
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
              if (carton.palletInfo) {
                console.log(`      ${carton.palletInfo}`);
              }
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
    const outputPath = path.join(__dirname, 'data', 'pallet_optimized_recommendations.json');
    const output = {
      targetQuantity: targetQuantity,
      generatedAt: new Date().toISOString(),
      products: results
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n✓ 推奨結果を保存しました: ${outputPath}`);
    
    // CSV形式でも保存
    const csvLines = ['商品名,SKU,段ボールコード,段ボール名,内寸,宅配サイズ,収容数,パレットぴったり,パレット配置,優先度,備考,URL'];
    
    for (const result of results) {
      for (const rec of result.recommendations) {
        const palletConfig = rec.palletConfiguration 
          ? `1段${rec.palletConfiguration.boxesPerLayer}箱×${rec.palletConfiguration.layers}段` 
          : '';
        
        csvLines.push([
          result.productName,
          result.sku,
          rec.cartonCode,
          `"${rec.cartonName}"`,
          rec.innerDimensions,
          rec.deliverySize,
          rec.capacity,
          rec.isPalletFit ? '○' : '',
          palletConfig,
          rec.priority,
          `"${rec.note}"`,
          rec.url
        ].join(','));
      }
    }
    
    const csvPath = path.join(__dirname, 'data', 'pallet_optimized_recommendations.csv');
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
  const recommender = new PalletOptimizedCartonRecommender();
  const targetQuantity = process.argv[2] ? parseInt(process.argv[2]) : 1000;
  recommender.run(targetQuantity);
}

module.exports = PalletOptimizedCartonRecommender;






