const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');

console.log('CSVファイルを読み込み中...');
const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
const lines = csvContent.split('\n');

console.log(`総行数: ${lines.length}`);

// ヘッダー
const header = lines[0];
const dataLines = lines.slice(1);

// 重複を削除（商品番号でユニーク化）
const seenCodes = new Set();
const uniqueLines = [];

dataLines.forEach((line, index) => {
  if (!line.trim()) return; // 空行はスキップ
  
  const code = line.split(',')[0];
  
  if (!seenCodes.has(code)) {
    seenCodes.add(code);
    uniqueLines.push(line);
  } else {
    console.log(`重複を削除: ${code}`);
  }
});

console.log(`\n元の行数: ${dataLines.length}`);
console.log(`ユニーク行数: ${uniqueLines.length}`);
console.log(`削除された重複: ${dataLines.length - uniqueLines.length}`);

// ファイルに書き戻す
const newContent = [header, ...uniqueLines].join('\n');
fs.writeFileSync(csvFilePath, newContent, 'utf-8');

console.log(`\n✓ 重複を削除してファイルを更新しました: ${csvFilePath}`);

