const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchGoogleSpreadsheet() {
  // GoogleスプレッドシートのIDを抽出
  const spreadsheetId = '1nu71ZJOTy_hcMVRYnZbHGkU2OirBKeXmdAUQmpbrTFc';
  const gid = '0';
  
  // CSV形式でエクスポート
  const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
  
  console.log('Googleスプレッドシートからデータを取得中...\n');
  console.log(`URL: ${csvUrl}\n`);
  
  try {
    const response = await axios.get(csvUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // CSVデータを保存
    const outputPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
    fs.writeFileSync(outputPath, response.data, 'utf-8');
    
    console.log(`✓ データを取得しました: ${outputPath}`);
    console.log(`  データサイズ: ${response.data.length} バイト\n`);
    
    // データをパースして表示
    const lines = response.data.split('\n');
    console.log(`行数: ${lines.length}`);
    console.log('\nヘッダー:');
    console.log(lines[0]);
    console.log('\n最初の5行のデータ:');
    for (let i = 1; i <= Math.min(5, lines.length - 1); i++) {
      console.log(lines[i]);
    }
    
    return outputPath;
    
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    if (error.response) {
      console.error('ステータスコード:', error.response.status);
      console.error('レスポンス:', error.response.data.substring(0, 200));
    }
    throw error;
  }
}

if (require.main === module) {
  fetchGoogleSpreadsheet();
}

module.exports = fetchGoogleSpreadsheet;

