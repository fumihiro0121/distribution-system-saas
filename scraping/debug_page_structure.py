"""
ページ構造をデバッグするためのスクリプト
実際のHTMLを確認して、正しいセレクタを見つけます。
"""
import requests
from bs4 import BeautifulSoup

def debug_page_structure():
    url = "https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet"
    params = {'tagIds': '1521%2112%2C13'}
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    print("ページを取得中...")
    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code == 200:
        print(f"✓ ページ取得成功 (ステータスコード: {response.status_code})")
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # HTMLをファイルに保存
        with open('scraping/data/page_structure.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print("✓ HTMLを 'scraping/data/page_structure.html' に保存しました")
        
        # 可能性のあるクラス名を検索
        print("\n=== 商品関連の要素を検索 ===")
        
        # 一般的な商品コンテナのクラス名
        possible_classes = [
            'product', 'item', 'card', 'box', 'list-item',
            'goods', 'merchandise', 'article'
        ]
        
        for class_name in possible_classes:
            elements = soup.find_all(class_=lambda x: x and class_name in x.lower())
            if elements:
                print(f"\n'{class_name}' を含むクラス:")
                for elem in elements[:3]:  # 最初の3つのみ表示
                    print(f"  - {elem.get('class')}")
        
        # 価格を検索
        print("\n=== 価格情報を検索 ===")
        price_patterns = ['円', 'price', '¥', 'yen']
        for pattern in price_patterns:
            elements = soup.find_all(text=lambda x: x and pattern in str(x))
            if elements:
                print(f"\n'{pattern}' を含むテキスト (最初の5件):")
                for elem in elements[:5]:
                    print(f"  - {elem.strip()[:50]}...")
        
        # 商品名を検索
        print("\n=== 商品名を検索 ===")
        h_tags = soup.find_all(['h1', 'h2', 'h3', 'h4'])
        if h_tags:
            print(f"\n見出しタグ (最初の5件):")
            for tag in h_tags[:5]:
                print(f"  <{tag.name}>: {tag.get_text(strip=True)[:50]}...")
        
        # リンクを検索
        print("\n=== 商品リンクを検索 ===")
        links = soup.find_all('a', href=True)
        product_links = [link for link in links if 'product' in link['href'] or 'item' in link['href']]
        if product_links:
            print(f"\n商品関連のリンク (最初の5件):")
            for link in product_links[:5]:
                print(f"  - {link['href']}")
        
        # ページネーション情報
        print("\n=== ページネーション情報 ===")
        pagination = soup.find_all(class_=lambda x: x and 'page' in x.lower())
        if pagination:
            print(f"ページネーション要素が見つかりました:")
            for elem in pagination[:3]:
                print(f"  - クラス: {elem.get('class')}")
                print(f"    テキスト: {elem.get_text(strip=True)[:50]}")
        
        print("\n\n詳細なHTMLは 'scraping/data/page_structure.html' を確認してください")
        
    else:
        print(f"✗ ページ取得失敗 (ステータスコード: {response.status_code})")

if __name__ == "__main__":
    debug_page_structure()






