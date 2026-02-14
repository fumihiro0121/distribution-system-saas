const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class CardboardScraperPuppeteer {
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
      
      // コンテンツが読み込まれるまで少し待機
      await this.page.waitForTimeout(2000);
      
      // 商品要素を待機（複数のセレクタを試す）
      let productsFound = false;
      const selectors = [
        '[class*="product"]',
        '[class*="item"]',
        '[class*="goods"]',
        '[class*="card"]',
        'article',
        '[data-product-id]'
      ];
      
      for (const selector of selectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          productsFound = true;
          console.log(`  セレクタ "${selector}" で要素が見つかりました`);
          break;
        } catch (e) {
          // 次のセレクタを試す
        }
      }
      
      if (!productsFound) {
        console.log('  商品要素が見つかりませんでした');
        
        // スクリーンショットを保存してデバッグ
        const screenshotPath = path.join(__dirname, 'data', `page${pageNum}_screenshot.png`);
        await this.page.screenshot({ path: screenshotPath });
        console.log(`  スクリーンショットを保存: ${screenshotPath}`);
        
        return false;
      }
      
      // ページ上の商品情報を抽出
      const pageProducts = await this.page.evaluate(() => {
        const products = [];
        
        // 可能な商品コンテナを検索
        const containers = document.querySelectorAll('[class*="product"], [class*="item"], [class*="goods"], article');
        
        containers.forEach(container => {
          try {
            const product = {};
            
            // 商品名
            const nameElem = container.querySelector('h1, h2, h3, h4, [class*="name"], [class*="title"]');
            if (nameElem) {
              product['商品名'] = nameElem.innerText.trim();
            }
            
            // 価格
            const priceElem = container.querySelector('[class*="price"]');
            if (priceElem) {
              product['価格'] = priceElem.innerText.trim();
            }
            
            // テキストから情報を抽出
            const text = container.innerText;
            
            // 商品番号
            const codeMatch = text.match(/([A-Z]{2,3}\d+-\d+)/);
            if (codeMatch) {
              product['商品番号'] = codeMatch[1];
            }
            
            // 内寸
            const innerMatch = text.match(/(\d+×\d+×\d+mm)/);
            if (innerMatch) {
              product['内寸'] = innerMatch[1];
            }
            
            // 外形三辺合計
            const outerMatch = text.match(/(\d+cm)/);
            if (outerMatch) {
              product['外形三辺合計'] = outerMatch[1];
            }
            
            // 厚み
            const thicknessMatch = text.match(/(\d+mm [A-Z]\/[A-Z])/);
            if (thicknessMatch) {
              product['厚み'] = thicknessMatch[1];
            }
            
            // 形式
            const formatMatch = text.match(/([A-Z]式)/);
            if (formatMatch) {
              product['形式'] = formatMatch[1];
            }
            
            // URL
            const linkElem = container.querySelector('a[href]');
            if (linkElem) {
              product['URL'] = linkElem.href;
            }
            
            // 商品名が取得できていれば追加
            if (product['商品名']) {
              products.push(product);
            }
          } catch (e) {
            console.error('商品抽出エラー:', e);
          }
        });
        
        return products;
      });
      
      console.log(`  ${pageProducts.length} 件の商品を取得`);
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
        console.log('\n1ページ目で商品が見つかりませんでした。ページ構造が変更された可能性があります。');
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
    const headers = ['商品名', '価格', '商品番号', '内寸', '外形三辺合計', '厚み', '形式', 'URL'];
    
    // CSVデータ
    let csv = headers.join(',') + '\n';
    
    for (const product of this.products) {
      const row = headers.map(header => {
        const value = product[header] || '';
        // カンマやダブルクォートを含む場合はエスケープ
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
    console.log('\n最初の3件:');
    
    for (let i = 0; i < Math.min(3, this.products.length); i++) {
      console.log(`\n${i + 1}. ${this.products[i]['商品名']}`);
      console.log(`   価格: ${this.products[i]['価格'] || 'N/A'}`);
      console.log(`   商品番号: ${this.products[i]['商品番号'] || 'N/A'}`);
      console.log(`   内寸: ${this.products[i]['内寸'] || 'N/A'}`);
    }
  }
}

async function main() {
  const scraper = new CardboardScraperPuppeteer();
  
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
      console.log('スクリーンショットを確認してページの状態を確認してください。');
    }
    
  } catch (error) {
    console.error('\nエラーが発生しました:', error.message);
    await scraper.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = CardboardScraperPuppeteer;






