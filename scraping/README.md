# ダンボールワン商品スクレイピング

このスクリプトは、ダンボールワンのウェブサイトから商品情報を自動取得します。

## 対象サイト

- **URL**: https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet
- **対象**: パレットぴったりサイズダンボール（1100×1100、宅配120/140サイズ）

## 取得する情報

- 商品名
- 価格
- 商品番号
- 内寸（長さ×幅×深さ）
- 外形三辺合計
- 厚み
- 形式
- 商品URL

## インストール

```bash
# 仮想環境を作成（推奨）
python -m venv venv

# 仮想環境を有効化
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 必要なパッケージをインストール
pip install -r requirements.txt
```

## 使用方法

### 基本的な使い方

```bash
python cardboard_scraper.py
```

### カスタマイズ

```python
from cardboard_scraper import CardboardScraper

# スクレイパーを初期化
scraper = CardboardScraper()

# 特定のページ数のみ取得
scraper.scrape_all_pages(max_pages=5)

# カスタムファイル名で保存
scraper.save_to_csv('custom_name.csv')
scraper.save_to_json('custom_name.json')
```

## 出力ファイル

- **CSV**: `data/cardboard_products_YYYYMMDD_HHMMSS.csv`
- **JSON**: `data/cardboard_products_YYYYMMDD_HHMMSS.json`

## 注意事項

1. **利用規約の確認**: スクレイピングを実行する前に、対象サイトの利用規約を必ず確認してください。
2. **サーバー負荷**: 各ページ取得後に1秒の待機時間を設けています。
3. **データの利用**: 取得したデータは個人利用の範囲で使用してください。
4. **エラー対応**: ページ構造が変更された場合、スクリプトの修正が必要です。

## トラブルシューティング

### 商品が取得できない場合

ウェブサイトの構造が変更された可能性があります。以下を確認してください：

```python
# デバッグモードで実行
scraper.scrape_page(1)  # 1ページ目のみテスト
```

### ページ構造を確認する

```python
import requests
from bs4 import BeautifulSoup

url = "https://www.notosiki.co.jp/group-list/t-cardboard/t-cardboard-pallet?tagIds=1521%2112%2C13"
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# HTMLを出力して構造を確認
with open('page_structure.html', 'w', encoding='utf-8') as f:
    f.write(soup.prettify())
```

## ライセンス

このスクリプトは教育目的で提供されています。

