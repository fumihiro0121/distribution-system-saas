'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { amazonFacilities } from '@/data/amazon-facilities';
import { supermarketLocations } from '@/data/supermarket-locations';
import { flowPatterns as flowPatternsData } from '@/data/flow-patterns';
import { products as productsData } from '@/data/products';
import { getCartonRecommendations } from '@/data/carton-recommendations';
import Header from '@/app/components/Header';
import Navigation from '@/app/components/Navigation';
import AdvancedCartonSelector from '@/app/components/AdvancedCartonSelector';

// 配送先マスタデータ（Amazon FBA/AWD + スーパーマーケット）
const destinations = [...amazonFacilities, ...supermarketLocations];

const manufacturers = [
  { id: 1, name: 'ABC製造株式会社', address: '東京都港区芝1-1-1', phone: '03-1234-5678', email: 'info@abc-mfg.jp', contact: '山田太郎', president: '鈴木一郎' },
  { id: 2, name: 'XYZ食品株式会社', address: '大阪府大阪市北区梅田2-2-2', phone: '06-9876-5432', email: 'contact@xyz-food.jp', contact: '田中花子', president: '佐藤次郎' },
  { id: 3, name: '日本有機食品株式会社', address: '京都府京都市下京区四条通3-3-3', phone: '075-1111-2222', email: 'info@nihon-organic.jp', contact: '佐々木健', president: '高橋三郎' },
];

const packingCompanies = [
  { id: 1, name: '株式会社福富運送', address: '東京都江東区豊洲4-4-4', phone: '03-5555-6666', email: 'info@fukutomi.jp', contact: '福富太郎', president: '福富社長' },
  { id: 2, name: '梱包サービス東京株式会社', address: '東京都大田区平和島5-5-5', phone: '03-7777-8888', email: 'service@packing-tokyo.jp', contact: '梱包次郎', president: '梱包社長' },
];

const forwarders = [
  { id: 1, name: '佐川グローバルロジスティクス株式会社', address: '東京都江東区新木場6-6-6', phone: '03-8888-9999', email: 'global@sagawa.jp', contact: '佐川太郎', president: '佐川社長' },
  { id: 2, name: '日本ジャパントラスト株式会社', address: '横浜市中区山下町7-7-7', phone: '045-1234-5678', email: 'info@japan-trust.jp', contact: 'トラスト花子', president: 'トラスト社長' },
  { id: 3, name: 'DHLジャパン株式会社', address: '東京都品川区東品川8-8-8', phone: '03-0000-1111', email: 'japan@dhl.com', contact: 'DHL太郎', president: 'DHL社長' },
  { id: 4, name: 'FedExジャパン株式会社', address: '千葉市美浜区中瀬9-9-9', phone: '043-2222-3333', email: 'japan@fedex.com', contact: 'FedEx花子', president: 'FedEx社長' },
];

const deadlineTypes = [
  { id: 1, name: 'メーカーから梱包業者への納期', code: 'manufacturer_to_packing' },
  { id: 2, name: 'メーカーからフォワーダーへの納期', code: 'manufacturer_to_forwarder' },
  { id: 3, name: '梱包業者からフォワーダーへの納期', code: 'packing_to_forwarder' },
  { id: 4, name: 'フォワーダーから配送先への納期', code: 'forwarder_to_destination' },
];

export default function NewShipmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // フォーム状態
  const [formData, setFormData] = useState({
    shipmentDate: new Date().toISOString().split('T')[0],
    shipmentName: '',
    manufacturerIds: [] as number[],
    flowPatternIds: [] as number[], // 複数選択可能に変更
    packingCompanyIds: [] as number[],
    forwarderIds: [] as number[],
    destinationIds: [] as number[],
    selectedProducts: [] as Array<{productId: number; quantity: number}>,
    selectedCartons: {} as Record<number, Array<{
      code: string;
      name: string;
      innerDimensions: string;
      deliverySize: string;
      capacity: number;
      boxCount: number;
      bagsPerBox: number;
      totalBags: number;
      price: number;
      cartonWeight: number;
      totalWeight: number;
      palletConfig: {
        boxesPerLayer: number;
        layers: number;
        total: number;
      } | null;
    }>>,
    notes: '',
  });

  // 配送先情報（選択した配送先ごとに保持、修正可能）
  const [destinationInfoMap, setDestinationInfoMap] = useState<{[key: number]: {
    country: string;
    port: string;
    address: string;
  }}>({});

  // 納期情報
  const [deadlines, setDeadlines] = useState<{[key: string]: string}>({});

  // 検索フィルター
  const [destinationSearch, setDestinationSearch] = useState('');
  const [manufacturerSearch, setManufacturerSearch] = useState('');
  const [packingSearch, setPackingSearch] = useState('');
  const [forwarderSearch, setForwarderSearch] = useState('');
  const [flowPatternSearch, setFlowPatternSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // ページ読み込み時に保存されたデータを復元
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(parsed);

    // 保存されたフォームデータを復元
    const savedFormData = localStorage.getItem('shipmentFormData');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        // selectedProductsとselectedCartonsフィールドが存在しない場合は初期化
        setFormData({
          ...parsed,
          selectedProducts: parsed.selectedProducts || [],
          selectedCartons: parsed.selectedCartons || {}
        });
      } catch (e) {
        console.error('Failed to restore form data:', e);
      }
    }

    const savedDestinationInfoMap = localStorage.getItem('shipmentDestinationInfoMap');
    if (savedDestinationInfoMap) {
      try {
        setDestinationInfoMap(JSON.parse(savedDestinationInfoMap));
      } catch (e) {
        console.error('Failed to restore destination info:', e);
      }
    }

    const savedDeadlines = localStorage.getItem('shipmentDeadlines');
    if (savedDeadlines) {
      try {
        setDeadlines(JSON.parse(savedDeadlines));
      } catch (e) {
        console.error('Failed to restore deadlines:', e);
      }
    }
  }, [router]);

  // フォームデータが変更されたら自動保存
  useEffect(() => {
    if (user) {
      localStorage.setItem('shipmentFormData', JSON.stringify(formData));
    }
  }, [formData, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shipmentDestinationInfoMap', JSON.stringify(destinationInfoMap));
    }
  }, [destinationInfoMap, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shipmentDeadlines', JSON.stringify(deadlines));
    }
  }, [deadlines, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション: フローパターンが少なくとも1つ選択されているか
    if (formData.flowPatternIds.length === 0) {
      alert('少なくとも1つの業務フローパターンを選択してください');
      return;
    }
    
    // 出荷名を自動生成
    const selectedDestinations = destinations.filter(d => formData.destinationIds.includes(d.id));
    const destinationNames = selectedDestinations.map(d => d.name).join('＋');
    const autoShipmentName = `${formData.shipmentDate} ${destinationNames}向け輸出`;
    
    console.log('出荷計画作成:', {
      ...formData,
      shipmentName: formData.shipmentName || autoShipmentName,
      destinationInfoMap,
      deadlines,
    });
    
    // 保存されたデータをクリア
    localStorage.removeItem('shipmentFormData');
    localStorage.removeItem('shipmentDestinationInfoMap');
    localStorage.removeItem('shipmentDeadlines');
    
    alert('出荷計画を作成しました（デモ）\n\n出荷名: ' + (formData.shipmentName || autoShipmentName));
    router.push('/admin');
  };

  // 配送先が選択された時、自動的に情報を入力
  useEffect(() => {
    const newInfoMap = { ...destinationInfoMap };
    
    // 新しく選択された配送先の情報を追加
    formData.destinationIds.forEach(destId => {
      if (!newInfoMap[destId]) {
        const destination = destinations.find(d => d.id === destId);
        if (destination) {
          newInfoMap[destId] = {
            country: destination.country,
            port: destination.port,
            address: destination.address,
          };
        }
      }
    });
    
    // 選択解除された配送先の情報を削除
    Object.keys(newInfoMap).forEach(key => {
      const destId = parseInt(key);
      if (!formData.destinationIds.includes(destId)) {
        delete newInfoMap[destId];
      }
    });
    
    setDestinationInfoMap(newInfoMap);
  }, [formData.destinationIds]);

  // 納期タイプは常に全て表示（フローパターンに関係なく）
  const [customDeadlineTypes, setCustomDeadlineTypes] = useState(deadlineTypes);

  const toggleSelection = (array: number[], id: number) => {
    if (array.includes(id)) {
      return array.filter(item => item !== id);
    } else {
      return [...array, id];
    }
  };

  if (!user) return <div>Loading...</div>;

  // フィルタリング
  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    d.code.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    d.fullName.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  const filteredManufacturers = manufacturers.filter(m =>
    m.name.toLowerCase().includes(manufacturerSearch.toLowerCase())
  );

  const filteredPackingCompanies = packingCompanies.filter(p =>
    p.name.toLowerCase().includes(packingSearch.toLowerCase())
  );

  const filteredForwarders = forwarders.filter(f =>
    f.name.toLowerCase().includes(forwarderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-indigo-600"
        subtitle="管理者 - 出荷計画作成"
        userName={user.name}
      />
      <Navigation 
        items={['ダッシュボード', '出荷計画', '商品マスタ', '取引先', 'ユーザー管理', 'レポート']}
        activeItem="出荷計画"
        activeColor="indigo"
        role="admin"
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.push('/admin')}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            ← 戻る
          </button>
          <div className="flex space-x-2">
            <a
              href="/admin/masters/products"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              📦 商品マスタ管理
            </a>
            <a
              href="/admin/masters/cartons"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              📦 段ボールマスタ管理
            </a>
            <a
              href="/admin/masters/destinations"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              📍 配送先マスタ管理
            </a>
            <a
              href="/admin/masters/companies"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              🏢 取引先マスタ管理
            </a>
            <a
              href="/admin/masters/flow-patterns"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              🔄 フローパターン管理
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">新規出荷計画作成</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* 基本情報 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出荷日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="shipmentDate"
                    value={formData.shipmentDate}
                    onChange={(e) => setFormData({...formData, shipmentDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出荷名（自動生成、カスタマイズ可）
                  </label>
                  <input
                    type="text"
                    name="shipmentName"
                    value={formData.shipmentName}
                    onChange={(e) => setFormData({...formData, shipmentName: e.target.value})}
                    placeholder={`${formData.shipmentDate} ${destinations.filter(d => formData.destinationIds.includes(d.id)).map(d => d.name).join('＋')}向け輸出`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    未入力の場合は自動生成されます
                  </p>
                </div>
              </div>
            </div>

            {/* 商品選択 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">商品選択</h3>
              
              {/* 商品検索 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品を選択（複数選択可）
                </label>
                <input
                  type="text"
                  placeholder="商品名、SKU、JANコード、ASINで検索..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                />
                
                {/* 商品リスト */}
                <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {productsData
                      .filter(product =>
                        product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.janCode?.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.asin?.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .sort((a, b) => {
                        // 選択された商品を上部に表示
                        const aSelected = formData.selectedProducts?.some(p => p.productId === a.id) || false;
                        const bSelected = formData.selectedProducts?.some(p => p.productId === b.id) || false;
                        if (aSelected && !bSelected) return -1;
                        if (!aSelected && bSelected) return 1;
                        return 0;
                      })
                      .map((product) => {
                        const isSelected = formData.selectedProducts?.some(p => p.productId === product.id) || false;
                        const selectedProduct = formData.selectedProducts?.find(p => p.productId === product.id);
                        
                        return (
                          <div
                            key={product.id}
                            className={`p-4 hover:bg-gray-50 ${isSelected ? 'bg-indigo-50' : ''}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFormData({
                                          ...formData,
                                          selectedProducts: [...(formData.selectedProducts || []), { productId: product.id, quantity: 1 }]
                                        });
                                      } else {
                                        // 商品を削除する際に、その商品の段ボール選択データも削除
                                        const newSelectedCartons = { ...formData.selectedCartons };
                                        delete newSelectedCartons[product.id];
                                        
                                        setFormData({
                                          ...formData,
                                          selectedProducts: (formData.selectedProducts || []).filter(p => p.productId !== product.id),
                                          selectedCartons: newSelectedCartons
                                        });
                                      }
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label className="text-sm font-medium text-gray-900">
                                    {product.productName}
                                    <span className="text-gray-500 ml-2 text-xs">
                                      ({product.numberOfSets}セット、{product.bagsPerSet}袋)
                                    </span>
                                  </label>
                                </div>
                                <div className="ml-7 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                                  {product.sku && (
                                    <div>
                                      <span className="font-medium">SKU:</span> {product.sku}
                                    </div>
                                  )}
                                  {product.janCode && (
                                    <div>
                                      <span className="font-medium">JAN:</span> {product.janCode}
                                    </div>
                                  )}
                                  {product.asin && (
                                    <div>
                                      <span className="font-medium">ASIN:</span> {product.asin}
                                    </div>
                                  )}
                                  {product.category && (
                                    <div>
                                      <span className="font-medium">カテゴリ:</span> {product.category}
                                    </div>
                                  )}
                                </div>
                                <div className="ml-7 mt-2 text-xs">
                                  <div className="space-y-1">
                                    {/* 重量情報 */}
                                    {product.unitWeight && product.setWeight && (
                                      <div className="text-gray-500">
                                        <span className="font-medium text-gray-600">重量: </span>
                                        <span>単品 {product.unitWeight} → 1セット({product.bagsPerSet}袋) {product.setWeight}</span>
                                        {product.setWeightPounds && <span className="text-gray-400 ml-1">({product.setWeightPounds})</span>}
                                      </div>
                                    )}
                                    
                                    {/* 標準箱入数（データがある場合のみ表示） */}
                                    {product.standardBoxQuantity !== undefined && 
                                     product.standardBoxQuantity !== null && 
                                     product.standardBoxQuantity > 0 && (
                                      <div className="text-gray-500">
                                        <span className="font-medium text-gray-600">標準箱入数: </span>
                                        <span>{product.standardBoxQuantity}袋 ({product.standardBoxSetQuantity}セット)</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* セット数入力 */}
                              {isSelected && (
                                <div className="ml-4 space-y-2">
                                  <label className="block text-xs text-gray-600 mb-1">
                                    セット数 ({product.bagsPerSet}袋/セット)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={selectedProduct?.quantity || 1}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value) || 1;
                                      setFormData({
                                        ...formData,
                                        selectedProducts: (formData.selectedProducts || []).map(p =>
                                          p.productId === product.id
                                            ? { ...p, quantity: newQuantity }
                                            : p
                                        )
                                      });
                                    }}
                                    className="w-24 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  />
                                  
                                  {/* 選択セット数での総重量表示 */}
                                  {selectedProduct && product.setWeight && (
                                    <div className="text-xs">
                                      <span className="font-medium text-indigo-600">選択数量の総重量: </span>
                                      <span className="text-indigo-700">
                                        {selectedProduct.quantity}セット × {product.setWeight} = {(() => {
                                          // setWeightから数値を抽出（例: "2.55kg" → 2.55）
                                          const weightMatch = product.setWeight.match(/[\d.]+/);
                                          if (weightMatch) {
                                            const weight = parseFloat(weightMatch[0]);
                                            const totalWeight = (weight * selectedProduct.quantity).toFixed(2);
                                            return `${totalWeight}kg`;
                                          }
                                          return '-';
                                        })()}
                                      </span>
                                      <span className="text-gray-500 ml-1">
                                        ({selectedProduct.quantity * product.bagsPerSet}袋)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* 選択された商品のサマリー */}
              {formData.selectedProducts && formData.selectedProducts.length > 0 && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    選択済み商品: {formData.selectedProducts.length}件
                  </h4>
                  <div className="space-y-2">
                    {formData.selectedProducts.map((selectedProduct) => {
                      const product = productsData.find(p => p.id === selectedProduct.productId);
                      if (!product) return null;
                      
                      // 総重量を計算
                      let totalWeight = '-';
                      if (product.setWeight) {
                        const weightMatch = product.setWeight.match(/[\d.]+/);
                        if (weightMatch) {
                          const weight = parseFloat(weightMatch[0]);
                          totalWeight = (weight * selectedProduct.quantity).toFixed(2) + 'kg';
                        }
                      }
                      
                      return (
                        <div key={selectedProduct.productId} className="flex justify-between items-center text-sm">
                          <div className="flex-1">
                            <div className="text-gray-900">
                              {product.productName}
                              <span className="text-gray-500 ml-2 text-xs">
                                ({product.numberOfSets}セット、{product.bagsPerSet}袋)
                              </span>
                              {product.sku && <span className="text-gray-500 ml-2">({product.sku})</span>}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              1セット: {product.setWeight} × {selectedProduct.quantity}セット = <span className="font-medium text-indigo-600">{totalWeight}</span>
                            </div>
                          </div>
                          <span className="font-medium text-indigo-600 ml-4">
                            {selectedProduct.quantity}セット ({selectedProduct.quantity * product.bagsPerSet}袋)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* 全体の総重量 */}
                  <div className="mt-3 pt-3 border-t border-indigo-300">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-900">合計重量:</span>
                      <span className="text-lg font-bold text-indigo-700">
                        {(() => {
                          let totalWeightKg = 0;
                          formData.selectedProducts.forEach((selectedProduct) => {
                            const product = productsData.find(p => p.id === selectedProduct.productId);
                            if (product && product.setWeight) {
                              const weightMatch = product.setWeight.match(/[\d.]+/);
                              if (weightMatch) {
                                const weight = parseFloat(weightMatch[0]);
                                totalWeightKg += weight * selectedProduct.quantity;
                              }
                            }
                          });
                          return totalWeightKg.toFixed(2);
                        })()}kg
                        <span className="text-xs text-gray-600 ml-2 font-normal">
                          (合計 {formData.selectedProducts.reduce((sum, sp) => {
                            const product = productsData.find(p => p.id === sp.productId);
                            return sum + (product ? sp.quantity * product.bagsPerSet : 0);
                          }, 0)}袋)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 段ボール選択（各商品ごと） */}
              {formData.selectedProducts && formData.selectedProducts.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">各商品の段ボール選択</h4>
                  <div className="space-y-4">
                    {formData.selectedProducts.map((selectedProduct) => {
                      const product = productsData.find(p => p.id === selectedProduct.productId);
                      if (!product) return null;
                      
                      // おすすめの段ボールコードを取得
                      const cartonRecommendations = getCartonRecommendations(product.productName);
                      const recommendedCartonCodes = cartonRecommendations.map(c => c.cartonCode);
                      const selectedCartons = formData.selectedCartons[selectedProduct.productId] || [];
                      
                      return (
                        <div key={selectedProduct.productId} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-900">
                              {product.productName}
                              <span className="text-gray-500 ml-2 text-xs">
                                ({product.numberOfSets}セット、{product.bagsPerSet}袋)
                              </span>
                              {product.sku && <span className="text-gray-500 ml-2 text-xs">({product.sku})</span>}
                            </h5>
                          </div>
                          
                          <AdvancedCartonSelector
                            productName={product.productName}
                            productId={selectedProduct.productId}
                            targetQuantity={selectedProduct.quantity}
                            bagsPerSet={product.bagsPerSet}
                            recommendedCartonCodes={recommendedCartonCodes}
                            selectedCartons={selectedCartons}
                            onCartonsChange={(cartons) => {
                              setFormData({
                                ...formData,
                                selectedCartons: {
                                  ...formData.selectedCartons,
                                  [selectedProduct.productId]: cartons
                                }
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 配送先情報（基本情報の直後） */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">配送先情報</h3>
              
              {/* 配送先選択（複数選択、検索機能付き） */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  配送先（複数選択可） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="配送先名、コードで検索..."
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                />
                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                  {filteredDestinations.map((dest) => (
                    <label
                      key={dest.id}
                      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                        formData.destinationIds.includes(dest.id) ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.destinationIds.includes(dest.id)}
                        onChange={() => setFormData({
                          ...formData,
                          destinationIds: toggleSelection(formData.destinationIds, dest.id)
                        })}
                        className="mr-3 h-4 w-4 text-indigo-600 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{dest.name}</span>
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                            {dest.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{dest.fullName}</p>
                        <p className="text-xs text-gray-500">{dest.address}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {formData.destinationIds.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    選択中: {formData.destinationIds.length}件
                  </p>
                )}
              </div>

              {/* 仕向地情報（配送先ごとに表示、自動入力、修正可能） */}
              {formData.destinationIds.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">各配送先の仕向地情報</h4>
                  {formData.destinationIds.map((destId) => {
                    const destination = destinations.find(d => d.id === destId);
                    const info = destinationInfoMap[destId];
                    if (!destination || !info) return null;
                    
                    return (
                      <div key={destId} className="bg-blue-50 p-4 rounded-lg border-l-4 border-indigo-500">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="font-medium text-gray-900">{destination.name}</span>
                          <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded">
                            {destination.code}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              仕向地国 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={info.country}
                              onChange={(e) => setDestinationInfoMap({
                                ...destinationInfoMap,
                                [destId]: { ...info, country: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">自動入力、修正可</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              仕向地港
                            </label>
                            <input
                              type="text"
                              value={info.port}
                              onChange={(e) => setDestinationInfoMap({
                                ...destinationInfoMap,
                                [destId]: { ...info, port: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">自動入力、修正可</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              仕向地住所 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={info.address}
                              onChange={(e) => setDestinationInfoMap({
                                ...destinationInfoMap,
                                [destId]: { ...info, address: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">自動入力、修正可</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 取引先情報 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">取引先情報</h3>
              
              <div className="space-y-6">
                {/* メーカー（複数選択、検索機能付き） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メーカー（複数選択可） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="メーカー名で検索..."
                    value={manufacturerSearch}
                    onChange={(e) => setManufacturerSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                  />
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {filteredManufacturers.map((mfr) => (
                      <label
                        key={mfr.id}
                        className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                          formData.manufacturerIds.includes(mfr.id) ? 'bg-green-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.manufacturerIds.includes(mfr.id)}
                          onChange={() => setFormData({
                            ...formData,
                            manufacturerIds: toggleSelection(formData.manufacturerIds, mfr.id)
                          })}
                          className="mr-3 h-4 w-4 text-indigo-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{mfr.name}</span>
                          <p className="text-xs text-gray-600">{mfr.address}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 梱包業者（複数選択、検索機能付き） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    梱包業者（複数選択可）
                  </label>
                  <input
                    type="text"
                    placeholder="梱包業者名で検索..."
                    value={packingSearch}
                    onChange={(e) => setPackingSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                  />
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {filteredPackingCompanies.map((pkg) => (
                      <label
                        key={pkg.id}
                        className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                          formData.packingCompanyIds.includes(pkg.id) ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.packingCompanyIds.includes(pkg.id)}
                          onChange={() => setFormData({
                            ...formData,
                            packingCompanyIds: toggleSelection(formData.packingCompanyIds, pkg.id)
                          })}
                          className="mr-3 h-4 w-4 text-indigo-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{pkg.name}</span>
                          <p className="text-xs text-gray-600">{pkg.address}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 業務フローパターン（複数選択可） */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      業務フローパターン（複数選択可） <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => window.open('/admin/masters/flow-patterns', '_blank')}
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      🔧 フローパターンマスタ管理
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="フローパターン名で検索..."
                    value={flowPatternSearch}
                    onChange={(e) => setFlowPatternSearch(e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  
                  <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                    {flowPatternsData
                      .filter(pattern => 
                        pattern.name.toLowerCase().includes(flowPatternSearch.toLowerCase()) ||
                        pattern.description.toLowerCase().includes(flowPatternSearch.toLowerCase())
                      )
                      .map(pattern => (
                        <label
                          key={pattern.id}
                          className="flex items-start p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={formData.flowPatternIds.includes(pattern.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  flowPatternIds: [...formData.flowPatternIds, pattern.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  flowPatternIds: formData.flowPatternIds.filter(id => id !== pattern.id)
                                });
                              }
                            }}
                            className="mt-1 h-4 w-4 text-indigo-600 rounded"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{pattern.name}</span>
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                {pattern.code}
                              </span>
                              {pattern.requiresPacking && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                  梱包業者あり
                                </span>
                              )}
                            </div>
                            {pattern.description && (
                              <p className="text-xs text-gray-600 mt-1">{pattern.description}</p>
                            )}
                          </div>
                        </label>
                      ))
                    }
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    選択中: {formData.flowPatternIds.length}件 / {flowPatternsData.length}件
                  </p>
                  
                  {/* 選択されたフローパターンの表示 */}
                  {formData.flowPatternIds.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-2">選択されたフローパターン:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.flowPatternIds.map(id => {
                          const pattern = flowPatternsData.find(p => p.id === id);
                          return pattern ? (
                            <span key={id} className="px-3 py-1 bg-white text-sm text-gray-700 rounded-full border border-gray-300 flex items-center space-x-2">
                              <span>{pattern.name}</span>
                              <button
                                type="button"
                                onClick={() => setFormData({
                                  ...formData,
                                  flowPatternIds: formData.flowPatternIds.filter(pid => pid !== id)
                                })}
                                className="text-gray-500 hover:text-red-600"
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* フォワーダー（複数選択、検索機能付き） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    フォワーダー（複数選択可） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="フォワーダー名で検索..."
                    value={forwarderSearch}
                    onChange={(e) => setForwarderSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                  />
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {filteredForwarders.map((fwd) => (
                      <label
                        key={fwd.id}
                        className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                          formData.forwarderIds.includes(fwd.id) ? 'bg-purple-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.forwarderIds.includes(fwd.id)}
                          onChange={() => setFormData({
                            ...formData,
                            forwarderIds: toggleSelection(formData.forwarderIds, fwd.id)
                          })}
                          className="mr-3 h-4 w-4 text-indigo-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{fwd.name}</span>
                          <p className="text-xs text-gray-600">{fwd.address}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 日程情報（納期を4種類に分割） */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">日程情報</h3>
                <button
                  type="button"
                  className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={() => {
                    const newTypeName = prompt('新しい納期タイプ名を入力してください\n例：通関から配送先への納期');
                    if (newTypeName && newTypeName.trim()) {
                      const newCode = `custom_${Date.now()}`;
                      const newType = {
                        id: customDeadlineTypes.length + 1,
                        name: newTypeName.trim(),
                        code: newCode,
                      };
                      setCustomDeadlineTypes([...customDeadlineTypes, newType]);
                      alert(`「${newTypeName}」を追加しました`);
                    }
                  }}
                >
                  + 納期タイプを追加
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customDeadlineTypes.map((type, index) => (
                  <div key={type.id} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {type.name}
                      </label>
                      {index >= 4 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`「${type.name}」を削除してもよろしいですか？`)) {
                              setCustomDeadlineTypes(customDeadlineTypes.filter(t => t.id !== type.id));
                              const newDeadlines = {...deadlines};
                              delete newDeadlines[type.code];
                              setDeadlines(newDeadlines);
                              alert(`「${type.name}」を削除しました`);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          削除
                        </button>
                      )}
                    </div>
                    <input
                      type="date"
                      value={deadlines[type.code] || ''}
                      onChange={(e) => setDeadlines({...deadlines, [type.code]: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                ※ デフォルトの4種類の納期に加えて、カスタム納期を追加できます
              </p>
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={4}
                placeholder="特記事項があれば入力してください"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                出荷計画を作成
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
