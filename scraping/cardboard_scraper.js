const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class CardboardScraper {
  constructor() {
    this.baseUrl = 'https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet';
    this.params = {
      tagIds: '1521%2112%2C13'
    };
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    this.products = [];
  }

  async scrapePage(pageNum) {
    console.log(`ページ ${pageNum} をスクレイピング中...`);
    
    try {
      const url = pageNum === 1 
        ? `${this.baseUrl}?${this.params.tagIds}`
        : `${this.baseUrl}?page=${pageNum}&${this.params.tagIds}`;
      
      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);
      
      // 商品カードを探す（複数の可能性を試す）
      let productCards = $('.product-card');
      if (productCards.length === 0) productCards = $('.item');
      if (productCards.length === 0) productCards = $('.goods-item');
      if (productCards.length === 0) productCards = $('[class*="product"]');
      
      console.log(`  ${productCards.length} 件の商品を発見`);
      
      productCards.each((index, element) => {
        const product = this.extractProductInfo($, element);
        if (product && product['商品名']) {
          this.products.push(product);
        }
      });
      
      return productCards.length > 0;
      
    } catch (error) {
      console.error(`エラー（ページ ${pageNum}）:`, error.message);
      return false;
    }
  }

  extractProductInfo($, card) {
    try {
      const product = {};
      
      // 商品名（複数のセレクタを試す）
      const nameSelectors = ['h3', '.product-name', '.item-name', '[class*="name"]'];
      for (const selector of nameSelectors) {
        const elem = $(card).find(selector).first();
        if (elem.length) {
          product['商品名'] = elem.text().trim();
          break;
        }
      }
      
      // 価格
      const priceSelectors = ['.price', '[class*="price"]', 'span:contains("円")'];
      for (const selector of priceSelectors) {
        const elem = $(card).find(selector).first();
        if (elem.length) {
          product['価格'] = elem.text().trim();
          break;
        }
      }
      
      // 商品番号
      const codeElem = $(card).find(':contains("商品番号")');
      if (codeElem.length) {
        product['商品番号'] = codeElem.next().text().trim() || codeElem.parent().text().replace('商品番号', '').trim();
      }
      
      // 内寸
      const innerElem = $(card).find(':contains("内寸")');
      if (innerElem.length) {
        product['内寸'] = innerElem.next().text().trim() || innerElem.parent().text().replace('内寸', '').trim();
      }
      
      // 外形三辺合計
      const outerElem = $(card).find(':contains("外形三辺合計")');
      if (outerElem.length) {
        product['外形三辺合計'] = outerElem.next().text().trim() || outerElem.parent().text().replace('外形三辺合計', '').trim();
      }
      
      // 厚み
      const thicknessElem = $(card).find(':contains("厚み")');
      if (thicknessElem.length) {
        product['厚み'] = thicknessElem.next().text().trim() || thicknessElem.parent().text().replace('厚み', '').trim();
      }
      
      // 形式
      const formatElem = $(card).find(':contains("形式")');
      if (formatElem.length) {
        product['形式'] = formatElem.next().text().trim() || formatElem.parent().text().replace('形式', '').trim();
      }
      
      // URL
      const link = $(card).find('a[href]').first();
      if (link.length) {
        const href = link.attr('href');
        product['URL'] = href.startsWith('http') ? href : `https://www.notosiki.co.jp${href}`;
      }
      
      return product;
      
    } catch (error) {
      console.error('商品情報抽出エラー:', error.message);
      return null;
    }
  }

  async scrapeAllPages(maxPages = 28) {
    console.log(`\nスクレイピング開始: 最大 ${maxPages} ページ\n`);
    
    for (let page = 1; page <= maxPages; page++) {
      const success = await this.scrapePage(page);
      
      if (!success) {
        console.log(`ページ ${page} で商品が見つからなかったため終了`);
        break;
      }
      
      // サーバーに負荷をかけないように待機
      await this.sleep(1000);
    }
    
    console.log(`\n合計 ${this.products.length} 件の商品を取得しました\n`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
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
      console.log(`   価格: ${this.products[i]['価格']}`);
      console.log(`   商品番号: ${this.products[i]['商品番号']}`);
    }
  }
}

async function main() {
  const scraper = new CardboardScraper();
  
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
      console.log('debug_page_structure.js を実行してページ構造を確認してください。');
    }
    
  } catch (error) {
    console.error('\nエラーが発生しました:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = CardboardScraper;






