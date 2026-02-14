const fs = require('fs');
const path = require('path');

class CartonRecommender {
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

  // 商品データを読み込む
  loadProducts() {
    const productPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
    this.products = this.loadCSV(productPath);
    console.log(`✓ 商品データを読み込みました: ${this.products.length}件\n`);
  }

  // 段ボールデータを読み込む
  loadCartons() {
    const cartonPath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');
    this.cartons = this.loadCSV(cartonPath);
    console.log(`✓ 段ボールデータを読み込みました: ${this.cartons.length}件\n`);
  }

  // センチメートルをミリメートルに変換
  cmToMm(cm) {
    const value = parseFloat(cm.replace('センチ', '').replace('cm', '').trim());
    return isNaN(value) ? 0 : value * 10;
  }

  // 内寸をパース（例: "450×300×230mm"）
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

  // 段ボールサイズを提案
  recommendCartons(product) {
    const recommendations = [];
    
    // 実績のある段ボールサイズを取得
    const historicalLength = this.cmToMm(product['段ボール縦センチ']);
    const historicalWidth = this.cmToMm(product['段ボール横センチ']);
    const historicalHeight = this.cmToMm(product['段ボール高さセンチ']);
    
    if (!historicalLength || !historicalWidth || !historicalHeight) {
      return recommendations;
    }
    
    // 商品名から袋数を抽出（例: "黒ゴマアーモンドきな粉150g×10袋セット" → 10袋）
    const productName = product['商品名'];
    const setMatch = productName.match(/×(\d+)袋セット/);
    const setsInProduct = setMatch ? parseInt(setMatch[1]) : 1;
    
    // 標準梱包セット数を取得
    const standardSetsStr = product['標準段ボールへの梱包セット数'];
    const standardSets = standardSetsStr ? parseInt(standardSetsStr.replace('セット', '')) : 0;
    
    console.log(`\n商品: ${productName}`);
    console.log(`  1商品の袋数: ${setsInProduct}袋`);
    console.log(`  実績段ボールサイズ: ${historicalLength}×${historicalWidth}×${historicalHeight}mm`);
    console.log(`  実績梱包セット数: ${standardSets}セット\n`);
    
    // 様々な袋数のパターンで段ボールを提案
    const quantityPatterns = [];
    
    // 1袋セットの場合は、実績の梱包数を基準に提案
    if (setsInProduct === 1 && standardSets > 0) {
      // 実績の梱包数を基準にパターンを生成
      quantityPatterns.push(
        { bags: 1, sets: 1 },
        { bags: 5, sets: 5 },
        { bags: 10, sets: 10 },
        { bags: 20, sets: 20 },
        { bags: 30, sets: 30 },
        { bags: 50, sets: 50 },
        { bags: standardSets, sets: standardSets }
      );
    } else if (setsInProduct > 1) {
      // ○袋セットの商品の場合
      // 実績段ボールは「○袋セット×1個」の場合
      quantityPatterns.push(
        { bags: setsInProduct, sets: 1 },
        { bags: setsInProduct * 2, sets: 2 },
        { bags: setsInProduct * 5, sets: 5 },
        { bags: setsInProduct * 10, sets: 10 }
      );
      
      // 1袋セット換算でも提案
      quantityPatterns.push(
        { bags: 1, sets: 1 / setsInProduct },
        { bags: 5, sets: 5 / setsInProduct },
        { bags: 10, sets: 10 / setsInProduct }
      );
    }
    
    // 重複を除去
    const uniquePatterns = [];
    const seenBags = new Set();
    for (const pattern of quantityPatterns) {
      if (!seenBags.has(pattern.bags) && pattern.bags >= 1) {
        seenBags.add(pattern.bags);
        uniquePatterns.push(pattern);
      }
    }
    
    // 各パターンで段ボールを検索
    for (const pattern of uniquePatterns) {
      const { bags, sets } = pattern;
      
      // 必要な段ボールサイズを計算
      // 実績データから1セットあたりのスペースを計算
      const spacePerSet = {
        length: historicalLength / standardSets,
        width: historicalWidth / standardSets,
        height: historicalHeight / standardSets
      };
      
      // 必要なセット数に応じたサイズを計算（余裕を持たせる）
      const margin = 1.1; // 10%の余裕
      const requiredLength = spacePerSet.length * sets * margin;
      const requiredWidth = spacePerSet.width * sets * margin;
      const requiredHeight = spacePerSet.height * sets * margin;
      
      // 段ボールを検索
      const matchingCartons = this.cartons.filter(carton => {
        const dims = this.parseInnerDimensions(carton['内寸']);
        if (!dims) return false;
        
        // 3辺すべてが収まるか確認（回転も考慮）
        const required = [requiredLength, requiredWidth, requiredHeight].sort((a, b) => a - b);
        const available = [dims.length, dims.width, dims.height].sort((a, b) => a - b);
        
        return required[0] <= available[0] && 
               required[1] <= available[1] && 
               required[2] <= available[2];
      });
      
      // 最適な段ボールを選択（最も小さいもの）
      if (matchingCartons.length > 0) {
        matchingCartons.sort((a, b) => {
          const dimsA = this.parseInnerDimensions(a['内寸']);
          const dimsB = this.parseInnerDimensions(b['内寸']);
          const volumeA = dimsA.length * dimsA.width * dimsA.height;
          const volumeB = dimsB.length * dimsB.width * dimsB.height;
          return volumeA - volumeB;
        });
        
        const topCartons = matchingCartons.slice(0, 3); // 上位3つ
        
        recommendations.push({
          quantity: bags,
          sets: sets,
          cartons: topCartons.map(carton => ({
            productNumber: carton['商品番号'],
            name: carton['商品名'],
            innerDimensions: carton['内寸'],
            deliverySize: carton['宅配サイズ'],
            url: carton['URL']
          }))
        });
      }
    }
    
    // 実績の段ボールサイズと同じものも候補に追加
    const historicalCartons = this.cartons.filter(carton => {
      const dims = this.parseInnerDimensions(carton['内寸']);
      if (!dims) return false;
      
      // 5mm以内の誤差を許容
      const tolerance = 5;
      return Math.abs(dims.length - historicalLength) <= tolerance &&
             Math.abs(dims.width - historicalWidth) <= tolerance &&
             Math.abs(dims.height - historicalHeight) <= tolerance;
    });
    
    if (historicalCartons.length > 0 && setsInProduct === 1) {
      // 1袋セットの場合、実績段ボールを全パターンに追加
      for (const rec of recommendations) {
        for (const historical of historicalCartons) {
          const alreadyIncluded = rec.cartons.some(c => c.productNumber === historical['商品番号']);
          if (!alreadyIncluded) {
            rec.cartons.unshift({
              productNumber: historical['商品番号'],
              name: historical['商品名'],
              innerDimensions: historical['内寸'],
              deliverySize: historical['宅配サイズ'],
              url: historical['URL'],
              isHistorical: true
            });
          }
        }
      }
    }
    
    return recommendations;
  }

  // すべての商品に対して段ボールを提案
  generateRecommendations() {
    console.log('=== 段ボールサイズ提案 ===\n');
    
    const results = [];
    
    for (const product of this.products) {
      const recommendations = this.recommendCartons(product);
      
      if (recommendations.length > 0) {
        results.push({
          product: product['商品名'],
          sku: product['SKU'],
          recommendations: recommendations
        });
        
        console.log(`\n【${product['商品名']}】`);
        for (const rec of recommendations) {
          console.log(`\n  ${rec.quantity}袋（${rec.sets.toFixed(1)}セット）の場合:`);
          rec.cartons.slice(0, 3).forEach((carton, i) => {
            const badge = carton.isHistorical ? ' [実績あり]' : '';
            console.log(`    ${i + 1}. ${carton.productNumber}${badge}`);
            console.log(`       ${carton.deliverySize} - ${carton.innerDimensions}`);
            console.log(`       ${carton.url}`);
          });
        }
      }
    }
    
    return results;
  }

  // 結果をJSONファイルとして保存
  saveRecommendations(results) {
    const outputPath = path.join(__dirname, 'data', 'carton_recommendations.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`\n✓ 提案結果を保存しました: ${outputPath}`);
    
    // CSV形式でも保存
    const csvLines = ['商品名,SKU,袋数,セット数,推奨段ボール1,推奨段ボール2,推奨段ボール3'];
    
    for (const result of results) {
      for (const rec of result.recommendations) {
        const cartonNames = rec.cartons.slice(0, 3).map(c => 
          `${c.productNumber} (${c.innerDimensions})`
        );
        while (cartonNames.length < 3) cartonNames.push('');
        
        csvLines.push([
          result.product,
          result.sku,
          rec.quantity,
          rec.sets.toFixed(1),
          ...cartonNames
        ].map(v => {
          const str = String(v);
          return str.includes(',') ? `"${str}"` : str;
        }).join(','));
      }
    }
    
    const csvPath = path.join(__dirname, 'data', 'carton_recommendations.csv');
    fs.writeFileSync(csvPath, '\uFEFF' + csvLines.join('\n'), 'utf-8');
    console.log(`✓ CSV形式でも保存しました: ${csvPath}\n`);
  }

  run() {
    this.loadProducts();
    this.loadCartons();
    const results = this.generateRecommendations();
    this.saveRecommendations(results);
    
    console.log(`\n合計 ${results.length} 商品に対して段ボールサイズを提案しました。`);
  }
}

if (require.main === module) {
  const recommender = new CartonRecommender();
  recommender.run();
}

module.exports = CartonRecommender;






