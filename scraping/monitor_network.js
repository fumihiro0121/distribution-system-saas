const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function monitorNetwork() {
  console.log('ブラウザを起動中...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const requests = [];
  const responses = [];
  
  // リクエストを監視
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData()
    });
  });
  
  // レスポンスを監視
  page.on('response', async response => {
    const url = response.url();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';
    
    responses.push({
      url,
      status,
      contentType
    });
    
    // JSONレスポンスを探す
    if (contentType.includes('application/json') || contentType.includes('text/json')) {
      try {
        const data = await response.json();
        console.log(`\nJSON レスポンス見つかりました:`);
        console.log(`  URL: ${url}`);
        console.log(`  ステータス: ${status}`);
        
        // データの一部を表示
        const dataStr = JSON.stringify(data).substring(0, 500);
        console.log(`  データ (抜粋): ${dataStr}...`);
        
        // ファイルに保存
        const filename = `api_response_${Date.now()}.json`;
        const filepath = path.join(__dirname, 'data', filename);
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        console.log(`  保存先: ${filepath}\n`);
      } catch (e) {
        // JSONでない
      }
    }
  });
  
  const url = 'https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet?tagIds=1521%2112%2C13';
  
  console.log('ページにアクセス中...');
  console.log(`URL: ${url}\n`);
  
  await page.goto(url, { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  // さらに待機してすべてのリクエストを捕捉
  await page.waitForTimeout(5000);
  
  console.log(`\n合計 ${requests.length} 件のリクエストを監視しました`);
  console.log(`合計 ${responses.length} 件のレスポンスを監視しました\n`);
  
  // すべてのリクエストとレスポンスを保存
  const networkDataPath = path.join(__dirname, 'data', 'network_data.json');
  fs.writeFileSync(networkDataPath, JSON.stringify({ requests, responses }, null, 2));
  console.log(`ネットワークデータを保存: ${networkDataPath}\n`);
  
  // 関連しそうなURLを表示
  console.log('商品データに関連しそうなURL:\n');
  responses.forEach(response => {
    if (response.url.includes('api') || 
        response.url.includes('item') || 
        response.url.includes('product') ||
        response.url.includes('search') ||
        response.url.includes('list')) {
      console.log(`  - ${response.url} (${response.status})`);
    }
  });
  
  await browser.close();
  
  console.log('\n完了しました！');
}

monitorNetwork().catch(console.error);






