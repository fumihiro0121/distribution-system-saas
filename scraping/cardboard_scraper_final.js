const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class CardboardScraperFinal {
  constructor() {
    this.baseUrl = 'https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet?tagIds=1521%2112%2C13';
    this.products = [];
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('ブラウザを起動中...\n');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // ビューポートを設定
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // User-Agentを設定
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  }

  async scrapePage(pageNum) {
    console.log(`ページ ${pageNum} をスクレイピング中...`);
    
    try {
      const url = pageNum === 1 
        ? this.baseUrl
        : `${this.baseUrl}&page=${pageNum}`;
      
      console.log(`  URL: ${url}`);
      
      // ページに移動
      await this.page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // コンテンツが読み込まれるまで待機
      await this.page.waitForTimeout(3000);
      
      // /item/detail へのリンクを持つ要素を探す
      const linkSelector = 'a[href*="/item/detail"]';
      
      try {
        await this.page.waitForSelector(linkSelector, { timeout: 5000 });
      } catch (e) {
        console.log('  商品リンクが見つかりませんでした');
        return false;
      }
      
      // ページ上の商品情報を抽出
      const pageProducts = await this.page.evaluate(() => {
        const products = [];
        const productLinks = document.querySelectorAll('a[href*="/item/detail"]');
        
        // 商品番号をキーにして重複を排除
        const productMap = new Map();
        
        productLinks.forEach(link => {
          try {
            const href = link.href;
            const match = href.match(/num=([^&]+)/);
            if (!match) return;
            
            const productNumber = match[1];
            
            // すでに処理した商品番号はスキップ
            if (productMap.has(productNumber)) return;
            
            const text = link.innerText.trim();
            
            // 商品名らしいテキスト（長いもの）を取得
            if (text.length > 10 && text !== 'ダンボール箱') {
              const product = {
                '商品番号': productNumber,
                '商品名': text,
                'URL': href
              };
              
              // 親要素から価格を探す
              let parent = link;
              for (let i = 0; i < 5; i++) {
                parent = parent.parentElement;
                if (!parent) break;
                
                const priceElem = parent.querySelector('*');
                if (priceElem) {
                  const priceText = parent.innerText;
                  // 価格を抽出
                  const priceMatch = priceText.match(/(\d{1,3}(?:,\d{3})*)\s*円/);
                  if (priceMatch) {
                    product['価格'] = priceMatch[0];
                  }
                }
              }
              
              // 商品名から情報を抽出
              // 内寸 例: （450×300×230mm）
              const innerMatch = text.match(/（(\d+×\d+×\d+mm)）/);
              if (innerMatch) {
                product['内寸'] = innerMatch[1];
              }
              
              // 宅配サイズ 例: 【宅配120サイズ】
              const deliverySizeMatch = text.match(/【宅配(\d+)サイズ】/);
              if (deliverySizeMatch) {
                product['宅配サイズ'] = `宅配${deliverySizeMatch[1]}サイズ`;
                product['外形三辺合計'] = `${deliverySizeMatch[1]}cm`;
              }
              
              // 厚み 例: 5mm A/F
              const thicknessMatch = text.match(/(\d+mm\s+[A-Z]\/[A-Z])/);
              if (thicknessMatch) {
                product['厚み'] = thicknessMatch[1];
              }
              
              // 形式 例: K5×K5, C5×C5
              const formatMatch = text.match(/([A-Z]\d+×[A-Z]\d+|[A-Z]\d+×強化芯\d+g×[A-Z]\d+)/);
              if (formatMatch) {
                product['形式'] = formatMatch[1];
              }
              
              // パレット配置 例: ［1段8箱×7段］
              const palletMatch = text.match(/［1段(\d+)箱×(\d+)段］/);
              if (palletMatch) {
                product['パレット配置'] = `1段${palletMatch[1]}箱×${palletMatch[2]}段`;
              }
              
              productMap.set(productNumber, product);
            }
          } catch (e) {
            console.error('商品抽出エラー:', e);
          }
        });
        
        return Array.from(productMap.values());
      });
      
      console.log(`  ${pageProducts.length} 件の商品を取得`);
      
      if (pageProducts.length > 0) {
        // 最初の商品を表示
        console.log(`  例: ${pageProducts[0]['商品番号']} - ${pageProducts[0]['商品名']?.substring(0, 50)}...`);
      }
      
      this.products.push(...pageProducts);
      
      return pageProducts.length > 0;
      
    } catch (error) {
      console.error(`エラー（ページ ${pageNum}）:`, error.message);
      return false;
    }
  }

  async scrapeAllPages(maxPages = 28) {
    console.log(`\nスクレイピング開始: 最大 ${maxPages} ページ\n`);
    
    await this.initialize();
    
    for (let page = 1; page <= maxPages; page++) {
      const success = await this.scrapePage(page);
      
      if (!success && page === 1) {
        console.log('\n1ページ目で商品が見つかりませんでした。');
        break;
      }
      
      if (!success) {
        console.log(`\nページ ${page} で商品が見つからなかったため終了`);
        break;
      }
      
      // サーバーに負荷をかけないように待機
      await this.page.waitForTimeout(1500);
    }
    
    await this.close();
    
    console.log(`\n合計 ${this.products.length} 件の商品を取得しました\n`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  saveToCSV(filename) {
    if (this.products.length === 0) {
      console.log('保存する商品データがありません');
      return null;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filepath = filename || path.join(__dirname, 'data', `cardboard_products_${timestamp}.csv`);
    
    // CSVヘッダー
    const headers = ['商品番号', '商品名', '宅配サイズ', '内寸', '外形三辺合計', '厚み', '形式', 'パレット配置', '価格', 'URL'];
    
    // CSVデータ
    let csv = headers.join(',') + '\n';
    
    for (const product of this.products) {
      const row = headers.map(header => {
        const value = product[header] || '';
        // カンマやダブルクォート、改行を含む場合はエスケープ
        return value.includes(',') || value.includes('"') || value.includes('\n')
          ? `"${value.replace(/"/g, '""').replace(/\n/g, ' ')}"` 
          : value;
      });
      csv += row.join(',') + '\n';
    }
    
    fs.writeFileSync(filepath, '\uFEFF' + csv, 'utf-8'); // BOM付きUTF-8
    console.log(`CSVファイルに保存しました: ${filepath}`);
    return filepath;
  }

  saveToJSON(filename) {
    if (this.products.length === 0) {
      console.log('保存する商品データがありません');
      return null;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filepath = filename || path.join(__dirname, 'data', `cardboard_products_${timestamp}.json`);
    
    fs.writeFileSync(filepath, JSON.stringify(this.products, null, 2), 'utf-8');
    console.log(`JSONファイルに保存しました: ${filepath}`);
    return filepath;
  }

  printSummary() {
    if (this.products.length === 0) {
      console.log('\n警告: 商品データが取得できませんでした');
      return;
    }
    
    console.log('\n=== データサマリー ===');
    console.log(`取得した商品数: ${this.products.length}`);
    console.log('\n最初の5件:');
    
    for (let i = 0; i < Math.min(5, this.products.length); i++) {
      console.log(`\n${i + 1}. ${this.products[i]['商品名']}`);
      console.log(`   商品番号: ${this.products[i]['商品番号']}`);
      console.log(`   宅配サイズ: ${this.products[i]['宅配サイズ'] || 'N/A'}`);
      console.log(`   内寸: ${this.products[i]['内寸'] || 'N/A'}`);
      console.log(`   価格: ${this.products[i]['価格'] || 'N/A'}`);
    }
    
    // 宅配サイズごとの集計
    const sizeCount = {};
    this.products.forEach(product => {
      const size = product['宅配サイズ'] || '不明';
      sizeCount[size] = (sizeCount[size] || 0) + 1;
    });
    
    console.log('\n宅配サイズ別の商品数:');
    Object.keys(sizeCount).sort().forEach(size => {
      console.log(`  ${size}: ${sizeCount[size]}件`);
    });
  }
}

async function main() {
  const scraper = new CardboardScraperFinal();
  
  try {
    // 全ページをスクレイピング
    await scraper.scrapeAllPages(28);
    
    // データを保存
    if (scraper.products.length > 0) {
      scraper.saveToCSV();
      scraper.saveToJSON();
      scraper.printSummary();
    } else {
      console.log('\n商品データが取得できませんでした。');
    }
    
  } catch (error) {
    console.error('\nエラーが発生しました:', error.message);
    await scraper.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = CardboardScraperFinal;






