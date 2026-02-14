const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'data', 'debug_carton_detail.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// unit-priceを含むJSONデータを抽出
const unitPriceMatches = [...html.matchAll(/"unit-price","label":"単価","value":"([^"]+)"/g)];

console.log('=== 見つかった価格データ ===\n');
unitPriceMatches.forEach((match, idx) => {
  console.log(`${idx + 1}. ${match[1]}`);
});

// quantityも一緒に抽出してみる
console.log('\n=== 数量と単価のペア ===\n');
const priceData = [];
let currentQuantity = null;

// JSONデータを探す
const jsonMatches = [...html.matchAll(/\{"groupOrder":(\d+),"key":"([^"]+)","label":"([^"]+)","value":"([^"]+)"/g)];

jsonMatches.forEach(match => {
  const [_, groupOrder, key, label, value] = match;
  if (key === 'quantity') {
    currentQuantity = value;
  } else if (key === 'unit-price' && currentQuantity) {
    priceData.push({ quantity: currentQuantity, price: value });
    console.log(`数量: ${currentQuantity} → 単価: ${value}`);
  }
});

// 最安値を見つける
if (priceData.length > 0) {
  const sortedByPrice = priceData.sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
    return priceA - priceB;
  });
  
  console.log('\n=== 最安値 ===');
  console.log(`数量: ${sortedByPrice[0].quantity} → 単価: ${sortedByPrice[0].price}`);
}






