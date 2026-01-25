const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'data', 'debug_carton_detail.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// 価格に関連する文字列を探す
const pricePatterns = [
  /(\d+[,\.]?\d*)\s*円/g,
  /¥\s*(\d+[,\.]?\d*)/g,
  /価格[：:]\s*(\d+[,\.]?\d*)/g
];

console.log('=== 価格らしき文字列を検索 ===\n');

pricePatterns.forEach((pattern, idx) => {
  const matches = html.matchAll(pattern);
  let found = false;
  for (const match of matches) {
    if (!found) {
      console.log(`パターン ${idx + 1}: ${pattern}`);
      found = true;
    }
    // 前後の文脈を表示（最大100文字）
    const startIdx = Math.max(0, match.index - 50);
    const endIdx = Math.min(html.length, match.index + 100);
    const context = html.substring(startIdx, endIdx).replace(/\s+/g, ' ');
    console.log(`  - ${match[0]} (前後の文脈: ${context})`);
  }
  if (found) console.log('');
});

// 特に「枚あたり」の価格を探す
console.log('\n=== "枚あたり"を含む箇所 ===\n');
const perSheetMatches = html.matchAll(/枚あたり.{0,50}(\d+[,\.]?\d*)\s*円/gi);
for (const match of perSheetMatches) {
  const startIdx = Math.max(0, match.index - 100);
  const endIdx = Math.min(html.length, match.index + 150);
  const context = html.substring(startIdx, endIdx).replace(/\s+/g, ' ');
  console.log(`  ${context}`);
  console.log('');
}

// 価格表を探す
console.log('\n=== 数量と価格の表を探す ===\n');
const priceTableMatches = html.matchAll(/(\d+)枚.{0,100}(\d+[,\.]?\d*)\s*円/gi);
for (const match of priceTableMatches) {
  console.log(`  ${match[0]}`);
}

