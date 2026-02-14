const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'data', 'debug_carton_detail.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

console.log('=== 価格データの構造を解析 ===\n');

// パターン1: 数量と価格のペア（JSONデータ）
console.log('1. JSONデータから数量と価格を探す...\n');
const jsonPricePattern = /"quantity"[^}]*?"value":"([^"]+)"[^}]*?"unit-price"[^}]*?"value":"([^"]+)"/g;
let matches = [...html.matchAll(jsonPricePattern)];

if (matches.length > 0) {
  console.log(`見つかった価格ペア: ${matches.length}件`);
  matches.slice(0, 5).forEach((match, idx) => {
    console.log(`  ${idx + 1}. 数量: ${match[1]}, 単価: ${match[2]}`);
  });
  console.log('');
}

// パターン2: 逆順
console.log('2. 逆順パターンで探す...\n');
const jsonPricePattern2 = /"unit-price"[^}]*?"value":"([^"]+)"[^}]*?"quantity"[^}]*?"value":"([^"]+)"/g;
matches = [...html.matchAll(jsonPricePattern2)];

if (matches.length > 0) {
  console.log(`見つかった価格ペア: ${matches.length}件`);
  matches.slice(0, 5).forEach((match, idx) => {
    console.log(`  ${idx + 1}. 単価: ${match[1]}, 数量: ${match[2]}`);
  });
  console.log('');
}

// パターン3: より広範囲で探す
console.log('3. 広範囲で"unit-price"を探す...\n');
const unitPricePattern = /"unit-price"[^}]*?"value":"([^"]+)"/g;
matches = [...html.matchAll(unitPricePattern)];

if (matches.length > 0) {
  console.log(`見つかったunit-price: ${matches.length}件`);
  matches.slice(0, 10).forEach((match, idx) => {
    console.log(`  ${idx + 1}. ${match[1]}`);
  });
  console.log('');
}

// パターン4: 価格を含むscriptタグ全体を探す
console.log('4. "単価"を含むscriptタグを探す...\n');
const scriptMatches = html.match(/<script[^>]*>[\s\S]*?単価[\s\S]*?<\/script>/gi);
if (scriptMatches && scriptMatches.length > 0) {
  console.log(`見つかったscriptタグ: ${scriptMatches.length}件`);
  scriptMatches.slice(0, 1).forEach((script, idx) => {
    // 最初の500文字だけ表示
    const preview = script.substring(0, 500);
    console.log(`  ${idx + 1}. ${preview}...\n`);
  });
}

// パターン5: 価格表を探す（HTML要素として）
console.log('5. 価格表（テーブル形式）を探す...\n');
const priceTablePattern = /(\d+)枚[^<]*?<[^>]*>([^<]*?)\d+[,.]?\d*\s*円/gi;
matches = [...html.matchAll(priceTablePattern)];

if (matches.length > 0) {
  console.log(`見つかった価格表エントリ: ${matches.length}件`);
  matches.slice(0, 5).forEach((match, idx) => {
    console.log(`  ${idx + 1}. ${match[0]}`);
  });
}






