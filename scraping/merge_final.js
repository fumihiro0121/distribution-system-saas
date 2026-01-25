const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

console.log('='.repeat(60));
console.log('全1110件の最終統合');
console.log('='.repeat(60));

// 必要なファイル
const files = [
  'cardboard_batch_1_51.csv',      // 1-50件
  'cardboard_batch_51_100.csv',    // 51-100件
  'cardboard_batch_101_150.csv',   // 101-150件
  'cardboard_batch_151_200.csv',   // 151-200件
  'cardboard_batch_201_250.csv',   // 201-250件
  'cardboard_batch_251_300.csv',   // 251-300件
  'cardboard_batch_301_350.csv',   // 301-350件
  'cardboard_batch_351_400.csv',   // 351-400件
  'cardboard_batch_401_450.csv',   // 401-450件
  'cardboard_batch_451_500.csv',   // 451-500件
  'cardboard_batch_501_550.csv',   // 501-550件
  'cardboard_batch_551_600.csv',   // 551-600件
  'cardboard_batch_601_650.csv',   // 601-650件
  'cardboard_batch_651_700.csv',   // 651-700件
  'cardboard_batch_701_750.csv',   // 701-750件
  'cardboard_batch_751_800.csv',   // 751-800件
  'cardboard_batch_801_850.csv',   // 801-850件
  'cardboard_batch_851_900.csv',   // 851-900件
  'cardboard_batch_901_950.csv',   // 901-950件
  'cardboard_batch_951_1000.csv',  // 951-1000件
  'cardboard_batch_1001_1050.csv', // 1001-1050件
  'cardboard_batch_1051_1110.csv'  // 1051-1110件
];

let header = null;
const allLines = [];
let totalRecords = 0;

for (const fileName of files) {
  const filePath = path.join(dataDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ ${fileName} が見つかりません`);
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  if (!header) {
    header = lines[0];
    allLines.push(header);
  }
  
  const dataLines = lines.slice(1).filter(line => line.trim());
  allLines.push(...dataLines);
  totalRecords += dataLines.length;
  
  console.log(`✓ ${fileName}: ${dataLines.length}行`);
}

console.log(`\n総レコード数: ${totalRecords}件\n`);

// 最終ファイルを保存
const outputPath = path.join(dataDir, 'cardboard_products_final.csv');
fs.writeFileSync(outputPath, allLines.join('\n'));
console.log(`✓ 最終統合ファイル作成: ${outputPath}`);
console.log(`  総行数: ${allLines.length - 1}件（ヘッダー除く）\n`);

// 元のファイルをバックアップ（まだ作成していない場合）
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
console.log('✓ 全1110件の統合完了！');
console.log('='.repeat(60));

