// 業務フローパターンマスタデータ

export interface FlowPattern {
  id: number;
  name: string;
  code: string;
  requiresPacking: boolean;
  description: string;
}

export const flowPatterns: FlowPattern[] = [
  {
    id: 1,
    name: '直送（メーカー → フォワーダー）',
    code: 'direct',
    requiresPacking: false,
    description: 'メーカーから直接フォワーダーに配送'
  },
  {
    id: 2,
    name: '梱包業者経由（メーカー → 梱包業者 → フォワーダー）',
    code: 'via_packing',
    requiresPacking: true,
    description: 'メーカーから梱包業者を経由してフォワーダーに配送'
  },
  {
    id: 3,
    name: '複数拠点経由（メーカー → 梱包業者A → 梱包業者B → フォワーダー）',
    code: 'multi_packing',
    requiresPacking: true,
    description: '複数の梱包業者を経由して配送する特殊ルート'
  },
  {
    id: 4,
    name: '国内配送のみ（メーカー → 梱包業者）',
    code: 'domestic_only',
    requiresPacking: true,
    description: '国内での梱包・保管のみ（輸出なし）'
  },
];




