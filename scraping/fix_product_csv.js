const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('商品CSVファイルの修正');
console.log('='.repeat(60));

// CSVファイルを読み込み
const csvPath = path.join(__dirname, 'data', 'product_shipping_data.csv');
const content = fs.readFileSync(csvPath, 'utf-8');

// 改行を含むダブルクォート内の改行を削除
let fixed = content.replace(/"([^"]*)"/g, (match, p1) => {
  // ダブルクォート内の改行を削除
  return '"' + p1.replace(/\r?\n/g, '') + '"';
});

// 連続する空のフィールドを整理
const lines = fixed.split('\n').filter(line => line.trim());
const outputLines = [];

for (const line of lines) {
  // 空の列を適切に処理
  const cleanedLine = line.replace(/,+/g, ',').replace(/^,|,$/g, '');
  if (cleanedLine && cleanedLine.split(',').length > 5) {
    outputLines.push(cleanedLine);
  }
}

// 修正したCSVを保存
fs.writeFileSync(csvPath, outputLines.join('\n'));

console.log(`✓ CSVファイルを修正しました: ${csvPath}`);
console.log(`  総行数: ${outputLines.length}行`);

console.log('\n' + '='.repeat(60));
console.log('✓ 完了！');
console.log('='.repeat(60));

