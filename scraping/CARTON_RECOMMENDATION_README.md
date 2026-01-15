# 段ボールサイズ推奨システム

## 概要

商品の出荷実績データを基に、最適な段ボールサイズを自動推奨するシステムです。

## 機能

1. **Googleスプレッドシートからデータ取得**
   - 商品情報、実績段ボールサイズ、梱包数などを取得

2. **段ボールサイズ推奨**
   - 商品の数量パターンごとに最適な段ボールを提案
   - 実績データを基に、1袋、5袋、10袋、20袋などの様々な数量で推奨

3. **マスタデータSQL生成**
   - 商品マスタのINSERT文を生成
   - 段ボールサイズマスタのINSERT文を生成
   - 商品と段ボールの推奨マッピングを生成

## ファイル構成

### スクリプトファイル

- **`fetch_spreadsheet.js`**
  - Googleスプレッドシートから商品データをCSV形式で取得
  - 使用方法: `node fetch_spreadsheet.js`

- **`recommend_carton_sizes.js`**
  - 商品データと段ボールデータを照合し、最適な段ボールを推奨
  - 実績段ボールサイズを考慮した提案
  - 使用方法: `node recommend_carton_sizes.js`

- **`generate_master_data_sql.js`**
  - 商品マスタと段ボールサイズマスタのSQL INSERT文を生成
  - 使用方法: `node generate_master_data_sql.js`

- **`cardboard_scraper_final.js`**
  - ダンボールワンのウェブサイトから段ボール商品データをスクレイピング
  - 28ページ、1109件の段ボール情報を取得
  - 使用方法: `node cardboard_scraper_final.js`

### データファイル

#### 入力データ

- **`product_shipping_data.csv`**
  - Googleスプレッドシートから取得した商品情報
  - 商品名、SKU、JANコード、ASIN、重量、梱包数、実績段ボールサイズなど

- **`cardboard_products_2026-01-14T22-44-17.csv`**
  - ダンボールワンから取得した段ボール商品データ
  - 商品番号、内寸、宅配サイズ、厚み、形式、URLなど

#### 出力データ

- **`carton_recommendations.json`**
  - 各商品の数量パターンごとの段ボール推奨データ（JSON形式）

- **`carton_recommendations.csv`**
  - 各商品の数量パターンごとの段ボール推奨データ（CSV形式）
  - 表計算ソフトで開いて確認可能

- **`master_data_insert.sql`**
  - データベース用のINSERT文
  - 商品マスタ、段ボールサイズマスタ、推奨マッピング

## 使用方法

### 1. 環境準備

```bash
cd scraping
npm install
```

### 2. データ取得とマスタデータ生成

```bash
# 1. Googleスプレッドシートから商品データを取得
node fetch_spreadsheet.js

# 2. 段ボールサイズを推奨
node recommend_carton_sizes.js

# 3. マスタデータのSQL生成
node generate_master_data_sql.js
```

### 3. 生成されたデータの確認

- `data/carton_recommendations.csv` - Excel等で開いて確認
- `data/master_data_insert.sql` - データベースにインポート

## 段ボール推奨ロジック

### 基本的な考え方

1. **実績データの活用**
   - スプレッドシートの「段ボール縦センチ」「段ボール横センチ」「段ボール高さセンチ」は、
     その商品を実際にそのサイズの段ボールで輸出した実績を示す
   - 例: 「黒ゴマアーモンドきな粉150g×10袋セット」が「34.1×22.6×10.9cm」の段ボールで
     輸出された実績がある場合、1袋セットを輸出する際もこのサイズを選択肢として提案

2. **数量パターンの生成**
   - 1袋セット商品: 1袋、5袋、10袋、20袋、30袋、50袋、実績梱包数
   - ○袋セット商品: 1セット、2セット、5セット、10セットなど

3. **段ボールサイズの計算**
   - 実績データから1セットあたりの必要スペースを計算
   - 必要なセット数に応じて、10%の余裕を持たせたサイズを算出
   - ダンボールワンのデータベースから最適なサイズを検索

4. **優先順位**
   - 実績のある段ボールサイズを優先
   - 容積が小さいものから順に提案（コスト削減）
   - 上位3つの候補を提示

### 例: 黒ゴマアーモンドきな粉150g×1袋セット

実績データ:
- 110袋を53.0×38.0×35.0cmの段ボールに梱包

推奨:
- 1袋の場合: 664×184×148mm の段ボール
- 10袋の場合: 664×184×148mm の段ボール
- 50袋の場合: 634×194×268mm の段ボール
- 110袋の場合: 実績段ボール（53.0×38.0×35.0cm）を含む候補

## データベーススキーマ

### product_master（商品マスタ）

- `id`: 主キー
- `product_name`: 商品名
- `sku`: SKU
- `jan_code`: JANコード
- `asin`: ASIN
- `fnsku`: FNSKU
- `hs_code`: HSコード
- `supplier`: 仕入先
- `unit_weight`: 単位重量（kg）
- `unit_weight_lb`: 単位重量（ポンド）
- `standard_box_quantity`: 標準箱入数
- `category`: カテゴリ

### carton_size_master（段ボールサイズマスタ）

- `id`: 主キー
- `carton_code`: 段ボール商品番号（例: MA120-398）
- `carton_name`: 段ボール商品名
- `supplier`: 仕入先（例: ダンボールワン）
- `inner_length_mm`: 内寸長さ（mm）
- `inner_width_mm`: 内寸幅（mm）
- `inner_height_mm`: 内寸高さ（mm）
- `outer_total_cm`: 外形三辺合計（cm）
- `thickness`: 厚み
- `material_type`: 形式
- `delivery_size`: 宅配サイズ
- `product_url`: 商品URL
- `unit_price`: 単価
- `currency`: 通貨

### product_carton_recommendation（商品段ボール推奨マッピング）

- `product_id`: 商品ID（外部キー）
- `carton_id`: 段ボールID（外部キー）
- `quantity_from`: 数量範囲（開始）
- `quantity_to`: 数量範囲（終了）
- `priority`: 優先順位（1が最優先）
- `is_historical`: 実績があるかどうか

## データソース

### 商品データ

- **ソース**: Googleスプレッドシート
- **URL**: https://docs.google.com/spreadsheets/d/1nu71ZJOTy_hcMVRYnZbHGkU2OirBKeXmdAUQmpbrTFc/edit

### 段ボールデータ

- **ソース**: ダンボールワン（能登紙器）
- **URL**: https://www.notosiki.co.jp/
- **検索条件**: パレット1100×1100、宅配120サイズ・140サイズ
- **取得件数**: 1109件（28ページ分）

## 注意事項

1. **スプレッドシートの公開設定**
   - Googleスプレッドシートは「リンクを知っている全員が閲覧可能」に設定する必要があります

2. **段ボールデータの更新**
   - ダンボールワンのウェブサイト構造が変更された場合、スクレイパーの修正が必要になる可能性があります

3. **推奨ロジックの調整**
   - 余裕率（現在10%）やその他のパラメータは、実際の梱包作業の経験に基づいて調整してください

4. **データベースへのインポート**
   - `master_data_insert.sql`をデータベースにインポートする前に、既存データのバックアップを取ってください

## トラブルシューティング

### エラー: "Request failed with status code 401"

- スプレッドシートが非公開になっています
- 共有設定を確認してください

### エラー: "No products found on page 1"

- ウェブサイトの構造が変更された可能性があります
- `cardboard_scraper_final.js`のセレクタを確認してください

### 推奨段ボールが見つからない

- 実績データの段ボールサイズが大きすぎる可能性があります
- `recommend_carton_sizes.js`の余裕率を調整してください

## 今後の改善案

1. **APIの開発**
   - フロントエンドから直接段ボール推奨を取得できるREST APIの開発

2. **自動更新**
   - 定期的にダンボールワンのデータを更新する自動化スクリプト

3. **コスト最適化**
   - 段ボールの価格データを取得し、コストを考慮した推奨

4. **在庫連携**
   - 段ボールの在庫状況を考慮した推奨

5. **発注システム連携**
   - 推奨された段ボールを直接発注できる機能

## ライセンス

MIT

## 作成者

桜ジャパンプロダクツ

## 最終更新日

2026年1月15日

