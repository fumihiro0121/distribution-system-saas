const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, 'data', 'cardboard_products_2026-01-14T22-44-17.csv');

console.log('============================================================');
console.log('パレット配置（段数）の再計算');
console.log('============================================================\n');

// FBA倉庫のパレット高さ上限と計算条件
const PALLET_HEIGHT_LIMIT = 182.5; // cm
const PALLET_BASE_HEIGHT = 22; // cm
const MAX_STACKING_HEIGHT = PALLET_HEIGHT_LIMIT - PALLET_BASE_HEIGHT; // 160.5 cm

console.log(`パレット高さ上限: ${PALLET_HEIGHT_LIMIT}cm`);
console.log(`パレット自身の高さ: ${PALLET_BASE_HEIGHT}cm`);
console.log(`段ボール積載可能高さ: ${MAX_STACKING_HEIGHT}cm\n`);

// CSVを読み込み
const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
const lines = csvContent.split('\n');

const header = lines[0];
const dataLines = lines.slice(1).filter(line => line.trim());

console.log(`処理対象: ${dataLines.length}行\n`);

// 実績段ボールの手動修正データ
const manualCorrections = {
  'HIST-330-260-175': { boxesPerLayer: 12 },  // きな粉 500g×10袋セット (17.5cm高)
  'HIST-354-225-125': { boxesPerLayer: 13 },  // きな粉150g×20袋セット (12.5cm高)
  'HIST-341-226-109': { boxesPerLayer: 13 },  // 黒ゴマアーモンドきな粉150g×10袋セット (10.9cm高)
  'HIST-355-260-150': { boxesPerLayer: 10 },  // 米の粉 450g×10袋セット (15cm高)
  'HIST-210-140-110': { boxesPerLayer: 12 },  // 茨城県産べにはるかほしいも10袋セット (11cm高)
  'HIST-400-205-100': { boxesPerLayer: 12 },  // 粉黒糖10袋セット (10cm高)
  'HIST-420-185-120': { boxesPerLayer: 12 }   // かちわり黒糖10袋セット (12cm高)
};

const updatedLines = dataLines.map((line, index) => {
  const parts = line.split(',');
  const code = parts[0];
  
  // 内寸を取得（例: "450×300×230mm"）
  const innerDim = parts[3];
  if (!innerDim) return line;
  
  const dimMatch = innerDim.match(/(\d+)×(\d+)×(\d+)/);
  if (!dimMatch) return line;
  
  const [, length, width, height] = dimMatch.map(Number);
  
  // パレット配置情報のインデックス
  const palletConfigIndex = 7;
  let palletConfig = parts[palletConfigIndex];
  
  // 手動修正が必要な実績段ボール
  if (manualCorrections[code]) {
    const { boxesPerLayer } = manualCorrections[code];
    
    // 段ボール高さ（mmをcmに変換）
    const cartonHeightCm = height / 10;
    
    // 最大段数を計算: (段ボールの高さ×段数 + 22cm) < 182.5cm
    const maxLayers = Math.floor(MAX_STACKING_HEIGHT / cartonHeightCm);
    
    const newConfig = `"1段${boxesPerLayer}箱×${maxLayers}段"`;
    parts[palletConfigIndex] = newConfig;
    console.log(`✓ ${code}: ${palletConfig} → ${newConfig} (手動修正: 高さ ${cartonHeightCm}cm, 最大段数: ${maxLayers})`);
    return parts.join(',');
  }
  
  // パレット配置情報がある場合のみ段数を再計算
  if (palletConfig && palletConfig !== '""' && palletConfig !== '-') {
    // 既存の「1段X箱」情報を抽出
    const configMatch = palletConfig.match(/1段(\d+)箱/);
    if (configMatch) {
      const boxesPerLayer = parseInt(configMatch[1]);
      
      // 段ボール高さ（mmをcmに変換）
      const cartonHeightCm = height / 10;
      
      // 最大段数を計算: (段ボールの高さ×段数 + 22cm) < 182.5cm
      // 段数 < (182.5 - 22) / 段ボールの高さ
      const maxLayers = Math.floor(MAX_STACKING_HEIGHT / cartonHeightCm);
      
      // 新しいパレット配置
      const newConfig = `"1段${boxesPerLayer}箱×${maxLayers}段"`;
      
      if (palletConfig !== newConfig) {
        console.log(`✓ ${code}: ${palletConfig} → ${newConfig} (高さ: ${cartonHeightCm}cm, 最大段数: ${maxLayers})`);
        parts[palletConfigIndex] = newConfig;
      }
    }
  }
  
  return parts.join(',');
});

// ファイルに書き戻す
const newContent = [header, ...updatedLines].join('\n');
fs.writeFileSync(csvFilePath, newContent, 'utf-8');

console.log('\n============================================================');
console.log(`✓ 完了！`);
console.log(`  更新ファイル: ${csvFilePath}`);
console.log('============================================================\n');

