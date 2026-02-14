import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import json
from datetime import datetime

class CardboardScraper:
    def __init__(self):
        self.base_url = "https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet"
        self.params = {
            'tagIds': '1521%2112%2C13'
        }
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        self.products = []
    
    def scrape_page(self, page_num):
        """指定されたページをスクレイピング"""
        print(f"ページ {page_num} をスクレイピング中...")
        
        # URLパラメータを設定
        params = self.params.copy()
        if page_num > 1:
            params['page'] = page_num
        
        try:
            response = requests.get(self.base_url, params=params, headers=self.headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 商品カードを取得
            product_cards = soup.find_all('div', class_='product-card')  # 実際のクラス名に応じて調整
            
            if not product_cards:
                # 別のセレクタを試す
                product_cards = soup.find_all('div', class_='item')
                
            print(f"  {len(product_cards)} 件の商品を発見")
            
            for card in product_cards:
                product = self.extract_product_info(card)
                if product:
                    self.products.append(product)
            
            return len(product_cards) > 0
            
        except Exception as e:
            print(f"エラー（ページ {page_num}）: {str(e)}")
            return False
    
    def extract_product_info(self, card):
        """商品カードから情報を抽出"""
        try:
            product = {}
            
            # 商品名
            name_elem = card.find('h3') or card.find('div', class_='product-name')
            product['商品名'] = name_elem.get_text(strip=True) if name_elem else ''
            
            # 価格
            price_elem = card.find('span', class_='price') or card.find('div', class_='price')
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                product['価格'] = price_text
            else:
                product['価格'] = ''
            
            # 商品番号
            code_elem = card.find('span', text='商品番号') or card.find('div', text='商品番号')
            if code_elem:
                product['商品番号'] = code_elem.find_next().get_text(strip=True)
            else:
                product['商品番号'] = ''
            
            # 内寸（長さ×幅×深さ）
            inner_elem = card.find('span', text='内寸') or card.find('div', text='内寸')
            if inner_elem:
                product['内寸'] = inner_elem.find_next().get_text(strip=True)
            else:
                product['内寸'] = ''
            
            # 外形三辺合計
            outer_elem = card.find('span', text='外形三辺合計') or card.find('div', text='外形三辺合計')
            if outer_elem:
                product['外形三辺合計'] = outer_elem.find_next().get_text(strip=True)
            else:
                product['外形三辺合計'] = ''
            
            # 厚み
            thickness_elem = card.find('span', text='厚み') or card.find('div', text='厚み')
            if thickness_elem:
                product['厚み'] = thickness_elem.find_next().get_text(strip=True)
            else:
                product['厚み'] = ''
            
            # 形式
            format_elem = card.find('span', text='形式') or card.find('div', text='形式')
            if format_elem:
                product['形式'] = format_elem.find_next().get_text(strip=True)
            else:
                product['形式'] = ''
            
            # URL
            link_elem = card.find('a', href=True)
            if link_elem:
                product['URL'] = 'https://www.notosiki.co.jp' + link_elem['href']
            else:
                product['URL'] = ''
            
            return product
            
        except Exception as e:
            print(f"商品情報抽出エラー: {str(e)}")
            return None
    
    def scrape_all_pages(self, max_pages=28):
        """すべてのページをスクレイピング"""
        print(f"スクレイピング開始: 最大 {max_pages} ページ")
        
        for page_num in range(1, max_pages + 1):
            success = self.scrape_page(page_num)
            
            if not success:
                print(f"ページ {page_num} で商品が見つからなかったため終了")
                break
            
            # サーバーに負荷をかけないように待機
            time.sleep(1)
        
        print(f"\n合計 {len(self.products)} 件の商品を取得しました")
    
    def save_to_csv(self, filename=None):
        """CSVファイルに保存"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'data/cardboard_products_{timestamp}.csv'
        
        df = pd.DataFrame(self.products)
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f"\nCSVファイルに保存しました: {filename}")
        return filename
    
    def save_to_json(self, filename=None):
        """JSONファイルに保存"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'data/cardboard_products_{timestamp}.json'
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.products, f, ensure_ascii=False, indent=2)
        
        print(f"JSONファイルに保存しました: {filename}")
        return filename


def main():
    # スクレイパーを初期化
    scraper = CardboardScraper()
    
    # 全ページをスクレイピング
    scraper.scrape_all_pages(max_pages=28)
    
    # データを保存
    if scraper.products:
        scraper.save_to_csv()
        scraper.save_to_json()
        
        # サマリーを表示
        print("\n=== データサマリー ===")
        df = pd.DataFrame(scraper.products)
        print(f"取得した商品数: {len(df)}")
        print("\n最初の5件:")
        print(df.head())
    else:
        print("\n警告: 商品データが取得できませんでした")


if __name__ == "__main__":
    main()






