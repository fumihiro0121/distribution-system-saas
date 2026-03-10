'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { products as productsData } from '@/data/products';
import { allCartons } from '@/data/all-cartons';
import { cartonProductMapping } from '@/data/carton-product-mapping';
import { companies, getCompaniesByType, getCompanyById, Company } from '@/data/companies';
import { allDestinations, getAmazonFBADestinations, getAmazonAWDDestinations, getSupermarketDestinations, Destination } from '@/data/destinations';
import { flowPatterns, getFlowPatternById, getCurrentStepInfo, FlowPattern } from '@/data/flow-patterns';
import Header from '@/app/components/Header';
import Navigation from '@/app/components/Navigation';
import CartonRecommendations from '@/app/components/CartonRecommendations';
import { CartonRecommendation } from '@/utils/carton-calculator';
import dynamic from 'next/dynamic';

// 3Dビューアーは動的インポート（SSR回避）
const PalletViewer3D = dynamic(() => import('@/app/components/PalletViewer3D'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 bg-gray-800 text-white">3Dモデル読み込み中...</div>
});

// 物流フロー（区間）の定義
type ShipmentFlow = 
  | 'manufacturer-to-forwarder'     // メーカー → フォワーダー
  | 'manufacturer-to-packer'        // メーカー → 梱包業者
  | 'packer-to-forwarder'          // 梱包業者 → フォワーダー
  | 'forwarder-to-destination';    // フォワーダー → アメリカ

// フロー情報
const FLOW_CONFIGS = {
  'manufacturer-to-forwarder': {
    label: 'メーカー → フォワーダー',
    from: { type: 'manufacturer' as const, label: 'メーカー' },
    to: { type: 'forwarder' as const, label: 'フォワーダー' },
    description: 'メーカーから直接フォワーダーに発送'
  },
  'manufacturer-to-packer': {
    label: 'メーカー → 梱包業者',
    from: { type: 'manufacturer' as const, label: 'メーカー' },
    to: { type: 'packer' as const, label: '梱包業者' },
    description: 'メーカーから梱包業者に発送（梱包作業のため）'
  },
  'packer-to-forwarder': {
    label: '梱包業者 → フォワーダー',
    from: { type: 'packer' as const, label: '梱包業者' },
    to: { type: 'forwarder' as const, label: 'フォワーダー' },
    description: '梱包業者から梱包完了品をフォワーダーに発送',
    hasReceived: true  // 受入情報あり
  },
  'forwarder-to-destination': {
    label: 'フォワーダー → アメリカ',
    from: { type: 'forwarder' as const, label: 'フォワーダー' },
    to: { type: 'destination' as const, label: 'アメリカ（FBA/スーパー）' },
    description: 'フォワーダーからアメリカの最終目的地に発送',
    hasReceived: true  // 受入情報あり
  }
};

// 段ボールの処理アクション
type CartonAction = 'use-as-is' | 'repack' | 'new';

// 受信段ボール情報
interface ReceivedCarton {
  id: string;
  sourceFlowId: string;  // どのフローから来たか
  sourceFlowName: string;  // 送り元フロー名
  cartonCode: string;
  cartonName: string;
  contents: { productId: number; quantity: number; sourceManufacturer?: string; }[];
  action?: CartonAction;  // この段ボールをどう扱うか
}

// 配送ルート（フロー）の定義
interface ShipmentFlowRoute {
  id: string;
  name: string;  // フローの名前（例: "幸田商店→梱包A→佐川→マルカイCupertino"）
  flowPatternId: string;
  currentStepNumber: number;
  manufacturerId?: number;
  packerId?: number;
  forwarderId?: number;
  destinationId?: number;
  usePallets?: boolean;  // パレットを使用するかどうか
  
  // 前のステップから受け取った段ボール情報
  receivedCartons?: ReceivedCarton[];
  
  // このフロー用の梱包情報
  selectedProducts: {
    productId: number;
    requestedQuantity: number;
    assignedQuantity: number;
    remainingQuantity: number;
    sourceFlowId?: string;  // どのフローから来た商品か（詰め替え用）
  }[];
  cartons: {
    id: string;
    cartonCode: string;
    cartonName: string;
    contents: { productId: number; quantity: number; sourceFlowId?: string; }[];
    currentWeight: number;
    assignedToPallet: boolean;
    palletId?: string;
    layer?: number;
    action?: CartonAction;  // 新規作成 or 受信したものをそのまま使用 or 詰め替え
    sourceCartonId?: string;  // 元の段ボールID（use-as-is の場合）
    finalDestinationId?: number;  // この段ボールの最終目的地
  }[];
  pallets: {
    id: string;
    size: string;
    layers: { layerNumber: number; cartons: string[]; }[];
    finalDestinationId?: number;  // このパレットの最終目的地
  }[];
}

// 統合されたState型定義
interface UnifiedPackingState {
  // 複数の配送ルート（フロー）を管理
  flows: ShipmentFlowRoute[];
  // 現在編集中のフローID
  activeFlowId: string;
  
  // 互換性のため残す（廃止予定）
  flowPatternId: string;
  currentStepNumber: number;
  manufacturerId?: number;
  packerId?: number;
  forwarderId?: number;
  destinationId?: number;
  flow: ShipmentFlow;
  
  // 廃止予定（flowsに移行）
  selectedProducts: {
    productId: number;
    requestedQuantity: number;
    assignedQuantity: number;
    remainingQuantity: number;
  }[];
  
  // 段ボール設計（送出）
  cartons: {
    id: string;
    cartonCode: string;
    cartonName: string;
    contents: {
      productId: number;
      quantity: number;
    }[];
    currentWeight: number;
    assignedToPallet: boolean;
    palletId?: string;
    layer?: number;
  }[];
  
  // パレット設計（送出）
  pallets: {
    id: string;
    size: string;
    layers: {
      layerNumber: number;
      cartons: string[];
    }[];
  }[];
  
  // 受入情報（前区間から）
  receivedState?: {
    cartons: Array<{
      id: string;
      cartonCode: string;
      cartonName: string;
      contents: { productId: number; quantity: number; }[];
      currentWeight: number;
      assignedToPallet: boolean;
      palletId?: string;
      layer?: number;
    }>;
    pallets: Array<{
      id: string;
      size: string;
      layers: { layerNumber: number; cartons: string[]; }[];
    }>;
    notes?: string;
  };
}

export default function UnifiedPackingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [productSearch, setProductSearch] = useState('');
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [cartonSearch, setCartonSearch] = useState('');
  const [showCartonSearch, setShowCartonSearch] = useState<number | null>(null);
  
  // 段ボールサイズ検索ドロップダウン
  const [cartonSearchOpen, setCartonSearchOpen] = useState<string | null>(null);
  const [cartonSearchText, setCartonSearchText] = useState('');
  
  // パレット選択モーダル
  const [palletSelectPrompt, setPalletSelectPrompt] = useState<{
    groupCartonIds: string[];
    groupCount: number;
    groupName: string;
  } | null>(null);
  
  // パレット間移動モーダル
  const [interPalletMovePrompt, setInterPalletMovePrompt] = useState<{
    sourcePalletId: string;
    productId: number;
    productName: string;
    maxBoxes: number;
    cartonIds: string[]; // 移動候補の段ボールID一覧
  } | null>(null);
  const [moveBoxCount, setMoveBoxCount] = useState(1);
  const [moveTargetPalletId, setMoveTargetPalletId] = useState<string | null>(null);
  const [moveTargetLayer, setMoveTargetLayer] = useState(1);
  
  // パレット状態テーブル表示切り替え
  const [palletTableExpanded, setPalletTableExpanded] = useState<Record<string, boolean>>({});
  
  // ドラッグ&ドロップ用の状態
  const [draggedProduct, setDraggedProduct] = useState<{id: number; name: string; remainingQuantity: number} | null>(null);
  const [draggedCarton, setDraggedCarton] = useState<{id: string; name: string; groupIds?: string[]; totalCount?: number} | null>(null);
  const [dropQuantityPrompt, setDropQuantityPrompt] = useState<{
    productId: number;
    cartonId: string;
    maxQuantity: number;
  } | null>(null);
  
  // 統合State（永続化対応）
  const [packingState, setPackingState] = useState<UnifiedPackingState>(() => {
    // localStorageから復元を試みる
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shipment_packing_state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // 新しいフォーマット（flows）がある場合
          if (parsed.flows && parsed.flows.length > 0) {
            return {
              flows: parsed.flows,
              activeFlowId: parsed.activeFlowId || parsed.flows[0].id,
              // 互換性のため
              flowPatternId: parsed.flowPatternId || 'via-packer',
              currentStepNumber: parsed.currentStepNumber || 1,
              manufacturerId: parsed.manufacturerId,
              packerId: parsed.packerId,
              forwarderId: parsed.forwarderId,
              destinationId: parsed.destinationId,
              flow: parsed.flow || 'manufacturer-to-packer',
              selectedProducts: parsed.selectedProducts || [],
              cartons: parsed.cartons || [],
              pallets: parsed.pallets || [],
              receivedState: parsed.receivedState
            };
          }
          
          // 古いフォーマットを新しいフォーマットに変換
          const initialFlow: ShipmentFlowRoute = {
            id: 'flow-1',
            name: '配送ルート 1',
            flowPatternId: parsed.flowPatternId || 'via-packer',
            currentStepNumber: parsed.currentStepNumber || 1,
            manufacturerId: parsed.manufacturerId,
            packerId: parsed.packerId,
            forwarderId: parsed.forwarderId,
            destinationId: parsed.destinationId,
            selectedProducts: parsed.selectedProducts || [],
            cartons: parsed.cartons || [],
            pallets: parsed.pallets || []
          };
          
          return {
            flows: [initialFlow],
            activeFlowId: 'flow-1',
            flowPatternId: parsed.flowPatternId || 'via-packer',
            currentStepNumber: parsed.currentStepNumber || 1,
            manufacturerId: parsed.manufacturerId,
            packerId: parsed.packerId,
            forwarderId: parsed.forwarderId,
            destinationId: parsed.destinationId,
            flow: parsed.flow || 'manufacturer-to-packer',
            selectedProducts: parsed.selectedProducts || [],
            cartons: parsed.cartons || [],
            pallets: parsed.pallets || [],
            receivedState: parsed.receivedState
          };
        } catch (e) {
          console.error('Failed to restore packing state:', e);
        }
      }
    }
    
    // デフォルト値
    const initialFlow: ShipmentFlowRoute = {
      id: 'flow-1',
      name: '配送ルート 1',
      flowPatternId: 'via-packer',
      currentStepNumber: 1,
      selectedProducts: [],
      cartons: [],
      pallets: []
    };
    
    return {
      flows: [initialFlow],
      activeFlowId: 'flow-1',
      flowPatternId: 'via-packer',
      currentStepNumber: 1,
      flow: 'manufacturer-to-packer',
      selectedProducts: [],
      cartons: [],
      pallets: []
    };
  });

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
  }, [router]);

  // 状態が変更されたらlocalStorageに保存
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shipment_packing_state', JSON.stringify(packingState));
    }
  }, [packingState]);

  // 段ボール検索ドロップダウンの外側クリックで閉じる
  useEffect(() => {
    if (!cartonSearchOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-carton-dropdown]')) {
        setCartonSearchOpen(null);
        setCartonSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [cartonSearchOpen]);

  // フロー情報を安全に取得するヘルパー
  const getFlowConfig = (flow: ShipmentFlow) => {
    return FLOW_CONFIGS[flow] || FLOW_CONFIGS['manufacturer-to-packer'];
  };
  
  // 現在アクティブなフローを取得
  const activeFlow = packingState.flows.find(f => f.id === packingState.activeFlowId) || packingState.flows[0];
  
  // 現在のフローパターンを取得
  const currentFlowPattern = getFlowPatternById(activeFlow?.flowPatternId || 'via-packer');
  
  // 現在のステップ情報を取得
  const currentStepInfo = currentFlowPattern?.steps[(activeFlow?.currentStepNumber || 1) - 1];
  
  // 選択されている関係者を取得（アクティブなフローから）
  const selectedManufacturer = activeFlow?.manufacturerId ? companies.find(c => c.id === activeFlow.manufacturerId) : undefined;
  const selectedPacker = activeFlow?.packerId ? companies.find(c => c.id === activeFlow.packerId) : undefined;
  const selectedForwarder = activeFlow?.forwarderId ? companies.find(c => c.id === activeFlow.forwarderId) : undefined;
  const selectedDestination = activeFlow?.destinationId ? allDestinations.find(d => d.id === activeFlow.destinationId) : undefined;
  
  // フロー名を自動生成
  const generateFlowName = (flow: ShipmentFlowRoute) => {
    const parts: string[] = [];
    if (flow.manufacturerId) {
      const mfr = companies.find(c => c.id === flow.manufacturerId);
      parts.push(mfr?.name || 'メーカー');
    }
    if (flow.packerId) {
      const pkr = companies.find(c => c.id === flow.packerId);
      parts.push(pkr?.name || '梱包業者');
    }
    if (flow.forwarderId) {
      const fwd = companies.find(c => c.id === flow.forwarderId);
      parts.push(fwd?.name || 'フォワーダー');
    }
    if (flow.destinationId) {
      const dest = allDestinations.find(d => d.id === flow.destinationId);
      parts.push(dest?.name || '目的地');
    }
    return parts.length > 0 ? parts.join(' → ') : `配送ルート ${flow.id}`;
  };
  
  // 新しいフローを追加
  const handleAddFlow = () => {
    const newFlowId = `flow-${Date.now()}`;
    const newFlow: ShipmentFlowRoute = {
      id: newFlowId,
      name: `配送ルート ${packingState.flows.length + 1}`,
      flowPatternId: 'via-packer',
      currentStepNumber: 1,
      selectedProducts: [],
      cartons: [],
      pallets: []
    };
    
    setPackingState({
      ...packingState,
      flows: [...packingState.flows, newFlow],
      activeFlowId: newFlowId
    });
  };
  
  // フローを削除
  const handleDeleteFlow = (flowId: string) => {
    if (packingState.flows.length === 1) {
      alert('最後のフローは削除できません');
      return;
    }
    
    if (!confirm('このフローを削除しますか？梱包情報もすべて削除されます。')) {
      return;
    }
    
    const newFlows = packingState.flows.filter(f => f.id !== flowId);
    const newActiveFlowId = packingState.activeFlowId === flowId ? newFlows[0].id : packingState.activeFlowId;
    
    setPackingState({
      ...packingState,
      flows: newFlows,
      activeFlowId: newActiveFlowId
    });
  };
  
  // 段ボールの内容から実際の割当数量を計算する関数
  const calculateActualAssignedQuantity = (productId: number, cartons: any[]) => {
    let totalBags = 0;
    
    cartons.forEach(carton => {
      carton.contents.forEach((content: any) => {
        if (content.productId === productId) {
          totalBags += content.quantity;
        }
      });
    });
    
    const product = productsData.find(p => p.id === productId);
    if (!product) return 0;
    
    // 袋数をセット数に変換
    return totalBags / product.bagsPerSet;
  };

  // 段ボールをグループ化する関数
  const groupCartons = (cartons: typeof activeFlow.cartons) => {
    const groups: { 
      key: string; 
      cartonCode: string; 
      cartonName: string; 
      contents: { productId: number; quantity: number; }[];
      cartonIds: string[];
      count: number;
      assignedToPallet: boolean;
      action?: string;
      finalDestinationId?: number;
    }[] = [];
    
    cartons.forEach(carton => {
      // グループキーを生成（段ボールコード + 内容）
      const contentsKey = carton.contents
        .map(c => `${c.productId}:${c.quantity}`)
        .sort()
        .join('|');
      const key = `${carton.cartonCode}|${contentsKey}`;
      
      // 既存のグループを検索
      const existingGroup = groups.find(g => g.key === key);
      
      if (existingGroup) {
        existingGroup.cartonIds.push(carton.id);
        existingGroup.count++;
        if (!(carton.assignedToPallet)) {
          existingGroup.assignedToPallet = false;
        }
      } else {
        groups.push({
          key,
          cartonCode: carton.cartonCode,
          cartonName: carton.cartonName,
          contents: carton.contents,
          cartonIds: [carton.id],
          count: 1,
          assignedToPallet: carton.assignedToPallet || false,
          action: carton.action,
          finalDestinationId: carton.finalDestinationId
        });
      }
    });
    
    return groups;
  };
  
  // アクティブなフローを更新
  const updateActiveFlow = (updates: Partial<ShipmentFlowRoute>) => {
    setPackingState({
      ...packingState,
      flows: packingState.flows.map(f =>
        f.id === packingState.activeFlowId
          ? { ...f, ...updates, name: generateFlowName({ ...f, ...updates }) }
          : f
      )
    });
  };

  // 前のステップから送られてくる段ボール情報を取得
  const getReceivedCartonsFromPreviousFlows = (): ReceivedCarton[] => {
    if (!activeFlow) return [];
    
    const currentStep = currentFlowPattern?.steps[activeFlow.currentStepNumber - 1];
    if (!currentStep || currentStep.from === 'manufacturer') return []; // メーカーは受信なし
    
    // 同じフォワーダー/梱包業者に送るフローを探す
    const receivedCartons: ReceivedCarton[] = [];
    
    packingState.flows.forEach(flow => {
      // 自分自身は除外
      if (flow.id === activeFlow.id) return;
      
      // 前のステップから送られてくる条件をチェック
      let shouldReceive = false;
      
      if (currentStep.from === 'packer') {
        // 梱包業者が受け取る場合：メーカーから梱包業者に送るフロー
        shouldReceive = flow.packerId === activeFlow.packerId && 
                       flow.currentStepNumber >= 1; // メーカー→梱包業者のステップを完了している
      } else if (currentStep.from === 'forwarder') {
        // フォワーダーが受け取る場合：梱包業者orメーカーからフォワーダーに送るフロー
        shouldReceive = flow.forwarderId === activeFlow.forwarderId &&
                       flow.currentStepNumber >= 2; // フォワーダーへの発送ステップを完了している
      }
      
      if (shouldReceive && flow.cartons.length > 0) {
        const sourceManufacturerName = flow.manufacturerId 
          ? companies.find(c => c.id === flow.manufacturerId)?.name 
          : '不明なメーカー';
        
        flow.cartons.forEach(carton => {
          receivedCartons.push({
            id: `received-${flow.id}-${carton.id}`,
            sourceFlowId: flow.id,
            sourceFlowName: flow.name,
            cartonCode: carton.cartonCode,
            cartonName: carton.cartonName,
            contents: carton.contents.map(c => ({
              ...c,
              sourceManufacturer: sourceManufacturerName
            })),
            action: undefined // 未処理
          });
        });
      }
    });
    
    return receivedCartons;
  };

  // 受信段ボールを「そのまま使う」
  const handleUseReceivedCartonAsIs = (receivedCarton: ReceivedCarton, finalDestinationId?: number) => {
    if (!activeFlow) return;
    
    // 受信段ボールをそのまま自分の段ボールリストに追加
    const newCarton = {
      id: `adopted-${receivedCarton.id}`,
      cartonCode: receivedCarton.cartonCode,
      cartonName: receivedCarton.cartonName,
      contents: receivedCarton.contents,
      currentWeight: 0, // TODO: 重量計算
      assignedToPallet: false,
      action: 'use-as-is' as CartonAction,
      sourceCartonId: receivedCarton.id,
      finalDestinationId: finalDestinationId
    };
    
    updateActiveFlow({
      cartons: [...activeFlow.cartons, newCarton],
      receivedCartons: [
        ...(activeFlow.receivedCartons || []),
        { ...receivedCarton, action: 'use-as-is' }
      ]
    });
    
    alert(`${receivedCarton.cartonName} をそのまま使用します`);
  };

  // 受信段ボールから商品を取り出して「詰め替える」
  const handleUnpackReceivedCarton = (receivedCarton: ReceivedCarton) => {
    if (!activeFlow) return;
    
    // 受信段ボールの中身を商品リストに追加
    const newProducts = receivedCarton.contents.map(content => ({
      productId: content.productId,
      requestedQuantity: content.quantity,
      assignedQuantity: 0,
      remainingQuantity: content.quantity,
      sourceFlowId: receivedCarton.sourceFlowId
    }));
    
    // 既存の商品と統合（同じ商品IDがあれば数量を加算）
    const updatedProducts = [...activeFlow.selectedProducts];
    newProducts.forEach(newProd => {
      const existing = updatedProducts.find(p => p.productId === newProd.productId);
      if (existing) {
        existing.requestedQuantity += newProd.requestedQuantity;
        existing.remainingQuantity += newProd.remainingQuantity;
      } else {
        updatedProducts.push(newProd);
      }
    });
    
    updateActiveFlow({
      selectedProducts: updatedProducts,
      receivedCartons: [
        ...(activeFlow.receivedCartons || []),
        { ...receivedCarton, action: 'repack' }
      ]
    });
    
    alert(`${receivedCarton.cartonName} から商品を取り出しました。新しい段ボールに詰め替えてください。`);
  };

  // 商品選択ハンドラー（アクティブなフロー用）
  const handleProductToggle = (productId: number) => {
    if (!activeFlow) return;
    
    const exists = activeFlow.selectedProducts.find(p => p.productId === productId);
    if (exists) {
      // ①→②→③ 連動削除: この商品を含む段ボールIDを特定し、パレットからも除去
      const cartonIdsToRemove = new Set(
        activeFlow.cartons
          .filter(c => c.contents.some(cnt => cnt.productId === productId))
          .map(c => c.id)
      );
      if (cartonIdsToRemove.size > 0) {
        const product = productsData.find(p => p.id === productId);
        const onPallet = activeFlow.pallets.some(p =>
          p.layers.some(l => l.cartons.some(cid => cartonIdsToRemove.has(cid)))
        );
        const msg = onPallet
          ? `「${product?.productName}」の段ボール（${cartonIdsToRemove.size}箱）がパレットに配置済みです。商品を削除すると段ボールとパレットからも削除されます。続けますか？`
          : `「${product?.productName}」の段ボール（${cartonIdsToRemove.size}箱）が段ボール設計にあります。商品を削除すると段ボールも削除されます。続けますか？`;
        if (!confirm(msg)) return;
      }
      updateActiveFlow({
        selectedProducts: activeFlow.selectedProducts.filter(p => p.productId !== productId),
        cartons: activeFlow.cartons.filter(c => !cartonIdsToRemove.has(c.id)),
        pallets: activeFlow.pallets.map(p => ({
          ...p,
          layers: p.layers.map(l => ({
            ...l,
            cartons: l.cartons.filter(cid => !cartonIdsToRemove.has(cid))
          })).filter(l => l.cartons.length > 0)
        }))
      });
    } else {
      // 追加
      updateActiveFlow({
        selectedProducts: [
          ...activeFlow.selectedProducts,
          {
            productId,
            requestedQuantity: 1,
            assignedQuantity: 0,
            remainingQuantity: 1
          }
        ]
      });
    }
  };

  // 商品数量変更ハンドラー（アクティブなフロー用）
  const handleQuantityChange = (productId: number, quantity: number) => {
    if (!activeFlow) return;
    
    updateActiveFlow({
      selectedProducts: activeFlow.selectedProducts.map(p =>
        p.productId === productId
          ? {
              ...p,
              requestedQuantity: quantity,
              remainingQuantity: quantity - p.assignedQuantity
            }
          : p
      )
    });
  };

  // グループの箱数を変更する
  const handleChangeBoxCount = (groupCartonIds: string[], currentCount: number, newCount: number) => {
    if (!activeFlow || newCount < 1) return;
    
    if (newCount > currentCount) {
      const templateCarton = activeFlow.cartons.find(c => c.id === groupCartonIds[0]);
      if (!templateCarton) return;
      const additionalCartons = [];
      for (let i = 0; i < newCount - currentCount; i++) {
        additionalCartons.push({
          ...templateCarton,
          id: `carton-${Date.now()}-add-${i}`,
          assignedToPallet: false,
          palletId: undefined
        });
      }
      updateActiveFlow({
        cartons: [...activeFlow.cartons, ...additionalCartons]
      });
    } else {
      const idsToRemove = groupCartonIds.slice(newCount);
      updateActiveFlow({
        cartons: activeFlow.cartons.filter(c => !idsToRemove.includes(c.id)),
        pallets: activeFlow.pallets.map(p => ({
          ...p,
          layers: p.layers.map(l => ({
            ...l,
            cartons: l.cartons.filter(cid => !idsToRemove.includes(cid))
          })).filter(l => l.cartons.length > 0)
        }))
      });
    }
  };

  // グループ内の1箱あたりのセット数を変更する
  const handleChangeSetsPerBox = (groupCartonIds: string[], contentIndex: number, newSets: number, product: any) => {
    if (!activeFlow || !product || newSets < 0) return;
    const newBagQuantity = Math.round(newSets * product.bagsPerSet);
    updateActiveFlow({
      cartons: activeFlow.cartons.map(c =>
        groupCartonIds.includes(c.id)
          ? {
              ...c,
              contents: c.contents.map((cnt, i) =>
                i === contentIndex ? { ...cnt, quantity: newBagQuantity } : cnt
              )
            }
          : c
      )
    });
  };

  // ボタンクリックで①→②に転送（ドラッグ不要）
  const handleTransferToCartonDesign = (productId: number) => {
    if (!activeFlow) return;
    const product = productsData.find(p => p.id === productId);
    const selectedProduct = activeFlow.selectedProducts.find(p => p.productId === productId);
    if (!product || !selectedProduct) return;

    const actualAssigned = calculateActualAssignedQuantity(productId, activeFlow.cartons);
    const actualRemaining = selectedProduct.requestedQuantity - actualAssigned;

    if (actualRemaining <= 0) {
      alert('この商品の残り数量がありません');
      return;
    }

    const optimalCarton = selectOptimalCarton(productId);
    if (!optimalCarton) {
      alert('適切な段ボールが見つかりませんでした');
      return;
    }

    const cartonMapping = cartonProductMapping[optimalCarton.code];
    const productMapping = cartonMapping?.find(m => m.productName === product.productName);
    const cartonCapacity = productMapping?.packingBags || 10;

    const totalBagsRemaining = actualRemaining * product.bagsPerSet;
    const numberOfCartons = Math.ceil(totalBagsRemaining / cartonCapacity);

    const newCartons = [];
    let remainingBags = totalBagsRemaining;

    for (let i = 0; i < numberOfCartons; i++) {
      const bagsInThisCarton = Math.min(cartonCapacity, remainingBags);
      newCartons.push({
        id: `carton-${Date.now()}-${i}`,
        cartonCode: optimalCarton.code,
        cartonName: optimalCarton.name,
        contents: [{ productId, quantity: bagsInThisCarton }],
        currentWeight: optimalCarton.weight || 0,
        assignedToPallet: false
      });
      remainingBags -= bagsInThisCarton;
    }

    updateActiveFlow({
      cartons: [...activeFlow.cartons, ...newCartons]
    });
  };

  // ボタンクリックで②→③に転送（パレット選択UI表示）
  const handleTransferToPallet = (groupCartonIds: string[], groupCount: number, groupName: string) => {
    if (!activeFlow) return;

    const unassignedCartonIds = groupCartonIds.filter(id =>
      !activeFlow.pallets.some(p =>
        p.layers.some(layer => layer.cartons.includes(id))
      )
    );

    if (unassignedCartonIds.length === 0) {
      alert('このグループの段ボールはすべてパレットに配置済みです');
      return;
    }

    // パレットがない場合は直接新規作成
    if (activeFlow.pallets.length === 0) {
      executeTransferToPallet(unassignedCartonIds, null);
    } else {
      setPalletSelectPrompt({ groupCartonIds: unassignedCartonIds, groupCount, groupName });
    }
  };

  // 実際のパレット転送処理
  const executeTransferToPallet = (unassignedCartonIds: string[], targetPalletIdOrNull: string | null) => {
    if (!activeFlow) return;

    let targetPalletId: string;
    let updatedPallets = [...activeFlow.pallets];

    if (targetPalletIdOrNull === null) {
      targetPalletId = `pallet-${Date.now()}`;
      updatedPallets.push({
        id: targetPalletId,
        size: '1100',
        layers: []
      });
    } else {
      targetPalletId = targetPalletIdOrNull;
    }

    const firstCarton = activeFlow.cartons.find(c => c.id === unassignedCartonIds[0]);
    const cartonDetail = firstCarton ? allCartons.find(c => c.code === firstCarton.cartonCode) : null;

    let newLayers: { layerNumber: number; cartons: string[] }[] = [];
    const targetPallet = updatedPallets.find(p => p.id === targetPalletId);
    const startLayerNumber = (targetPallet?.layers.length || 0) + 1;

    const palletLoading = cartonDetail?.palletLoadingDetails;
    const palletCfg = cartonDetail?.palletConfig;
    const cartonsPerLayer = palletLoading?.cartonsPerLayer || palletCfg?.boxesPerLayer || 0;
    const configuredLayers = palletLoading?.totalLayers || palletCfg?.layers || 0;
    
    if (cartonsPerLayer > 0) {
      const totalLayersNeeded = Math.ceil(unassignedCartonIds.length / cartonsPerLayer);
      const layersToUse = Math.max(configuredLayers, totalLayersNeeded);
      
      const isKinako20 = firstCarton?.contents.some(content => {
        const product = productsData.find(p => p.id === content.productId);
        return product?.productName === 'きな粉150g×20袋セット';
      });

      if (isKinako20) {
        // きな粉150g×20袋セット: 13箱×10段 + 2段ペアの隙間に各1箱縦置き×5 = 135箱
        // 構造: [13箱横][13箱横][1箱縦] × 5ペア
        let cartonIndex = 0;
        let currentLayerNumber = startLayerNumber;
        
        for (let pair = 0; pair < 5 && cartonIndex < unassignedCartonIds.length; pair++) {
          // ペアの1段目（13箱横置き）
          const layer1 = unassignedCartonIds.slice(cartonIndex, cartonIndex + cartonsPerLayer);
          if (layer1.length > 0) {
            newLayers.push({ layerNumber: currentLayerNumber++, cartons: layer1 });
            cartonIndex += layer1.length;
          }
          // ペアの2段目（13箱横置き）
          if (cartonIndex < unassignedCartonIds.length) {
            const layer2 = unassignedCartonIds.slice(cartonIndex, cartonIndex + cartonsPerLayer);
            if (layer2.length > 0) {
              newLayers.push({ layerNumber: currentLayerNumber++, cartons: layer2 });
              cartonIndex += layer2.length;
            }
          }
          // 2段の隙間に1箱縦置き
          if (cartonIndex < unassignedCartonIds.length) {
            const verticalBox = unassignedCartonIds.slice(cartonIndex, cartonIndex + 1);
            if (verticalBox.length > 0) {
              newLayers.push({ layerNumber: currentLayerNumber++, cartons: verticalBox });
              cartonIndex += 1;
            }
          }
        }
      } else {
        let cartonIndex = 0;
        for (let layer = 0; layer < layersToUse && cartonIndex < unassignedCartonIds.length; layer++) {
          const cartonsForThisLayer = unassignedCartonIds.slice(cartonIndex, cartonIndex + cartonsPerLayer);
          if (cartonsForThisLayer.length > 0) {
            newLayers.push({ layerNumber: startLayerNumber + layer, cartons: cartonsForThisLayer });
            cartonIndex += cartonsPerLayer;
          }
        }
      }
    } else {
      newLayers = [{ layerNumber: startLayerNumber, cartons: unassignedCartonIds }];
    }

    updateActiveFlow({
      pallets: updatedPallets.map(p =>
        p.id === targetPalletId
          ? { ...p, layers: [...p.layers, ...newLayers] }
          : p
      ),
      cartons: activeFlow.cartons.map(c =>
        unassignedCartonIds.includes(c.id)
          ? { ...c, assignedToPallet: true, palletId: targetPalletId }
          : c
      )
    });
    
    setPalletSelectPrompt(null);
  };

  // パレット間移動を実行
  const executeInterPalletMove = () => {
    if (!activeFlow || !interPalletMovePrompt || !moveTargetPalletId) return;
    
    const { sourcePalletId, cartonIds } = interPalletMovePrompt;
    const count = Math.min(moveBoxCount, cartonIds.length);
    if (count <= 0) return;
    
    const cartonsToMove = cartonIds.slice(0, count);
    const targetPallet = activeFlow.pallets.find(p => p.id === moveTargetPalletId);
    if (!targetPallet) return;
    
    // 元パレットから削除
    const updatedPallets = activeFlow.pallets.map(p => {
      if (p.id === sourcePalletId) {
        return {
          ...p,
          layers: p.layers.map(layer => ({
            ...layer,
            cartons: layer.cartons.filter(id => !cartonsToMove.includes(id))
          })).filter(layer => layer.cartons.length > 0)
        };
      }
      if (p.id === moveTargetPalletId) {
        // 移動先パレットの指定段に追加
        const existingLayer = p.layers.find(l => l.layerNumber === moveTargetLayer);
        if (existingLayer) {
          return {
            ...p,
            layers: p.layers.map(l =>
              l.layerNumber === moveTargetLayer
                ? { ...l, cartons: [...l.cartons, ...cartonsToMove] }
                : l
            )
          };
        } else {
          return {
            ...p,
            layers: [...p.layers, { layerNumber: moveTargetLayer, cartons: cartonsToMove }]
              .sort((a, b) => a.layerNumber - b.layerNumber)
          };
        }
      }
      return p;
    });
    
    updateActiveFlow({
      pallets: updatedPallets,
      cartons: activeFlow.cartons.map(c =>
        cartonsToMove.includes(c.id)
          ? { ...c, palletId: moveTargetPalletId }
          : c
      )
    });
    
    setInterPalletMovePrompt(null);
    setMoveBoxCount(1);
    setMoveTargetPalletId(null);
    setMoveTargetLayer(1);
  };

  // ドラッグ&ドロップハンドラー - 商品をドラッグ開始
  const handleProductDragStart = (e: React.DragEvent, productId: number) => {
    const product = productsData.find(p => p.id === productId);
    const selectedProduct = activeFlow?.selectedProducts.find(p => p.productId === productId);
    if (!product || !selectedProduct) return;

    // 実際の残り数量を計算
    const actualAssigned = calculateActualAssignedQuantity(productId, activeFlow?.cartons || []);
    const actualRemaining = selectedProduct.requestedQuantity - actualAssigned;

    setDraggedProduct({
      id: productId,
      name: product.productName,
      remainingQuantity: actualRemaining
    });
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', productId.toString());
  };

  // 段ボール選択ロジック: 商品に最適な段ボールを優先順位で選択
  const selectOptimalCarton = (productId: number) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return null;

    // 優先順位1: パレット積載実績のある段ボール
    const cartonsWithPalletLoading = allCartons.filter(c => {
      const mapping = cartonProductMapping[c.code];
      if (!mapping) return false;
      const productMapping = mapping.find(m => m.productName === product.productName);
      return productMapping && productMapping.palletFit && c.palletLoadingDetails;
    });

    if (cartonsWithPalletLoading.length > 0) {
      // パレット積載実績がある場合、最も効率的なものを選択
      return cartonsWithPalletLoading.sort((a, b) => {
        const aMapping = cartonProductMapping[a.code]?.find(m => m.productName === product.productName);
        const bMapping = cartonProductMapping[b.code]?.find(m => m.productName === product.productName);
        return (bMapping?.packingBags || 0) - (aMapping?.packingBags || 0);
      })[0];
    }

    // 優先順位2: その商品について輸出実績のある段ボール
    const cartonsWithHistory = allCartons.filter(c => {
      const mapping = cartonProductMapping[c.code];
      if (!mapping) return false;
      return mapping.some(m => m.productName === product.productName);
    });

    if (cartonsWithHistory.length > 0) {
      // 袋数が多く入る順
      return cartonsWithHistory.sort((a, b) => {
        const aMapping = cartonProductMapping[a.code]?.find(m => m.productName === product.productName);
        const bMapping = cartonProductMapping[b.code]?.find(m => m.productName === product.productName);
        return (bMapping?.packingBags || 0) - (aMapping?.packingBags || 0);
      })[0];
    }

    // 優先順位3: 容量の大きい順（一般的な段ボール）
    const volumeSortedCartons = [...allCartons].sort((a, b) => {
      const aVol = (a.innerLength || 0) * (a.innerWidth || 0) * (a.innerHeight || 0);
      const bVol = (b.innerLength || 0) * (b.innerWidth || 0) * (b.innerHeight || 0);
      return bVol - aVol;
    });

    return volumeSortedCartons[0] || null;
  };

  // ドラッグ&ドロップハンドラー - 段ボールパネルにドロップ（新規段ボール追加）
  const handleCartonPanelDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedProduct || !activeFlow) return;

    const product = productsData.find(p => p.id === draggedProduct.id);
    const selectedProduct = activeFlow.selectedProducts.find(p => p.productId === draggedProduct.id);
    
    if (!product || !selectedProduct) {
      setDraggedProduct(null);
      return;
    }
    
    // 実際の残り数量を計算
    const actualAssigned = calculateActualAssignedQuantity(draggedProduct.id, activeFlow.cartons);
    const actualRemaining = selectedProduct.requestedQuantity - actualAssigned;
    
    if (actualRemaining <= 0) {
      alert('この商品の残り数量がありません');
      setDraggedProduct(null);
      return;
    }

    // 最適な段ボールを選択
    const optimalCarton = selectOptimalCarton(draggedProduct.id);
    if (!optimalCarton) {
      alert('適切な段ボールが見つかりませんでした');
      setDraggedProduct(null);
      return;
    }

    // 段ボールの容量を取得
    const cartonMapping = cartonProductMapping[optimalCarton.code];
    const productMapping = cartonMapping?.find(m => m.productName === product.productName);
    const cartonCapacity = productMapping?.packingBags || 10; // デフォルト10袋

    // 残りの袋数を計算
    const totalBagsRemaining = actualRemaining * product.bagsPerSet;
    const numberOfCartons = Math.ceil(totalBagsRemaining / cartonCapacity);

    // 段ボールを追加
    const newCartons = [];
    let remainingBags = totalBagsRemaining;
    
    for (let i = 0; i < numberOfCartons; i++) {
      const bagsInThisCarton = Math.min(cartonCapacity, remainingBags);
      newCartons.push({
        id: `carton-${Date.now()}-${i}`,
        cartonCode: optimalCarton.code,
        cartonName: optimalCarton.name,
        contents: [{
          productId: draggedProduct.id,
          quantity: bagsInThisCarton
        }],
        currentWeight: optimalCarton.weight || 0,
        assignedToPallet: false
      });
      remainingBags -= bagsInThisCarton;
    }
    
    // 注意: assignedQuantityとremainingQuantityは表示時に計算されるため、ここでは更新不要
    updateActiveFlow({
      cartons: [...activeFlow.cartons, ...newCartons]
    });

    setDraggedProduct(null);
  };

  // ドラッグ&ドロップハンドラー - 既存段ボールにドロップ（商品追加）
  const handleCartonDrop = (e: React.DragEvent, cartonId: string) => {
    e.preventDefault();
    e.stopPropagation(); // パネルへのドロップイベントを伝播させない
    if (!draggedProduct || !activeFlow) return;

    const selectedProduct = activeFlow.selectedProducts.find(p => p.productId === draggedProduct.id);
    if (!selectedProduct) {
      setDraggedProduct(null);
      return;
    }

    // 実際の残り数量を計算
    const actualAssigned = calculateActualAssignedQuantity(draggedProduct.id, activeFlow.cartons);
    const actualRemaining = selectedProduct.requestedQuantity - actualAssigned;

    if (actualRemaining <= 0) {
      alert('この商品の残り数量がありません');
      setDraggedProduct(null);
      return;
    }

    // 数量入力プロンプトを表示
    setDropQuantityPrompt({
      productId: draggedProduct.id,
      cartonId: cartonId,
      maxQuantity: actualRemaining
    });
  };

  // 段ボールにドラッグオーバー
  const handleCartonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // 数量入力完了後の処理
  const handleConfirmProductToCarton = (quantity: number) => {
    if (!dropQuantityPrompt || !activeFlow) return;

    const product = productsData.find(p => p.id === dropQuantityPrompt.productId);
    if (!product) return;

    const selectedProduct = activeFlow.selectedProducts.find(p => p.productId === dropQuantityPrompt.productId);
    if (!selectedProduct) return;

    // 段ボールに商品を追加（assignedQuantityとremainingQuantityは表示時に計算される）
    updateActiveFlow({
      cartons: activeFlow.cartons.map(c =>
        c.id === dropQuantityPrompt.cartonId
          ? {
              ...c,
              contents: [
                ...(c.contents.filter(content => content.productId !== dropQuantityPrompt.productId)),
                {
                  productId: dropQuantityPrompt.productId,
                  quantity: (c.contents.find(content => content.productId === dropQuantityPrompt.productId)?.quantity || 0) + quantity * product.bagsPerSet
                }
              ]
            }
          : c
      )
    });

    setDropQuantityPrompt(null);
    setDraggedProduct(null);
  };

  // ドラッグ&ドロップハンドラー - 段ボールをドラッグ開始
  const handleCartonDragStart = (e: React.DragEvent, cartonId: string, groupIds?: string[], totalCount?: number) => {
    const carton = activeFlow?.cartons.find(c => c.id === cartonId);
    if (!carton) return;

    setDraggedCarton({
      id: cartonId,
      name: carton.cartonName,
      groupIds: groupIds || [cartonId],
      totalCount: totalCount || 1
    });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cartonId);
  };

  // ドラッグ&ドロップハンドラー - パレットにドロップ
  const handlePalletDrop = (e: React.DragEvent, palletId: string) => {
    e.preventDefault();
    if (!draggedCarton || !activeFlow) return;

    const groupIds = draggedCarton.groupIds || [draggedCarton.id];

    // パレットに未配置の段ボールIDを取得
    const unassignedCartonIds = groupIds.filter(id => 
      !activeFlow.pallets.some(p => 
        p.layers.some(layer => layer.cartons.includes(id))
      )
    );

    if (unassignedCartonIds.length === 0) {
      alert('このグループの段ボールはすべてパレットに配置済みです');
      setDraggedCarton(null);
      return;
    }

    // 段ボールの情報を取得
    const firstCarton = activeFlow.cartons.find(c => c.id === unassignedCartonIds[0]);
    const cartonDetail = firstCarton ? allCartons.find(c => c.code === firstCarton.cartonCode) : null;
    
    // パレット積載詳細があれば、それに基づいて配置
    let newLayers: { layerNumber: number; cartons: string[] }[] = [];
    
    if (cartonDetail?.palletLoadingDetails) {
      const { cartonsPerLayer, totalLayers } = cartonDetail.palletLoadingDetails;
      
      // 商品の中身を確認してきな粉150g×20袋セットかチェック
      const isKinako20 = firstCarton?.contents.some(content => {
        const product = productsData.find(p => p.id === content.productId);
        return product?.productName === 'きな粉150g×20袋セット';
      });
      
      let cartonIndex = 0;
      const targetPallet = activeFlow.pallets.find(p => p.id === palletId);
      const startLayerNumber = (targetPallet?.layers.length || 0) + 1;
      
      if (isKinako20) {
        // きな粉150g×20袋セット: 1段13箱×10段 + 縦置き5箱×2層 = 135箱
        // 1-3段目: 13箱ずつ（13回しパターン）
        // 3.5段目: 5箱（縦置き）← 3段目と4段目の間
        // 4-7段目: 13箱ずつ（13回しパターン）
        // 7.5段目: 5箱（縦置き）← 7段目と8段目の間
        // 8-10段目: 13箱ずつ（13回しパターン）
        
        let currentLayerNumber = startLayerNumber;
        
        for (let layer = 0; layer < totalLayers && cartonIndex < unassignedCartonIds.length; layer++) {
          // 通常の13箱層
          const cartonsForThisLayer = unassignedCartonIds.slice(cartonIndex, cartonIndex + cartonsPerLayer);
          if (cartonsForThisLayer.length > 0) {
            newLayers.push({
              layerNumber: currentLayerNumber,
              cartons: cartonsForThisLayer
            });
            cartonIndex += cartonsPerLayer;
            currentLayerNumber++;
          }
          
          // 3段目の後（layer === 2）に縦置き5箱を挿入
          if (layer === 2 && cartonIndex < unassignedCartonIds.length) {
            const verticalCartons = unassignedCartonIds.slice(cartonIndex, cartonIndex + 5);
            if (verticalCartons.length > 0) {
              newLayers.push({
                layerNumber: currentLayerNumber,
                cartons: verticalCartons
              });
              cartonIndex += verticalCartons.length;
              currentLayerNumber++;
            }
          }
          
          // 7段目の後（layer === 6）に縦置き5箱を挿入
          if (layer === 6 && cartonIndex < unassignedCartonIds.length) {
            const verticalCartons = unassignedCartonIds.slice(cartonIndex, cartonIndex + 5);
            if (verticalCartons.length > 0) {
              newLayers.push({
                layerNumber: currentLayerNumber,
                cartons: verticalCartons
              });
              cartonIndex += verticalCartons.length;
              currentLayerNumber++;
            }
          }
        }
    } else {
        // 通常のパレット積載
        for (let layer = 0; layer < totalLayers && cartonIndex < unassignedCartonIds.length; layer++) {
          const cartonsForThisLayer = unassignedCartonIds.slice(cartonIndex, cartonIndex + cartonsPerLayer);
          if (cartonsForThisLayer.length > 0) {
            newLayers.push({
              layerNumber: startLayerNumber + layer,
              cartons: cartonsForThisLayer
            });
            cartonIndex += cartonsPerLayer;
          }
        }
      }
    } else {
      // パレット積載詳細がない場合は、すべてを1つの層に配置
      const targetPallet = activeFlow.pallets.find(p => p.id === palletId);
      const startLayerNumber = (targetPallet?.layers.length || 0) + 1;
      newLayers = [{
        layerNumber: startLayerNumber,
        cartons: unassignedCartonIds
      }];
    }

    updateActiveFlow({
      pallets: activeFlow.pallets.map(p =>
        p.id === palletId
          ? {
              ...p,
              layers: [...p.layers, ...newLayers]
            }
          : p
      ),
      cartons: activeFlow.cartons.map(c =>
        unassignedCartonIds.includes(c.id)
          ? { ...c, assignedToPallet: true, palletId: palletId }
          : c
      )
    });
    
    setDraggedCarton(null);
  };

  // パレットにドラッグオーバー
  const handlePalletDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 段ボール追加（アクティブなフロー用）
  const handleAddCarton = () => {
    if (!activeFlow) return;
    
    const newCarton = {
      id: `carton-${Date.now()}`,
      cartonCode: '120サイズ',
      cartonName: '段ボール120',
      contents: [],
      currentWeight: 0,
      assignedToPallet: false
    };
    updateActiveFlow({
      cartons: [...activeFlow.cartons, newCarton]
    });
  };

  // パレット追加（アクティブなフロー用）
  const handleAddPallet = () => {
    if (!activeFlow) return;
    
    const newPallet = {
      id: `pallet-${Date.now()}`,
      size: '110x110cm',
      layers: []
    };
    updateActiveFlow({
      pallets: [...activeFlow.pallets, newPallet]
    });
  };

  // 段ボール推奨から段ボールを追加（アクティブなフロー用）
  const handleSelectRecommendedCarton = (productId: number, recommendation: CartonRecommendation) => {
    if (!activeFlow) return;
    
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const selectedProduct = activeFlow.selectedProducts.find(sp => sp.productId === productId);
    if (!selectedProduct) return;

    // 残りの袋数を全て段ボールに入れるために必要な箱数を計算
    const totalBagsRemaining = selectedProduct.remainingQuantity * product.bagsPerSet;
    const cartonCapacity = recommendation.capacity; // 1箱あたりの袋数
    const numberOfCartons = Math.ceil(totalBagsRemaining / cartonCapacity);
    
    // 段ボールを必要数だけ追加
    const newCartons = [];
    let remainingBags = totalBagsRemaining;
    
    for (let i = 0; i < numberOfCartons; i++) {
      const bagsInThisCarton = Math.min(cartonCapacity, remainingBags);
      newCartons.push({
        id: `carton-${Date.now()}-${i}`,
        cartonCode: recommendation.code,
        cartonName: recommendation.name,
        contents: [{
          productId: productId,
          quantity: bagsInThisCarton
        }],
        currentWeight: recommendation.weight,
        assignedToPallet: false
      });
      remainingBags -= bagsInThisCarton;
    }
    
    updateActiveFlow({
      cartons: [...activeFlow.cartons, ...newCartons],
      selectedProducts: activeFlow.selectedProducts.map(sp =>
        sp.productId === productId
          ? {
              ...sp,
              assignedQuantity: sp.assignedQuantity + totalBagsRemaining / product.bagsPerSet,
              remainingQuantity: 0
            }
          : sp
      )
    });
  };

  // 段ボール検索から段ボールを追加（アクティブなフロー用）
  const handleSelectCartonFromSearch = (productId: number, cartonCode: string) => {
    if (!activeFlow) return;
    
    const carton = allCartons.find(c => c.code === cartonCode);
    if (!carton) return;

    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const selectedProduct = activeFlow.selectedProducts.find(sp => sp.productId === productId);
    if (!selectedProduct) return;

    // 段ボールの容積から推定袋数を計算
    const volumeMatch = carton.volume?.match(/[\d.]+/);
    const volume = volumeMatch ? parseFloat(volumeMatch[0]) : 15; // デフォルト15L

    // 1袋あたりの体積を推定（kg × 1.2L/kg）
    const unitWeightMatch = product.unitWeight?.match(/[\d.]+/);
    const unitWeight = unitWeightMatch ? parseFloat(unitWeightMatch[0]) : 0.5;
    const volumePerBag = unitWeight * 1.2;
    
    // 梱包可能袋数（5袋単位で切り捨て）
    const estimatedCapacity = Math.floor((volume / volumePerBag) / 5) * 5;
    const capacity = Math.min(estimatedCapacity, selectedProduct.remainingQuantity);

    const newCarton = {
      id: `carton-${Date.now()}`,
      cartonCode: carton.code,
      cartonName: carton.name,
      contents: [{
        productId: productId,
        quantity: capacity
      }],
      currentWeight: (carton.weight || 500) / 1000, // g to kg
      assignedToPallet: false
    };

    // 商品の割り当て数量を更新
    updateActiveFlow({
      cartons: [...activeFlow.cartons, newCarton],
      selectedProducts: activeFlow.selectedProducts.map(sp =>
        sp.productId === productId
          ? {
              ...sp,
              assignedQuantity: sp.assignedQuantity + capacity,
              remainingQuantity: sp.remainingQuantity - capacity
            }
          : sp
      )
    });

    alert(`${carton.name}を追加しました（${capacity}袋）`);
    setShowCartonSearch(null); // 検索を閉じる
    setCartonSearch(''); // 検索をリセット
  };

  // 計算値（アクティブなフロー用）
  const calculated = useMemo(() => {
    if (!activeFlow) {
      return {
        totalProducts: 0,
        totalBags: 0,
        totalCartons: 0,
        totalPallets: 0,
        totalWeight: 0
      };
    }
    
    const totalProducts = activeFlow.selectedProducts.length;
    const totalBags = activeFlow.selectedProducts.reduce((sum, p) => sum + p.requestedQuantity, 0);
    const totalCartons = activeFlow.cartons.length;
    const totalPallets = activeFlow.pallets.length;
    
    let totalWeight = 0;
    activeFlow.selectedProducts.forEach(sp => {
      const product = productsData.find(p => p.id === sp.productId);
      if (product && product.setWeight) {
        const weightMatch = product.setWeight.match(/[\d.]+/);
        if (weightMatch) {
          totalWeight += parseFloat(weightMatch[0]) * sp.requestedQuantity;
        }
      }
    });

    return {
      totalProducts,
      totalBags,
      totalCartons,
      totalPallets,
      totalWeight: totalWeight.toFixed(2)
    };
  }, [activeFlow]);

  // 商品フィルタリング（選択された商品を上部に表示）
  const filteredProducts = productsData
    .filter(product =>
      product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.janCode.toLowerCase().includes(productSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = activeFlow?.selectedProducts.some(p => p.productId === a.id);
      const bSelected = activeFlow?.selectedProducts.some(p => p.productId === b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  // 段ボール検索用フィルタリング
  const getFilteredCartons = (productId: number) => {
    if (showCartonSearch !== productId) return [];
    
    return allCartons
      .filter(carton =>
        carton.code.toLowerCase().includes(cartonSearch.toLowerCase()) ||
        carton.name.toLowerCase().includes(cartonSearch.toLowerCase()) ||
        carton.deliverySize.toLowerCase().includes(cartonSearch.toLowerCase())
      )
      .slice(0, 20); // 20件に制限
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        icon="📦"
        iconBgColor="bg-indigo-600"
        subtitle="管理者 - 出荷計画作成（統合ワークスペース）"
        userName={user.name}
      />
      <Navigation 
        items={['ダッシュボード', '出荷計画', '商品マスタ', '段ボールマスタ', '取引先', 'ユーザー管理', 'レポート']}
        activeItem="出荷計画"
        activeColor="indigo"
        role="admin"
      />

      {/* トップバー */}
      <div className="bg-white border-b border-gray-200 px-4 py-1.5 flex justify-between items-center">
          <button
          onClick={() => router.push('/admin/shipments')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
          >
            ← 戻る
          </button>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            出荷計画: <span className="font-medium text-gray-900">新規作成</span>
          </span>
            <a
              href="/admin/masters/products"
              target="_blank"
              rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
            📦 商品マスタ
            </a>
            <a
              href="/admin/masters/cartons"
              target="_blank"
              rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            📦 段ボールマスタ
            </a>
          </div>
        </div>

      {/* 配送ルート（フロー）管理セクション */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-1.5">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-semibold text-gray-900">📋 配送ルート管理</h3>
            <button
              onClick={handleAddFlow}
              className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              + 配送ルートを追加
            </button>
          </div>

          {/* フロー一覧（タブ形式） */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {packingState.flows.map((flow, idx) => {
              const isActive = flow.id === packingState.activeFlowId;
              const flowName = generateFlowName(flow);
              
              return (
                <div
                  key={flow.id}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg border-2 transition-all cursor-pointer min-w-fit ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                  onClick={() => setPackingState({ ...packingState, activeFlowId: flow.id })}
                >
                  <div className="flex-1">
                    <div className={`text-xs font-medium ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                      {flowName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      商品{flow.selectedProducts.length}点 / 段ボール{flow.cartons.length}箱 / パレット{flow.pallets.length}基
                    </div>
                  </div>
                  {packingState.flows.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFlow(flow.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
                </div>

          {/* 現在編集中のフロー情報 */}
          <div className="mt-1.5 p-1.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-amber-900">📍 現在編集中:</span>
              <span className="text-amber-800">{generateFlowName(activeFlow)}</span>
              <span className="text-xs text-amber-600 ml-2">
                ← この配送ルート用の商品・段ボール・パレットを設計します
              </span>
            </div>
                </div>
              </div>
            </div>

      {/* フローパターン選択バー */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-200">
        <div className="px-4 py-2">
          {/* フローパターン選択（現在のフロー用） */}
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">🚚 物流フローパターン（このルート用）</h3>
            <div className="grid grid-cols-2 gap-3">
              {flowPatterns.map((pattern) => {
                const isActive = activeFlow?.flowPatternId === pattern.id;
                        return (
                  <button
                    key={pattern.id}
                    onClick={() => {
                      if (activeFlow && (activeFlow.cartons.length > 0 || activeFlow.pallets.length > 0)) {
                        if (!confirm('フローパターンを変更すると現在の作業内容がリセットされます。よろしいですか？')) {
                          return;
                        }
                      }
                      updateActiveFlow({
                        flowPatternId: pattern.id,
                        currentStepNumber: 1,
                        packerId: pattern.id === 'direct' ? undefined : activeFlow?.packerId,
                        selectedProducts: [],
                        cartons: [],
                        pallets: []
                      });
                    }}
                    className={`p-2 rounded-lg border-2 transition-all text-left ${
                      isActive
                        ? 'border-indigo-500 bg-white shadow-md'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow'
                    }`}
                  >
                    <div className={`text-xs font-semibold mb-0.5 ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                      {pattern.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {pattern.description}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      {pattern.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center">
                          {idx > 0 && <span className="mx-1 text-gray-400">→</span>}
                          <span className={`px-2 py-1 rounded-full ${
                            isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {step.from === 'manufacturer' ? 'メーカー' :
                             step.from === 'packer' ? '梱包業者' :
                             step.from === 'forwarder' ? 'フォワーダー' : 'アメリカ'}
                                    </span>
                                </div>
                      ))}
                      <span className="mx-1 text-gray-400">→</span>
                      <span className={`px-2 py-1 rounded-full ${
                        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        アメリカ
                      </span>
                                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 関係者選択（現在のフロー用） */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {/* メーカー選択 */}
                                    <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">メーカー</label>
              <select
                value={activeFlow?.manufacturerId || ''}
                onChange={(e) => updateActiveFlow({
                  manufacturerId: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">選択してください</option>
                {getCompaniesByType('manufacturer').map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
                                    </div>

            {/* 梱包業者選択（梱包業者経由の場合のみ） */}
            {activeFlow?.flowPatternId === 'via-packer' && (
                                    <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">梱包業者</label>
                <select
                  value={activeFlow?.packerId || ''}
                  onChange={(e) => updateActiveFlow({
                    packerId: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">選択してください</option>
                  {getCompaniesByType('packer').map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
                                    </div>
                                  )}

            {/* フォワーダー選択 */}
                                    <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">フォワーダー</label>
              <select
                value={activeFlow?.forwarderId || ''}
                onChange={(e) => updateActiveFlow({
                  forwarderId: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">選択してください</option>
                {getCompaniesByType('forwarder').map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 現在のステップ表示 */}
          {currentFlowPattern && currentStepInfo && (
            <div className="bg-white rounded-lg p-2 border border-indigo-200">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-gray-900">
                  📍 現在のステップ: {currentStepInfo.label}
                </h4>
                <div className="text-xs text-gray-600">
                  ステップ {packingState.currentStepNumber} / {currentFlowPattern.steps.length}
                </div>
              </div>
              
              {/* プログレスバー */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  {currentFlowPattern.steps.map((step, idx) => (
                    <div key={idx} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          idx + 1 < packingState.currentStepNumber
                            ? 'bg-green-500 text-white'
                            : idx + 1 === packingState.currentStepNumber
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {idx + 1 < packingState.currentStepNumber ? '✓' : idx + 1}
                        </div>
                        <div className={`text-xs mt-0.5 text-center ${
                          idx + 1 === packingState.currentStepNumber ? 'font-semibold text-indigo-700' : 'text-gray-600'
                        }`}>
                          {step.from === 'manufacturer' ? selectedManufacturer?.name || 'メーカー' :
                           step.from === 'packer' ? selectedPacker?.name || '梱包業者' :
                           step.from === 'forwarder' ? selectedForwarder?.name || 'フォワーダー' : 'アメリカ'}
                        </div>
                      </div>
                      {idx < currentFlowPattern.steps.length && (
                        <div className="flex-1 flex items-center px-2">
                          <div className={`h-1 w-full rounded transition-all ${
                            idx + 1 < packingState.currentStepNumber ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                          <span className="mx-2 text-gray-400">→</span>
                                    </div>
                                  )}
                                </div>
                  ))}
                  {/* 最終目的地 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      packingState.currentStepNumber > currentFlowPattern.steps.length
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      🏁
                    </div>
                    <div className="text-xs mt-0.5 text-center text-gray-600">
                      {selectedDestination?.name || 'アメリカ'}
                    </div>
                  </div>
                                </div>
                              </div>
                              
              {/* ステップナビゲーション（現在のフロー用） */}
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200">
                <button
                  onClick={() => {
                    const currentStep = activeFlow?.currentStepNumber || 1;
                    if (currentStep > 1) {
                      updateActiveFlow({
                        currentStepNumber: currentStep - 1
                      });
                    }
                  }}
                  disabled={(activeFlow?.currentStepNumber || 1) === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← 前のステップ
                </button>
                <div className="text-xs text-gray-600">
                  {currentStepInfo?.description}
                                </div>
                <button
                  onClick={() => {
                    const currentStep = activeFlow?.currentStepNumber || 1;
                    if (currentStep < (currentFlowPattern?.steps.length || 0)) {
                      if ((activeFlow?.cartons.length || 0) === 0) {
                        alert('段ボールを追加してから次のステップに進んでください');
                        return;
                      }
                      updateActiveFlow({
                        currentStepNumber: currentStep + 1
                      });
                    }
                  }}
                  disabled={(activeFlow?.currentStepNumber || 1) >= (currentFlowPattern?.steps.length || 0)}
                  className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次のステップ →
                </button>
                            </div>
                          </div>
          )}
                  </div>
                </div>

      {/* 受入情報セクション（前のフローから送られてくる段ボール） */}
      {(() => {
        const receivedCartons = getReceivedCartonsFromPreviousFlows();
        const hasReceivedCartons = receivedCartons.length > 0;
        const currentStep = currentFlowPattern?.steps[activeFlow?.currentStepNumber - 1];
        const shouldShowReceived = currentStep && currentStep.from !== 'manufacturer';
        
        if (!shouldShowReceived) return null;
        
        return (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200">
            <div className="px-4 py-1.5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-amber-900 flex items-center gap-2">
                  <span className="text-sm">📥</span>
                  <span>受入段ボール（前のフローから受領）</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs">
                    {receivedCartons.length}箱
                  </span>
                </h3>
                {!hasReceivedCartons && (
                  <div className="text-xs text-amber-700">
                    ※ 他の配送ルートで段ボールを作成すると、ここに表示されます
                  </div>
                )}
              </div>

              {hasReceivedCartons ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {receivedCartons.map((receivedCarton) => {
                    const alreadyProcessed = activeFlow?.receivedCartons?.find(rc => rc.id === receivedCarton.id);
                    
                      return (
                      <div 
                        key={receivedCarton.id} 
                        className={`bg-white rounded-lg p-3 border-2 transition-all ${
                          alreadyProcessed 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-amber-300 hover:border-amber-400 hover:shadow-md'
                        }`}
                      >
                        {/* ヘッダー */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-xs font-bold text-gray-900">
                              {receivedCarton.cartonName}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              コード: {receivedCarton.cartonCode}
                            </div>
                            <div className="text-xs text-blue-600 mt-1 font-medium">
                              📦 {receivedCarton.sourceFlowName}
                            </div>
                          </div>
                          {alreadyProcessed && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              {alreadyProcessed.action === 'use-as-is' ? '使用中' : '詰替済'}
                            </span>
                          )}
                        </div>
                        
                        {/* 内容物 */}
                        <div className="bg-gray-50 rounded p-2 mb-3">
                          <div className="text-xs font-semibold text-gray-700 mb-1">📋 内容物:</div>
                          {receivedCarton.contents.map((content, idx) => {
                            const product = productsData.find(p => p.id === content.productId);
                            return (
                              <div key={idx} className="text-xs text-gray-600 flex justify-between">
                                <span>{product?.productName || `商品ID: ${content.productId}`}</span>
                                <span className="font-medium">{content.quantity}袋</span>
                        </div>
                      );
                    })}
                          {receivedCarton.contents[0]?.sourceManufacturer && (
                            <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-200">
                              製造元: {receivedCarton.contents[0].sourceManufacturer}
                  </div>
                          )}
                        </div>
                        
                        {/* アクションボタン */}
                        {!alreadyProcessed && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUseReceivedCartonAsIs(receivedCarton)}
                              className="flex-1 px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                              title="この段ボールをそのまま次に送る"
                            >
                              ✓ そのまま使う
                            </button>
                            <button
                              onClick={() => handleUnpackReceivedCarton(receivedCarton)}
                              className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                              title="段ボールから商品を取り出して新しい段ボールに詰め替える"
                            >
                              🔄 詰め替える
                            </button>
                </div>
              )}

                        {alreadyProcessed && alreadyProcessed.action === 'repack' && (
                          <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                            💡 商品を取り出しました。左側の商品リストから新しい段ボールに詰めてください。
                          </div>
                        )}
                        
                        {alreadyProcessed && alreadyProcessed.action === 'use-as-is' && (
                          <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                            ✓ この段ボールをそのまま次のステップに送ります
                          </div>
                        )}
                        </div>
                      );
                    })}
                  </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-amber-300">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm text-amber-700 font-medium">
                    まだ受入段ボールがありません
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    他の配送ルートで段ボールを作成・完了すると、ここに表示されます
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* メインコンテンツ - 2行レイアウト */}
      <main className="overflow-auto flex flex-col">
        {/* 上段: 商品選択と段ボール設計 */}
        <div className="flex border-b border-gray-300" style={{ minHeight: '800px' }}>
          
          {/* ① 商品選択パネル */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white" style={{ minHeight: '800px' }}>
            {/* ヘッダー */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  ① 商品選択（送出）
                </h3>
                <span className="text-xs text-gray-500">
                  {calculated.totalProducts > 0 ? `${Math.round((calculated.totalProducts / productsData.length) * 100)}%` : '0%'}
                </span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{width: `${calculated.totalProducts > 0 ? 25 : 0}%`}}
                />
              </div>
              {/* 検索 */}
                <input
                  type="text"
                placeholder="商品名、SKU、JANで検索..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full mt-3 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            {/* 商品リスト */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredProducts.map((product) => {
                const selectedProduct = activeFlow?.selectedProducts.find(p => p.productId === product.id);
                const isSelected = !!selectedProduct;
                const isExpanded = expandedProductId === product.id;
                
                return (
                  <div
                    key={product.id}
                    draggable={isSelected && selectedProduct && (() => {
                      const actualAssigned = calculateActualAssignedQuantity(product.id, activeFlow?.cartons || []);
                      const actualRemaining = selectedProduct.requestedQuantity - actualAssigned;
                      return actualRemaining > 0;
                    })()}
                    onDragStart={(e) => isSelected && handleProductDragStart(e, product.id)}
                    className={`border rounded-lg transition-colors ${
                      isSelected ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200 hover:border-indigo-200'
                    } ${isSelected && selectedProduct && (() => {
                      const actualAssigned = calculateActualAssignedQuantity(product.id, activeFlow?.cartons || []);
                      const actualRemaining = selectedProduct.requestedQuantity - actualAssigned;
                      return actualRemaining > 0 ? 'cursor-move' : '';
                    })()}`}
                  >
                    {/* 基本情報 */}
                    <div 
                      className="p-3 cursor-pointer"
                      onClick={() => !isSelected && handleProductToggle(product.id)}
                    >
                      <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                          checked={isSelected}
                          onChange={() => handleProductToggle(product.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                      <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {product.productName}
                        </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {product.numberOfSets}セット、{product.bagsPerSet}袋
                      </div>
                              {product.manufacturerId && (
                                <div className="text-xs text-blue-600 mt-0.5 font-medium">
                                  🏭 {getCompanyById(product.manufacturerId)?.name}
                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProductId(isExpanded ? null : product.id);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 ml-2"
                            >
                              {isExpanded ? '▲ 閉じる' : '▼ 詳細'}
                            </button>
              </div>

                          {/* 重量情報 */}
                          {product.setWeight && (
                            <div className="text-xs text-gray-600 mt-1">
                              💪 {product.setWeight}/セット
                              {product.setWeightPounds && (
                                <span className="text-gray-400 ml-1">({product.setWeightPounds})</span>
                              )}
                            </div>
                          )}
                          
                          {/* セット数入力 */}
                          {isSelected && selectedProduct && (
                            <div className="mt-2 space-y-1">
                              <label className="text-xs text-gray-600">セット数:</label>
                              <input
                                type="number"
                                min="1"
                                value={selectedProduct.requestedQuantity}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                              />
                              <div className="space-y-0.5 text-xs">
                                {(() => {
                                  const actualAssigned = calculateActualAssignedQuantity(product.id, activeFlow?.cartons || []);
                                  const actualRemaining = selectedProduct.requestedQuantity - actualAssigned;
                    return (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">合計袋数:</span>
                                        <span className="font-semibold text-indigo-700">
                                          {selectedProduct.requestedQuantity * product.bagsPerSet}袋
                          </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">段ボール未割当:</span>
                                        <span className="text-orange-600 font-medium">
                                          {actualRemaining}セット ({actualRemaining * product.bagsPerSet}袋)
                                        </span>
                                      </div>
                                      {actualAssigned > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">段ボール割当済:</span>
                                          <span className="text-green-600 font-medium">
                                            {actualAssigned}セット ({actualAssigned * product.bagsPerSet}袋)
                                          </span>
                                        </div>
                                      )}
                                      {actualRemaining > 0 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTransferToCartonDesign(product.id);
                                          }}
                                          className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                          <span>→②</span>
                                          <span>段ボール設計に移動</span>
                                          <span className="text-blue-200">({actualRemaining}セット)</span>
                                        </button>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                        </div>
                        
                    {/* 詳細情報（展開時） */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-3 bg-gray-50 space-y-3">
                        {/* 商品マスタ詳細 */}
                          <div>
                          <div className="text-xs font-semibold text-gray-700 mb-2">📋 商品情報</div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            {product.sku && (
                              <div className="col-span-2">
                                <span className="text-gray-500">SKU:</span>
                                <span className="ml-1 font-mono text-gray-900">{product.sku}</span>
                          </div>
                            )}
                            {product.janCode && (
                              <div className="col-span-2">
                                <span className="text-gray-500">JAN:</span>
                                <span className="ml-1 font-mono text-gray-900">{product.janCode}</span>
                              </div>
                            )}
                            {product.asin && (
                          <div>
                                <span className="text-gray-500">ASIN:</span>
                                <span className="ml-1 font-mono text-gray-900">{product.asin}</span>
                          </div>
                            )}
                            {product.fnsku && (
                          <div>
                                <span className="text-gray-500">FNSKU:</span>
                                <span className="ml-1 font-mono text-gray-900">{product.fnsku}</span>
                          </div>
                            )}
                            {product.hsCode && (
                              <div>
                                <span className="text-gray-500">HSコード:</span>
                                <span className="ml-1 font-mono text-gray-900">{product.hsCode}</span>
                        </div>
                            )}
                            {product.supplier && (
                              <div>
                                <span className="text-gray-500">仕入先:</span>
                                <span className="ml-1 text-gray-900">{product.supplier}</span>
                      </div>
                            )}
                            {product.category && (
                              <div>
                                <span className="text-gray-500">カテゴリ:</span>
                                <span className="ml-1 text-gray-900">{product.category}</span>
                </div>
              )}
                            {product.costPrice && (
                              <div>
                                <span className="text-gray-500">仕入金額:</span>
                                <span className="ml-1 text-gray-900">¥{product.costPrice}</span>
                              </div>
                            )}
                          </div>
            </div>

                        {/* 標準箱入数 */}
                        {product.standardBoxQuantity && product.standardBoxQuantity > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-1">📦 標準梱包</div>
                            <div className="text-xs text-gray-600">
                              {product.standardBoxQuantity}袋 ({product.standardBoxSetQuantity}セット)
                              {product.boxLengthCm && (
                                <span className="ml-1">
                                  / {product.boxLengthCm}×{product.boxWidthCm}×{product.boxHeightCm}cm
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* パレット積載情報 */}
                        {product.palletLoading && (
                          <div className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1">
                              <span className="bg-green-200 text-green-900 px-1.5 py-0.5 rounded text-xs">パレットぴったり</span>
                              🏗️ パレット積載実績
                            </div>
                            <div className="text-xs text-gray-700 space-y-0.5">
                              <div>1c=1p {product.palletLoading.cartonsPerShipment}c/s</div>
                              <div>📦 1段{product.palletLoading.cartonsPerPallet}箱 × {product.palletLoading.layers}段</div>
                              <div>📏 高さ{product.palletLoading.heightMm}mm × 幅{product.palletLoading.widthMm}mm</div>
                              <div className="font-medium text-green-700">⚖️ {(product.palletLoading.weightG / 1000).toFixed(1)}kg</div>
                            </div>
                          </div>
                        )}
                        
                        {/* 段ボール推奨 */}
                        {isSelected && (
                <div>
                            <div className="text-xs font-semibold text-gray-700 mb-2">🎯 おすすめ段ボール（上位3件）</div>
                            <CartonRecommendations
                              product={product}
                              onSelectCarton={(rec) => handleSelectRecommendedCarton(product.id, rec)}
                            />
                            
                            {/* 段ボール検索 */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => {
                                  if (showCartonSearch === product.id) {
                                    setShowCartonSearch(null);
                                    setCartonSearch('');
                                  } else {
                                    setShowCartonSearch(product.id);
                                    setCartonSearch('');
                                  }
                                }}
                                className="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium"
                              >
                                {showCartonSearch === product.id ? '🔍 検索を閉じる' : '🔍 他の段ボールを検索'}
                              </button>
                              
                              {showCartonSearch === product.id && (
                                <div className="mt-2 space-y-2">
                        <input
                                    type="text"
                                    placeholder="段ボールコード、サイズで検索..."
                                    value={cartonSearch}
                                    onChange={(e) => setCartonSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  />
                                  
                                  <div className="max-h-60 overflow-y-auto space-y-1 bg-gray-50 rounded p-2">
                                    {getFilteredCartons(product.id).map((carton) => (
                                      <div
                                        key={carton.code}
                                        className="border border-gray-200 rounded p-2 bg-white hover:border-indigo-300 hover:shadow transition-all cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectCartonFromSearch(product.id, carton.code);
                                        }}
                                      >
                                        <div className="flex justify-between items-start mb-1">
                                          <div className="text-xs font-medium text-gray-900">
                                            {carton.name}
                        </div>
                                          <span className={`px-1.5 py-0.5 text-xs rounded flex-shrink-0 ml-1 ${
                                            carton.code.startsWith('HIST-')
                                              ? 'bg-amber-100 text-amber-800'
                                              : 'bg-blue-100 text-blue-800'
                                          }`}>
                                            {carton.code.startsWith('HIST-') ? '実績' : '標準'}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-0.5">
                                          <div>コード: {carton.code}</div>
                                          <div>📦 {carton.deliverySize}</div>
                                          <div>📏 {carton.innerDimensions}</div>
                                          {carton.weight && <div>⚖️ {carton.weight}g</div>}
                                          {carton.price && <div>💰 ¥{carton.price}</div>}
                                        </div>
                                      </div>
                                    ))}
                                    {cartonSearch && getFilteredCartons(product.id).length === 0 && (
                                      <div className="text-center py-4 text-xs text-gray-500">
                                        該当する段ボールが見つかりません
                  </div>
                                    )}
                                    {!cartonSearch && (
                                      <div className="text-center py-4 text-xs text-gray-500">
                                        段ボールを検索してください
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
                </div>

            {/* フッター */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>選択:</span>
                  <span className="font-medium">{calculated.totalProducts}商品</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>合計:</span>
                  <span className="font-medium">{calculated.totalBags}袋</span>
                </div>
                <div className="flex justify-between text-gray-900 font-medium border-t pt-1">
                  <span>重量:</span>
                  <span className="text-indigo-600">{calculated.totalWeight}kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* ② 段ボール設計パネル */}
          <div 
            className="w-1/2 flex flex-col bg-white"
            style={{ minHeight: '800px' }}
            onDragOver={handleCartonDragOver}
            onDrop={handleCartonPanelDrop}
          >
            {/* ヘッダー */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  ② 段ボール設計（送出）
                </h3>
                <span className="text-xs text-gray-500">{calculated.totalCartons}箱</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{width: `${calculated.totalCartons > 0 ? 50 : 0}%`}}
                />
              </div>
              {/* 割当状況サマリー */}
              {activeFlow && activeFlow.selectedProducts.length > 0 && (
                <div className="mt-2 space-y-1">
                  {activeFlow.selectedProducts.map(sp => {
                    const product = productsData.find(p => p.id === sp.productId);
                    if (!product) return null;
                    const actualAssigned = calculateActualAssignedQuantity(sp.productId, activeFlow.cartons);
                    const diff = sp.requestedQuantity - actualAssigned;
                    return (
                      <div key={sp.productId} className={`text-xs px-2 py-1 rounded flex justify-between ${
                        diff === 0 ? 'bg-green-50 text-green-700' :
                        diff > 0 ? 'bg-orange-50 text-orange-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        <span className="truncate mr-2">{product.productName}</span>
                        <span className="font-medium whitespace-nowrap">
                          {diff === 0 ? '✓ 割当完了' :
                           diff > 0 ? `${diff}セット不足` :
                           `${Math.abs(diff)}セット超過`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* 段ボールリスト（アクティブなフロー用） */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(activeFlow?.cartons.length || 0) === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 mx-2 transition-all">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm font-semibold text-blue-600 mb-1">段ボール設計</p>
                  <p className="text-xs text-gray-600">左側の商品で「→② 段ボール設計に移動」ボタンをクリック</p>
                  <p className="text-xs text-gray-500 mt-1">自動的に最適な段ボールが選択されます</p>
                </div>
              ) : (
                groupCartons(activeFlow?.cartons || []).map((group, groupIndex) => (
                  <div 
                    key={group.key}
                    draggable={group.contents.length > 0}
                    onDragStart={(e) => handleCartonDragStart(e, group.cartonIds[0], group.cartonIds, group.count)}
                    className={`border border-gray-200 rounded-lg p-3 bg-white transition-all ${
                      group.contents.length > 0 
                        ? 'cursor-move hover:shadow-lg hover:border-blue-400 hover:bg-blue-50' 
                        : ''
                    }`}
                    onDragOver={handleCartonDragOver}
                    onDrop={(e) => handleCartonDrop(e, group.cartonIds[0])}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <span>段ボールグループ#{groupIndex + 1}</span>
                          {group.count > 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {group.count}箱
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{group.cartonCode}</div>
                        {(() => {
                          const cartonDetail = allCartons.find(c => c.code === group.cartonCode);
                          if (cartonDetail?.palletLoadingDetails) {
                            return (
                              <div className="text-xs text-green-600 mt-1 bg-green-50 px-2 py-1 rounded border border-green-200">
                                <div className="flex items-center gap-1 font-semibold">
                                  <span>🏗️</span>
                                  <span>パレットぴったり載る</span>
                  </div>
                                <div className="ml-5 mt-1 text-green-700">
                                  1段{cartonDetail.palletLoadingDetails.cartonsPerLayer}箱 × {cartonDetail.palletLoadingDetails.totalLayers}段 / 高さ{cartonDetail.palletLoadingDetails.heightMm}mm
                </div>
                              </div>
                            );
                          } else if (cartonDetail?.palletConfig) {
                            return (
                              <div className="text-xs text-blue-600 mt-1 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                <span>📐</span>
                                <span>パレット配置: 1段{cartonDetail.palletConfig.boxesPerLayer}箱 × {cartonDetail.palletConfig.layers}段</span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                        {group.action === 'use-as-is' && (
                          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <span>✓</span>
                            <span>受入段ボールをそのまま使用</span>
                          </div>
                        )}
                      </div>
                    <button
                        onClick={() => {
                          if (!activeFlow) return;
                          const idsToRemove = new Set(group.cartonIds);
                          const onPallet = activeFlow.pallets.some(p =>
                            p.layers.some(l => l.cartons.some(cid => idsToRemove.has(cid)))
                          );
                          if (onPallet && !confirm(`この段ボールグループ（${group.count}箱）はパレットに配置済みです。削除するとパレットからも削除されます。続けますか？`)) return;
                          updateActiveFlow({
                            cartons: activeFlow.cartons.filter(c => !idsToRemove.has(c.id)),
                            pallets: activeFlow.pallets.map(p => ({
                              ...p,
                              layers: p.layers.map(l => ({
                                ...l,
                                cartons: l.cartons.filter(cid => !idsToRemove.has(cid))
                              })).filter(l => l.cartons.length > 0)
                            }))
                          });
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        削除
                    </button>
                  </div>
                  
                    {/* 段ボールサイズ変更 */}
                    <div className="mb-3 bg-purple-50 border border-purple-200 rounded p-2">
                      <label className="block text-xs font-semibold text-purple-900 mb-1">
                        📦 段ボールサイズ変更{group.count > 1 && ` (${group.count}箱すべて)`}:
                      </label>
                      <div className="relative" data-carton-dropdown>
                        <button
                          onClick={() => {
                            if (cartonSearchOpen === group.key) {
                              setCartonSearchOpen(null);
                              setCartonSearchText('');
                            } else {
                              setCartonSearchOpen(group.key);
                              setCartonSearchText('');
                            }
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-purple-300 rounded bg-white text-left truncate hover:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        >
                          {(() => {
                            const current = allCartons.find(c => c.code === group.cartonCode);
                            if (!current) return group.cartonCode;
                            let name = `${current.name} (${current.code})`;
                            if (current.palletLoadingDetails) {
                              name += ` [1段${current.palletLoadingDetails.cartonsPerLayer}箱×${current.palletLoadingDetails.totalLayers}段]`;
                            }
                            return name;
                          })()}
                        </button>
                        {cartonSearchOpen === group.key && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-purple-300 rounded-lg shadow-xl max-h-64 overflow-hidden">
                            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                              <input
                                type="text"
                                autoFocus
                                placeholder="段ボール名・コード・サイズで検索..."
                                value={cartonSearchText}
                                onChange={(e) => setCartonSearchText(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div className="overflow-y-auto max-h-48">
                              {allCartons
                                .filter(c => {
                                  if (!cartonSearchText) return true;
                                  const q = cartonSearchText.toLowerCase();
                                  const searchStr = `${c.name} ${c.code} ${c.innerLength}×${c.innerWidth}×${c.innerHeight} ${c.deliverySize} ${c.palletLoadingDetails?.productName || ''}`.toLowerCase();
                                  return searchStr.includes(q);
                                })
                                .map(cartonOption => {
                                  const isSelected = cartonOption.code === group.cartonCode;
                                  return (
                                    <button
                                      key={cartonOption.code}
                                      onClick={() => {
                                        if (!activeFlow) return;
                                        const idsSet = new Set(group.cartonIds);
                                        const hasAssigned = activeFlow.cartons.some(c => idsSet.has(c.id) && c.assignedToPallet);
                                        if (hasAssigned && !confirm('この段ボールグループはパレットに配置済みです。サイズを変更するとパレットから取り外されます。続けますか？')) return;
                                        updateActiveFlow({
                                          cartons: activeFlow.cartons.map(c =>
                                            idsSet.has(c.id)
                                              ? { ...c, cartonCode: cartonOption.code, cartonName: cartonOption.name, assignedToPallet: false, palletId: undefined }
                                              : c
                                          ),
                                          pallets: hasAssigned
                                            ? activeFlow.pallets.map(p => ({
                                                ...p,
                                                layers: p.layers.map(l => ({
                                                  ...l,
                                                  cartons: l.cartons.filter(cid => !idsSet.has(cid))
                                                })).filter(l => l.cartons.length > 0)
                                              }))
                                            : activeFlow.pallets
                                        });
                                        setCartonSearchOpen(null);
                                        setCartonSearchText('');
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs hover:bg-purple-50 border-b border-gray-100 last:border-b-0 ${
                                        isSelected ? 'bg-purple-100 font-semibold text-purple-900' : 'text-gray-700'
                                      }`}
                                    >
                                      <div className="font-medium">{cartonOption.name}</div>
                                      <div className="text-gray-500 mt-0.5">
                                        {cartonOption.code} | {cartonOption.innerLength}×{cartonOption.innerWidth}×{cartonOption.innerHeight}mm
                                        {cartonOption.palletLoadingDetails && (
                                          <span className="text-purple-600 ml-1">
                                            [1段{cartonOption.palletLoadingDetails.cartonsPerLayer}箱×{cartonOption.palletLoadingDetails.totalLayers}段 / 高さ{cartonOption.palletLoadingDetails.heightMm}mm]
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              {allCartons.filter(c => {
                                if (!cartonSearchText) return true;
                                const q = cartonSearchText.toLowerCase();
                                return `${c.name} ${c.code} ${c.innerLength}×${c.innerWidth}×${c.innerHeight} ${c.deliverySize} ${c.palletLoadingDetails?.productName || ''}`.toLowerCase().includes(q);
                              }).length === 0 && (
                                <div className="px-3 py-4 text-xs text-gray-400 text-center">
                                  該当する段ボールが見つかりません
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {group.contents.length === 0 ? (
                      <div className="text-xs text-gray-400 py-4 border-2 border-dashed border-gray-300 rounded text-center bg-gray-50">
                        <div className="mb-1">📦 商品未設定</div>
                        <div>左側の商品で「→② 段ボール設計に移動」をクリック</div>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-gray-50 p-2 rounded">
                        {/* パレット積載詳細情報 */}
                        {(() => {
                          const cartonDetail = allCartons.find(c => c.code === group.cartonCode);
                          if (cartonDetail?.palletLoadingDetails && group.contents[0]) {
                            const product = productsData.find(p => p.id === group.contents[0].productId);
                            const details = cartonDetail.palletLoadingDetails;
                            return (
                              <div className="bg-green-50 border-2 border-green-300 rounded p-2 mb-2">
                                <div className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1">
                                  <span>✨</span>
                                  <span>{product?.productName}用パレット積載情報</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  <div className="text-green-700">
                                    <span className="font-semibold">配置:</span> 1段{details.cartonsPerLayer}箱 × {details.totalLayers}段
                                  </div>
                                  <div className="text-green-700">
                                    <span className="font-semibold">高さ:</span> {details.heightMm}mm
                                  </div>
                                  <div className="text-green-700">
                                    <span className="font-semibold">総箱数:</span> {details.totalCartons}箱
                                  </div>
                                  <div className="text-green-700">
                                    <span className="font-semibold">総袋数:</span> {details.totalBags}袋
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-green-600 italic">
                                  → 「→③ パレット積付に移動」で自動的にこの配置で積載されます
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                        
                        {group.contents.map((content, contentIndex) => {
                          const product = productsData.find(p => p.id === content.productId);
                          const setsPerBox = product ? content.quantity / product.bagsPerSet : 0;
                          const totalSetsInGroup = setsPerBox * group.count;
                          const selectedProduct = activeFlow?.selectedProducts.find(sp => sp.productId === content.productId);
                          const totalRequested = selectedProduct?.requestedQuantity || 0;
                          const totalAssigned = calculateActualAssignedQuantity(content.productId, activeFlow?.cartons || []);
                          const diff = totalRequested - totalAssigned;
                          
                          return (
                            <div key={content.productId} className="bg-white p-2 rounded border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-gray-700 font-medium flex-1">
                                  {product?.productName}
                                </span>
                                <button
                                  onClick={() => {
                                    if (!activeFlow) return;
                                    updateActiveFlow({
                                      cartons: activeFlow.cartons.map(c =>
                                        group.cartonIds.includes(c.id)
                                          ? { ...c, contents: c.contents.filter((_, i) => i !== contentIndex) }
                                          : c
                                      )
                                    });
                                  }}
                                  className="text-xs text-red-500 hover:text-red-700 ml-2"
                                >
                                  ×
                                </button>
                              </div>
                              
                              {/* セット数と箱数の編集 */}
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                  <label className="text-xs text-gray-500 block mb-1">1箱あたり</label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min="0"
                                      step="1"
                                      value={Math.round(setsPerBox * 100) / 100}
                                      onChange={(e) => {
                                        const newSets = parseFloat(e.target.value) || 0;
                                        handleChangeSetsPerBox(group.cartonIds, contentIndex, newSets, product);
                                      }}
                                      className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                    />
                                    <span className="text-xs text-gray-600 font-medium">セット</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 block mb-1">箱数</label>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min="1"
                                      value={group.count}
                                      onChange={(e) => {
                                        const newCount = parseInt(e.target.value) || 1;
                                        handleChangeBoxCount(group.cartonIds, group.count, newCount);
                                      }}
                                      className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                    />
                                    <span className="text-xs text-gray-600 font-medium">箱</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* 合計表示 */}
                              <div className="bg-gray-50 rounded p-1.5 text-xs space-y-1">
                                <div className="flex justify-between text-gray-700">
                                  <span>この段ボール合計:</span>
                                  <span className="font-semibold text-blue-700">
                                    {Math.round(setsPerBox * 100) / 100} × {group.count}箱 = {Math.round(totalSetsInGroup * 100) / 100}セット
                                  </span>
                                </div>
                                {/* 割当状況 */}
                                <div className={`flex justify-between font-medium ${
                                  diff === 0 ? 'text-green-600' : diff > 0 ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                  <span>①との差分:</span>
                                  <span>
                                    {diff === 0 ? '✓ ぴったり' :
                                     diff > 0 ? `${diff}セット不足` :
                                     `${Math.abs(diff)}セット超過`}
                                    （①: {totalRequested} / ②合計: {Math.round(totalAssigned * 100) / 100}）
                                  </span>
                                </div>
                              </div>
                              
                              {product?.setWeight && (
                                <div className="text-xs text-gray-500 mt-1">
                                  重量: {(parseFloat(product.setWeight.match(/[\d.]+/)?.[0] || '0') * totalSetsInGroup).toFixed(2)}kg
                                </div>
                              )}
                          </div>
                          );
                        })}
                  </div>
                    )}
                    
                    {/* 別の段ボールで分割ボタン */}
                    {group.contents.length > 0 && !group.assignedToPallet && (
                      <button
                        onClick={() => {
                          if (!activeFlow) return;
                          const content = group.contents[0];
                          if (!content) return;
                          const product = productsData.find(p => p.id === content.productId);
                          if (!product) return;
                          
                          const newCarton = {
                            id: `carton-${Date.now()}-split`,
                            cartonCode: group.cartonCode,
                            cartonName: group.cartonName,
                            contents: [{ productId: content.productId, quantity: product.bagsPerSet }],
                            currentWeight: 0,
                            assignedToPallet: false,
                            action: 'new' as CartonAction
                          };
                          updateActiveFlow({
                            cartons: [...activeFlow.cartons, newCarton]
                          });
                        }}
                        className="w-full mt-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 text-xs font-medium transition-colors"
                      >
                        + 別の段ボールタイプで分割
                      </button>
                    )}
                    
                    {group.assignedToPallet ? (
                      <div className="mt-2 text-xs text-green-600">
                        ✓ パレットに配置済み
                      </div>
                    ) : group.contents.length > 0 ? (
                      <button
                        onClick={() => handleTransferToPallet(group.cartonIds, group.count, group.cartonName)}
                        className="w-full mt-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <span>→③</span>
                        <span>パレット積付に移動</span>
                        <span className="text-purple-200">({group.count}箱)</span>
                      </button>
                    ) : null}
                  </div>
                ))
              )}
              
              {/* ドロップヒント（段ボールが既にある場合） */}
              {(activeFlow?.cartons.length || 0) > 0 && (
                <div className="text-center py-4 text-xs text-blue-600 border border-dashed border-blue-300 rounded-lg bg-blue-50 mx-2 mt-3">
                  💡 左側の商品で「→② 段ボール設計に移動」をクリックして追加
                </div>
              )}
            </div>
            
            {/* フッター */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
                              <button
                onClick={() => {
                  if (!activeFlow) return;
                  const newCarton = {
                    id: `carton-${Date.now()}`,
                    cartonCode: '未設定',
                    cartonName: '新規段ボール',
                    contents: [],
                    currentWeight: 0,
                    assignedToPallet: false,
                    action: 'new' as CartonAction
                  };
                  updateActiveFlow({
                    cartons: [...activeFlow.cartons, newCarton]
                  });
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                + 段ボールを追加
                              </button>
              <div className="text-xs text-gray-500 text-center">
                左側の商品の「→② 段ボール設計に移動」ボタンで追加
                      </div>
                    </div>
          </div>
                </div>

        {/* 下段: パレット積付 */}
        <div className="flex" style={{ minHeight: '800px' }}>
          {/* ③ パレット積付パネル */}
          <div className="w-full flex flex-col bg-white" style={{ minHeight: '800px' }}>
            {/* ヘッダー */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  ③ パレット積付（送出）
                </h3>
                <span className="text-xs text-gray-500">
                  {activeFlow?.usePallets ? `${calculated.totalPallets}基` : '段ボールのみ'}
                </span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{width: `${calculated.totalPallets > 0 ? 75 : 0}%`}}
                />
              </div>
              
              {/* パレット使用トグル */}
              <div className="mt-3 flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-xs font-medium text-purple-900">🏗️ パレットを使用</span>
                <button
                  onClick={() => {
                    if (!activeFlow) return;
                    updateActiveFlow({
                      usePallets: !activeFlow.usePallets
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    activeFlow?.usePallets ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      activeFlow?.usePallets ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                        </div>
              
              {/* ②→③ 割当状況サマリー */}
              {activeFlow?.usePallets && activeFlow.cartons.length > 0 && (
                <div className="mt-3 space-y-1">
                  {(() => {
                    const totalCartons = activeFlow.cartons.length;
                    const assignedCartons = activeFlow.cartons.filter(c => c.assignedToPallet).length;
                    const unassignedCartons = totalCartons - assignedCartons;
                    return (
                      <div className={`text-xs px-2 py-1.5 rounded flex justify-between ${
                        unassignedCartons === 0 ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        <span>段ボール割当:</span>
                        <span className="font-medium">
                          {unassignedCartons === 0 
                            ? `✓ 全${totalCartons}箱 割当完了`
                            : `${assignedCartons}/${totalCartons}箱 割当済（残り${unassignedCartons}箱）`
                          }
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}
                  </div>
            
            {/* パレット使用の場合はパレットリスト */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!activeFlow?.usePallets ? (
                // パレットを使わない場合：説明のみ表示
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">📦</div>
                  <p className="text-sm font-medium mb-2">パレット不使用</p>
                  <p className="text-xs text-gray-400">段ボールのまま出荷します</p>
                </div>
              ) : (activeFlow?.pallets.length || 0) === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🏗️</div>
                  <p className="text-sm">パレットを追加してください</p>
              </div>
              ) : (
                activeFlow?.pallets.map((pallet, index) => (
                  <div 
                    key={pallet.id} 
                    className="border border-purple-200 rounded-lg p-3 bg-white transition-all hover:shadow-lg hover:border-purple-400 hover:bg-purple-50"
                    onDragOver={handlePalletDragOver}
                    onDrop={(e) => handlePalletDrop(e, pallet.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          パレット#{index + 1}
                        </div>
                        <div className="text-xs text-gray-500">{pallet.size}</div>
                      </div>
                      <button
                        onClick={() => {
                          if (!activeFlow) return;
                          const cartonIdsOnPallet = new Set<string>();
                          pallet.layers.forEach(l => l.cartons.forEach(cid => cartonIdsOnPallet.add(cid)));
                          updateActiveFlow({
                            pallets: activeFlow.pallets.filter(p => p.id !== pallet.id),
                            cartons: activeFlow.cartons.map(c =>
                              cartonIdsOnPallet.has(c.id)
                                ? { ...c, assignedToPallet: false, palletId: undefined }
                                : c
                            )
                          });
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        削除
                      </button>
            </div>

                    {/* 段ボール追加 */}
                    <div className="mb-2">
                <button
                  onClick={() => {
                          if (!activeFlow) return;
                          
                          // 利用可能な段ボールを表示
                          const availableCartons = activeFlow.cartons.filter(c => !c.assignedToPallet);
                          if (availableCartons.length === 0) {
                            alert('パレットに追加できる段ボールがありません。先に段ボールを作成してください。');
                            return;
                          }
                          
                          const cartonList = availableCartons.map((c, idx) => 
                            `${idx + 1}. 段ボール (${c.cartonCode}) - ${c.contents.length}商品`
                          ).join('\n');
                          
                          const selection = prompt('パレットに追加する段ボールの番号を入力してください:\n\n' + cartonList);
                          if (!selection) return;
                          
                          const index = parseInt(selection) - 1;
                          if (index < 0 || index >= availableCartons.length) {
                            alert('無効な番号です');
                            return;
                          }
                          
                          const selectedCarton = availableCartons[index];
                          const layer = parseInt(prompt('何段目に積みますか？') || '1');
                          
                          // 段ボールをパレットに割り当て
                          updateActiveFlow({
                            cartons: activeFlow.cartons.map(c =>
                              c.id === selectedCarton.id
                                ? { ...c, assignedToPallet: true, palletId: pallet.id, layer: layer }
                                : c
                            ),
                            pallets: activeFlow.pallets.map(p => {
                              if (p.id !== pallet.id) return p;
                              
                              const layerExists = p.layers.find(l => l.layerNumber === layer);
                              if (layerExists) {
                                return {
                                  ...p,
                                  layers: p.layers.map(l =>
                                    l.layerNumber === layer
                                      ? { ...l, cartons: [...l.cartons, selectedCarton.id] }
                                      : l
                                  )
                                };
                              } else {
                                return {
                                  ...p,
                                  layers: [...p.layers, { layerNumber: layer, cartons: [selectedCarton.id] }]
                                };
                              }
                            })
                          });
                        }}
                        className="w-full px-2 py-1.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-medium transition-colors"
                      >
                        + 段ボールを積む
                </button>
              </div>
              
                    {/* パレット内の商品サマリー */}
                    {pallet.layers.length === 0 ? (
                      <div className="text-xs text-gray-400 py-8 border-2 border-dashed border-purple-200 rounded text-center bg-purple-50">
                        <div className="text-3xl mb-2">🏗️</div>
                        <div>②の段ボールで「→③ パレット積付に移動」をクリック</div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* パレット積載状態テーブル */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setPalletTableExpanded(prev => ({ ...prev, [pallet.id]: !prev[pallet.id] }))}
                            className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
                          >
                            <span className="text-xs font-semibold text-indigo-900">📊 積載状態テーブル</span>
                            <span className="text-xs text-gray-500">{palletTableExpanded[pallet.id] ? '▲ 閉じる' : '▼ 開く'}</span>
                          </button>
                          
                          {palletTableExpanded[pallet.id] && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 whitespace-nowrap">段</th>
                                    <th className="px-2 py-1.5 text-left font-semibold text-gray-700 whitespace-nowrap">商品名</th>
                                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 whitespace-nowrap">箱数</th>
                                    <th className="px-2 py-1.5 text-right font-semibold text-gray-700 whitespace-nowrap">袋数</th>
                                    <th className="px-2 py-1.5 text-center font-semibold text-gray-700 whitespace-nowrap">操作</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    const rows: Array<{ layerNumber: number; productId: number; productName: string; boxes: number; bags: number; cartonIds: string[] }> = [];
                                    [...pallet.layers].sort((a, b) => a.layerNumber - b.layerNumber).forEach(layer => {
                                      const layerProducts: { [pid: number]: { boxes: number; bags: number; cartonIds: string[]; productName: string } } = {};
                                      layer.cartons.forEach(cartonId => {
                                        const carton = activeFlow?.cartons.find(c => c.id === cartonId);
                                        if (carton) {
                                          carton.contents.forEach(content => {
                                            if (!layerProducts[content.productId]) {
                                              const product = productsData.find(p => p.id === content.productId);
                                              layerProducts[content.productId] = {
                                                boxes: 0, bags: 0, cartonIds: [],
                                                productName: product?.productName || '不明'
                                              };
                                            }
                                            layerProducts[content.productId].boxes += 1;
                                            layerProducts[content.productId].bags += content.quantity;
                                            layerProducts[content.productId].cartonIds.push(cartonId);
                                          });
                                        }
                                      });
                                      Object.entries(layerProducts).forEach(([pid, info]) => {
                                        rows.push({
                                          layerNumber: layer.layerNumber,
                                          productId: parseInt(pid),
                                          productName: info.productName,
                                          boxes: info.boxes,
                                          bags: info.bags,
                                          cartonIds: info.cartonIds
                                        });
                                      });
                                    });
                                    
                                    if (rows.length === 0) {
                                      return (
                                        <tr>
                                          <td colSpan={5} className="px-2 py-4 text-center text-gray-400">積載データなし</td>
                                        </tr>
                                      );
                                    }
                                    
                                    return rows.map((row, ri) => (
                                      <tr key={`${row.layerNumber}-${row.productId}-${ri}`} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-2 py-1.5 text-gray-700 font-medium whitespace-nowrap">{row.layerNumber}段</td>
                                        <td className="px-2 py-1.5 text-gray-800 truncate max-w-[120px]" title={row.productName}>{row.productName}</td>
                                        <td className="px-2 py-1.5 text-right text-gray-700 whitespace-nowrap">{row.boxes}箱</td>
                                        <td className="px-2 py-1.5 text-right text-gray-700 whitespace-nowrap">{row.bags}袋</td>
                                        <td className="px-2 py-1.5 text-center whitespace-nowrap">
                                          {(activeFlow?.pallets.length || 0) > 1 && (
                                            <button
                                              onClick={() => {
                                                setInterPalletMovePrompt({
                                                  sourcePalletId: pallet.id,
                                                  productId: row.productId,
                                                  productName: row.productName,
                                                  maxBoxes: row.boxes,
                                                  cartonIds: row.cartonIds
                                                });
                                                setMoveBoxCount(1);
                                                setMoveTargetPalletId(null);
                                                setMoveTargetLayer(1);
                                              }}
                                              className="px-1.5 py-0.5 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded transition-colors"
                                            >
                                              移動
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    ));
                                  })()}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-gray-50 border-t border-gray-300">
                                    <td className="px-2 py-1.5 font-semibold text-gray-800" colSpan={2}>合計</td>
                                    <td className="px-2 py-1.5 text-right font-semibold text-gray-800">
                                      {pallet.layers.reduce((sum, l) => sum + l.cartons.length, 0)}箱
                                    </td>
                                    <td className="px-2 py-1.5 text-right font-semibold text-gray-800">
                                      {(() => {
                                        let totalBags = 0;
                                        pallet.layers.forEach(layer => {
                                          layer.cartons.forEach(cartonId => {
                                            const carton = activeFlow?.cartons.find(c => c.id === cartonId);
                                            if (carton) {
                                              carton.contents.forEach(content => { totalBags += content.quantity; });
                                            }
                                          });
                                        });
                                        return totalBags;
                                      })()}袋
                                    </td>
                                    <td></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          )}
                          
                          {!palletTableExpanded[pallet.id] && (
                            <div className="px-3 py-2 flex flex-wrap gap-2">
                              {(() => {
                                const productSummary: { [productId: number]: { bags: number; boxes: number } } = {};
                                pallet.layers.forEach(layer => {
                                  layer.cartons.forEach(cartonId => {
                                    const carton = activeFlow?.cartons.find(c => c.id === cartonId);
                                    if (carton) {
                                      carton.contents.forEach(content => {
                                        if (!productSummary[content.productId]) {
                                          productSummary[content.productId] = { bags: 0, boxes: 0 };
                                        }
                                        productSummary[content.productId].bags += content.quantity;
                                        productSummary[content.productId].boxes += 1;
                                      });
                                    }
                                  });
                                });
                                return Object.entries(productSummary).map(([productId, summary]) => {
                                  const product = productsData.find(p => p.id === parseInt(productId));
                                  return (
                                    <span key={productId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                                      {product?.productName}: {summary.boxes}箱
                                    </span>
                                  );
                                });
                              })()}
                            </div>
                          )}
                        </div>
                        
                        {/* 三次元パレット積載図（Three.js） */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-gray-700 mb-2">🏗️ パレット積載図（3D・編集可能）</div>
                          <PalletViewer3D
                            key={`pallet3d-${pallet.id}-${pallet.layers.length}-${pallet.layers.reduce((s, l) => s + l.cartons.length, 0)}`}
                            layers={pallet.layers.map(layer => ({
                              layerNumber: layer.layerNumber,
                              cartons: layer.cartons.map(cartonId => {
                                const carton = activeFlow?.cartons.find(c => c.id === cartonId);
                                if (!carton) return null;
                                const cartonDetail = allCartons.find(c => c.code === carton.cartonCode);
                                const productName = carton.contents[0] ? 
                                  productsData.find(p => p.id === carton.contents[0].productId)?.productName || '' : '';
                                
                                return {
                                  id: cartonId,
                                  length: cartonDetail?.innerLength || 300,
                                  width: cartonDetail?.innerWidth || 200,
                                  height: cartonDetail?.innerHeight || 150,
                                  productName: productName,
                                  palletConfig: cartonDetail?.palletConfig || (cartonDetail?.palletLoadingDetails ? {
                                    boxesPerLayer: cartonDetail.palletLoadingDetails.cartonsPerLayer,
                                    layers: cartonDetail.palletLoadingDetails.totalLayers,
                                    total: cartonDetail.palletLoadingDetails.totalCartons
                                  } : undefined)
                                };
                              }).filter((c): c is NonNullable<typeof c> => c !== null)
                            })).filter(layer => layer.cartons.length > 0)}
                            palletSize={1100}
                            editable={true}
                            onLayoutChange={(newLayers) => {
                              // 配置変更時の処理（必要に応じて実装）
                              console.log('Layout changed:', newLayers);
                            }}
                          />
                          {/* 旧2Dビュー削除済み - 3Dビューアーを使用 */}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* フッター */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={handleAddPallet}
                className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
              >
                + パレット追加
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* パレット選択モーダル */}
      {palletSelectPrompt && activeFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              パレットを選択
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-purple-700">{palletSelectPrompt.groupName}</span>
              （{palletSelectPrompt.groupCount}箱）をどのパレットに積みますか？
            </p>
            
            <div className="space-y-2 mb-4">
              {activeFlow.pallets.map((pallet, index) => {
                const totalCartonsOnPallet = pallet.layers.reduce((sum, l) => sum + l.cartons.length, 0);
                return (
                  <button
                    key={pallet.id}
                    onClick={() => executeTransferToPallet(palletSelectPrompt.groupCartonIds, pallet.id)}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">パレット#{index + 1}</span>
                        <span className="text-xs text-gray-500 ml-2">({pallet.size}mm)</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {totalCartonsOnPallet > 0 ? `${totalCartonsOnPallet}箱積載中` : '空'}
                      </span>
                    </div>
                    {totalCartonsOnPallet > 0 && (
                      <div className="mt-1 text-xs text-gray-400">
                        {pallet.layers.length}段
                      </div>
                    )}
                  </button>
                );
              })}
              
              {/* 新規パレット作成ボタン */}
              <button
                onClick={() => executeTransferToPallet(palletSelectPrompt.groupCartonIds, null)}
                className="w-full text-left px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold text-lg">+</span>
                  <span className="font-medium text-purple-700">新しいパレットを作成</span>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setPalletSelectPrompt(null)}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* パレット間移動モーダル */}
      {interPalletMovePrompt && activeFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              段ボールをパレット間で移動
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              パレット#{activeFlow.pallets.findIndex(p => p.id === interPalletMovePrompt.sourcePalletId) + 1} から移動
            </p>
            
            {/* 商品情報 */}
            <div className="bg-indigo-50 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-indigo-900">{interPalletMovePrompt.productName}</div>
              <div className="text-xs text-indigo-600 mt-1">最大 {interPalletMovePrompt.maxBoxes}箱 移動可能</div>
            </div>
            
            {/* 移動箱数 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">移動する箱数</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMoveBoxCount(Math.max(1, moveBoxCount - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-gray-600"
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={interPalletMovePrompt.maxBoxes}
                  value={moveBoxCount}
                  onChange={(e) => setMoveBoxCount(Math.max(1, Math.min(interPalletMovePrompt.maxBoxes, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={() => setMoveBoxCount(Math.min(interPalletMovePrompt.maxBoxes, moveBoxCount + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-gray-600"
                >+</button>
                <span className="text-xs text-gray-500">/ {interPalletMovePrompt.maxBoxes}箱</span>
              </div>
            </div>
            
            {/* 移動先パレット選択 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">移動先パレット</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeFlow.pallets.filter(p => p.id !== interPalletMovePrompt.sourcePalletId).map((p, idx) => {
                  const palletIndex = activeFlow.pallets.indexOf(p);
                  const totalBoxes = p.layers.reduce((sum, l) => sum + l.cartons.length, 0);
                  const isSelected = moveTargetPalletId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setMoveTargetPalletId(p.id);
                        setMoveTargetLayer(p.layers.length > 0 ? Math.max(...p.layers.map(l => l.layerNumber)) + 1 : 1);
                      }}
                      className={`w-full text-left px-3 py-2 border rounded-lg transition-colors ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-gray-900">パレット#{palletIndex + 1}</span>
                        <span className="text-xs text-gray-500">{totalBoxes > 0 ? `${totalBoxes}箱 / ${p.layers.length}段` : '空'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* 移動先の段の選択 */}
            {moveTargetPalletId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">移動先の段</label>
                {(() => {
                  const targetPallet = activeFlow.pallets.find(p => p.id === moveTargetPalletId);
                  if (!targetPallet) return null;
                  const existingLayers = [...targetPallet.layers].sort((a, b) => a.layerNumber - b.layerNumber);
                  const nextLayerNum = existingLayers.length > 0 ? Math.max(...existingLayers.map(l => l.layerNumber)) + 1 : 1;
                  
                  return (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {existingLayers.map(layer => {
                        const isSelected = moveTargetLayer === layer.layerNumber;
                        return (
                          <button
                            key={layer.layerNumber}
                            onClick={() => setMoveTargetLayer(layer.layerNumber)}
                            className={`w-full text-left px-3 py-1.5 border rounded transition-colors text-sm ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200'
                                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-medium">{layer.layerNumber}段目</span>
                            <span className="text-xs text-gray-500 ml-2">（{layer.cartons.length}箱積載中）</span>
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setMoveTargetLayer(nextLayerNum)}
                        className={`w-full text-left px-3 py-1.5 border-2 border-dashed rounded transition-colors text-sm ${
                          moveTargetLayer === nextLayerNum
                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200'
                            : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-indigo-600 font-medium">+ 新しい段（{nextLayerNum}段目）</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {/* ボタン */}
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
              <button
                onClick={() => {
                  setInterPalletMovePrompt(null);
                  setMoveBoxCount(1);
                  setMoveTargetPalletId(null);
                  setMoveTargetLayer(1);
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={executeInterPalletMove}
                disabled={!moveTargetPalletId}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  moveTargetPalletId
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {moveBoxCount}箱を移動
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 商品→段ボール 数量入力モーダル */}
      {dropQuantityPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              段ボールに梱包する数量を入力
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                商品: {productsData.find(p => p.id === dropQuantityPrompt.productId)?.productName}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                最大: {dropQuantityPrompt.maxQuantity}セット ({dropQuantityPrompt.maxQuantity * (productsData.find(p => p.id === dropQuantityPrompt.productId)?.bagsPerSet || 0)}袋)
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                セット数:
              </label>
              <input
                type="number"
                min="1"
                max={dropQuantityPrompt.maxQuantity}
                defaultValue={Math.min(1, dropQuantityPrompt.maxQuantity)}
                id="drop-quantity-input"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.currentTarget as HTMLInputElement;
                    const quantity = parseInt(input.value) || 1;
                    if (quantity > 0 && quantity <= dropQuantityPrompt.maxQuantity) {
                      handleConfirmProductToCarton(quantity);
                    }
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setDropQuantityPrompt(null);
                  setDraggedProduct(null);
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('drop-quantity-input') as HTMLInputElement;
                  const quantity = parseInt(input?.value) || 1;
                  if (quantity > 0 && quantity <= dropQuantityPrompt.maxQuantity) {
                    handleConfirmProductToCarton(quantity);
                  } else {
                    alert(`1〜${dropQuantityPrompt.maxQuantity}の範囲で入力してください`);
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                追加
              </button>
            </div>
        </div>
        </div>
      )}
    </div>
  );
}

