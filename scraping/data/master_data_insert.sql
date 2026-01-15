-- ========================================
-- 商品マスタと段ボールサイズマスタの更新
-- 生成日時: 2026-01-15T01:19:01.423Z
-- ========================================

-- 既存データをクリア（必要に応じてコメント解除）
-- DELETE FROM product_carton_recommendation;
-- DELETE FROM product_master;
-- DELETE FROM carton_size_master;

-- 商品マスタ (product_master)
INSERT INTO product_master (
  product_name, sku, jan_code, asin, fnsku, hs_code,
  supplier, unit_weight, unit_weight_lb,
  standard_box_quantity, category
) VALUES
(
    'ヨーグルト種菌1袋セット', '1103.19', 'タニカ電器',
    NULL, NULL, NULL,
    '0.02kg', 1, 2.205,
    120, '発酵食品'
  ),
(
    'ヨーグルト種菌3袋セット', '1103.19', 'タニカ電器',
    NULL, NULL, NULL,
    '0.02kg', 3, 6.614,
    NULL, '発酵食品'
  ),
(
    '甘酒酵素1袋セット', '1103.19', 'タニカ電器',
    NULL, NULL, NULL,
    '0.02kg', 1, 2.205,
    120, '発酵食品'
  ),
(
    '甘酒酵素3袋セット', '1103.19', 'タニカ電器',
    NULL, NULL, NULL,
    '0.02kg', 1, 2.205,
    NULL, '発酵食品'
  ),
(
    '米麹1袋セット', '20250920-850', '4560139331087',
    'B0FRZLZS17', 'X004UJ9M9N', '1103.19',
    'タニカ電器', 0.51, 1.124,
    30, '発酵食品'
  ),
(
    '米麹5袋セット', '20250920-850', '4560139331087',
    'B0FRZLZS17', 'X004UJ9M9N', '1103.19',
    'タニカ電器', 0.51, 1.124,
    0, '発酵食品'
  ),
(
    '黒ゴマアーモンドきな粉150g×1袋セット', '20250126-190B-1', '4972560302527',
    'B0DWL6Q2SB', 'X004KCL5SL', '1208.1',
    '幸田商店', 0.16, 0.353,
    110, '粉末食品'
  ),
(
    '黒ゴマアーモンドきな粉150g×2袋セット', '20250126-190B-2', '4582772450895',
    'B0DWL4XL5C', 'X004KCRT31', '1208.1',
    '幸田商店', 0.16, 0.353,
    90, '粉末食品'
  ),
(
    '黒ゴマアーモンドきな粉150g×10袋セット', '1208.1', '幸田商店',
    NULL, NULL, NULL,
    NULL, 0.16, 0.353,
    10, '粉末食品'
  ),
(
    'きな粉150g×1袋セット', '20250126-190A-1', '4972560302510',
    'B0DYWFZR6F', 'X004LB82G9', '1208.1',
    '幸田商店', 0.16, 0.353,
    120, '粉末食品'
  ),
(
    'きな粉150g×2袋セット', '20250126-190A-2', '4582772450871',
    'B0DYX3Q97S', 'X004LANHID', '1208.1',
    '幸田商店', 0.16, 0.353,
    120, '粉末食品'
  ),
(
    'きな粉150g×20袋セット', '1208.1', '幸田商店',
    NULL, NULL, NULL,
    NULL, 0.16, 0.353,
    10, '粉末食品'
  ),
(
    'きな粉 500g×1袋セット', '20250126-90-1', '4972560302503',
    'B0F91MKCY9', 'X004OUUYKT', '1208.1',
    '幸田商店', 0.5, 1.102,
    60, '粉末食品'
  );

-- 段ボールサイズマスタ (carton_size_master)
INSERT INTO carton_size_master (
  carton_code, carton_name, supplier,
  inner_length_mm, inner_width_mm, inner_height_mm,
  outer_total_cm, thickness, material_type,
  delivery_size, product_url, unit_price, currency
) VALUES
(
    'MA120-134', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（664×184×148mm）8mm W/F C5×C5', 'ダンボールワン',
    664, 184, 148,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-134', NULL, 'JPY'
  ),
(
    'MA120-152', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（634×194×148mm）8mm W/F C5×C5', 'ダンボールワン',
    634, 194, 148,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-152', NULL, 'JPY'
  ),
(
    'MA120-192', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（614×204×148mm）8mm W/F C5×C5', 'ダンボールワン',
    614, 204, 148,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-192', NULL, 'JPY'
  ),
(
    'MA120-172', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（624×204×148mm）8mm W/F C5×C5', 'ダンボールワン',
    624, 204, 148,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-172', NULL, 'JPY'
  ),
(
    'MA140-259', '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（614×454×238mm）3mm B/F C5×C5', 'ダンボールワン',
    614, 454, 238,
    140, '3mm B/F', 'C5×C5',
    '宅配140サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA140-259', NULL, 'JPY'
  ),
(
    'MAS140-115', '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（614×454×238mm）3mm B/F 白C5×C5', 'ダンボールワン',
    614, 454, 238,
    140, '3mm B/F', 'C5×C5',
    '宅配140サイズ', 'https://www.notosiki.co.jp/item/detail?num=MAS140-115', NULL, 'JPY'
  ),
(
    'MA140-287', '【宅配140サイズ】1100×1100パレットぴったりサイズダンボール箱［1段4箱×7段］（594×474×238mm）3mm B/F C5×C5', 'ダンボールワン',
    594, 474, 238,
    140, '3mm B/F', 'C5×C5',
    '宅配140サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA140-287', NULL, 'JPY'
  ),
(
    'MA120-418', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（440×300×230mm）5mm A/F K5×K5', 'ダンボールワン',
    440, 300, 230,
    120, '5mm A/F', 'K5×K5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-418', NULL, 'JPY'
  ),
(
    'MAS120-189', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（440×300×230mm）5mm A/F 白C5×C5', 'ダンボールワン',
    440, 300, 230,
    120, '5mm A/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MAS120-189', NULL, 'JPY'
  ),
(
    'MA120-419', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（440×300×230mm）5mm A/F K6×強化芯180g×K6', 'ダンボールワン',
    440, 300, 230,
    120, '5mm A/F', 'K6×強化芯180g×K6',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-419', NULL, 'JPY'
  ),
(
    'MA120-138', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（634×194×268mm）8mm W/F C5×C5', 'ダンボールワン',
    634, 194, 268,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-138', NULL, 'JPY'
  ),
(
    'MA120-540', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段16箱×3段］（304×194×568mm）8mm W/F C5×C5', 'ダンボールワン',
    304, 194, 568,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-540', NULL, 'JPY'
  ),
(
    'MA120-176', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×6段］（614×204×268mm）8mm W/F C5×C5', 'ダンボールワン',
    614, 204, 268,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-176', NULL, 'JPY'
  ),
(
    'MA120-320', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（524×254×168mm）8mm W/F C5×C5', 'ダンボールワン',
    524, 254, 168,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-320', NULL, 'JPY'
  ),
(
    'MA120-348', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（494×264×188mm）8mm W/F C5×C5', 'ダンボールワン',
    494, 264, 188,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-348', NULL, 'JPY'
  ),
(
    'MA120-318', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（530×260×180mm）5mm A/F K5×K5', 'ダンボールワン',
    530, 260, 180,
    120, '5mm A/F', 'K5×K5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-318', NULL, 'JPY'
  ),
(
    'MA120-277', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（564×244×188mm）3mm B/F C5×C5', 'ダンボールワン',
    564, 244, 188,
    120, '3mm B/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-277', NULL, 'JPY'
  ),
(
    'MAS120-120', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×9段］（564×244×188mm）3mm B/F 白C5×C5', 'ダンボールワン',
    564, 244, 188,
    120, '3mm B/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MAS120-120', NULL, 'JPY'
  ),
(
    'MA120-273', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×8段］（564×244×208mm）3mm B/F C5×C5', 'ダンボールワン',
    564, 244, 208,
    120, '3mm B/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-273', NULL, 'JPY'
  ),
(
    'MA120-260', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×10段］（574×224×148mm）8mm W/F C5×C5', 'ダンボールワン',
    574, 224, 148,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-260', NULL, 'JPY'
  ),
(
    'MA120-440', '【宅配120サイズ】1100×1100パレットぴったりサイズダンボール箱［1段8箱×7段］（424×304×218mm）8mm W/F C5×C5', 'ダンボールワン',
    424, 304, 218,
    120, '8mm W/F', 'C5×C5',
    '宅配120サイズ', 'https://www.notosiki.co.jp/item/detail?num=MA120-440', NULL, 'JPY'
  );

-- 商品段ボール推奨マッピング (product_carton_recommendation)
INSERT INTO product_carton_recommendation (
  product_id, carton_id, quantity_from, quantity_to,
  priority, is_historical
) VALUES
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 24, 36,
    1, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 24, 36,
    2, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 24, 36,
    3, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 40, 60,
    1, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 40, 60,
    2, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-172' LIMIT 1), 40, 60,
    3, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA140-259' LIMIT 1), 96, 144,
    1, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MAS140-115' LIMIT 1), 96, 144,
    2, FALSE
  ),
(
    1, (SELECT id FROM carton_size_master WHERE carton_code = 'MA140-287' LIMIT 1), 96, 144,
    3, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 24, 36,
    1, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 24, 36,
    2, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 24, 36,
    3, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 40, 60,
    1, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 40, 60,
    2, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-172' LIMIT 1), 40, 60,
    3, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA140-259' LIMIT 1), 96, 144,
    1, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MAS140-115' LIMIT 1), 96, 144,
    2, FALSE
  ),
(
    2, (SELECT id FROM carton_size_master WHERE carton_code = 'MA140-287' LIMIT 1), 96, 144,
    3, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-418' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MAS120-189' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    3, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-419' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 24, 36,
    1, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 24, 36,
    2, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 24, 36,
    3, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-138' LIMIT 1), 40, 60,
    1, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-540' LIMIT 1), 40, 60,
    2, FALSE
  ),
(
    4, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-176' LIMIT 1), 40, 60,
    3, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 3,
    1, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 3,
    2, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 3,
    3, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 3, 5,
    1, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 3, 5,
    2, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 3, 5,
    3, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    5, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 40, 60,
    1, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 40, 60,
    2, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 40, 60,
    3, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-320' LIMIT 1), 80, 120,
    1, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-348' LIMIT 1), 80, 120,
    2, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-318' LIMIT 1), 80, 120,
    3, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    6, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 24, 36,
    1, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 24, 36,
    2, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 24, 36,
    3, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-277' LIMIT 1), 40, 60,
    1, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MAS120-120' LIMIT 1), 40, 60,
    2, FALSE
  ),
(
    7, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-273' LIMIT 1), 40, 60,
    3, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 3,
    1, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 3,
    2, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 3,
    3, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 3, 5,
    1, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 3, 5,
    2, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 3, 5,
    3, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    8, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 32, 48,
    1, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 32, 48,
    2, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 32, 48,
    3, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 80, 120,
    1, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 80, 120,
    2, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 80, 120,
    3, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-320' LIMIT 1), 160, 240,
    1, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-348' LIMIT 1), 160, 240,
    2, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-318' LIMIT 1), 160, 240,
    3, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    9, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 1, 1,
    1, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 1, 1,
    2, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 1, 1,
    3, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 4, 6,
    1, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 4, 6,
    2, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 4, 6,
    3, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-134' LIMIT 1), 8, 12,
    1, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-152' LIMIT 1), 8, 12,
    2, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 8, 12,
    3, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-192' LIMIT 1), 16, 24,
    1, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-172' LIMIT 1), 16, 24,
    2, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-260' LIMIT 1), 16, 24,
    3, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-440' LIMIT 1), 24, 36,
    1, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MA120-418' LIMIT 1), 24, 36,
    2, FALSE
  ),
(
    10, (SELECT id FROM carton_size_master WHERE carton_code = 'MAS120-189' LIMIT 1), 24, 36,
    3, FALSE
  );
