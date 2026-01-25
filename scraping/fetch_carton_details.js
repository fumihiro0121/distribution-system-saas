const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 1つの段ボール詳細を取得
async function fetchCartonDetails(url, code) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log(`  ${code}: アクセス中...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // ページの内容を取得
    const details = await page.evaluate(() => {
      // 価格を取得（1枚あたりの価格）
      let unitPrice = null;
      const priceElements = document.querySelectorAll('td');
      for (let i = 0; i < priceElements.length; i++) {
        const text = priceElements[i].textContent;
        if (text.includes('枚あたりの価格') && i + 1 < priceElements.length) {
          const priceText = priceElements[i + 1].textContent;
          const priceMatch = priceText.match(/([\d,]+\.?\d*)\s*円/);
          if (priceMatch) {
            unitPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
          }
          break;
        }
      }
      
      // 容量を取得
      let volume = null;
      const volumeElements = document.querySelectorAll('td');
      for (let i = 0; i < volumeElements.length; i++) {
        const text = volumeElements[i].textContent;
        if (text.includes('容量') && i + 1 < volumeElements.length) {
          const volumeText = volumeElements[i + 1].textContent;
          const volumeMatch = volumeText.match(/([\d,]+\.?\d*)\s*L/);
          if (volumeMatch) {
            volume = parseFloat(volumeMatch[1].replace(/,/g, ''));
          }
          break;
        }
      }
      
      // 重量を取得
      let weight = null;
      const weightElements = document.querySelectorAll('td');
      for (let i = 0; i < weightElements.length; i++) {
        const text = weightElements[i].textContent;
        if (text.includes('重量') && i + 1 < weightElements.length) {
          const weightText = weightElements[i + 1].textContent;
          const weightMatch = weightText.match(/([\d,]+\.?\d*)\s*g/);
          if (weightMatch) {
            weight = parseFloat(weightMatch[1].replace(/,/g, ''));
          }
          break;
        }
      }
      
      return { unitPrice, volume, weight };
    });
    
    console.log(`  ${code}: 価格=${details.unitPrice}円, 容量=${details.volume}L, 重量=${details.weight}g`);
    
    await browser.close();
    return details;
    
  } catch (error) {
    console.error(`  ${code}: エラー - ${error.message}`);
    await browser.close();
    return { unitPrice: null, volume: null, weight: null };
  }
}

// テスト実行
async function testFetch() {
  const testUrl = 'https://www.notosiki.co.jp/item/detail?num=MA120-398';
  const details = await fetchCartonDetails(testUrl, 'MA120-398');
  console.log('\n取得結果:', details);
}

testFetch();

