const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function debugPageStructure() {
  const url = 'https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet';
  const params = { tagIds: '1521%2112%2C13' };
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };
  
  console.log('ページを取得中...\n');
  
  try {
    const response = await axios.get(`${url}?tagIds=${params.tagIds}`, { headers });
    
    console.log(`✓ ページ取得成功 (ステータスコード: ${response.status})\n`);
    
    const $ = cheerio.load(response.data);
    const html = $.html();
    
    // HTMLをファイルに保存
    const htmlPath = path.join(__dirname, 'data', 'page_structure.html');
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`✓ HTMLを保存しました: ${htmlPath}\n`);
    
    // 商品関連の要素を検索
    console.log('=== 商品関連の要素を検索 ===\n');
    
    const possibleClasses = ['product', 'item', 'card', 'box', 'list', 'goods'];
    
    possibleClasses.forEach(className => {
      const elements = $(`[class*="${className}"]`);
      if (elements.length > 0) {
        console.log(`"${className}" を含むクラス (${elements.length}件):`);
        elements.slice(0, 3).each((i, elem) => {
          console.log(`  - ${$(elem).attr('class')}`);
        });
        console.log('');
      }
    });
    
    // 価格を検索
    console.log('=== 価格情報を検索 ===\n');
    const priceElements = $('*:contains("円")');
    console.log(`"円" を含む要素: ${priceElements.length}件`);
    priceElements.slice(0, 5).each((i, elem) => {
      console.log(`  - ${$(elem).text().trim().substring(0, 50)}...`);
    });
    console.log('');
    
    // 商品名を検索
    console.log('=== 見出しタグを検索 ===\n');
    $('h1, h2, h3, h4').slice(0, 5).each((i, elem) => {
      console.log(`  <${elem.name}>: ${$(elem).text().trim().substring(0, 50)}...`);
    });
    console.log('');
    
    // リンクを検索
    console.log('=== 商品リンクを検索 ===\n');
    const links = $('a[href*="product"], a[href*="item"]');
    console.log(`商品関連のリンク: ${links.length}件`);
    links.slice(0, 5).each((i, elem) => {
      console.log(`  - ${$(elem).attr('href')}`);
    });
    console.log('');
    
    // ページネーション
    console.log('=== ページネーション情報 ===\n');
    const pagination = $('[class*="page"], [class*="pagination"]');
    if (pagination.length > 0) {
      console.log(`ページネーション要素が見つかりました (${pagination.length}件):`);
      pagination.slice(0, 3).each((i, elem) => {
        console.log(`  - クラス: ${$(elem).attr('class')}`);
        console.log(`    テキスト: ${$(elem).text().trim().substring(0, 50)}`);
      });
    } else {
      console.log('ページネーション要素が見つかりませんでした');
    }
    console.log('');
    
    console.log('=========================================');
    console.log('詳細なHTMLは以下のファイルを確認してください:');
    console.log(htmlPath);
    console.log('=========================================\n');
    
  } catch (error) {
    console.error(`✗ エラーが発生しました: ${error.message}`);
    if (error.response) {
      console.error(`ステータスコード: ${error.response.status}`);
    }
  }
}

debugPageStructure();

