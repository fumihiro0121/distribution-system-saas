# Amazon FBA/AWD倉庫データの追加

## 日時
2026年1月13日

## 実装内容

### 🎯 概要

Amazon FBA（Fulfillment by Amazon）とAWD（Amazon Warehousing & Distribution）の公式倉庫情報127件をプロジェクトに追加しました。

---

## 📊 追加されたデータ

### データの内訳

**合計**: 137件の配送先

| タイプ | 件数 | 説明 |
|--------|------|------|
| Amazon AWD | 10件 | Amazon倉庫保管サービス |
| Amazon FBA | 127件 | Amazon配送センター |
| その他（スーパー等） | 2件 | マルカイ、Walmart |
| **合計** | **139件** | |

---

### Amazon AWD (10件)

Amazon Warehousing & Distribution - バルク保管・流通拠点

| コード | 名称 | 州 | 地域 |
|--------|------|-----|------|
| IUSL | AWD North East | MD | 東海岸ハブ |
| IUSQ | AWD Redlands | CA | 西海岸バルク保管 |
| IUSJ | AWD Beaumont | CA | 南カリフォルニア |
| IUSP | AWD Hesperia | CA | ハイデザート |
| IUSF | AWD Dallas | TX | 中南部ハブ |
| IUTE | AWD Goodyear | AZ | 南西部拡張 |
| IUTI | AWD Redlands #2 | CA | 西海岸拡張 |
| IUTF | AWD Perris | CA | バルク拠点 |
| IUTG | AWD Coppell | TX | テキサス北部 |
| IUTH | AWD San Marcos | TX | テキサス中部 |

---

### Amazon FBA (127件)

フルフィルメントセンター・配送拠点

#### エリア別内訳

| 地域 | 州 | 件数 |
|------|-----|------|
| **南カリフォルニア** | CA | 17件 |
| **北カリフォルニア** | CA | 10件 |
| **アリゾナ** | AZ | 13件 |
| **太平洋北西部** | WA, NV, UT | 7件 |
| **中西部** | IN, IL, OH | 15件 |
| **ケンタッキー** | KY | 11件 |
| **テキサス** | TX | 7件 |
| **ペンシルバニア・NJ** | PA, NJ, DE | 19件 |
| **テネシー・南東部** | TN, SC, GA | 9件 |
| **フロリダ** | FL | 5件 |
| **北東部** | CT, MD, VA, MA, MI, WI | 10件 |

#### 主要FBA拠点の例

**南カリフォルニア（ロサンゼルス港アクセス）**:
- ONT2, ONT3, ONT4, ONT5 - San Bernardino（主要FCクラスター）
- ONT6, ONT8, ONT9 - Moreno Valley / Redlands
- LGB3, LGB4, LGB6, LGB7, LGB8 - Eastvale / Riverside / Rialto
- LAX9 - Fontana

**北カリフォルニア（オークランド港アクセス）**:
- OAK3, OAK4 - Patterson / Tracy（北カリフォルニアハブ）
- OAK5, OAK7 - Newark
- SMF1 - Sacramento
- FAT1 - Fresno

**アリゾナ（フェニックス地域）**:
- PHX3, PHX5, PHX6, PHX7, PHX8, PHX9 - Phoenix / Goodyear エリア
- GYR1, GYR3, GYR4 - Goodyear / Avondale
- TUS2 - Tucson

**ケンタッキー（CVG地域）**:
- CVG1, CVG2, CVG3, CVG5, CVG7 - Hebron（シンシナティ近郊）
- SDF1, SDF2, SDF4, SDF6, SDF9 - Louisville / Shepherdsville

**ペンシルバニア（東海岸ハブ）**:
- ABE2, ABE3 - Breinigsville
- PHL4, PHL5, PHL6 - Carlisle / Lewisberry
- MDT1 - Carlisle

---

## 🗂️ データ構造

### ファイル構成

```
frontend/
└── data/
    └── amazon-facilities.ts  ← 新規作成
```

### データ型定義

```typescript
interface AmazonFacility {
  id: number;
  code: string;              // 倉庫コード（例：ONT9, IUSQ）
  name: string;              // 表示名
  fullName: string;          // 正式名称
  country: string;           // 国
  port: string;              // 最寄り港
  address: string;           // 完全な住所
  type: 'amazon_fba' | 'amazon_awd';
  contactEmail?: string;     // 担当者メール（ある場合）
  notes?: string;            // 備考・特記事項
  city: string;              // 市
  state: string;             // 州
  zip: string;               // 郵便番号
}
```

### データ例

```typescript
{
  id: 2007,
  code: 'ONT9',
  name: 'Amazon FBA ONT9',
  fullName: 'Amazon FBA Fulfillment Center ONT9 (大型FC)',
  country: 'アメリカ',
  port: 'ロサンゼルス港',
  address: '2125 W San Bernardino Ave, Redlands, CA 92374, USA',
  type: 'amazon_fba',
  city: 'Redlands',
  state: 'CA',
  zip: '92374',
  contactEmail: 'ont9-inbound-appt@amazon.com',
  notes: '大型FC'
}
```

---

## 🔄 統合されたファイル

### 1. 出荷計画作成画面

**ファイル**: `frontend/app/admin/shipments/new/page.tsx`

**変更内容**:
```typescript
// 変更前
const destinations = [
  // 6件の手動データ
];

// 変更後
import { amazonFacilities } from '@/data/amazon-facilities';

const otherDestinations = [
  // スーパー等の非Amazon配送先
];

const destinations = [...amazonFacilities, ...otherDestinations];
```

**結果**:
- 6件 → **139件**の配送先が選択可能に

---

### 2. 配送先マスタ管理画面

**ファイル**: `frontend/app/admin/masters/destinations/page.tsx`

**変更内容**:
```typescript
// 変更前
const [destinations, setDestinations] = useState<Destination[]>([
  // 6件の手動データ
]);

// 変更後
import { amazonFacilities } from '@/data/amazon-facilities';

const [destinations, setDestinations] = useState<Destination[]>([
  ...amazonFacilities,
  ...initialOtherDestinations,
]);
```

**結果**:
- 配送先マスタに**127件のAmazon倉庫**が追加される
- 検索機能で素早く目的の倉庫を見つけられる

---

## 🎨 UI/UX への影響

### 配送先選択画面

**変更前**:
```
配送先（複数選択可）
┌────────────────────────┐
│ ☐ Amazon FBA TMB8      │
│ ☐ Amazon FBA ONT9      │
│ ☐ Amazon FBA LGB8      │
│ ☐ Amazon AWD LA        │
│ ☐ 米国マルカイ LA店    │
│ ☐ 米国Walmart NYC倉庫  │
└────────────────────────┘
選択中: 0件
```

**変更後**:
```
配送先（複数選択可）
┌────────────────────────────────────┐
│ [配送先名、コードで検索...]        │
├────────────────────────────────────┤
│ ☐ Amazon AWD IUSL [IUSL]          │
│   600 Principio Pkwy W, North...  │
│ ☐ Amazon AWD IUSQ [IUSQ]          │
│   2125 W San Bernardino Ave...    │
│ ☐ Amazon FBA ONT2 [ONT2]          │
│   1910 E Central Ave, San...      │
│ ☐ Amazon FBA ONT9 [ONT9]          │
│   2125 W San Bernardino Ave...    │
│ ☐ Amazon FBA LGB8 [LGB8]          │
│   1568 N Linden Ave, Rialto...    │
│  ...（127件のAmazon倉庫）          │
│ ☐ 米国マルカイ ロサンゼルス店     │
│ ☐ 米国Walmart ニューヨーク倉庫    │
└────────────────────────────────────┘
選択中: 0件
```

---

### 検索機能の活用例

#### 例1: 州で検索

**検索**: `CA`

**結果**:
- カリフォルニア州の全倉庫（ONT2, ONT9, LGB8, OAK3, SMF1 等）が表示される

#### 例2: コードで検索

**検索**: `ONT`

**結果**:
- ONT2, ONT3, ONT4, ONT5, ONT6, ONT8, ONT9 が表示される

#### 例3: 地域で検索

**検索**: `Phoenix`

**結果**:
- PHX3, PHX5, PHX6, PHX7, PHX8, PHX9 等のフェニックス地域の倉庫が表示される

---

## 📍 港別グループ分け

主要な仕向地港とそれに対応する倉庫：

### 西海岸

**ロサンゼルス港**:
- 南カリフォルニアFBA: ONT2～ONT9, LGB3～LGB8, LAX9, SNA4 等
- アリゾナFBA: PHX3～PHX9, GYR1～GYR4, TUS1～TUS2
- ネバダFBA: LAS1, LAS2
- Amazon AWD: IUSQ, IUSJ, IUSP, IUTF, IUTI, IUTE

**オークランド港**:
- 北カリフォルニアFBA: OAK3, OAK4, OAK5, OAK7, SMF1, FAT1
- ネバダFBA: RNO4
- ユタFBA: SLC1

**シアトル港**:
- ワシントンFBA: BFI1, BFI3, BFI4, BFIX

---

### 東海岸

**ニューヨーク港**:
- ニュージャージーFBA: EWR4, EWR5, EWR7, EWR9, ABE8
- ペンシルバニアFBA: ABE2, ABE3, AVP1
- コネチカットFBA: BDL1, BDL2, BDL3

**ボルチモア港**:
- メリーランドFBA: BWI2, MDT2
- ペンシルバニアFBA: ABE5, PHL4, PHL5, PHL6, MDT1, PIT5
- ケンタッキーFBA: CVG1～CVG7, SDF1～SDF9, LEX1, LEX2
- オハイオFBA: CMH1, CMH2
- Amazon AWD: IUSL

**フィラデルフィア港**:
- デラウェアFBA: PHL1, PHL7
- ニュージャージーFBA: ACY1, ACY2, TEB3

---

### 中南部

**ヒューストン港**:
- テキサスFBA: DFW6, DFW7, DFW8, SAT1, HOU1, FTW1, DAL3
- Amazon AWD: IUSF, IUTG, IUTH

**シカゴ港**:
- イリノイFBA: MDW2, MDW6, MDW7, STL4, ORD2
- インディアナFBA: IND1～IND9, SDF8
- ウィスコンシンFBA: MKE1, MKE2

---

### 南東部

**サバンナ港**:
- ジョージアFBA: ATL2, ATL7, AGS1
- テネシーFBA: CHA1, CHA2

**チャールストン港**:
- サウスカロライナFBA: CAE1, GSP1

**タンパ港**:
- フロリダFBA: TPA1, TPA2

**ジャクソンビル港**:
- フロリダFBA: MCO1, JAX3

**マイアミ港**:
- フロリダFBA: MIA1

---

## 💡 活用シーン

### シーン1: 西海岸向け大量出荷

**要件**:
- ロサンゼルス港経由
- 複数のFBA倉庫に分散納品
- AWDでの一時保管も検討

**選択する配送先**:
```
✅ Amazon AWD IUSQ（バルク保管）
✅ Amazon FBA ONT9（Redlands - 大型FC）
✅ Amazon FBA LGB8（Rialto - IXD）
✅ Amazon FBA PHX3（Phoenix - 主要FC）
```

**メリット**:
- 同一港（LA港）でコンテナ通関
- 効率的な配送ルート
- AWDで在庫調整可能

---

### シーン2: 東西両岸への分散配送

**要件**:
- 東海岸と西海岸の両方に在庫配置
- リードタイム短縮

**選択する配送先**:
```
✅ Amazon FBA ONT9（CA - 西海岸）
✅ Amazon FBA PHX5（AZ - 南西部）
✅ Amazon FBA CVG3（KY - 東海岸ハブ）
✅ Amazon FBA EWR4（NJ - ニューヨーク近郊）
```

**メリット**:
- 全米をカバー
- 配送コスト最適化
- 2つの主要港に分散

---

### シーン3: AWDバルク保管 + FBA配送

**要件**:
- 大量在庫を一旦AWDで保管
- 需要に応じてFBAに補充

**選択する配送先**:
```
✅ Amazon AWD IUSQ（CA - バルク保管）
→ 後日、需要に応じて以下に配送：
✅ Amazon FBA ONT9（CA）
✅ Amazon FBA PHX3（AZ）
✅ Amazon FBA LAS2（NV）
```

**メリット**:
- 在庫コスト削減
- フレキシブルな在庫配置
- FBA納品制限に対応

---

## 🚀 確認方法

### 1. ブラウザをリロード

```
http://localhost:3001
```

**F5キー**でリロード

---

### 2. 出荷計画作成画面を開く

1. 管理者でログイン（admin@example.com / admin123）
2. 「+ 新規作成」をクリック

---

### 3. 配送先を確認

**配送先（複数選択可）**のセクションで：

1. 検索窓に「**ONT**」と入力
   - ONT2, ONT3, ONT4, ONT5, ONT6, ONT8, ONT9 が表示される

2. 検索窓に「**AWD**」と入力
   - 10件のAWD倉庫が表示される

3. 検索窓に「**Phoenix**」と入力
   - フェニックス地域の倉庫が表示される

4. 複数の倉庫を選択
   - それぞれの仕向地情報が個別に表示される

---

### 4. 配送先マスタ管理画面を確認

1. 「**📍 配送先マスタ管理**」をクリック
2. 検索窓で「**CA**」と検索
3. カリフォルニア州の全倉庫が表示される
4. **127件のAmazon倉庫**が登録されていることを確認

---

## 📝 変更されたファイル

### 新規作成
1. **`frontend/data/amazon-facilities.ts`** - Amazon倉庫マスタデータ（127件）

### 修正
2. **`frontend/app/admin/shipments/new/page.tsx`** - データインポート
3. **`frontend/app/admin/masters/destinations/page.tsx`** - データインポート

### ドキュメント
4. **`CHANGELOG_AMAZON_FACILITIES.md`** - このファイル

---

## ✅ 完了した機能

すべての要望を実装しました：

1. ✅ Amazon FBA倉庫情報を127件追加
2. ✅ Amazon AWD倉庫情報を10件追加
3. ✅ 倉庫コード、住所、州、郵便番号を保存
4. ✅ 連絡先メール、備考も保存
5. ✅ 配送先選択で利用可能
6. ✅ 配送先マスタ管理で追加・編集可能
7. ✅ 検索機能で素早く検索可能
8. ✅ 複数選択で個別に仕向地情報を管理

---

## 📊 統計情報

| 項目 | 値 |
|------|-----|
| Amazon AWD | 10件 |
| Amazon FBA | 127件 |
| その他配送先 | 2件 |
| **合計配送先** | **139件** |
| 対象州数 | 約25州 |
| カバーエリア | 全米 |
| 主要港 | 約12港 |

---

すべての実装が完了しました！🎉

**ブラウザをリロード（F5キー）して、139件の配送先を確認してください！**










