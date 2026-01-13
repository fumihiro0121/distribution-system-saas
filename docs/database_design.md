# データベース設計書

## ER図（概念）

```
[organizations] 1----* [users]
[organizations] 1----* [shipments]
[shipments] 1----* [cartons]
[shipments] 1----* [pallets]
[shipments] 1----* [containers]
[products] *----* [cartons] (through carton_products)
[cartons] *----* [pallets] (through pallet_cartons)
[pallets] *----* [containers] (through container_pallets)
[shipments] 1----* [work_instructions]
[work_instructions] 1----* [work_reports]
[cartons] 1----* [carton_documents]
[cartons] 1----* [carton_labels]
```

---

## テーブル定義

### 1. organizations（組織マスタ）
```sql
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    organization_code VARCHAR(50) UNIQUE NOT NULL,
    organization_name VARCHAR(200) NOT NULL,
    organization_type VARCHAR(50) NOT NULL, -- 'manufacturer', 'packing_company', 'forwarder'
    address VARCHAR(500),
    postal_code VARCHAR(20),
    phone_number VARCHAR(50),
    email VARCHAR(200),
    contact_person VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_organizations_type ON organizations(organization_type);
CREATE INDEX idx_organizations_code ON organizations(organization_code);
```

### 2. users（ユーザー）
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role VARCHAR(50) NOT NULL, -- 'admin', 'manufacturer', 'packing_worker', 'forwarder_worker'
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 3. products（商品マスタ）
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    product_code VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(300) NOT NULL,
    product_name_en VARCHAR(300),
    manufacturer_id BIGINT REFERENCES organizations(id),
    
    -- 識別コード
    jan_code VARCHAR(13), -- JANコード（JAN-13またはJAN-8）
    hs_code VARCHAR(20), -- HSコード（HTSコード）
    country_of_origin VARCHAR(100),
    
    -- 価格情報
    cost_price DECIMAL(12,2), -- 原価
    selling_price DECIMAL(12,2), -- 売価
    currency VARCHAR(3) DEFAULT 'JPY', -- 通貨（ISO 4217）
    
    -- Amazon情報
    asin VARCHAR(10), -- Amazon Standard Identification Number
    seller_sku VARCHAR(100), -- Amazon Seller SKU
    fnsku VARCHAR(10), -- Fulfillment Network SKU
    
    -- サイズ・重量情報
    length_cm DECIMAL(10,2),
    width_cm DECIMAL(10,2),
    height_cm DECIMAL(10,2),
    weight_kg DECIMAL(10,3),
    volume_weight_kg DECIMAL(10,3), -- 容積重量（自動計算）
    
    -- セット商品管理
    base_product_id BIGINT REFERENCES products(id), -- 基本商品（1個単位）
    set_quantity INTEGER DEFAULT 1, -- セット数（1、2、3など）
    is_set_product BOOLEAN DEFAULT FALSE, -- セット商品フラグ
    
    -- ラベル・書類
    requires_fnsku_label BOOLEAN DEFAULT FALSE,
    requires_nutrition_label BOOLEAN DEFAULT FALSE,
    default_labels JSON, -- ['fnsku', 'nutrition', 'made_in_japan']
    default_documents JSON, -- ['fda_notice', 'fsvp_consent']
    
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX idx_products_jan ON products(jan_code);
CREATE INDEX idx_products_asin ON products(asin);
CREATE INDEX idx_products_fnsku ON products(fnsku);
CREATE INDEX idx_products_base ON products(base_product_id);
CREATE INDEX idx_products_set ON products(is_set_product);

-- 容積重量自動計算トリガー
CREATE OR REPLACE FUNCTION calculate_volume_weight()
RETURNS TRIGGER AS $$
BEGIN
    -- 容積重量 = (長さ × 幅 × 高さ) / 6000 (国際配送の標準)
    IF NEW.length_cm IS NOT NULL AND NEW.width_cm IS NOT NULL AND NEW.height_cm IS NOT NULL THEN
        NEW.volume_weight_kg := (NEW.length_cm * NEW.width_cm * NEW.height_cm) / 6000.0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_volume_weight
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION calculate_volume_weight();
```

### 4. carton_size_master（段ボールサイズマスタ）
```sql
CREATE TABLE carton_size_master (
    id BIGSERIAL PRIMARY KEY,
    size_code VARCHAR(50) UNIQUE NOT NULL,
    size_name VARCHAR(100) NOT NULL, -- 'S', 'M', 'L', 'LL'
    length_cm DECIMAL(10,2) NOT NULL,
    width_cm DECIMAL(10,2) NOT NULL,
    height_cm DECIMAL(10,2) NOT NULL,
    max_weight_kg DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. pallet_size_master（パレットサイズマスタ）
```sql
CREATE TABLE pallet_size_master (
    id BIGSERIAL PRIMARY KEY,
    size_code VARCHAR(50) UNIQUE NOT NULL,
    size_name VARCHAR(100) NOT NULL, -- 'Standard', 'L', 'LL'
    length_cm DECIMAL(10,2) NOT NULL,
    width_cm DECIMAL(10,2) NOT NULL,
    height_cm DECIMAL(10,2),
    max_weight_kg DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. container_size_master（コンテナサイズマスタ）
```sql
CREATE TABLE container_size_master (
    id BIGSERIAL PRIMARY KEY,
    size_code VARCHAR(50) UNIQUE NOT NULL,
    size_name VARCHAR(100) NOT NULL, -- '20ft', '40ft', '40ft HC'
    length_cm DECIMAL(10,2) NOT NULL,
    width_cm DECIMAL(10,2) NOT NULL,
    height_cm DECIMAL(10,2) NOT NULL,
    max_weight_kg DECIMAL(10,2),
    max_volume_m3 DECIMAL(10,3),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. shipments（出荷計画）
```sql
CREATE TABLE shipments (
    id BIGSERIAL PRIMARY KEY,
    shipment_code VARCHAR(100) UNIQUE NOT NULL,
    shipment_name VARCHAR(300),
    manufacturer_id BIGINT NOT NULL REFERENCES organizations(id),
    packing_company_id BIGINT REFERENCES organizations(id), -- NULL if direct to forwarder
    forwarder_id BIGINT NOT NULL REFERENCES organizations(id),
    flow_pattern VARCHAR(20) NOT NULL, -- 'direct' or 'via_packing'
    destination_country VARCHAR(100),
    destination_port VARCHAR(200),
    destination_address VARCHAR(500),
    due_date DATE,
    ship_date DATE,
    estimated_arrival_date DATE,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'in_progress', 'shipped', 'arrived', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_shipments_manufacturer ON shipments(manufacturer_id);
CREATE INDEX idx_shipments_packing_company ON shipments(packing_company_id);
CREATE INDEX idx_shipments_forwarder ON shipments(forwarder_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_due_date ON shipments(due_date);
```

### 8. cartons（段ボール）
```sql
CREATE TABLE cartons (
    id BIGSERIAL PRIMARY KEY,
    carton_code VARCHAR(100) UNIQUE NOT NULL,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    carton_size_id BIGINT REFERENCES carton_size_master(id),
    custom_length_cm DECIMAL(10,2),
    custom_width_cm DECIMAL(10,2),
    custom_height_cm DECIMAL(10,2),
    weight_kg DECIMAL(10,3),
    barcode VARCHAR(200),
    qr_code VARCHAR(500),
    destination_address VARCHAR(500),
    pallet_id BIGINT REFERENCES pallets(id),
    current_location VARCHAR(200), -- 'manufacturer', 'packing_company', 'forwarder', 'in_transit', 'delivered'
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'packed', 'shipped', 'delivered'
    packed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_cartons_shipment ON cartons(shipment_id);
CREATE INDEX idx_cartons_pallet ON cartons(pallet_id);
CREATE INDEX idx_cartons_status ON cartons(status);
CREATE INDEX idx_cartons_code ON cartons(carton_code);
```

### 9. carton_products（段ボール-商品関連）
```sql
CREATE TABLE carton_products (
    id BIGSERIAL PRIMARY KEY,
    carton_id BIGINT NOT NULL REFERENCES cartons(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(carton_id, product_id)
);

CREATE INDEX idx_carton_products_carton ON carton_products(carton_id);
CREATE INDEX idx_carton_products_product ON carton_products(product_id);
```

### 10. pallets（パレット）
```sql
CREATE TABLE pallets (
    id BIGSERIAL PRIMARY KEY,
    pallet_code VARCHAR(100) UNIQUE NOT NULL,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    pallet_size_id BIGINT REFERENCES pallet_size_master(id),
    total_weight_kg DECIMAL(10,3),
    total_volume_m3 DECIMAL(10,3),
    stacking_layers INTEGER, -- 段数
    carton_count INTEGER, -- 箱数
    destination_address VARCHAR(500),
    container_id BIGINT REFERENCES containers(id),
    barcode VARCHAR(200),
    qr_code VARCHAR(500),
    current_location VARCHAR(200),
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'loading', 'loaded', 'shipped', 'delivered'
    loaded_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_pallets_shipment ON pallets(shipment_id);
CREATE INDEX idx_pallets_container ON pallets(container_id);
CREATE INDEX idx_pallets_status ON pallets(status);
CREATE INDEX idx_pallets_code ON pallets(pallet_code);
```

### 11. pallet_cartons（パレット-段ボール関連）
```sql
CREATE TABLE pallet_cartons (
    id BIGSERIAL PRIMARY KEY,
    pallet_id BIGINT NOT NULL REFERENCES pallets(id) ON DELETE CASCADE,
    carton_id BIGINT NOT NULL REFERENCES cartons(id),
    layer_number INTEGER, -- 何段目か
    position_x INTEGER, -- X座標
    position_y INTEGER, -- Y座標
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    UNIQUE(carton_id) -- 1つの段ボールは1つのパレットのみに属する
);

CREATE INDEX idx_pallet_cartons_pallet ON pallet_cartons(pallet_id);
CREATE INDEX idx_pallet_cartons_carton ON pallet_cartons(carton_id);
```

### 12. containers（コンテナ）
```sql
CREATE TABLE containers (
    id BIGSERIAL PRIMARY KEY,
    container_code VARCHAR(100) UNIQUE NOT NULL,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    container_size_id BIGINT REFERENCES container_size_master(id),
    pallet_count INTEGER,
    total_weight_kg DECIMAL(10,3),
    total_volume_m3 DECIMAL(10,3),
    loading_rate_percent DECIMAL(5,2), -- 積載率
    destination_country VARCHAR(100),
    destination_port VARCHAR(200),
    destination_address VARCHAR(500),
    vessel_name VARCHAR(200), -- 船名
    voyage_number VARCHAR(100), -- 便名
    departure_date DATE, -- 出港日
    estimated_arrival_date DATE, -- 到着予定日
    actual_arrival_date DATE, -- 実到着日
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'loading', 'loaded', 'departed', 'arrived'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_containers_shipment ON containers(shipment_id);
CREATE INDEX idx_containers_status ON containers(status);
CREATE INDEX idx_containers_departure_date ON containers(departure_date);
```

### 13. container_pallets（コンテナ-パレット関連）
```sql
CREATE TABLE container_pallets (
    id BIGSERIAL PRIMARY KEY,
    container_id BIGINT NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    pallet_id BIGINT NOT NULL REFERENCES pallets(id),
    position_x INTEGER,
    position_y INTEGER,
    position_z INTEGER,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT
);

CREATE INDEX idx_container_pallets_container ON container_pallets(container_id);
CREATE INDEX idx_container_pallets_pallet ON container_pallets(pallet_id);
```

### 14. document_templates（書類テンプレート）
```sql
CREATE TABLE document_templates (
    id BIGSERIAL PRIMARY KEY,
    template_code VARCHAR(100) UNIQUE NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'shipping_label', 'fba_label', 'fda_notice', 'fsvp_consent', 'invoice', 'packing_list'
    template_content TEXT, -- HTML or PDF template
    variables JSON, -- ['product_name', 'quantity', 'address']
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_document_templates_type ON document_templates(document_type);
```

### 15. carton_documents（段ボール-書類関連）
```sql
CREATE TABLE carton_documents (
    id BIGSERIAL PRIMARY KEY,
    carton_id BIGINT NOT NULL REFERENCES cartons(id) ON DELETE CASCADE,
    document_template_id BIGINT REFERENCES document_templates(id),
    document_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500), -- S3 or Azure Blob path
    file_url VARCHAR(500),
    is_printed BOOLEAN DEFAULT FALSE,
    printed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT
);

CREATE INDEX idx_carton_documents_carton ON carton_documents(carton_id);
CREATE INDEX idx_carton_documents_type ON carton_documents(document_type);
```

### 16. label_templates（ラベルテンプレート）
```sql
CREATE TABLE label_templates (
    id BIGSERIAL PRIMARY KEY,
    template_code VARCHAR(100) UNIQUE NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    label_type VARCHAR(100) NOT NULL, -- 'fnsku', 'nutrition', 'product', 'carton', 'pallet'
    template_content TEXT,
    width_mm DECIMAL(10,2),
    height_mm DECIMAL(10,2),
    variables JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_label_templates_type ON label_templates(label_type);
```

### 17. carton_labels（段ボール-ラベル関連）
```sql
CREATE TABLE carton_labels (
    id BIGSERIAL PRIMARY KEY,
    carton_id BIGINT NOT NULL REFERENCES cartons(id) ON DELETE CASCADE,
    label_template_id BIGINT REFERENCES label_templates(id),
    label_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    is_printed BOOLEAN DEFAULT FALSE,
    printed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT
);

CREATE INDEX idx_carton_labels_carton ON carton_labels(carton_id);
CREATE INDEX idx_carton_labels_type ON carton_labels(label_type);
```

### 18. work_instructions（作業指示）
```sql
CREATE TABLE work_instructions (
    id BIGSERIAL PRIMARY KEY,
    instruction_code VARCHAR(100) UNIQUE NOT NULL,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    assigned_organization_id BIGINT NOT NULL REFERENCES organizations(id),
    instruction_type VARCHAR(50) NOT NULL, -- 'packing', 'loading', 'shipping'
    title VARCHAR(300),
    description TEXT,
    instruction_data JSON, -- 作業内容の詳細（JSON形式）
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    assigned_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_work_instructions_shipment ON work_instructions(shipment_id);
CREATE INDEX idx_work_instructions_organization ON work_instructions(assigned_organization_id);
CREATE INDEX idx_work_instructions_status ON work_instructions(status);
CREATE INDEX idx_work_instructions_due_date ON work_instructions(due_date);
```

### 19. work_reports（作業報告）
```sql
CREATE TABLE work_reports (
    id BIGSERIAL PRIMARY KEY,
    work_instruction_id BIGINT NOT NULL REFERENCES work_instructions(id) ON DELETE CASCADE,
    reported_by BIGINT NOT NULL REFERENCES users(id),
    report_type VARCHAR(50) NOT NULL, -- 'progress', 'completion', 'issue'
    report_content TEXT,
    report_data JSON, -- 作業結果の詳細
    photo_urls JSON, -- ['https://...', 'https://...']
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_reports_instruction ON work_reports(work_instruction_id);
CREATE INDEX idx_work_reports_reporter ON work_reports(reported_by);
```

### 20. notifications（通知）
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'shipment_created', 'work_assigned', 'work_completed', 'delay_alert'
    title VARCHAR(300),
    message TEXT,
    related_entity_type VARCHAR(50), -- 'shipment', 'work_instruction', etc.
    related_entity_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

### 21. audit_logs（操作ログ）
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    entity_type VARCHAR(100), -- 'shipment', 'carton', 'pallet', etc.
    entity_id BIGINT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 22. tracking_events（トラッキングイベント）
```sql
CREATE TABLE tracking_events (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'carton', 'pallet', 'container'
    entity_id BIGINT NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'created', 'packed', 'shipped', 'arrived', 'scanned'
    event_description TEXT,
    location VARCHAR(200),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    photo_urls JSON,
    performed_by BIGINT REFERENCES users(id),
    event_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tracking_events_entity ON tracking_events(entity_type, entity_id);
CREATE INDEX idx_tracking_events_type ON tracking_events(event_type);
CREATE INDEX idx_tracking_events_time ON tracking_events(event_at);
```

### 23. shipping_regulations（配送先別規定マスタ）
```sql
CREATE TABLE shipping_regulations (
    id BIGSERIAL PRIMARY KEY,
    regulation_code VARCHAR(100) UNIQUE NOT NULL,
    regulation_name VARCHAR(200) NOT NULL,
    destination_type VARCHAR(100) NOT NULL, -- 'amazon_fba', 'amazon_awd', 'general_export', 'supermarket'
    
    -- 段ボール制限
    carton_max_length_cm DECIMAL(10,2),
    carton_max_width_cm DECIMAL(10,2),
    carton_max_height_cm DECIMAL(10,2),
    carton_max_weight_kg DECIMAL(10,2),
    carton_max_girth_cm DECIMAL(10,2), -- 胴回り（長さ + (幅+高さ)×2）
    
    -- パレット制限
    pallet_standard_length_cm DECIMAL(10,2), -- 標準: 1219mm (48インチ)
    pallet_standard_width_cm DECIMAL(10,2), -- 標準: 1016mm (40インチ)
    pallet_max_height_cm DECIMAL(10,2), -- 最大高さ
    pallet_max_weight_kg DECIMAL(10,2),
    
    -- コンテナ制限
    container_20ft_pallet_count INTEGER, -- 20ftコンテナに積載可能なパレット数
    container_40ft_pallet_count INTEGER, -- 40ftコンテナに積載可能なパレット数
    
    -- ラベル・書類要件
    required_labels JSON, -- ['fnsku', 'shipping_label', 'made_in']
    required_documents JSON, -- ['invoice', 'packing_list', 'fda_notice']
    
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shipping_regulations_type ON shipping_regulations(destination_type);

-- デフォルトデータの挿入
INSERT INTO shipping_regulations (
    regulation_code, regulation_name, destination_type,
    carton_max_length_cm, carton_max_width_cm, carton_max_height_cm, carton_max_weight_kg,
    pallet_standard_length_cm, pallet_standard_width_cm, pallet_max_height_cm, pallet_max_weight_kg,
    required_labels, required_documents
) VALUES 
(
    'AMAZON_FBA_STANDARD',
    'Amazon FBA標準規定',
    'amazon_fba',
    63.5, -- 25インチ
    NULL,
    NULL,
    22.7, -- 50ポンド
    121.9, -- 48インチ
    101.6, -- 40インチ
    182.9, -- 72インチ
    680.4, -- 1500ポンド
    '["fnsku", "fba_label"]',
    '["invoice", "packing_list"]'
),
(
    'GENERAL_EXPORT_US',
    '一般輸出（米国向け）',
    'general_export',
    NULL,
    NULL,
    NULL,
    NULL,
    121.9, -- 48インチ
    101.6, -- 40インチ
    243.8, -- 96インチ
    1000.0,
    '["shipping_label", "made_in_japan"]',
    '["commercial_invoice", "packing_list", "certificate_of_origin"]'
);
```

### 24. export_calculations（輸出計算履歴）
```sql
CREATE TABLE export_calculations (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    calculation_name VARCHAR(200),
    
    -- 計算結果
    total_items INTEGER, -- 総商品数
    total_cartons INTEGER, -- 総段ボール数
    total_pallets INTEGER, -- 総パレット数
    total_weight_kg DECIMAL(10,3), -- 総重量
    total_volume_m3 DECIMAL(10,3), -- 総容積
    total_value_source_currency DECIMAL(12,2), -- 総額（元通貨）
    source_currency VARCHAR(3), -- 元通貨
    total_value_usd DECIMAL(12,2), -- 総額（USD換算）
    exchange_rate DECIMAL(10,4), -- 為替レート
    
    -- 商品別明細（JSON）
    items_breakdown JSON,
    -- 例: [{"product_id": 1, "product_name": "緑茶", "quantity": 100, "unit_price": 500, "total_price": 50000, "weight_kg": 50}]
    
    -- 段ボール別明細（JSON）
    cartons_breakdown JSON,
    
    -- パレット別明細（JSON）
    pallets_breakdown JSON,
    
    -- 配送業者向けデータ
    carrier_type VARCHAR(50), -- 'fedex', 'dhl', 'ups', 'ocean_freight', 'air_freight'
    carrier_data JSON, -- 配送業者固有のデータ
    
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calculated_by BIGINT REFERENCES users(id),
    
    -- テンプレートとして保存
    is_template BOOLEAN DEFAULT FALSE,
    template_name VARCHAR(200),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_export_calculations_shipment ON export_calculations(shipment_id);
CREATE INDEX idx_export_calculations_template ON export_calculations(is_template);
```

### 25. packing_suggestions（AI梱包提案）
```sql
CREATE TABLE packing_suggestions (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    suggestion_type VARCHAR(50) NOT NULL, -- 'carton_size', 'carton_packing', 'pallet_loading'
    
    -- 入力パラメータ
    input_parameters JSON,
    
    -- 提案内容
    suggestion_rank INTEGER, -- 1: 最適案、2: 代替案1、3: 代替案2
    suggestion_data JSON,
    -- carton_size例: {"carton_size_id": 2, "quantity": 10, "reason": "最も効率的"}
    -- carton_packing例: {"carton_id": 1, "products": [{"product_id": 1, "quantity": 24}], "arrangement": "2x3x4"}
    -- pallet_loading例: {"pallet_id": 1, "cartons": [{"carton_id": 1, "layer": 1, "position": "A1"}], "layers": 5}
    
    -- スコア
    space_efficiency_percent DECIMAL(5,2), -- 空間効率
    weight_balance_score DECIMAL(5,2), -- 重量バランス（1-10）
    compliance_score DECIMAL(5,2), -- 規定準拠度（1-10）
    total_score DECIMAL(5,2), -- 総合スコア
    
    -- 警告・注意事項
    warnings JSON, -- ["重量が制限に近い", "高さ制限に注意"]
    
    -- ステータス
    status VARCHAR(50) DEFAULT 'suggested', -- 'suggested', 'accepted', 'modified', 'rejected'
    accepted_at TIMESTAMP,
    accepted_by BIGINT REFERENCES users(id),
    
    -- 修正内容（管理者が修正した場合）
    modified_data JSON,
    modification_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT -- システムまたは管理者
);

CREATE INDEX idx_packing_suggestions_shipment ON packing_suggestions(shipment_id);
CREATE INDEX idx_packing_suggestions_type ON packing_suggestions(suggestion_type);
CREATE INDEX idx_packing_suggestions_status ON packing_suggestions(status);
```

### 26. shipment_templates（出荷テンプレート）
```sql
CREATE TABLE shipment_templates (
    id BIGSERIAL PRIMARY KEY,
    template_name VARCHAR(200) NOT NULL,
    template_description TEXT,
    organization_id BIGINT REFERENCES organizations(id),
    
    -- テンプレートデータ
    flow_pattern VARCHAR(20), -- 'direct' or 'via_packing'
    destination_country VARCHAR(100),
    destination_type VARCHAR(100), -- 'amazon_fba', 'general_export'
    
    -- 商品テンプレート
    products_template JSON,
    -- 例: [{"product_id": 1, "typical_quantity": 100}, {"product_id": 2, "typical_quantity": 50}]
    
    -- 梱包テンプレート
    cartons_template JSON,
    pallets_template JSON,
    
    -- 書類・ラベルテンプレート
    documents_template JSON,
    labels_template JSON,
    
    use_count INTEGER DEFAULT 0, -- 使用回数
    last_used_at TIMESTAMP,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT
);

CREATE INDEX idx_shipment_templates_org ON shipment_templates(organization_id);
CREATE INDEX idx_shipment_templates_destination ON shipment_templates(destination_type);
```

---

## ビュー定義（便利なビュー）

### 1. v_shipment_overview（出荷概要ビュー）
```sql
CREATE VIEW v_shipment_overview AS
SELECT 
    s.id,
    s.shipment_code,
    s.shipment_name,
    m.organization_name as manufacturer_name,
    p.organization_name as packing_company_name,
    f.organization_name as forwarder_name,
    s.destination_country,
    s.due_date,
    s.status,
    COUNT(DISTINCT c.id) as total_cartons,
    COUNT(DISTINCT pl.id) as total_pallets,
    COUNT(DISTINCT ct.id) as total_containers,
    SUM(c.weight_kg) as total_weight_kg,
    s.created_at,
    s.updated_at
FROM shipments s
LEFT JOIN organizations m ON s.manufacturer_id = m.id
LEFT JOIN organizations p ON s.packing_company_id = p.id
LEFT JOIN organizations f ON s.forwarder_id = f.id
LEFT JOIN cartons c ON s.id = c.shipment_id
LEFT JOIN pallets pl ON s.id = pl.shipment_id
LEFT JOIN containers ct ON s.id = ct.shipment_id
GROUP BY s.id, m.organization_name, p.organization_name, f.organization_name;
```

### 2. v_carton_details（段ボール詳細ビュー）
```sql
CREATE VIEW v_carton_details AS
SELECT 
    c.id,
    c.carton_code,
    c.shipment_id,
    s.shipment_code,
    c.weight_kg,
    COALESCE(c.custom_length_cm, csm.length_cm) as length_cm,
    COALESCE(c.custom_width_cm, csm.width_cm) as width_cm,
    COALESCE(c.custom_height_cm, csm.height_cm) as height_cm,
    c.status,
    c.current_location,
    p.pallet_code,
    STRING_AGG(pr.product_name || ' x ' || cp.quantity, ', ') as contents,
    c.created_at,
    c.updated_at
FROM cartons c
LEFT JOIN shipments s ON c.shipment_id = s.id
LEFT JOIN carton_size_master csm ON c.carton_size_id = csm.id
LEFT JOIN pallets p ON c.pallet_id = p.id
LEFT JOIN carton_products cp ON c.id = cp.carton_id
LEFT JOIN products pr ON cp.product_id = pr.id
GROUP BY c.id, s.shipment_code, csm.length_cm, csm.width_cm, csm.height_cm, p.pallet_code;
```

---

## インデックス最適化の推奨事項

1. **複合インデックス**:
   - `(shipment_id, status)` on cartons, pallets, containers
   - `(user_id, is_read)` on notifications
   - `(entity_type, entity_id, event_at)` on tracking_events

2. **全文検索インデックス**:
   - `product_name` in products
   - `shipment_name` in shipments

3. **パーティショニング**（大規模データの場合）:
   - `audit_logs` - 月次パーティション
   - `tracking_events` - 月次パーティション

---

## データ整合性チェック用トリガー

### 1. 段ボールがパレットに追加された時の重量・個数更新
```sql
CREATE OR REPLACE FUNCTION update_pallet_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pallets
    SET 
        carton_count = (SELECT COUNT(*) FROM pallet_cartons WHERE pallet_id = NEW.pallet_id),
        total_weight_kg = (
            SELECT COALESCE(SUM(c.weight_kg), 0)
            FROM pallet_cartons pc
            JOIN cartons c ON pc.carton_id = c.id
            WHERE pc.pallet_id = NEW.pallet_id
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.pallet_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pallet_stats
AFTER INSERT OR UPDATE OR DELETE ON pallet_cartons
FOR EACH ROW
EXECUTE FUNCTION update_pallet_stats();
```

### 2. パレットがコンテナに追加された時の統計更新
```sql
CREATE OR REPLACE FUNCTION update_container_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE containers
    SET 
        pallet_count = (SELECT COUNT(*) FROM container_pallets WHERE container_id = NEW.container_id),
        total_weight_kg = (
            SELECT COALESCE(SUM(p.total_weight_kg), 0)
            FROM container_pallets cp
            JOIN pallets p ON cp.pallet_id = p.id
            WHERE cp.container_id = NEW.container_id
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.container_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_container_stats
AFTER INSERT OR UPDATE OR DELETE ON container_pallets
FOR EACH ROW
EXECUTE FUNCTION update_container_stats();
```

---

## サンプルクエリ

### 1. 特定の出荷の進捗状況を取得
```sql
SELECT 
    s.shipment_code,
    s.status as shipment_status,
    COUNT(DISTINCT c.id) as total_cartons,
    COUNT(DISTINCT CASE WHEN c.status = 'delivered' THEN c.id END) as delivered_cartons,
    COUNT(DISTINCT pl.id) as total_pallets,
    COUNT(DISTINCT CASE WHEN pl.status = 'delivered' THEN pl.id END) as delivered_pallets
FROM shipments s
LEFT JOIN cartons c ON s.id = c.shipment_id
LEFT JOIN pallets pl ON s.id = pl.shipment_id
WHERE s.id = ?
GROUP BY s.id;
```

### 2. 特定の段ボールのトレース情報
```sql
SELECT 
    c.carton_code,
    p.product_name,
    cp.quantity,
    pl.pallet_code,
    ct.container_code,
    te.event_type,
    te.event_description,
    te.location,
    te.event_at
FROM cartons c
LEFT JOIN carton_products cp ON c.id = cp.carton_id
LEFT JOIN products p ON cp.product_id = p.id
LEFT JOIN pallets pl ON c.pallet_id = pl.id
LEFT JOIN containers ct ON pl.container_id = ct.id
LEFT JOIN tracking_events te ON te.entity_type = 'carton' AND te.entity_id = c.id
WHERE c.carton_code = ?
ORDER BY te.event_at DESC;
```

### 3. 梱包業者向け作業指示一覧
```sql
SELECT 
    wi.instruction_code,
    wi.title,
    s.shipment_code,
    s.manufacturer_id,
    wi.due_date,
    wi.status,
    COUNT(DISTINCT c.id) as carton_count
FROM work_instructions wi
JOIN shipments s ON wi.shipment_id = s.id
LEFT JOIN cartons c ON s.id = c.shipment_id
WHERE wi.assigned_organization_id = ?
    AND wi.status != 'completed'
GROUP BY wi.id, s.id
ORDER BY wi.due_date ASC;
```

---

## バックアップ・リストア戦略

### 日次バックアップ
```bash
pg_dump -Fc distribution_system > backup_$(date +%Y%m%d).dump
```

### リストア
```bash
pg_restore -d distribution_system backup_20260114.dump
```

### ポイントインタイムリカバリ（PITR）
- WAL（Write-Ahead Logging）を有効化
- 継続的アーカイブを設定
- 必要に応じて特定時点までリカバリ可能


