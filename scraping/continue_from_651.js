const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const BATCH_SIZE = 50;
const START_INDEX = 651; // 651件目から再開
const TOTAL_ITEMS = 1110;

async function runBatch(startIndex, endIndex) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== バッチ処理開始: ${startIndex}〜${endIndex}件目 ===`);
    
    const process = spawn('node', ['update_carton_batch.js', startIndex.toString(), endIndex.toString()], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ バッチ ${startIndex}〜${endIndex} 完了\n`);
        resolve();
      } else {
        console.error(`✗ バッチ ${startIndex}〜${endIndex} エラー (exit code: ${code})\n`);
        // エラーでも続行
        resolve();
      }
    });
    
    process.on('error', (error) => {
      console.error(`✗ バッチ ${startIndex}〜${endIndex} 実行エラー: ${error.message}\n`);
      // エラーでも続行
      resolve();
    });
  });
}

async function mergeAllBatches() {
  console.log('\n=== 全バッチファイルを結合中... ===\n');
  
  const dataDir = path.join(__dirname, 'data');
  const batchFiles = [];
  
  // バッチファイルを探す
  for (let i = 1; i <= TOTAL_ITEMS; i += BATCH_SIZE) {
    const end = Math.min(i + BATCH_SIZE - 1, TOTAL_ITEMS);
    const fileName = `cardboard_batch_${i}_${end}.csv`;
    const filePath = path.join(dataDir, fileName);
    
    if (fs.existsSync(filePath)) {
      batchFiles.push({ path: filePath, start: i, end });
    } else {
      console.log(`⚠ バッチファイル未作成: ${fileName}`);
    }
  }
  
  console.log(`見つかったバッチファイル: ${batchFiles.length}件`);
  
  if (batchFiles.length === 0) {
    console.error('バッチファイルが見つかりません');
    return;
  }
  
  // ヘッダーを読み込む
  const firstFileContent = fs.readFileSync(batchFiles[0].path, 'utf-8');
  const lines = firstFileContent.split('\n');
  const header = lines[0];
  
  // 全ファイルを結合
  const allLines = [header];
  
  for (const file of batchFiles) {
    const content = fs.readFileSync(file.path, 'utf-8');
    const fileLines = content.split('\n').slice(1); // ヘッダーをスキップ
    allLines.push(...fileLines.filter(line => line.trim()));
  }
  
  // 最終ファイルを保存
  const outputPath = path.join(dataDir, 'cardboard_products_updated.csv');
  fs.writeFileSync(outputPath, allLines.join('\n'));
  console.log(`✓ 結合完了: ${outputPath}`);
  console.log(`  総行数: ${allLines.length - 1}件（ヘッダー除く）`);
  
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
}

async function main() {
  const startTime = Date.now();
  
  console.log('='.repeat(60));
  console.log('段ボールデータ更新処理（651件目から再開）');
  console.log('='.repeat(60));
  console.log(`開始位置: ${START_INDEX}件目`);
  console.log(`総件数: ${TOTAL_ITEMS}件`);
  console.log(`残り件数: ${TOTAL_ITEMS - START_INDEX + 1}件`);
  console.log(`バッチサイズ: ${BATCH_SIZE}件`);
  console.log(`タイムアウト: 60秒（最適化）`);
  console.log(`リトライ: 1回のみ（高速化）`);
  console.log(`推定処理時間: 約${Math.ceil((TOTAL_ITEMS - START_INDEX + 1) / BATCH_SIZE * 1.2)}分`);
  console.log('='.repeat(60));
  
  try {
    for (let i = START_INDEX; i <= TOTAL_ITEMS; i += BATCH_SIZE) {
      const endIndex = Math.min(i + BATCH_SIZE - 1, TOTAL_ITEMS);
      
      // 既に完了しているバッチはスキップ
      const batchFile = path.join(__dirname, 'data', `cardboard_batch_${i}_${endIndex}.csv`);
      if (fs.existsSync(batchFile)) {
        console.log(`⏭ バッチ ${i}〜${endIndex} は既に完了済み（スキップ）`);
        continue;
      }
      
      await runBatch(i, endIndex);
      
      // サーバー負荷を考慮して少し待機（短縮）
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ 全バッチ処理完了！');
    console.log('='.repeat(60));
    
    // 全バッチファイルを結合
    await mergeAllBatches();
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000 / 60);
    
    console.log('\n' + '='.repeat(60));
    console.log(`✓ 全処理完了！ (所要時間: ${duration}分)`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n処理中にエラーが発生しました:', error.message);
    console.error('バッチファイルは保存されています。再実行で続きから処理できます。');
    process.exit(1);
  }
}

main();

