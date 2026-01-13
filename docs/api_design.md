# API設計書

## 基本情報

### ベースURL
```
Production: https://api.distribution-system.com/v1
Staging: https://api-staging.distribution-system.com/v1
Development: http://localhost:3000/api/v1
```

### 認証
- 認証方式: JWT (JSON Web Token)
- ヘッダー: `Authorization: Bearer <token>`
- トークン有効期限: 24時間
- リフレッシュトークン: 30日間

### レスポンス形式
- Content-Type: `application/json`
- 文字コード: UTF-8

### 共通レスポンス構造

#### 成功時
```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": "2026-01-14T10:30:00Z"
}
```

#### エラー時
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": { ... }
  },
  "timestamp": "2026-01-14T10:30:00Z"
}
```

### HTTPステータスコード
- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 500: Internal Server Error

---

## エンドポイント一覧

### 1. 認証 (Authentication)

#### 1.1 ログイン
```
POST /auth/login
```

**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "full_name": "田中 太郎",
      "role": "manufacturer",
      "organization": {
        "id": 1,
        "name": "株式会社ABC製造"
      }
    }
  }
}
```

#### 1.2 トークンリフレッシュ
```
POST /auth/refresh
```

**リクエスト**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 1.3 ログアウト
```
POST /auth/logout
```

#### 1.4 パスワードリセット要求
```
POST /auth/password-reset/request
```

**リクエスト**
```json
{
  "email": "user@example.com"
}
```

#### 1.5 パスワードリセット実行
```
POST /auth/password-reset/confirm
```

**リクエスト**
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword123"
}
```

---

### 2. 出荷計画 (Shipments)

#### 2.1 出荷計画一覧取得
```
GET /shipments
```

**クエリパラメータ**
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 20）
- `status`: ステータスフィルタ（planning, in_progress, shipped, arrived, completed, cancelled）
- `manufacturer_id`: メーカーIDフィルタ
- `forwarder_id`: フォワーダーIDフィルタ
- `due_date_from`: 納期開始日（YYYY-MM-DD）
- `due_date_to`: 納期終了日（YYYY-MM-DD）
- `search`: 検索キーワード（出荷コード、出荷名）
- `sort`: ソート項目（created_at, due_date, updated_at）
- `order`: ソート順（asc, desc）

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "shipment_code": "SHP-2026-0001",
        "shipment_name": "米国向け食品出荷",
        "manufacturer": {
          "id": 1,
          "name": "株式会社ABC製造"
        },
        "packing_company": {
          "id": 2,
          "name": "株式会社福富運送"
        },
        "forwarder": {
          "id": 3,
          "name": "佐川グローバルロジスティクス"
        },
        "flow_pattern": "via_packing",
        "destination_country": "アメリカ",
        "due_date": "2026-02-15",
        "status": "in_progress",
        "progress_percentage": 45,
        "carton_count": 120,
        "pallet_count": 8,
        "container_count": 1,
        "total_weight_kg": 2400.5,
        "created_at": "2026-01-10T09:00:00Z",
        "updated_at": "2026-01-14T15:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 95,
      "items_per_page": 20
    }
  }
}
```

#### 2.2 出荷計画詳細取得
```
GET /shipments/:id
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "shipment_code": "SHP-2026-0001",
    "shipment_name": "米国向け食品出荷",
    "manufacturer": {
      "id": 1,
      "name": "株式会社ABC製造",
      "address": "東京都千代田区..."
    },
    "packing_company": {
      "id": 2,
      "name": "株式会社福富運送",
      "address": "神奈川県横浜市..."
    },
    "forwarder": {
      "id": 3,
      "name": "佐川グローバルロジスティクス",
      "address": "東京都港区..."
    },
    "flow_pattern": "via_packing",
    "destination_country": "アメリカ",
    "destination_port": "ロサンゼルス港",
    "destination_address": "123 Main St, Los Angeles, CA 90001, USA",
    "due_date": "2026-02-15",
    "ship_date": "2026-02-10",
    "estimated_arrival_date": "2026-03-01",
    "status": "in_progress",
    "progress_percentage": 45,
    "carton_count": 120,
    "pallet_count": 8,
    "container_count": 1,
    "total_weight_kg": 2400.5,
    "notes": "温度管理が必要な商品を含む",
    "created_at": "2026-01-10T09:00:00Z",
    "updated_at": "2026-01-14T15:30:00Z",
    "created_by": {
      "id": 5,
      "name": "山田 花子"
    }
  }
}
```

#### 2.3 出荷計画作成
```
POST /shipments
```

**リクエスト**
```json
{
  "shipment_name": "米国向け食品出荷",
  "manufacturer_id": 1,
  "packing_company_id": 2,
  "forwarder_id": 3,
  "flow_pattern": "via_packing",
  "destination_country": "アメリカ",
  "destination_port": "ロサンゼルス港",
  "destination_address": "123 Main St, Los Angeles, CA 90001, USA",
  "due_date": "2026-02-15",
  "ship_date": "2026-02-10",
  "estimated_arrival_date": "2026-03-01",
  "notes": "温度管理が必要な商品を含む"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "shipment_code": "SHP-2026-0001",
    ...
  },
  "message": "出荷計画を作成しました"
}
```

#### 2.4 出荷計画更新
```
PUT /shipments/:id
```

**リクエスト**
```json
{
  "shipment_name": "米国向け食品出荷（更新）",
  "due_date": "2026-02-20",
  ...
}
```

#### 2.5 出荷計画削除
```
DELETE /shipments/:id
```

#### 2.6 出荷計画ステータス更新
```
PATCH /shipments/:id/status
```

**リクエスト**
```json
{
  "status": "shipped",
  "notes": "2026年2月10日に出荷完了"
}
```

---

### 3. 段ボール (Cartons)

#### 3.1 段ボール一覧取得
```
GET /shipments/:shipmentId/cartons
```

**クエリパラメータ**
- `page`, `limit`: ページネーション
- `status`: ステータスフィルタ
- `pallet_id`: パレットIDフィルタ

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "carton_code": "CTN-2026-0001",
        "shipment_id": 1,
        "carton_size": {
          "id": 2,
          "name": "M",
          "dimensions": "40x30x30cm"
        },
        "weight_kg": 15.5,
        "barcode": "123456789012",
        "qr_code": "https://...",
        "products": [
          {
            "product_id": 10,
            "product_name": "オーガニック緑茶",
            "quantity": 24
          }
        ],
        "destination_address": "123 Main St, Los Angeles, CA",
        "pallet": {
          "id": 5,
          "pallet_code": "PLT-2026-0001"
        },
        "status": "packed",
        "current_location": "packing_company",
        "created_at": "2026-01-12T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 3.2 段ボール詳細取得
```
GET /cartons/:id
```

#### 3.3 段ボール作成
```
POST /shipments/:shipmentId/cartons
```

**リクエスト**
```json
{
  "carton_size_id": 2,
  "custom_length_cm": 40,
  "custom_width_cm": 30,
  "custom_height_cm": 30,
  "weight_kg": 15.5,
  "destination_address": "123 Main St, Los Angeles, CA",
  "products": [
    {
      "product_id": 10,
      "quantity": 24
    }
  ],
  "required_labels": ["fnsku", "nutrition"],
  "required_documents": ["fda_notice", "fsvp_consent"]
}
```

#### 3.4 段ボール更新
```
PUT /cartons/:id
```

#### 3.5 段ボール削除
```
DELETE /cartons/:id
```

#### 3.6 段ボール一括作成
```
POST /shipments/:shipmentId/cartons/bulk
```

**リクエスト**
```json
{
  "cartons": [
    { ... },
    { ... }
  ]
}
```

#### 3.7 段ボールバーコード生成
```
GET /cartons/:id/barcode
```

**レスポンス**: 画像データ（PNG/SVG）

#### 3.8 段ボールQRコード生成
```
GET /cartons/:id/qrcode
```

---

### 4. パレット (Pallets)

#### 4.1 パレット一覧取得
```
GET /shipments/:shipmentId/pallets
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "pallet_code": "PLT-2026-0001",
        "shipment_id": 1,
        "pallet_size": {
          "id": 1,
          "name": "Standard",
          "dimensions": "120x100x150cm"
        },
        "total_weight_kg": 245.5,
        "total_volume_m3": 1.8,
        "stacking_layers": 5,
        "carton_count": 15,
        "cartons": [
          {
            "id": 1,
            "carton_code": "CTN-2026-0001",
            "layer_number": 1,
            "position_x": 0,
            "position_y": 0
          }
        ],
        "container": {
          "id": 1,
          "container_code": "CNT-2026-0001"
        },
        "status": "loaded",
        "current_location": "forwarder",
        "created_at": "2026-01-13T09:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 4.2 パレット詳細取得
```
GET /pallets/:id
```

#### 4.3 パレット作成
```
POST /shipments/:shipmentId/pallets
```

**リクエスト**
```json
{
  "pallet_size_id": 1,
  "destination_address": "123 Main St, Los Angeles, CA",
  "cartons": [
    {
      "carton_id": 1,
      "layer_number": 1,
      "position_x": 0,
      "position_y": 0
    }
  ]
}
```

#### 4.4 パレット更新
```
PUT /pallets/:id
```

#### 4.5 パレット削除
```
DELETE /pallets/:id
```

#### 4.6 段ボールのパレット割当
```
POST /pallets/:id/cartons
```

**リクエスト**
```json
{
  "carton_id": 15,
  "layer_number": 3,
  "position_x": 1,
  "position_y": 0
}
```

#### 4.7 段ボールのパレット割当解除
```
DELETE /pallets/:palletId/cartons/:cartonId
```

#### 4.8 パレット積付図取得
```
GET /pallets/:id/loading-diagram
```

**レスポンス**: 画像データまたはJSON形式の積付データ

---

### 5. コンテナ (Containers)

#### 5.1 コンテナ一覧取得
```
GET /shipments/:shipmentId/containers
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "container_code": "CNT-2026-0001",
        "shipment_id": 1,
        "container_size": {
          "id": 2,
          "name": "40ft",
          "dimensions": "1203x235x239cm"
        },
        "pallet_count": 18,
        "total_weight_kg": 4500.0,
        "total_volume_m3": 33.2,
        "loading_rate_percent": 78.5,
        "destination_country": "アメリカ",
        "destination_port": "ロサンゼルス港",
        "vessel_name": "MAERSK TOKYO",
        "voyage_number": "V123",
        "departure_date": "2026-02-15",
        "estimated_arrival_date": "2026-03-01",
        "status": "loaded",
        "pallets": [
          {
            "id": 1,
            "pallet_code": "PLT-2026-0001",
            "position_x": 0,
            "position_y": 0,
            "position_z": 0
          }
        ],
        "created_at": "2026-01-13T14:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 5.2 コンテナ詳細取得
```
GET /containers/:id
```

#### 5.3 コンテナ作成
```
POST /shipments/:shipmentId/containers
```

**リクエスト**
```json
{
  "container_code": "MAEU1234567",
  "container_size_id": 2,
  "destination_country": "アメリカ",
  "destination_port": "ロサンゼルス港",
  "destination_address": "123 Main St, Los Angeles, CA",
  "vessel_name": "MAERSK TOKYO",
  "voyage_number": "V123",
  "departure_date": "2026-02-15",
  "estimated_arrival_date": "2026-03-01",
  "pallets": [
    {
      "pallet_id": 1,
      "position_x": 0,
      "position_y": 0,
      "position_z": 0
    }
  ]
}
```

#### 5.4 コンテナ更新
```
PUT /containers/:id
```

#### 5.5 コンテナ削除
```
DELETE /containers/:id
```

#### 5.6 パレットのコンテナ割当
```
POST /containers/:id/pallets
```

#### 5.7 パレットのコンテナ割当解除
```
DELETE /containers/:containerId/pallets/:palletId
```

#### 5.8 コンテナ積付図取得
```
GET /containers/:id/loading-diagram
```

---

### 6. 商品 (Products)

#### 6.1 商品一覧取得
```
GET /products
```

**クエリパラメータ**
- `page`, `limit`
- `manufacturer_id`: メーカーIDフィルタ
- `search`: 検索キーワード

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product_code": "PROD-001",
        "product_name": "オーガニック緑茶",
        "product_name_en": "Organic Green Tea",
        "manufacturer": {
          "id": 1,
          "name": "株式会社ABC製造"
        },
        "jan_code": "4901234567890",
        "hs_code": "0902.10",
        "country_of_origin": "日本",
        "pricing": {
          "cost_price": 500,
          "selling_price": 1200,
          "currency": "JPY"
        },
        "amazon_info": {
          "asin": "B08XYZ1234",
          "seller_sku": "GREEN-TEA-001",
          "fnsku": "X001ABC123"
        },
        "dimensions": {
          "length_cm": 10,
          "width_cm": 8,
          "height_cm": 15,
          "weight_kg": 0.5,
          "volume_weight_kg": 0.02
        },
        "set_info": {
          "is_set_product": false,
          "base_product_id": null,
          "set_quantity": 1
        },
        "requires_fnsku_label": true,
        "requires_nutrition_label": true,
        "is_active": true,
        "created_at": "2026-01-01T00:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 6.2 商品詳細取得
```
GET /products/:id
```

#### 6.3 商品作成
```
POST /products
```

**リクエスト**
```json
{
  "product_code": "PROD-001",
  "product_name": "オーガニック緑茶",
  "product_name_en": "Organic Green Tea",
  "manufacturer_id": 1,
  "length_cm": 10,
  "width_cm": 8,
  "height_cm": 15,
  "weight_kg": 0.5,
  "hs_code": "0902.10",
  "country_of_origin": "日本",
  "requires_fnsku_label": true,
  "requires_nutrition_label": true,
  "default_labels": ["fnsku", "nutrition"],
  "default_documents": ["fda_notice"],
  "description": "有機栽培された高品質な緑茶"
}
```

#### 6.4 商品更新
```
PUT /products/:id
```

#### 6.5 商品削除
```
DELETE /products/:id
```

---

### 7. 作業指示 (Work Instructions)

#### 7.1 作業指示一覧取得
```
GET /work-instructions
```

**クエリパラメータ**
- `page`, `limit`
- `organization_id`: 組織IDフィルタ（現在のユーザーの組織に自動フィルタ）
- `status`: ステータスフィルタ
- `instruction_type`: 指示種別フィルタ（packing, loading, shipping）
- `due_date_from`, `due_date_to`

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "instruction_code": "WI-2026-0001",
        "shipment": {
          "id": 1,
          "shipment_code": "SHP-2026-0001",
          "shipment_name": "米国向け食品出荷"
        },
        "instruction_type": "packing",
        "title": "FNSKUラベル貼付・詰替え作業",
        "description": "メーカーから入荷した商品にFNSKUラベルを貼付し、指定の段ボールに詰替え",
        "due_date": "2026-01-20",
        "status": "pending",
        "assigned_at": "2026-01-14T10:00:00Z",
        "created_at": "2026-01-14T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 7.2 作業指示詳細取得
```
GET /work-instructions/:id
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "instruction_code": "WI-2026-0001",
    "shipment": { ... },
    "instruction_type": "packing",
    "title": "FNSKUラベル貼付・詰替え作業",
    "description": "...",
    "instruction_data": {
      "incoming_cartons": [
        {
          "product_id": 10,
          "product_name": "オーガニック緑茶",
          "quantity": 240,
          "carton_size": "L",
          "carton_count": 10
        }
      ],
      "packing_instructions": [
        {
          "product_id": 10,
          "product_name": "オーガニック緑茶",
          "incoming_quantity": 240,
          "labels_to_attach": ["fnsku", "nutrition"],
          "target_carton_size": "M",
          "items_per_carton": 24,
          "total_cartons": 10,
          "documents_to_attach": ["fba_label", "fda_notice"]
        }
      ],
      "destination": {
        "organization": "佐川グローバルロジスティクス",
        "address": "東京都港区..."
      }
    },
    "due_date": "2026-01-20",
    "status": "pending",
    "work_reports": [
      {
        "id": 1,
        "report_type": "progress",
        "report_content": "入荷確認完了。作業開始。",
        "reported_by": {
          "id": 10,
          "name": "佐藤 一郎"
        },
        "reported_at": "2026-01-15T09:00:00Z"
      }
    ]
  }
}
```

#### 7.3 作業指示作成
```
POST /work-instructions
```

#### 7.4 作業指示更新
```
PUT /work-instructions/:id
```

#### 7.5 作業指示ステータス更新
```
PATCH /work-instructions/:id/status
```

**リクエスト**
```json
{
  "status": "in_progress",
  "notes": "作業を開始しました"
}
```

---

### 8. 作業報告 (Work Reports)

#### 8.1 作業報告一覧取得
```
GET /work-instructions/:instructionId/reports
```

#### 8.2 作業報告作成
```
POST /work-instructions/:instructionId/reports
```

**リクエスト**
```json
{
  "report_type": "progress",
  "report_content": "商品の入荷を確認しました。FNSKUラベルの貼付を開始します。",
  "report_data": {
    "cartons_received": 10,
    "cartons_processed": 0
  },
  "photo_urls": [
    "https://storage.example.com/photos/photo1.jpg"
  ]
}
```

#### 8.3 写真アップロード
```
POST /work-reports/:id/photos
```

**リクエスト**: multipart/form-data
- `photo`: 画像ファイル

**レスポンス**
```json
{
  "success": true,
  "data": {
    "photo_url": "https://storage.example.com/photos/photo1.jpg"
  }
}
```

---

### 9. トラッキング (Tracking)

#### 9.1 トラッキング検索
```
GET /tracking/search
```

**クエリパラメータ**
- `carton_code`: 段ボールコード
- `pallet_code`: パレットコード
- `container_code`: コンテナコード
- `product_name`: 商品名

**レスポンス**
```json
{
  "success": true,
  "data": {
    "entity_type": "carton",
    "entity_id": 1,
    "carton": {
      "id": 1,
      "carton_code": "CTN-2026-0001",
      "products": [...],
      "pallet": {...},
      "container": {...}
    },
    "current_status": "in_transit",
    "current_location": "forwarder",
    "progress_percentage": 65,
    "events": [
      {
        "id": 1,
        "event_type": "created",
        "event_description": "段ボール作成",
        "location": "株式会社ABC製造",
        "latitude": 35.6812,
        "longitude": 139.7671,
        "performed_by": {
          "id": 5,
          "name": "山田 花子"
        },
        "event_at": "2026-01-12T10:00:00Z"
      },
      {
        "id": 2,
        "event_type": "shipped",
        "event_description": "梱包業者へ出荷",
        "location": "株式会社ABC製造",
        "photo_urls": ["https://..."],
        "performed_by": {...},
        "event_at": "2026-01-13T14:00:00Z"
      },
      {
        "id": 3,
        "event_type": "arrived",
        "event_description": "梱包業者に到着",
        "location": "株式会社福富運送",
        "performed_by": {...},
        "event_at": "2026-01-14T09:00:00Z"
      }
    ]
  }
}
```

#### 9.2 トラッキングイベント追加
```
POST /tracking/events
```

**リクエスト**
```json
{
  "entity_type": "carton",
  "entity_id": 1,
  "event_type": "scanned",
  "event_description": "入荷確認スキャン",
  "location": "株式会社福富運送",
  "latitude": 35.4437,
  "longitude": 139.6380,
  "photo_urls": ["https://..."]
}
```

---

### 10. 通知 (Notifications)

#### 10.1 通知一覧取得
```
GET /notifications
```

**クエリパラメータ**
- `is_read`: 既読フィルタ（true/false）
- `notification_type`: 通知種別フィルタ

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "notification_type": "work_assigned",
        "title": "新しい作業指示が割り当てられました",
        "message": "WI-2026-0001: FNSKUラベル貼付・詰替え作業",
        "related_entity_type": "work_instruction",
        "related_entity_id": 1,
        "is_read": false,
        "sent_at": "2026-01-14T10:00:00Z"
      }
    ],
    "unread_count": 5
  }
}
```

#### 10.2 通知を既読にする
```
PATCH /notifications/:id/read
```

#### 10.3 通知を全て既読にする
```
PATCH /notifications/read-all
```

#### 10.4 通知削除
```
DELETE /notifications/:id
```

---

### 11. マスタデータ (Master Data)

#### 11.1 組織一覧取得
```
GET /organizations
```

#### 11.2 組織詳細取得
```
GET /organizations/:id
```

#### 11.3 組織作成
```
POST /organizations
```

#### 11.4 組織更新
```
PUT /organizations/:id
```

#### 11.5 段ボールサイズマスタ取得
```
GET /master/carton-sizes
```

#### 11.6 パレットサイズマスタ取得
```
GET /master/pallet-sizes
```

#### 11.7 コンテナサイズマスタ取得
```
GET /master/container-sizes
```

---

### 12. ユーザー管理 (Users)

#### 12.1 ユーザー一覧取得
```
GET /users
```

#### 12.2 ユーザー詳細取得
```
GET /users/:id
```

#### 12.3 ユーザー作成
```
POST /users
```

**リクエスト**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "full_name": "田中 太郎",
  "organization_id": 1,
  "role": "packing_worker"
}
```

#### 12.4 ユーザー更新
```
PUT /users/:id
```

#### 12.5 ユーザー削除
```
DELETE /users/:id
```

#### 12.6 現在のユーザー情報取得
```
GET /users/me
```

#### 12.7 現在のユーザー情報更新
```
PUT /users/me
```

---

### 13. 書類・ラベル (Documents & Labels)

#### 13.1 書類テンプレート一覧取得
```
GET /document-templates
```

#### 13.2 書類生成
```
POST /cartons/:id/documents/generate
```

**リクエスト**
```json
{
  "template_id": 5,
  "document_type": "fda_notice",
  "variables": {
    "product_name": "オーガニック緑茶",
    "quantity": 24,
    "destination": "123 Main St, Los Angeles, CA"
  }
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "document_id": 15,
    "file_url": "https://storage.example.com/documents/fda-notice-001.pdf"
  }
}
```

#### 13.3 ラベルテンプレート一覧取得
```
GET /label-templates
```

#### 13.4 ラベル生成
```
POST /cartons/:id/labels/generate
```

---

### 14. レポート (Reports)

#### 14.1 出荷実績レポート取得
```
GET /reports/shipments
```

**クエリパラメータ**
- `start_date`, `end_date`: 期間
- `manufacturer_id`, `forwarder_id`: フィルタ
- `format`: レスポンス形式（json, csv, excel, pdf）

**レスポンス**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_shipments": 45,
      "total_cartons": 5400,
      "total_pallets": 360,
      "total_containers": 18,
      "total_weight_kg": 108000
    },
    "by_month": [
      {
        "month": "2026-01",
        "shipment_count": 15,
        "carton_count": 1800,
        "total_weight_kg": 36000
      }
    ],
    "by_manufacturer": [...],
    "by_forwarder": [...],
    "by_status": [...]
  }
}
```

#### 14.2 遅延分析レポート取得
```
GET /reports/delays
```

#### 14.3 コスト分析レポート取得
```
GET /reports/costs
```

---

### 15. ダッシュボード (Dashboard)

#### 15.1 ダッシュボードデータ取得
```
GET /dashboard
```

**レスポンス**（役割によって異なる）
```json
{
  "success": true,
  "data": {
    "stats": {
      "shipments_this_month": 15,
      "shipments_in_progress": 8,
      "shipments_delayed": 2,
      "shipments_completed_this_month": 5
    },
    "recent_shipments": [...],
    "charts": {
      "monthly_shipments": [
        { "month": "2025-09", "count": 12 },
        { "month": "2025-10", "count": 15 },
        ...
      ]
    },
    "alerts": [
      {
        "type": "delay",
        "message": "SHP-2026-0003の納期が近づいています",
        "shipment_id": 3
      }
    ]
  }
}
```

---

### 16. 輸出計算 (Export Calculations)

#### 16.1 輸出計算実行
```
POST /shipments/:shipmentId/export-calculation
```

**リクエスト**
```json
{
  "calculation_name": "米国FedEx輸出",
  "carrier_type": "fedex",
  "source_currency": "JPY",
  "target_currency": "USD",
  "exchange_rate": 0.0067,
  "save_as_template": true,
  "template_name": "米国向け標準"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "calculation_id": 1,
    "summary": {
      "total_items": 240,
      "total_cartons": 10,
      "total_pallets": 2,
      "total_weight_kg": 120.5,
      "total_volume_m3": 2.4,
      "total_value_jpy": 288000,
      "total_value_usd": 1929.60,
      "exchange_rate": 0.0067
    },
    "items_breakdown": [
      {
        "product_id": 1,
        "product_name": "オーガニック緑茶",
        "jan_code": "4901234567890",
        "hs_code": "0902.10",
        "quantity": 240,
        "unit_price_jpy": 1200,
        "total_price_jpy": 288000,
        "unit_price_usd": 8.04,
        "total_price_usd": 1929.60,
        "unit_weight_kg": 0.5,
        "total_weight_kg": 120.0
      }
    ],
    "cartons_breakdown": [
      {
        "carton_id": 1,
        "carton_code": "CTN-2026-0001",
        "products": [
          {
            "product_id": 1,
            "quantity": 24
          }
        ],
        "total_value_jpy": 28800,
        "total_value_usd": 192.96,
        "total_weight_kg": 12.0
      }
    ],
    "pallets_breakdown": [
      {
        "pallet_id": 1,
        "pallet_code": "PLT-2026-0001",
        "carton_count": 5,
        "total_value_jpy": 144000,
        "total_value_usd": 964.80,
        "total_weight_kg": 60.0
      }
    ],
    "carrier_data": {
      "fedex_commercial_invoice": {
        "shipper": {...},
        "consignee": {...},
        "items": [...],
        "total_value": 1929.60,
        "currency": "USD"
      }
    }
  }
}
```

#### 16.2 輸出計算履歴取得
```
GET /shipments/:shipmentId/export-calculations
```

#### 16.3 輸出計算詳細取得
```
GET /export-calculations/:id
```

#### 16.4 輸出計算をテンプレートとして保存
```
POST /export-calculations/:id/save-as-template
```

#### 16.5 輸出計算テンプレート一覧取得
```
GET /export-calculation-templates
```

#### 16.6 テンプレートから輸出計算作成
```
POST /shipments/:shipmentId/export-calculation/from-template
```

**リクエスト**
```json
{
  "template_id": 5,
  "exchange_rate": 0.0067
}
```

---

### 17. AI梱包提案 (Packing Suggestions)

#### 17.1 段ボールサイズ提案取得
```
POST /shipments/:shipmentId/suggestions/carton-size
```

**リクエスト**
```json
{
  "products": [
    {
      "product_id": 1,
      "quantity": 240
    }
  ],
  "destination_type": "amazon_fba"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "rank": 1,
        "carton_size": {
          "id": 2,
          "name": "M",
          "dimensions": "40x30x30cm"
        },
        "quantity": 10,
        "products_per_carton": 24,
        "space_efficiency_percent": 92.5,
        "weight_balance_score": 9.0,
        "compliance_score": 10.0,
        "total_score": 9.5,
        "reason": "Amazon FBA規定内で最も効率的",
        "warnings": []
      },
      {
        "rank": 2,
        "carton_size": {
          "id": 3,
          "name": "L",
          "dimensions": "50x40x35cm"
        },
        "quantity": 8,
        "products_per_carton": 30,
        "space_efficiency_percent": 88.0,
        "weight_balance_score": 8.5,
        "compliance_score": 9.0,
        "total_score": 8.8,
        "reason": "より大きな段ボールで数を削減",
        "warnings": ["重量が制限に近い"]
      }
    ]
  }
}
```

#### 17.2 段ボール梱包方法提案取得
```
POST /shipments/:shipmentId/suggestions/carton-packing
```

#### 17.3 パレット積付提案取得
```
POST /shipments/:shipmentId/suggestions/pallet-loading
```

**リクエスト**
```json
{
  "carton_ids": [1, 2, 3, 4, 5],
  "pallet_size_id": 1,
  "destination_type": "amazon_fba"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "rank": 1,
        "pallet_layout": {
          "layers": 4,
          "cartons_per_layer": 4,
          "total_cartons": 16,
          "arrangement": [
            {
              "layer": 1,
              "cartons": [
                {"carton_id": 1, "position": "A1"},
                {"carton_id": 2, "position": "A2"},
                {"carton_id": 3, "position": "B1"},
                {"carton_id": 4, "position": "B2"}
              ]
            }
          ]
        },
        "total_height_cm": 120,
        "total_weight_kg": 240,
        "space_efficiency_percent": 95.0,
        "weight_balance_score": 9.5,
        "compliance_score": 10.0,
        "total_score": 9.7,
        "warnings": [],
        "visualization_url": "https://storage.example.com/visualizations/pallet-1.png"
      }
    ]
  }
}
```

#### 17.4 提案の承認
```
POST /packing-suggestions/:id/accept
```

#### 17.5 提案の修正
```
PUT /packing-suggestions/:id/modify
```

**リクエスト**
```json
{
  "modified_data": {
    "layers": 3,
    "cartons_per_layer": 5
  },
  "modification_notes": "高さを抑えるため3段に変更"
}
```

#### 17.6 提案の却下
```
POST /packing-suggestions/:id/reject
```

---

### 18. 配送先規定 (Shipping Regulations)

#### 18.1 配送先規定一覧取得
```
GET /shipping-regulations
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "regulation_code": "AMAZON_FBA_STANDARD",
        "regulation_name": "Amazon FBA標準規定",
        "destination_type": "amazon_fba",
        "carton_limits": {
          "max_length_cm": 63.5,
          "max_weight_kg": 22.7,
          "max_girth_cm": null
        },
        "pallet_limits": {
          "standard_length_cm": 121.9,
          "standard_width_cm": 101.6,
          "max_height_cm": 182.9,
          "max_weight_kg": 680.4
        },
        "required_labels": ["fnsku", "fba_label"],
        "required_documents": ["invoice", "packing_list"]
      }
    ]
  }
}
```

#### 18.2 規定準拠チェック
```
POST /shipping-regulations/validate
```

**リクエスト**
```json
{
  "destination_type": "amazon_fba",
  "cartons": [
    {
      "length_cm": 40,
      "width_cm": 30,
      "height_cm": 30,
      "weight_kg": 15.5
    }
  ],
  "pallets": [
    {
      "length_cm": 121.9,
      "width_cm": 101.6,
      "height_cm": 180.0,
      "weight_kg": 650.0
    }
  ]
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "is_compliant": true,
    "carton_validations": [
      {
        "carton_index": 0,
        "is_compliant": true,
        "violations": []
      }
    ],
    "pallet_validations": [
      {
        "pallet_index": 0,
        "is_compliant": true,
        "violations": []
      }
    ],
    "warnings": [],
    "recommendations": [
      "余裕を持った積載を推奨します"
    ]
  }
}
```

---

### 19. 出荷テンプレート (Shipment Templates)

#### 19.1 出荷テンプレート一覧取得
```
GET /shipment-templates
```

#### 19.2 出荷テンプレート詳細取得
```
GET /shipment-templates/:id
```

#### 19.3 出荷テンプレート作成
```
POST /shipment-templates
```

**リクエスト**
```json
{
  "template_name": "米国Amazon FBA標準出荷",
  "template_description": "米国Amazon FBAへの標準的な出荷パターン",
  "flow_pattern": "via_packing",
  "destination_country": "アメリカ",
  "destination_type": "amazon_fba",
  "products_template": [
    {
      "product_id": 1,
      "typical_quantity": 240
    }
  ],
  "cartons_template": [
    {
      "carton_size_id": 2,
      "quantity": 10
    }
  ],
  "pallets_template": [
    {
      "pallet_size_id": 1,
      "quantity": 2
    }
  ]
}
```

#### 19.4 テンプレートから出荷計画作成
```
POST /shipments/from-template
```

**リクエスト**
```json
{
  "template_id": 5,
  "shipment_name": "2026年2月 米国向け出荷",
  "due_date": "2026-02-28",
  "customizations": {
    "products": [
      {
        "product_id": 1,
        "quantity": 300
      }
    ]
  }
}
```

---

## Webhook（オプション）

### イベント通知
特定のイベントが発生した際に、登録されたWebhook URLにPOSTリクエストを送信

**サポートイベント**:
- `shipment.created`
- `shipment.status_changed`
- `carton.created`
- `carton.status_changed`
- `work_instruction.assigned`
- `work_instruction.completed`

**ペイロード例**:
```json
{
  "event": "shipment.status_changed",
  "timestamp": "2026-01-14T15:30:00Z",
  "data": {
    "shipment_id": 1,
    "shipment_code": "SHP-2026-0001",
    "old_status": "in_progress",
    "new_status": "shipped"
  }
}
```

---

## レート制限

- 認証済みユーザー: 1000リクエスト/時間
- 未認証: 100リクエスト/時間

レスポンスヘッダー:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1705240800
```

---

## エラーコード一覧

| コード | メッセージ | 説明 |
|--------|-----------|------|
| AUTH_001 | Invalid credentials | メールアドレスまたはパスワードが正しくありません |
| AUTH_002 | Token expired | トークンの有効期限が切れています |
| AUTH_003 | Insufficient permissions | 権限がありません |
| VALID_001 | Validation error | 入力値が不正です |
| VALID_002 | Required field missing | 必須項目が入力されていません |
| NOT_FOUND_001 | Resource not found | 指定されたリソースが見つかりません |
| CONFLICT_001 | Resource already exists | リソースが既に存在します |
| SERVER_001 | Internal server error | サーバー内部エラーが発生しました |

---

## バージョニング

- URLベースのバージョニング: `/api/v1/...`
- メジャーバージョンアップ時は新しいURLパスを提供
- 旧バージョンは最低1年間サポート


