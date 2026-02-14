// 取引先マスタデータ
// メーカー、梱包業者、フォワーダーの情報

export interface Company {
  id: number;
  code: string;
  name: string;
  type: 'manufacturer' | 'packer' | 'forwarder';
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  notes?: string;
}

export const companies: Company[] = [
  // メーカー
  {
    id: 1,
    code: 'MFR-KOUDA',
    name: '幸田商店',
    type: 'manufacturer',
    address: '〒444-0111 愛知県額田郡幸田町高力88',
    phone: '0564-62-1114',
    email: 'info@koda-shoten.co.jp',
    contactPerson: '幸田太郎',
    notes: 'きな粉、米の粉、黒ごまアーモンドきな粉、ほしいもの製造元'
  },
  {
    id: 2,
    code: 'MFR-TANICA',
    name: 'タニカ電器',
    type: 'manufacturer',
    address: '〒391-0013 長野県茅野市宮川4532-5',
    phone: '0266-72-1129',
    email: 'info@tanica.jp',
    contactPerson: '谷口次郎',
    notes: 'ヨーグルト種菌、米麹の製造元'
  },
  {
    id: 3,
    code: 'MFR-ONISHI',
    name: '尾西食品',
    type: 'manufacturer',
    address: '〒130-0005 東京都墨田区東駒形4-11-14',
    phone: '03-3829-7411',
    email: 'info@onisifoods.co.jp',
    contactPerson: '尾西三郎',
    notes: 'アルファ米、ライスクッキー等の製造元'
  },
  
  // 梱包業者
  {
    id: 101,
    code: 'PKR-SAMPLE1',
    name: 'サンプル梱包業者1',
    type: 'packer',
    address: '日本',
    notes: 'サンプルデータ'
  },
  {
    id: 102,
    code: 'PKR-SAMPLE2',
    name: 'サンプル梱包業者2',
    type: 'packer',
    address: '日本',
    notes: 'サンプルデータ'
  },
  
  // フォワーダー
  {
    id: 201,
    code: 'FWD-SAGAWA',
    name: '佐川グローバル',
    type: 'forwarder',
    address: '日本',
    notes: '国際物流フォワーダー'
  },
  {
    id: 202,
    code: 'FWD-NIPPON',
    name: '日本ジャパントラスト',
    type: 'forwarder',
    address: '日本',
    notes: '国際物流フォワーダー'
  },
  {
    id: 203,
    code: 'FWD-SAMPLE1',
    name: 'サンプルフォワーダー1',
    type: 'forwarder',
    address: '日本',
    notes: 'サンプルデータ'
  },
];

// タイプ別にフィルタリングする関数
export const getCompaniesByType = (type: Company['type']) => {
  return companies.filter(c => c.type === type);
};

export const getCompanyById = (id: number) => {
  return companies.find(c => c.id === id);
};

export const getCompanyByCode = (code: string) => {
  return companies.find(c => c.code === code);
};

