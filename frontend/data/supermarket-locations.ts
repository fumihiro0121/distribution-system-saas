// アメリカのスーパーマーケット倉庫データ
// マルカイ & トーキョーセントラル

export interface SupermarketLocation {
  id: number;
  code: string;
  name: string;
  fullName: string;
  country: string;
  port: string;
  address: string;
  type: 'supermarket';
  phone?: string;
  notes?: string;
  city: string;
  state: string;
  zip: string;
  brand: 'marukai' | 'tokyo_central';
}

export const supermarketLocations: SupermarketLocation[] = [
  // Marukai Market (5店舗)
  {
    id: 20001,
    code: 'MARUKAI-CUPERTINO',
    name: 'Marukai Market Cupertino',
    fullName: 'Marukai Market - Cupertino Store',
    country: 'アメリカ',
    port: 'オークランド港',
    address: '19750 Stevens Creek Blvd, Cupertino, CA 95014, USA',
    type: 'supermarket',
    phone: '408-200-4850',
    city: 'Cupertino',
    state: 'CA',
    zip: '95014',
    brand: 'marukai',
    notes: 'Marukai'
  },
  {
    id: 20002,
    code: 'MARUKAI-LITTLE-TOKYO',
    name: 'Marukai Market Little Tokyo',
    fullName: 'Marukai Market - Little Tokyo Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '123 S Onizuka St #105, Los Angeles, CA 90012, USA',
    type: 'supermarket',
    phone: '213-893-7200',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90012',
    brand: 'marukai',
    notes: 'Marukai'
  },
  {
    id: 20003,
    code: 'MARUKAI-SD-FOOD',
    name: 'Marukai Market San Diego (Food)',
    fullName: 'Marukai Market - San Diego Food Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '8151 Balboa Ave, San Diego, CA 92111, USA',
    type: 'supermarket',
    phone: '858-384-0248',
    city: 'San Diego',
    state: 'CA',
    zip: '92111',
    brand: 'marukai',
    notes: 'Marukai'
  },
  {
    id: 20004,
    code: 'MARUKAI-SD-LIVING',
    name: 'Marukai Market San Diego (Living)',
    fullName: 'Marukai Market - San Diego Living Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '8125 Balboa Ave, San Diego, CA 92111, USA',
    type: 'supermarket',
    phone: '858-384-0245',
    city: 'San Diego',
    state: 'CA',
    zip: '92111',
    brand: 'marukai',
    notes: 'Marukai'
  },
  {
    id: 20005,
    code: 'MARUKAI-WEST-LA',
    name: 'Marukai Market West LA',
    fullName: 'Marukai Market - West Los Angeles Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '12121 W Pico Blvd, Los Angeles, CA 90064, USA',
    type: 'supermarket',
    phone: '310-806-4120',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90064',
    brand: 'marukai',
    notes: 'Marukai'
  },

  // Tokyo Central (8店舗)
  {
    id: 20006,
    code: 'TOKYO-CENTRAL-GARDENA',
    name: 'Tokyo Central Gardena',
    fullName: 'Tokyo Central - Gardena Store (Largest)',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '1740 Artesia Blvd, Gardena, CA 90248, USA',
    type: 'supermarket',
    phone: '310-660-6300',
    city: 'Gardena',
    state: 'CA',
    zip: '90248',
    brand: 'tokyo_central',
    notes: 'Tokyo Central (Largest Store)'
  },
  {
    id: 20007,
    code: 'TOKYO-CENTRAL-MAIN-GARDENA',
    name: 'Tokyo Central & Main (Gardena)',
    fullName: 'Tokyo Central & Main - Gardena Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '1620 W Redondo Beach Blvd, Gardena, CA 90247, USA',
    type: 'supermarket',
    city: 'Gardena',
    state: 'CA',
    zip: '90247',
    brand: 'tokyo_central',
    notes: 'Tokyo Central & Main'
  },
  {
    id: 20008,
    code: 'TOKYO-CENTRAL-COSTA-MESA',
    name: 'Tokyo Central Costa Mesa',
    fullName: 'Tokyo Central - Costa Mesa Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '2975 Harbor Blvd, Costa Mesa, CA 92626, USA',
    type: 'supermarket',
    phone: '714-751-8433',
    city: 'Costa Mesa',
    state: 'CA',
    zip: '92626',
    brand: 'tokyo_central',
    notes: 'Tokyo Central'
  },
  {
    id: 20009,
    code: 'TOKYO-CENTRAL-YORBA-LINDA',
    name: 'Tokyo Central Yorba Linda',
    fullName: 'Tokyo Central - Yorba Linda Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '18171 Imperial Hwy, Yorba Linda, CA 92886, USA',
    type: 'supermarket',
    phone: '714-386-5110',
    city: 'Yorba Linda',
    state: 'CA',
    zip: '92886',
    brand: 'tokyo_central',
    notes: 'Tokyo Central'
  },
  {
    id: 20010,
    code: 'TOKYO-CENTRAL-WEST-COVINA',
    name: 'Tokyo Central West Covina',
    fullName: 'Tokyo Central - West Covina Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '1420 S Azusa Ave, West Covina, CA 91791, USA',
    type: 'supermarket',
    phone: '626-214-9590',
    city: 'West Covina',
    state: 'CA',
    zip: '91791',
    brand: 'tokyo_central',
    notes: 'Tokyo Central'
  },
  {
    id: 20011,
    code: 'TOKYO-CENTRAL-TORRANCE-SEP',
    name: 'Tokyo Central Torrance (Sepulveda)',
    fullName: 'Tokyo Central - Torrance Sepulveda Store',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '3832 Sepulveda Blvd, Torrance, CA 90505, USA',
    type: 'supermarket',
    phone: '310-375-4900',
    city: 'Torrance',
    state: 'CA',
    zip: '90505',
    brand: 'tokyo_central',
    notes: 'Tokyo Central'
  },
  {
    id: 20012,
    code: 'TOKYO-CENTRAL-TORRANCE-PCH',
    name: 'Tokyo Central Torrance (PCH)',
    fullName: 'Tokyo Central - Torrance Pacific Coast Hwy Store (New)',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '3665 Pacific Coast Hwy, Torrance, CA 90505, USA',
    type: 'supermarket',
    phone: '310-436-4374',
    city: 'Torrance',
    state: 'CA',
    zip: '90505',
    brand: 'tokyo_central',
    notes: 'Tokyo Central (New Location)'
  },
  {
    id: 20013,
    code: 'TOKYO-CENTRAL-IRVINE',
    name: 'Tokyo Central Irvine',
    fullName: 'Tokyo Central - Irvine Store (New)',
    country: 'アメリカ',
    port: 'ロサンゼルス港',
    address: '14120 Culver Dr, Irvine, CA 92604, USA',
    type: 'supermarket',
    city: 'Irvine',
    state: 'CA',
    zip: '92604',
    brand: 'tokyo_central',
    notes: 'Tokyo Central (New Location)'
  },
];




