// 最終目的地マスタデータ
// Amazon FBA/AWD倉庫 + スーパーマーケット

import { amazonFacilities, AmazonFacility } from './amazon-facilities';
import { supermarketLocations, SupermarketLocation } from './supermarket-locations';

export type DestinationType = 'amazon_fba' | 'amazon_awd' | 'supermarket';

export interface Destination {
  id: number;
  code: string;
  name: string;
  fullName: string;
  type: DestinationType;
  country: string;
  port: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contactEmail?: string;
  phone?: string;
  notes?: string;
  brand?: 'marukai' | 'tokyo_central';  // スーパーマーケットの場合
}

// Amazon倉庫とスーパーマーケットを統合
export const allDestinations: Destination[] = [
  ...amazonFacilities.map(facility => ({
    id: facility.id,
    code: facility.code,
    name: facility.name,
    fullName: facility.fullName,
    type: facility.type as DestinationType,
    country: facility.country,
    port: facility.port,
    address: facility.address,
    city: facility.city,
    state: facility.state,
    zip: facility.zip,
    contactEmail: facility.contactEmail,
    notes: facility.notes
  })),
  ...supermarketLocations.map(location => ({
    id: location.id,
    code: location.code,
    name: location.name,
    fullName: location.fullName,
    type: location.type as DestinationType,
    country: location.country,
    port: location.port,
    address: location.address,
    city: location.city,
    state: location.state,
    zip: location.zip,
    phone: location.phone,
    notes: location.notes,
    brand: location.brand
  }))
];

// タイプ別にフィルタリング
export const getDestinationsByType = (type: DestinationType) => {
  return allDestinations.filter(d => d.type === type);
};

// Amazon FBA倉庫のみ
export const getAmazonFBADestinations = () => {
  return allDestinations.filter(d => d.type === 'amazon_fba');
};

// Amazon AWD倉庫のみ
export const getAmazonAWDDestinations = () => {
  return allDestinations.filter(d => d.type === 'amazon_awd');
};

// スーパーマーケットのみ
export const getSupermarketDestinations = () => {
  return allDestinations.filter(d => d.type === 'supermarket');
};

// 州別にグループ化
export const getDestinationsByState = (state: string) => {
  return allDestinations.filter(d => d.state === state);
};

// IDで検索
export const getDestinationById = (id: number) => {
  return allDestinations.find(d => d.id === id);
};

// コードで検索
export const getDestinationByCode = (code: string) => {
  return allDestinations.find(d => d.code === code);
};

// 主要な州のリスト
export const MAJOR_STATES = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'WA', name: 'Washington' },
  { code: 'NV', name: 'Nevada' },
  { code: 'IL', name: 'Illinois' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'OH', name: 'Ohio' },
  { code: 'IN', name: 'Indiana' },
];




