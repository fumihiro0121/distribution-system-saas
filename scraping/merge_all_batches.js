const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const TOTAL_ITEMS = 1110;
const BATCH_SIZE = 50;

console.log('='.repeat(60));
console.log('全バッチファイルの統合処理');
console.log('='.repeat(60));

// バッチファイルを探す
const batchFiles = [];
for (let i = 1; i <= TOTAL_ITEMS; i += BATCH_SIZE) {
  const end = Math.min(i + BATCH_SIZE - 1, TOTAL_ITEMS);
  const fileName = `cardboard_batch_${i}_${end}.csv`;
  const filePath = path.join(dataDir, fileName);
  
  if (fs.existsSync(filePath)) {
    batchFiles.push({ path: filePath, start: i, end, fileName });
    console.log(`✓ ${fileName}`);
  } else {
    console.log(`⚠ ${fileName} が見つかりません`);
  }
}

console.log(`\n見つかったバッチファイル: ${batchFiles.length}件\n`);

if (batchFiles.length === 0) {
  console.error('エラー: バッチファイルが見つかりません');
  process.exit(1);
}

// ヘッダーを読み込む
const firstFileContent = fs.readFileSync(batchFiles[0].path, 'utf-8');
const lines = firstFileContent.split('\n');
const header = lines[0];

console.log('ヘッダー:', header);
console.log('');

// 全ファイルを結合
const allLines = [header];
let totalRecords = 0;

for (const file of batchFiles) {
  const content = fs.readFileSync(file.path, 'utf-8');
  const fileLines = content.split('\n').slice(1); // ヘッダーをスキップ
  const validLines = fileLines.filter(line => line.trim());
  allLines.push(...validLines);
  totalRecords += validLines.length;
  console.log(`  ${file.fileName}: ${validLines.length}行`);
}

console.log(`\n総レコード数: ${totalRecords}件\n`);

// 最終ファイルを保存
const outputPath = path.join(dataDir, 'cardboard_products_updated.csv');
fs.writeFileSync(outputPath, allLines.join('\n'));
console.log(`✓ 統合ファイル作成: ${outputPath}`);
console.log(`  総行数: ${allLines.length - 1}件（ヘッダー除く）\n`);

// 元のファイルをバックアップ
const originalPath = path.join(dataDir, 'cardboard_products_2026-01-14T22-44-17.csv');
const backupPath = path.join(dataDir, 'cardboard_products_original_backup.csv');

if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(originalPath, backupPath);
  console.log(`✓ バックアップ作成: ${backupPath}`);
} else {
  console.log(`  バックアップは既に存在: ${backupPath}`);
}

// 元のファイルを置き換え
fs.copyFileSync(outputPath, originalPath);
console.log(`✓ 元のファイルを更新: ${originalPath}`);

console.log('\n' + '='.repeat(60));
console.log('✓ 全処理完了！');
console.log('='.repeat(60));

