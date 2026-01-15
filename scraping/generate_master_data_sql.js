const fs = require('fs');
const path = require('path');

class MasterDataGenerator {
  constructor() {
    this.products = [];
    this.cartons = [];
    this.recommendations = [];
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
    const recommendPath = path.join(__dirname, 'data', 'carton_recommendations.json');
    
    this.products = this.loadCSV(productPath);
    this.cartons = this.loadCSV(cartonPath);
    this.recommendations = JSON.parse(fs.readFileSync(recommendPath, 'utf-8'));
    
    console.log(`✓ 商品データ: ${this.products.length}件`);
    console.log(`✓ 段ボールデータ: ${this.cartons.length}件`);
    console.log(`✓ 推奨データ: ${this.recommendations.length}件\n`);
  }

  // 文字列をSQLエスケープ
  sqlEscape(str) {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
  }

  // 数値をSQLフォーマット
  sqlNumber(str) {
    if (!str) return 'NULL';
    const num = parseFloat(str.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 'NULL' : num;
  }

  // 商品マスタのINSERT文を生成
  generateProductMasterSQL() {
    const sqlLines = [];
    
    sqlLines.push('-- 商品マスタ (product_master)');
    sqlLines.push('INSERT INTO product_master (');
    sqlLines.push('  product_name, sku, jan_code, asin, fnsku, hs_code,');
    sqlLines.push('  supplier, unit_weight, unit_weight_lb,');
    sqlLines.push('  standard_box_quantity, category');
    sqlLines.push(') VALUES');
    
    const values = [];
    
    for (const product of this.products) {
      // 商品名から袋数を抽出
      const productName = product['商品名'];
      const setMatch = productName.match(/×(\d+)袋セット/);
      const setsInProduct = setMatch ? parseInt(setMatch[1]) : 1;
      
      // セット重量から単位重量を計算
      let unitWeight = this.sqlNumber(product['単品重さ']);
      if (unitWeight === 'NULL') {
        const setWeight = parseFloat(product['セット重さ'].replace(/[^\d.]/g, ''));
        if (!isNaN(setWeight) && setsInProduct > 0) {
          unitWeight = (setWeight / setsInProduct).toFixed(3);
        }
      }
      
      // ポンド換算
      let unitWeightLb = 'NULL';
      if (unitWeight !== 'NULL') {
        unitWeightLb = (parseFloat(unitWeight) * 2.20462).toFixed(3);
      }
      
      // 標準箱入数
      const standardBoxQty = this.sqlNumber(product['標準段ボールへの梱包セット数']);
      
      // カテゴリを商品名から推測
      let category = '食品';
      if (productName.includes('ヨーグルト') || productName.includes('甘酒') || productName.includes('麹')) {
        category = '発酵食品';
      } else if (productName.includes('きな粉') || productName.includes('ゴマ')) {
        category = '粉末食品';
      }
      
      values.push(`(
    ${this.sqlEscape(productName)}, ${this.sqlEscape(product['SKU'])}, ${this.sqlEscape(product['JANコード'])},
    ${this.sqlEscape(product['ASIN'])}, ${this.sqlEscape(product['FNSKU'])}, ${this.sqlEscape(product['HSコード'])},
    ${this.sqlEscape(product['仕入先'])}, ${unitWeight}, ${unitWeightLb},
    ${standardBoxQty}, ${this.sqlEscape(category)}
  )`);
    }
    
    sqlLines.push(values.join(',\n') + ';');
    sqlLines.push('');
    
    return sqlLines.join('\n');
  }

  // 段ボールサイズマスタのINSERT文を生成
  generateCartonMasterSQL() {
    const sqlLines = [];
    
    sqlLines.push('-- 段ボールサイズマスタ (carton_size_master)');
    sqlLines.push('INSERT INTO carton_size_master (');
    sqlLines.push('  carton_code, carton_name, supplier,');
    sqlLines.push('  inner_length_mm, inner_width_mm, inner_height_mm,');
    sqlLines.push('  outer_total_cm, thickness, material_type,');
    sqlLines.push('  delivery_size, product_url, unit_price, currency');
    sqlLines.push(') VALUES');
    
    const values = [];
    const addedCodes = new Set();
    
    // 推奨されている段ボールのみを追加
    for (const rec of this.recommendations) {
      for (const recData of rec.recommendations) {
        for (const carton of recData.cartons) {
          const cartonCode = carton.productNumber;
          if (addedCodes.has(cartonCode)) continue;
          addedCodes.add(cartonCode);
          
          // 元の段ボールデータを検索
          const fullCarton = this.cartons.find(c => c['商品番号'] === cartonCode);
          if (!fullCarton) continue;
          
          // 内寸をパース
          const dims = fullCarton['内寸'];
          const match = dims.match(/(\d+)×(\d+)×(\d+)/);
          if (!match) continue;
          
          const length = parseInt(match[1]);
          const width = parseInt(match[2]);
          const height = parseInt(match[3]);
          
          // 外形三辺合計
          const outerTotal = fullCarton['外形三辺合計']?.replace('cm', '') || 'NULL';
          
          values.push(`(
    ${this.sqlEscape(cartonCode)}, ${this.sqlEscape(fullCarton['商品名'])}, 'ダンボールワン',
    ${length}, ${width}, ${height},
    ${this.sqlNumber(outerTotal)}, ${this.sqlEscape(fullCarton['厚み'])}, ${this.sqlEscape(fullCarton['形式'])},
    ${this.sqlEscape(fullCarton['宅配サイズ'])}, ${this.sqlEscape(fullCarton['URL'])}, NULL, 'JPY'
  )`);
        }
      }
    }
    
    sqlLines.push(values.join(',\n') + ';');
    sqlLines.push('');
    
    return sqlLines.join('\n');
  }

  // 商品段ボール推奨マッピングのINSERT文を生成
  generateProductCartonMappingSQL() {
    const sqlLines = [];
    
    sqlLines.push('-- 商品段ボール推奨マッピング (product_carton_recommendation)');
    sqlLines.push('INSERT INTO product_carton_recommendation (');
    sqlLines.push('  product_id, carton_id, quantity_from, quantity_to,');
    sqlLines.push('  priority, is_historical');
    sqlLines.push(') VALUES');
    
    const values = [];
    
    for (let prodIdx = 0; prodIdx < this.recommendations.length; prodIdx++) {
      const rec = this.recommendations[prodIdx];
      const productId = prodIdx + 1; // 仮のID（実際は商品マスタのIDを使用）
      
      for (const recData of rec.recommendations) {
        const quantity = recData.quantity;
        const sets = recData.sets;
        
        // 数量範囲を計算
        let quantityFrom = quantity;
        let quantityTo = quantity;
        
        // 範囲を設定（例: 10袋の場合は8-12袋）
        if (quantity > 1) {
          quantityFrom = Math.max(1, Math.floor(quantity * 0.8));
          quantityTo = Math.ceil(quantity * 1.2);
        }
        
        for (let i = 0; i < Math.min(3, recData.cartons.length); i++) {
          const carton = recData.cartons[i];
          const cartonId = `(SELECT id FROM carton_size_master WHERE carton_code = ${this.sqlEscape(carton.productNumber)} LIMIT 1)`;
          const priority = i + 1;
          const isHistorical = carton.isHistorical ? 'TRUE' : 'FALSE';
          
          values.push(`(
    ${productId}, ${cartonId}, ${quantityFrom}, ${quantityTo},
    ${priority}, ${isHistorical}
  )`);
        }
      }
    }
    
    sqlLines.push(values.join(',\n') + ';');
    sqlLines.push('');
    
    return sqlLines.join('\n');
  }

  // すべてのSQLを生成
  generateSQL() {
    const sqlLines = [];
    
    sqlLines.push('-- ========================================');
    sqlLines.push('-- 商品マスタと段ボールサイズマスタの更新');
    sqlLines.push('-- 生成日時: ' + new Date().toISOString());
    sqlLines.push('-- ========================================');
    sqlLines.push('');
    
    // 既存データの削除（オプション）
    sqlLines.push('-- 既存データをクリア（必要に応じてコメント解除）');
    sqlLines.push('-- DELETE FROM product_carton_recommendation;');
    sqlLines.push('-- DELETE FROM product_master;');
    sqlLines.push('-- DELETE FROM carton_size_master;');
    sqlLines.push('');
    
    // 商品マスタ
    sqlLines.push(this.generateProductMasterSQL());
    
    // 段ボールサイズマスタ
    sqlLines.push(this.generateCartonMasterSQL());
    
    // 推奨マッピング
    sqlLines.push(this.generateProductCartonMappingSQL());
    
    return sqlLines.join('\n');
  }

  // SQLファイルとして保存
  save() {
    const sql = this.generateSQL();
    
    const outputPath = path.join(__dirname, 'data', 'master_data_insert.sql');
    fs.writeFileSync(outputPath, sql, 'utf-8');
    
    console.log(`✓ SQLファイルを生成しました: ${outputPath}`);
    console.log(`  商品数: ${this.products.length}`);
    console.log(`  段ボールサイズ数: ${this.cartons.length}`);
    console.log(`  推奨マッピング数: ${this.recommendations.reduce((sum, r) => sum + r.recommendations.length * 3, 0)}\n`);
    
    return outputPath;
  }

  run() {
    console.log('=== マスタデータSQL生成 ===\n');
    this.load();
    this.save();
    console.log('完了しました！');
  }
}

if (require.main === module) {
  const generator = new MasterDataGenerator();
  generator.run();
}

module.exports = MasterDataGenerator;

