'use client';

/**
 * PalletViewer3D - パレット積載の3D可視化コンポーネント（編集機能付き）
 * 
 * 対応している配置パターン：
 * 
 * 1. 【13回しパターン】
 *    - 黒ゴマアーモンドきな粉150g×10袋セット（341mm × 226mm × 109mm）
 *    - きな粉150g×20袋セット（354mm × 225mm × 125mm）
 *    配置: 手前9箱（横向き 3×3）+ 奥4箱（縦向き 4×1）
 * 
 * 2. 【デフォルトパターン】
 *    - 上記以外の商品: グリッド配置
 * 
 * 編集機能：
 * - 段ボールをクリックで選択
 * - 回転・縦置き/横置き切り替え
 * - 位置の調整
 */

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { useMemo, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';

interface Carton {
  id: string;
  length: number; // mm
  width: number;  // mm
  height: number; // mm
  productName: string;
}

interface Layer {
  layerNumber: number;
  cartons: Carton[];
}

interface PalletViewer3DProps {
  layers: Layer[];
  palletSize?: number; // mm (default: 1100)
  editable?: boolean;  // 編集モードを有効にするか
  onLayoutChange?: (newLayers: Layer[]) => void; // 配置変更時のコールバック
}

// 段ボールの配置情報を拡張
interface CartonPlacement {
  carton: Carton;
  position: [number, number, number];
  size: [number, number, number];
  rotation: number;
  isVertical?: boolean; // 縦置きかどうか
  layerNumber: number;
  cartonIndex: number;
  // X-Y-Z 番号（原点=1-1-1は正面左手前）
  gridX?: number; // X軸番号（手前から奥へ：1,2,3...）
  gridY?: number; // Y軸番号（左から右へ：1,2,3...）
  gridZ?: number; // Z軸番号（下から上へ：1,2,3...）
}

// 段ボールコンポーネント（編集可能版）
function CartonBox({ 
  position, 
  size, 
  color, 
  productName, 
  rotation = 0,
  isSelected = false,
  layerNumber,
  cartonIndex,
  gridX,
  gridY,
  gridZ,
  isVertical,
  palletId,
  onClick,
  onInfoClick
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  productName: string;
  rotation?: number;
  isSelected?: boolean;
  layerNumber: number;
  cartonIndex: number;
  gridX?: number;
  gridY?: number;
  gridZ?: number;
  isVertical?: boolean;
  palletId?: string;
  onClick?: (layerNumber: number, cartonIndex: number) => void;
  onInfoClick?: (info: { productName: string; palletId: string; cartonNumber: string; orientation: string }) => void;
}) {
  const geometry = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  
  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    
    // 段ボール情報を親コンポーネントに通知
    if (gridX && gridY && gridZ && onInfoClick) {
      const orientation = isVertical ? '縦置き' : '横置き';
      const cartonNumber = `${gridX}-${gridY}-${gridZ}`;
      
      console.log('📦 段ボール情報:');
      console.log(`  商品: ${productName}`);
      console.log(`  パレット番号: ${palletId || 'P1'}`);
      console.log(`  段ボール番号: ${cartonNumber}`);
      console.log(`  配置: ${orientation}`);
      
      onInfoClick({
        productName,
        palletId: palletId || 'P1',
        cartonNumber,
        orientation
      });
    }
    
    // userDataから直接情報を取得
    const clickedLayer = (e.object.userData as any).layerNumber;
    const clickedIndex = (e.object.userData as any).cartonIndex;
    if (onClick && clickedLayer !== undefined && clickedIndex !== undefined) {
      onClick(clickedLayer, clickedIndex);
    }
  }, [gridX, gridY, gridZ, isVertical, productName, palletId, onClick, onInfoClick]);
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh 
        geometry={geometry} 
        castShadow 
        receiveShadow
        userData={{ layerNumber, cartonIndex, productName, gridX, gridY, gridZ, isVertical }}
        onClick={onClick ? handleClick : undefined}
      >
        <meshStandardMaterial 
          color={isSelected ? '#ff6b6b' : color}
          roughness={0.7}
          metalness={0.1}
          emissive={isSelected ? '#ff0000' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      {/* 段ボールの折り目（線） */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={isSelected ? '#ffffff' : '#5a4a35'} linewidth={isSelected ? 3 : 1} />
      </lineSegments>
    </group>
  );
}

// パレット台座コンポーネント（原点を左手前に設定）
function PalletBase({ size }: { size: number }) {
  const scaleFactor = size / 1000; // スケール調整
  const halfSize = scaleFactor * 1.1 / 2; // パレットの半分のサイズ
  
  // 正面左手前を原点にするための調整
  return (
    <group position={[halfSize, -0.05, halfSize]}>
      {/* パレット本体 */}
      <mesh receiveShadow>
        <boxGeometry args={[scaleFactor * 1.1, 0.1, scaleFactor * 1.1]} />
        <meshStandardMaterial 
          color="#6b5a45"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* パレットのスラット（板）を表現 */}
      {[...Array(4)].map((_, i) => (
        <mesh 
          key={i}
          position={[0, 0.06, -scaleFactor * 0.4 + i * scaleFactor * 0.27]}
        >
          <boxGeometry args={[scaleFactor * 1.1, 0.02, 0.05]} />
          <meshStandardMaterial 
            color="#5a4a35"
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function PalletViewer3D({ 
  layers, 
  palletSize = 1100, 
  editable = false,
  onLayoutChange 
}: PalletViewer3DProps) {
  // パレットと段ボールのサイズを Three.js のスケールに変換
  // 1100mm → 1.1 units (1mm = 0.001 units)
  const scale = 0.001;
  
  // layersを常に正しい順序にソート（1が一番下）
  const sortedInputLayers = useMemo(() => {
    const sorted = [...layers].sort((a, b) => a.layerNumber - b.layerNumber);
    console.log('🔄 Sorting input layers:', {
      original: layers.map(l => l.layerNumber),
      sorted: sorted.map(l => l.layerNumber)
    });
    return sorted;
  }, [layers]);
  
  // 編集モード用の状態
  const [selectedCarton, setSelectedCarton] = useState<{
    layerNumber: number;
    cartonIndex: number;
  } | null>(null);
  
  // クリックされた段ボールの詳細情報（情報表示用）
  const [clickedCartonInfo, setClickedCartonInfo] = useState<{
    productName: string;
    palletId: string;
    cartonNumber: string;
    orientation: string;
  } | null>(null);
  
  // 編集モード：選択した段全体を表示
  const [editingLayer, setEditingLayer] = useState<number | null>(null);
  
  // 段ボール配置のカスタマイズ状態
  const [customPlacements, setCustomPlacements] = useState<Map<string, {
    position: [number, number, number];
    rotation: number;
    isVertical: boolean;
  }>>(new Map());
  
  // Undo/Redo用の履歴
  const [undoStack, setUndoStack] = useState<Array<Map<string, {
    position: [number, number, number];
    rotation: number;
    isVertical: boolean;
  }>>>([]);
  const [redoStack, setRedoStack] = useState<Array<Map<string, {
    position: [number, number, number];
    rotation: number;
    isVertical: boolean;
  }>>>([]);
  
  // 履歴に状態を追加するヘルパー関数
  const pushToUndoStack = useCallback((newState: Map<string, any>) => {
    setUndoStack(prev => [...prev, new Map(customPlacements)]);
    setRedoStack([]); // 新しい変更があったらredoスタックをクリア
    setCustomPlacements(newState);
  }, [customPlacements]);
  
  // Undo機能
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, new Map(customPlacements)]);
    setUndoStack(prev => prev.slice(0, -1));
    setCustomPlacements(previousState);
  }, [undoStack, customPlacements]);
  
  // Redo機能
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, new Map(customPlacements)]);
    setRedoStack(prev => prev.slice(0, -1));
    setCustomPlacements(nextState);
  }, [redoStack, customPlacements]);
  
  // キーボードショートカット（CTRL+Z / CTRL+Shift+Z）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);
  
  // 段ボールの配置を計算（パレットサイズに最適化）
  const cartonPositions = useMemo(() => {
    const positions: Array<CartonPlacement> = [];
    
    let currentHeight = 0.05; // パレットの上から開始
    const palletSizeUnits = palletSize * scale; // パレットサイズ（units）
    
    // ソート済みのlayersを使用（1が一番下、数字が大きいほど上）
    const sortedLayers = sortedInputLayers;
    
    console.log('🔧 Layer sorting in PalletViewer3D:', {
      receivedLayers: sortedInputLayers.map(l => ({ layerNumber: l.layerNumber, cartonCount: l.cartons.length })),
      sortedLayers: sortedLayers.map(l => ({ layerNumber: l.layerNumber, cartonCount: l.cartons.length }))
    });
    
    sortedLayers.forEach((layer) => {
      if (layer.cartons.length === 0) return;
      
      // layerNumberをそのまま使用（変換不要）
      const layerNumber = layer.layerNumber;
      
      console.log(`📊 Processing layer: layerNumber=${layerNumber}, cartonCount=${layer.cartons.length}`);
      
      // 最適な配置パターンを計算
      const carton = layer.cartons[0];
      const cartonLength = carton.length * scale;  // 長辺（例: 341mm）
      const cartonWidth = carton.width * scale;    // 短辺（例: 226mm）
      const cartonHeight = carton.height * scale;  // 高さ（例: 109mm）
      
      // 13箱の「13回し」パターン
      let layoutPattern: Array<{
        x: number;
        z: number;
        rotated: boolean;
        gridX?: number;
        gridY?: number;
        gridZ?: number;
      }> = [];
      
      // 13回しパターンを適用する商品名のキーワード
      const pattern13Keywords = [
        '黒ゴマアーモンドきな粉',
        'きな粉150g×20袋'
      ];
      
      const productName = carton.productName || '';
      const isKinako20 = productName.includes('きな粉150g×20袋セット');
      
      // 13回しパターンの判定
      const matchesProduct = pattern13Keywords.some(keyword => 
        productName.toLowerCase().includes(keyword.toLowerCase())
      );
      const use13Pattern = layer.cartons.length === 13 && matchesProduct;
      
      // きな粉20袋セットの縦置き5箱パターン
      const useVertical5Pattern = isKinako20 && layer.cartons.length === 5;
      
      // デバッグログ
      console.log('🔍 PalletViewer3D Debug:', {
        layerNumber: layerNumber,
        cartonsLength: layer.cartons.length,
        productName: productName,
        isKinako20: isKinako20,
        matchesProduct: matchesProduct,
        use13Pattern: use13Pattern,
        useVertical5Pattern: useVertical5Pattern
      });
      
      if (useVertical5Pattern) {
        // 【縦置き5箱パターン】きな粉150g×20袋セット専用
        // 3段目と4段目、7段目と8段目の間のスペースに配置
        // 段ボールを横倒しにして縦置き: 125mm × 354mm × 225mm（高さ）
        // 5箱を横一列に並べる
        
        for (let col = 0; col < 5; col++) {
          layoutPattern.push({
            x: col * cartonHeight,  // 125mm × 列（元の高さを横幅として使用）
            z: 0,                    // パレット中央
            rotated: false           // 縦置き用の特別な処理
          });
        }
      } else if (use13Pattern) {
        // 【13回し（変形ブロック積み）パターン】
        // きな粉150g×20袋セット: 奇数段と偶数段で前後を入れ替える
        
        const isEvenLayer = layerNumber % 2 === 0;
        
        if (isKinako20) {
          // きな粉150g×20袋セット専用: 段ごとに配置を変える
          // Aパターン（1,2,5,6,9,10段目）: 手前9箱+奥4箱
          // Bパターン（3,4,7,8段目）: 手前4箱+奥9箱
          
          // 段番号に基づいてパターンを決定
          // 1,2段目: A, 3,4段目: B, 5,6段目: A, 7,8段目: B, 9,10段目: A
          const layerMod = ((layerNumber - 1) % 4);
          const useBPattern = (layerMod === 2 || layerMod === 3);
          
          if (useBPattern) {
            // Bパターン: 手前4箱（縦向き）+ 奥9箱（横置き）
            // 【手前側ブロック】4箱: 縦向き 4列×1行
            for (let col = 0; col < 4; col++) {
              layoutPattern.push({
                x: col * cartonWidth,   // 短辺 × 列（225mm）
                z: 0,                    // 手前
                rotated: true            // 90度回転
              });
            }
            
            // 【奥側ブロック】9箱: 横向き 3列×3行
            const backRowZ = cartonLength; // 4箱ブロックの奥行き（354mm）
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                layoutPattern.push({
                  x: col * cartonLength,  // 長辺 × 列（354mm）
                  z: backRowZ + row * cartonWidth,  // 奥行き
                  rotated: false
                });
              }
            }
          } else {
            // Aパターン: 手前9箱（横置き）+ 奥4箱（縦向き）
            // 【手前側ブロック】9箱: 横向き 3列×3行
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                layoutPattern.push({
                  x: col * cartonLength,  // 長辺 × 列（354mm）
                  z: row * cartonWidth,   // 短辺 × 行（225mm）
                  rotated: false
                });
              }
            }
            
            // 【奥側ブロック】4箱: 縦向き 4列×1行
            const backRowZ = 3 * cartonWidth; // 9箱ブロックの奥行き（675mm）
            for (let col = 0; col < 4; col++) {
              layoutPattern.push({
                x: col * cartonWidth,   // 短辺 × 列（225mm）
                z: backRowZ,            // 奥側に配置
                rotated: true           // 90度回転
              });
            }
          }
        } else {
          // 黒ゴマアーモンドきな粉: 通常の13回しパターン（全段同じ）
          // 【手前側ブロック】9箱: 横向き 3列×3行
          // 段番号を計算（1,2,5,6,9,10段目はAパターン、3,4,7,8段目はBパターン）
          const layerMod = ((layerNumber - 1) % 4);
          const useBPattern = (layerMod === 2 || layerMod === 3);
          
          if (useBPattern) {
            // 3,4,7,8段目: Bパターン（手前4箱縦+奥9箱横）
            // 【手前側】4箱: 縦向き（X軸: 1, Y軸: 1-4）
            for (let col = 0; col < 4; col++) {
              layoutPattern.push({
                x: 0,                    // 手前（X軸方向）
                z: col * cartonWidth,   // 短辺 × 列（Y軸方向、左右）
                rotated: true,           // 90度回転
                gridX: 1,                // X: 1（手前）
                gridY: col + 1,          // Y: 1,2,3,4（左から右へ）
                gridZ: layerNumber       // Z: 段番号
              });
            }
            
            // 【奥側】9箱: 横向き（X軸: 2-4, Y軸: 1-3）
            const backRowX = cartonLength; // 4箱ブロックの奥行き（X軸方向）
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                layoutPattern.push({
                  x: backRowX + row * cartonWidth,  // 奥行き（X軸方向）
                  z: col * cartonLength,  // 長辺 × 列（Y軸方向、左右）
                  rotated: false,
                  gridX: row + 2,         // X: 2,3,4（奥側）
                  gridY: col + 1,         // Y: 1,2,3（左から右へ）
                  gridZ: layerNumber      // Z: 段番号
                });
              }
            }
          } else {
            // 1,2,5,6,9,10段目: Aパターン（手前9箱横+奥4箱縦）
            // 【手前側】9箱: 横向き（X軸: 1-3, Y軸: 1-3）
            for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                layoutPattern.push({
                  x: row * cartonWidth,   // 短辺 × 行（X軸方向、手前奥）
                  z: col * cartonLength,  // 長辺 × 列（Y軸方向、左右）
                  rotated: false,
                  gridX: row + 1,         // X: 1,2,3（手前から奥へ）
                  gridY: col + 1,         // Y: 1,2,3（左から右へ）
                  gridZ: layerNumber      // Z: 段番号
                });
              }
            }
            
            // 【奥側】4箱: 縦向き（X軸: 4, Y軸: 1-4）
            const backRowX = 3 * cartonWidth;  // 奥側のX座標
            for (let col = 0; col < 4; col++) {
              layoutPattern.push({
                x: backRowX,            // 奥側に配置（X軸方向）
                z: col * cartonWidth,   // 短辺 × 列（Y軸方向、左右）
                rotated: true,          // 90度回転
                gridX: 4,               // X: 4（奥側）
                gridY: col + 1,         // Y: 1,2,3,4（左から右へ）
                gridZ: layerNumber      // Z: 段番号
              });
            }
          }
        }
      } else {
        // デフォルト配置（13箱以外）
        const colsPerRow = Math.ceil(Math.sqrt(layer.cartons.length));
        for (let i = 0; i < layer.cartons.length; i++) {
          layoutPattern.push({
            x: Math.floor(i / colsPerRow) * cartonWidth,   // X軸方向（手前奥）
            z: (i % colsPerRow) * cartonLength,             // Y軸方向（左右）
            rotated: false
          });
        }
      }
      
      // 原点を「正面左手前」の「パレット上面」に設定
      if (layoutPattern.length > 0) {
        // 配置パターンに基づいて段ボールを配置
        layer.cartons.forEach((carton, idx) => {
          if (idx >= layoutPattern.length) return;
          
          const pattern = layoutPattern[idx];
          const cartonL = carton.length * scale;  // 354mm
          const cartonW = carton.width * scale;   // 225mm
          const cartonH = carton.height * scale;  // 125mm
          
          if (useVertical5Pattern) {
            // 縦置き5箱: 段ボールを横倒しにして縦置き
            // 通常: 354mm × 225mm × 125mm
            // 縦置き: 125mm × 354mm × 225mm（高さ）
            const boxWidth = cartonH;   // 125mm（元の高さを横幅として使用）
            const boxDepth = cartonL;   // 354mm（長辺を奥行きとして使用）
            const boxHeight = cartonW;  // 225mm（幅を高さとして使用）
            
            positions.push({
              carton,
              position: [
                pattern.z + boxWidth / 2,    // pattern.z = 左右方向（Y軸）
                currentHeight + boxHeight / 2,
                pattern.x + boxDepth / 2     // pattern.x = 手前奥方向（X軸）
              ],
              size: [boxWidth, boxHeight, boxDepth],  // 縦置き用サイズ
              rotation: 0,  // 回転なし
              isVertical: true,
              layerNumber: layerNumber,  // layerNumberをそのまま使用
              cartonIndex: idx,
              gridX: pattern.gridX,
              gridY: pattern.gridY,
              gridZ: pattern.gridZ
            });
          } else {
            // 通常の配置（13回しパターンまたはデフォルト）
            // 回転を考慮したサイズ（X軸とY軸入れ替え後）
            const boxWidthThree = pattern.rotated ? cartonW : cartonL;  // Three.jsのX軸サイズ（左右）
            const boxDepthThree = pattern.rotated ? cartonL : cartonW;  // Three.jsのZ軸サイズ（手前奥）
            
            positions.push({
              carton,
              position: [
                pattern.z + boxWidthThree / 2,   // pattern.z = 左右方向（Y軸→Three.jsのX）
                currentHeight + cartonH / 2,
                pattern.x + boxDepthThree / 2    // pattern.x = 手前奥方向（X軸→Three.jsのZ）
              ],
              size: [cartonL, cartonH, cartonW],
              rotation: pattern.rotated ? Math.PI / 2 : 0,
              isVertical: false,
              layerNumber: layerNumber,  // layerNumberをそのまま使用
              cartonIndex: idx,
              gridX: pattern.gridX,
              gridY: pattern.gridY,
              gridZ: pattern.gridZ
            });
          }
        });
      }
      
      // 次の段の高さを計算
      let maxHeight;
      if (useVertical5Pattern) {
        // 縦置きの場合は width（225mm）が高さになる
        maxHeight = Math.max(...layer.cartons.map(c => c.width * scale));
      } else {
        maxHeight = Math.max(...layer.cartons.map(c => c.height * scale));
      }
      currentHeight += maxHeight;
    });
    
    return positions;
  }, [layers, scale, palletSize]);
  
  // 段ボールの色をランダムに生成（茶色系）
  const getCartonColor = (index: number) => {
    const colors = ['#d4a574', '#c89660', '#b8864f', '#a8763f'];
    return colors[index % colors.length];
  };
  
  // 段ボール同士の接触判定
  const isCartonTouching = useCallback((
    carton1: CartonPlacement,
    carton2: CartonPlacement,
    direction: 'x' | 'z' | 'y',
    customPlacements: Map<string, any>
  ): boolean => {
    const key1 = `${carton1.layerNumber}-${carton1.cartonIndex}`;
    const key2 = `${carton2.layerNumber}-${carton2.cartonIndex}`;
    
    const custom1 = customPlacements.get(key1);
    const custom2 = customPlacements.get(key2);
    
    const pos1 = custom1?.position || carton1.position;
    const pos2 = custom2?.position || carton2.position;
    
    const size1 = carton1.size;
    const size2 = carton2.size;
    
    const threshold = 0.01; // 接触判定の閾値（10mm）
    
    if (direction === 'x') {
      // X軸方向の接触：Y座標とZ座標が重なっているか確認
      const yOverlap = Math.abs(pos1[1] - pos2[1]) < (size1[1] + size2[1]) / 2 + threshold;
      const zOverlap = Math.abs(pos1[2] - pos2[2]) < (size1[2] + size2[2]) / 2 + threshold;
      // X方向で隣接しているか
      const xDistance = Math.abs(pos1[0] - pos2[0]);
      const xAdjacent = Math.abs(xDistance - (size1[0] + size2[0]) / 2) < threshold;
      return yOverlap && zOverlap && xAdjacent;
    } else if (direction === 'z') {
      // Z軸方向の接触：Y座標とX座標が重なっているか確認
      const yOverlap = Math.abs(pos1[1] - pos2[1]) < (size1[1] + size2[1]) / 2 + threshold;
      const xOverlap = Math.abs(pos1[0] - pos2[0]) < (size1[0] + size2[0]) / 2 + threshold;
      // Z方向で隣接しているか
      const zDistance = Math.abs(pos1[2] - pos2[2]);
      const zAdjacent = Math.abs(zDistance - (size1[2] + size2[2]) / 2) < threshold;
      return yOverlap && xOverlap && zAdjacent;
    } else if (direction === 'y') {
      // Y軸方向の接触：X座標とZ座標が重なっているか確認
      const xOverlap = Math.abs(pos1[0] - pos2[0]) < (size1[0] + size2[0]) / 2 + threshold;
      const zOverlap = Math.abs(pos1[2] - pos2[2]) < (size1[2] + size2[2]) / 2 + threshold;
      // Y方向で隣接しているか
      const yDistance = Math.abs(pos1[1] - pos2[1]);
      const yAdjacent = Math.abs(yDistance - (size1[1] + size2[1]) / 2) < threshold;
      return xOverlap && zOverlap && yAdjacent;
    }
    
    return false;
  }, []);
  
  // 移動方向に直接接触している段ボールを再帰的に取得（同じ段のみ）
  const getCartonsInMovementPath = useCallback((
    startCarton: CartonPlacement,
    direction: 'x' | 'z',
    delta: number,
    visited: Set<string> = new Set()
  ): Set<string> => {
    const result = new Set<string>();
    const startKey = `${startCarton.layerNumber}-${startCarton.cartonIndex}`;
    
    if (visited.has(startKey)) return result;
    visited.add(startKey);
    result.add(startKey);
    
    const startCustom = customPlacements.get(startKey);
    const startPos = startCustom?.position || startCarton.position;
    const startRotation = startCustom?.rotation ?? startCarton.rotation;
    
    // 回転を考慮した実際のサイズ（90度回転している場合はXとZが入れ替わる）
    const isRotated90 = Math.abs(startRotation % Math.PI - Math.PI / 2) < 0.1;
    const startSize: [number, number, number] = isRotated90
      ? [startCarton.size[2], startCarton.size[1], startCarton.size[0]] // 90度回転: [width, height, length]
      : startCarton.size; // 0度: [length, height, width]
    
    console.log(`  🔍 検査中: ${startKey}`, {
      position: startPos,
      size: startSize,
      rotation: startRotation,
      isRotated90,
      originalSize: startCarton.size,
      direction,
      delta: delta > 0 ? '正方向' : '負方向'
    });
    
    // 同じ段（layerNumber）の段ボールのみを対象とする
    const sameLevelCartons = cartonPositions.filter(
      c => c.layerNumber === startCarton.layerNumber && 
           `${c.layerNumber}-${c.cartonIndex}` !== startKey
    );
    
    const contactThreshold = 0.03; // 接触判定の閾値（30mm - より多くの操作に対応）
    
    // 移動方向に直接接触している段ボールを探す
    sameLevelCartons.forEach(otherCarton => {
      const otherKey = `${otherCarton.layerNumber}-${otherCarton.cartonIndex}`;
      if (visited.has(otherKey)) return;
      
      const otherCustom = customPlacements.get(otherKey);
      const otherPos = otherCustom?.position || otherCarton.position;
      const otherRotation = otherCustom?.rotation ?? otherCarton.rotation;
      
      // 回転を考慮した実際のサイズ
      const isOtherRotated90 = Math.abs(otherRotation % Math.PI - Math.PI / 2) < 0.1;
      const otherSize: [number, number, number] = isOtherRotated90
        ? [otherCarton.size[2], otherCarton.size[1], otherCarton.size[0]]
        : otherCarton.size;
      
      // Y座標が同じ高さか確認
      const yOverlap = Math.abs(startPos[1] - otherPos[1]) < 0.01;
      if (!yOverlap) return;
      
      let isAdjacent = false;
      let debugInfo: any = {};
      
      if (direction === 'x') {
        // X方向に移動：Z座標が重なっていて、X方向で隣接しているか
        const zOverlapThreshold = (startSize[2] + otherSize[2]) / 2 * 0.9; // 90%以上重なっている（緩和）
        const zOverlap = Math.abs(startPos[2] - otherPos[2]) < zOverlapThreshold;
        
        debugInfo.zOverlap = zOverlap;
        debugInfo.zDistance = Math.abs(startPos[2] - otherPos[2]);
        debugInfo.zThreshold = (startSize[2] + otherSize[2]) / 2;
        
        if (zOverlap) {
          if (delta > 0) {
            // 右方向に移動：右側に接触している段ボールを探す
            const startRight = startPos[0] + startSize[0] / 2;
            const otherLeft = otherPos[0] - otherSize[0] / 2;
            const gap = otherLeft - startRight;
            debugInfo.gap = gap;
            debugInfo.direction = '右方向';
            debugInfo.startRight = startRight;
            debugInfo.otherLeft = otherLeft;
            // 右側にある段ボールで、接触 or 重なっている
            // gap <= threshold かつ 実際に右側にある（otherPos[0] >= startPos[0]）
            isAdjacent = gap <= contactThreshold && otherPos[0] >= startPos[0];
          } else {
            // 左方向に移動：左側に接触している段ボールを探す
            const startLeft = startPos[0] - startSize[0] / 2;
            const otherRight = otherPos[0] + otherSize[0] / 2;
            const gap = startLeft - otherRight;
            debugInfo.gap = gap;
            debugInfo.direction = '左方向';
            debugInfo.startLeft = startLeft;
            debugInfo.otherRight = otherRight;
            // 左側にある段ボールで、接触 or 重なっている
            // gap <= threshold かつ 実際に左側にある（otherPos[0] <= startPos[0]）
            isAdjacent = gap <= contactThreshold && otherPos[0] <= startPos[0];
          }
        }
      } else if (direction === 'z') {
        // Z方向に移動：X座標が重なっていて、Z方向で隣接しているか
        const xOverlapThreshold = (startSize[0] + otherSize[0]) / 2 * 0.9; // 90%以上重なっている（緩和）
        const xOverlap = Math.abs(startPos[0] - otherPos[0]) < xOverlapThreshold;
        
        debugInfo.xOverlap = xOverlap;
        debugInfo.xDistance = Math.abs(startPos[0] - otherPos[0]);
        debugInfo.xThreshold = (startSize[0] + otherSize[0]) / 2;
        
        if (xOverlap) {
          if (delta > 0) {
            // 奥方向に移動：奥側に接触している段ボールを探す
            const startBack = startPos[2] + startSize[2] / 2;
            const otherFront = otherPos[2] - otherSize[2] / 2;
            const gap = otherFront - startBack;
            debugInfo.gap = gap;
            debugInfo.direction = '奥方向';
            debugInfo.startBack = startBack;
            debugInfo.otherFront = otherFront;
            // 奥側にある段ボールで、接触 or 重なっている
            // gap <= threshold かつ 実際に奥側にある（otherPos[2] >= startPos[2]）
            isAdjacent = gap <= contactThreshold && otherPos[2] >= startPos[2];
          } else {
            // 手前方向に移動：手前側に接触している段ボールを探す
            const startFront = startPos[2] - startSize[2] / 2;
            const otherBack = otherPos[2] + otherSize[2] / 2;
            const gap = startFront - otherBack;
            debugInfo.gap = gap;
            debugInfo.direction = '手前方向';
            debugInfo.startFront = startFront;
            debugInfo.otherBack = otherBack;
            // 手前側にある段ボールで、接触 or 重なっている
            // gap <= threshold かつ 実際に手前側にある（otherPos[2] <= startPos[2]）
            isAdjacent = gap <= contactThreshold && otherPos[2] <= startPos[2];
          }
        }
      }
      
      console.log(`    └ チェック: ${otherKey}`, {
        ...debugInfo,
        isAdjacent,
        otherPos,
        otherSize
      });
      
      if (isAdjacent) {
        console.log(`    ✅ 接触検出: ${otherKey}`);
        // 再帰的に連鎖する段ボール（直接接触しているもののみ）を取得
        const chainedCartons = getCartonsInMovementPath(otherCarton, direction, delta, visited);
        chainedCartons.forEach(key => result.add(key));
      }
    });
    
    return result;
  }, [cartonPositions, customPlacements]);
  const handleCartonSelect = useCallback((layerNumber: number, cartonIndex: number) => {
    if (!editable) return;
    setSelectedCarton({ layerNumber, cartonIndex });
  }, [editable]);
  
  // 段ボールを回転（90度）- 隣の段ボールを押し出す
  const handleRotate = useCallback(() => {
    if (!selectedCarton) return;
    const key = `${selectedCarton.layerNumber}-${selectedCarton.cartonIndex}`;
    
    // 元の配置情報を取得
    const originalPlacement = cartonPositions.find(
      p => p.layerNumber === selectedCarton.layerNumber && p.cartonIndex === selectedCarton.cartonIndex
    );
    if (!originalPlacement) return;
    
    const current = customPlacements.get(key);
    const newRotation = ((current?.rotation ?? originalPlacement.rotation) + Math.PI / 2) % (Math.PI * 2);
    
    // 回転前後のサイズを計算
    const oldRotation = current?.rotation ?? originalPlacement.rotation;
    const wasRotated90 = Math.abs(oldRotation % Math.PI - Math.PI / 2) < 0.1;
    const willBeRotated90 = Math.abs(newRotation % Math.PI - Math.PI / 2) < 0.1;
    
    const oldSize: [number, number, number] = wasRotated90
      ? [originalPlacement.size[2], originalPlacement.size[1], originalPlacement.size[0]]
      : originalPlacement.size;
    const newSize: [number, number, number] = willBeRotated90
      ? [originalPlacement.size[2], originalPlacement.size[1], originalPlacement.size[0]]
      : originalPlacement.size;
    
    // サイズの変化量
    const sizeChangeX = newSize[0] - oldSize[0];
    const sizeChangeZ = newSize[2] - oldSize[2];
    
    const newPlacements = new Map(customPlacements);
    
    // 選択された段ボール自体を回転
    newPlacements.set(key, {
      position: current?.position || originalPlacement.position,
      rotation: newRotation,
      isVertical: current?.isVertical ?? originalPlacement.isVertical
    });
    
    // サイズが変わった場合、隣接する段ボールを押し出す
    if (Math.abs(sizeChangeX) > 0.001 || Math.abs(sizeChangeZ) > 0.001) {
      const selectedPos = current?.position || originalPlacement.position;
      
      // 同じ段の段ボールを取得
      const sameLevelCartons = cartonPositions.filter(
        c => c.layerNumber === selectedCarton.layerNumber && 
             `${c.layerNumber}-${c.cartonIndex}` !== key
      );
      
      sameLevelCartons.forEach(otherCarton => {
        const otherKey = `${otherCarton.layerNumber}-${otherCarton.cartonIndex}`;
        const otherCustom = newPlacements.get(otherKey);
        const otherPos = otherCustom?.position || otherCarton.position;
        
        // Y座標が同じ高さか確認
        const yOverlap = Math.abs(selectedPos[1] - otherPos[1]) < 0.01;
        if (!yOverlap) return;
        
        let needsPush = false;
        let pushDirection: [number, number, number] = [0, 0, 0];
        
        // X方向のサイズが拡大した場合のみ押し出し
        if (sizeChangeX > 0.001) {
          // X方向に大きくなった → X方向の隣接段ボールを押し出す
          const zOverlapThreshold = (newSize[2] + otherCarton.size[2]) / 2 * 0.9; // 90%（緩和）
          const zOverlap = Math.abs(selectedPos[2] - otherPos[2]) < zOverlapThreshold;
          
          if (zOverlap) {
            if (otherPos[0] > selectedPos[0]) {
              // 右側にある段ボール → 右方向に押し出し
              // 50.4% = ギャップ最小化（約5mm/回）
              pushDirection[0] = sizeChangeX * 0.504;
              needsPush = true;
            } else if (otherPos[0] < selectedPos[0]) {
              // 左側にある段ボール → 左方向に押し出し
              pushDirection[0] = -sizeChangeX * 0.504;
              needsPush = true;
            }
          }
        }
        
        // Z方向のサイズが拡大した場合のみ押し出し
        if (sizeChangeZ > 0.001) {
          // Z方向に大きくなった → Z方向の隣接段ボールを押し出す
          const xOverlapThreshold = (newSize[0] + otherCarton.size[0]) / 2 * 0.9; // 90%（緩和）
          const xOverlap = Math.abs(selectedPos[0] - otherPos[0]) < xOverlapThreshold;
          
          if (xOverlap) {
            if (otherPos[2] > selectedPos[2]) {
              // 奥側にある段ボール → 奥方向に押し出し
              // 50.4% = ギャップ最小化（約5mm/回）
              pushDirection[2] = sizeChangeZ * 0.504;
              needsPush = true;
            } else if (otherPos[2] < selectedPos[2]) {
              // 手前側にある段ボール → 手前方向に押し出し
              pushDirection[2] = -sizeChangeZ * 0.504;
              needsPush = true;
            }
          }
        }
        
        if (needsPush) {
          const newPos: [number, number, number] = [
            otherPos[0] + pushDirection[0],
            otherPos[1] + pushDirection[1],
            otherPos[2] + pushDirection[2]
          ];
          
          newPlacements.set(otherKey, {
            position: newPos,
            rotation: otherCustom?.rotation ?? otherCarton.rotation,
            isVertical: otherCustom?.isVertical ?? otherCarton.isVertical
          });
        }
      });
    }
    
    pushToUndoStack(newPlacements);
  }, [selectedCarton, customPlacements, cartonPositions, pushToUndoStack]);
  
  // 縦置き/横置き切り替え（上方向の段ボールを押し上げる）
  const handleToggleVertical = useCallback(() => {
    if (!selectedCarton) return;
    const key = `${selectedCarton.layerNumber}-${selectedCarton.cartonIndex}`;
    
    // 元の配置情報を取得
    const originalPlacement = cartonPositions.find(
      p => p.layerNumber === selectedCarton.layerNumber && p.cartonIndex === selectedCarton.cartonIndex
    );
    if (!originalPlacement) return;
    
    const current = customPlacements.get(key);
    const currentIsVertical = current?.isVertical ?? originalPlacement.isVertical;
    const newIsVertical = !currentIsVertical;
    
    // 高さの変化を計算
    const carton = originalPlacement.carton;
    const oldHeight = currentIsVertical ? carton.width : carton.height;
    const newHeight = newIsVertical ? carton.width : carton.height;
    const heightDelta = (newHeight - oldHeight) * scale;
    
    const newPlacements = new Map(customPlacements);
    
    // まず選択された段ボール自体を更新
    newPlacements.set(key, {
      position: current?.position || originalPlacement.position,
      rotation: current?.rotation ?? originalPlacement.rotation,
      isVertical: newIsVertical
    });
    
    // 高さが変わった場合、上方向の段ボールを押し上げる
    if (Math.abs(heightDelta) > 0.001) {
      const selectedPos = current?.position || originalPlacement.position;
      
      // 上方向で接触している段ボールを再帰的に取得
      const affectedCartons = new Set<string>();
      const queue: CartonPlacement[] = [originalPlacement];
      const visited = new Set<string>([key]);
      
      while (queue.length > 0) {
        const currentCarton = queue.shift()!;
        
        cartonPositions.forEach(otherCarton => {
          const otherKey = `${otherCarton.layerNumber}-${otherCarton.cartonIndex}`;
          if (visited.has(otherKey)) return;
          
          const otherCustom = newPlacements.get(otherKey);
          const otherPos = otherCustom?.position || otherCarton.position;
          const currentCustom = newPlacements.get(`${currentCarton.layerNumber}-${currentCarton.cartonIndex}`);
          const currentPos = currentCustom?.position || currentCarton.position;
          
          // 上方向にあるかチェック
          if (otherPos[1] > currentPos[1]) {
            // X座標とZ座標が重なっているか確認
            const xOverlap = Math.abs(otherPos[0] - currentPos[0]) < (otherCarton.size[0] + currentCarton.size[0]) / 2 + 0.01;
            const zOverlap = Math.abs(otherPos[2] - currentPos[2]) < (otherCarton.size[2] + currentCarton.size[2]) / 2 + 0.01;
            
            if (xOverlap && zOverlap) {
              affectedCartons.add(otherKey);
              visited.add(otherKey);
              queue.push(otherCarton);
            }
          }
        });
      }
      
      // 影響を受ける段ボールを押し上げる
      affectedCartons.forEach(affectedKey => {
        const [layerNum, cartonIdx] = affectedKey.split('-').map(Number);
        const placement = cartonPositions.find(
          p => p.layerNumber === layerNum && p.cartonIndex === cartonIdx
        );
        if (!placement) return;
        
        const affectedCustom = newPlacements.get(affectedKey);
        const affectedPos = affectedCustom?.position || placement.position;
        
        const newPos: [number, number, number] = [...affectedPos];
        newPos[1] += heightDelta; // Y座標を変更
        
        newPlacements.set(affectedKey, {
          position: newPos,
          rotation: affectedCustom?.rotation ?? placement.rotation,
          isVertical: affectedCustom?.isVertical ?? placement.isVertical
        });
      });
    }
    
    setCustomPlacements(newPlacements);
  }, [selectedCarton, customPlacements, cartonPositions, scale]);
  
  // 位置を微調整（移動経路上の段ボールを全て移動）
  const handleMoveCarton = useCallback((axis: 'x' | 'z', delta: number) => {
    if (!selectedCarton) return;
    
    // 選択された段ボールの情報を取得
    const selectedPlacement = cartonPositions.find(
      p => p.layerNumber === selectedCarton.layerNumber && p.cartonIndex === selectedCarton.cartonIndex
    );
    if (!selectedPlacement) return;
    
    const deltaValue = delta * 0.1; // 100mm単位で移動
    
    console.log('🔧 移動開始:', {
      selectedCarton: `段${selectedCarton.layerNumber}-箱${selectedCarton.cartonIndex}`,
      axis,
      delta,
      deltaValue,
      currentPosition: customPlacements.get(`${selectedCarton.layerNumber}-${selectedCarton.cartonIndex}`)?.position || selectedPlacement.position,
      size: selectedPlacement.size
    });
    
    // 移動経路上の段ボールを再帰的に取得
    const affectedCartons = getCartonsInMovementPath(selectedPlacement, axis, delta);
    
    console.log('📦 影響を受ける段ボール:', {
      count: affectedCartons.size,
      cartons: Array.from(affectedCartons).map(key => {
        const [layerNum, cartonIdx] = key.split('-').map(Number);
        const placement = cartonPositions.find(p => p.layerNumber === layerNum && p.cartonIndex === cartonIdx);
        const currentPos = customPlacements.get(key)?.position || placement?.position;
        return {
          key,
          position: currentPos,
          size: placement?.size
        };
      })
    });
    
    const newPlacements = new Map(customPlacements);
    const axisIndex = axis === 'x' ? 0 : 2; // x=0, z=2
    
    affectedCartons.forEach(key => {
      const [layerNum, cartonIdx] = key.split('-').map(Number);
      const placement = cartonPositions.find(
        p => p.layerNumber === layerNum && p.cartonIndex === cartonIdx
      );
      if (!placement) return;
      
      const current = customPlacements.get(key);
      const currentPos = current?.position || placement.position;
      
      const newPos: [number, number, number] = [...currentPos];
      newPos[axisIndex] += deltaValue;
      
      console.log(`  └ 移動: ${key}`, {
        from: currentPos[axisIndex],
        to: newPos[axisIndex]
      });
      
      newPlacements.set(key, {
        position: newPos,
        rotation: current?.rotation ?? placement.rotation,
        isVertical: current?.isVertical ?? placement.isVertical
      });
    });
    
    pushToUndoStack(newPlacements);
    
    // 移動後に重なりをチェック
    setTimeout(() => {
      console.log('🔍 重なりチェック開始...');
      const overlaps: any[] = [];
      
      // 同じ段の全ての段ボールの組み合わせをチェック
      const sameLevelCartons = cartonPositions.filter(c => c.layerNumber === selectedCarton.layerNumber);
      
      for (let i = 0; i < sameLevelCartons.length; i++) {
        for (let j = i + 1; j < sameLevelCartons.length; j++) {
          const cartonA = sameLevelCartons[i];
          const cartonB = sameLevelCartons[j];
          
          const keyA = `${cartonA.layerNumber}-${cartonA.cartonIndex}`;
          const keyB = `${cartonB.layerNumber}-${cartonB.cartonIndex}`;
          
          const customA = newPlacements.get(keyA);
          const customB = newPlacements.get(keyB);
          
          const posA = customA?.position || cartonA.position;
          const posB = customB?.position || cartonB.position;
          
          const rotA = customA?.rotation ?? cartonA.rotation;
          const rotB = customB?.rotation ?? cartonB.rotation;
          
          // 回転を考慮したサイズ
          const isRotatedA = Math.abs(rotA % Math.PI - Math.PI / 2) < 0.1;
          const isRotatedB = Math.abs(rotB % Math.PI - Math.PI / 2) < 0.1;
          
          const sizeA: [number, number, number] = isRotatedA
            ? [cartonA.size[2], cartonA.size[1], cartonA.size[0]]
            : cartonA.size;
          const sizeB: [number, number, number] = isRotatedB
            ? [cartonB.size[2], cartonB.size[1], cartonB.size[0]]
            : cartonB.size;
          
          // Y座標が同じ高さか確認
          const yOverlap = Math.abs(posA[1] - posB[1]) < 0.01;
          if (!yOverlap) continue;
          
          // X方向の重なり
          const xDistance = Math.abs(posA[0] - posB[0]);
          const xOverlapDistance = (sizeA[0] + sizeB[0]) / 2;
          const xOverlap = xDistance < xOverlapDistance;
          
          // Z方向の重なり
          const zDistance = Math.abs(posA[2] - posB[2]);
          const zOverlapDistance = (sizeA[2] + sizeB[2]) / 2;
          const zOverlap = zDistance < zOverlapDistance;
          
          // X方向とZ方向の両方で重なっていたら衝突
          if (xOverlap && zOverlap) {
            // X方向とZ方向のギャップを計算
            let xGap = 0;
            let zGap = 0;
            
            if (posB[0] > posA[0]) {
              // Bが右側
              const aRight = posA[0] + sizeA[0] / 2;
              const bLeft = posB[0] - sizeB[0] / 2;
              xGap = bLeft - aRight;
            } else {
              // Aが右側
              const bRight = posB[0] + sizeB[0] / 2;
              const aLeft = posA[0] - sizeA[0] / 2;
              xGap = aLeft - bRight;
            }
            
            if (posB[2] > posA[2]) {
              // Bが奥側
              const aBack = posA[2] + sizeA[2] / 2;
              const bFront = posB[2] - sizeB[2] / 2;
              zGap = bFront - aBack;
            } else {
              // Aが奥側
              const bBack = posB[2] + sizeB[2] / 2;
              const aFront = posA[2] - sizeA[2] / 2;
              zGap = aFront - bBack;
            }
            
            overlaps.push({
              cartonA: keyA,
              cartonB: keyB,
              positionA: posA,
              positionB: posB,
              sizeA,
              sizeB,
              rotationA: rotA,
              rotationB: rotB,
              xDistance,
              zDistance,
              xGap,
              zGap,
              xOverlapAmount: xOverlapDistance - xDistance,
              zOverlapAmount: zOverlapDistance - zDistance
            });
          }
        }
      }
      
      if (overlaps.length > 0) {
        console.error('❌ 重なり検出:', overlaps);
        console.log('📋 重なり詳細:');
        overlaps.forEach(overlap => {
          console.log(`  ${overlap.cartonA} と ${overlap.cartonB}:`);
          console.log(`    X方向ギャップ: ${overlap.xGap.toFixed(3)}m (${(overlap.xGap * 1000).toFixed(1)}mm)`);
          console.log(`    Z方向ギャップ: ${overlap.zGap.toFixed(3)}m (${(overlap.zGap * 1000).toFixed(1)}mm)`);
          console.log(`    X重なり量: ${(overlap.xOverlapAmount * 1000).toFixed(1)}mm`);
          console.log(`    Z重なり量: ${(overlap.zOverlapAmount * 1000).toFixed(1)}mm`);
          console.log(`    位置A: [${overlap.positionA.map((v: number) => v.toFixed(3)).join(', ')}]`);
          console.log(`    位置B: [${overlap.positionB.map((v: number) => v.toFixed(3)).join(', ')}]`);
          console.log(`    サイズA: [${overlap.sizeA.map((v: number) => v.toFixed(3)).join(', ')}]`);
          console.log(`    サイズB: [${overlap.sizeB.map((v: number) => v.toFixed(3)).join(', ')}]`);
        });
      } else {
        console.log('✅ 重なりなし');
      }
    }, 100);
  }, [selectedCarton, customPlacements, cartonPositions, getCartonsInMovementPath, pushToUndoStack]);
  
  // 選択された段ボールの情報を取得
  const selectedCartonInfo = useMemo(() => {
    if (!selectedCarton) return null;
    const placement = cartonPositions.find(
      p => p.layerNumber === selectedCarton.layerNumber && p.cartonIndex === selectedCarton.cartonIndex
    );
    return placement;
  }, [selectedCarton, cartonPositions]);
  
  // 段（レイヤー）のリストを取得
  const layersList = useMemo(() => {
    const layersMap = new Map<number, CartonPlacement[]>();
    cartonPositions.forEach(placement => {
      const existing = layersMap.get(placement.layerNumber) || [];
      existing.push(placement);
      layersMap.set(placement.layerNumber, existing);
    });
    return Array.from(layersMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [cartonPositions]);
  
  return (
    <div style={{ width: '100%', height: '500px', background: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%)', position: 'relative' }}>
      <Canvas
        camera={{ position: [0.8, 1.8, -1.5], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => {
          // 背景（オブジェクト以外）をクリックした場合は選択解除
          setSelectedCarton(null);
          setEditingLayer(null);
        }}
      >
        {/* 照明 */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* パレット台座 */}
        <PalletBase size={palletSize} />
        
        {/* パレットの境界枠（視覚的ガイド）- 原点を正面左手前に */}
        <mesh position={[palletSize * scale / 2, 0.01, palletSize * scale / 2]}>
          <boxGeometry args={[palletSize * scale, 0.002, palletSize * scale / 2]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.3} wireframe />
        </mesh>
        
        {/* 軸ヘルパー - 原点を正面左手前に */}
        <axesHelper args={[0.3]} position={[0, 0.01, 0]} />
        
        {/* パレット正面表示（手前側中央に赤い板で「FRONT」を示す）- 正面左手前が原点 */}
        <group position={[palletSize * scale / 2, 0.15, -0.15]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.8, 0.15]} />
            <meshBasicMaterial color="#ff0000" side={THREE.DoubleSide} />
          </mesh>
        </group>
        
        {/* 段ボール */}
        {cartonPositions.map((item, idx) => {
          const key = `${item.layerNumber}-${item.cartonIndex}`;
          const customPlacement = customPlacements.get(key);
          const isSelected = selectedCarton?.layerNumber === item.layerNumber && 
                            selectedCarton?.cartonIndex === item.cartonIndex;
          const isLayerEditing = editingLayer === item.layerNumber;
          
          // 編集中の段は横にずらして表示
          let displayPosition = customPlacement?.position || item.position;
          if (isLayerEditing && !customPlacement) {
            displayPosition = [
              item.position[0] + 2.0,  // 右に2m移動
              item.position[1],
              item.position[2]
            ];
          } else if (isLayerEditing && customPlacement) {
            displayPosition = [
              customPlacement.position[0] + 2.0,
              customPlacement.position[1],
              customPlacement.position[2]
            ];
          }
          
          // 編集モードでは全ての段がクリック可能（段の切り替えのため）
          const isClickEnabled = editable;
          
          return (
            <CartonBox
              key={`${item.layerNumber}-${item.cartonIndex}-${idx}`}
              position={displayPosition}
              size={item.size}
              color={isLayerEditing ? '#ff9966' : getCartonColor(idx)}
              productName={item.carton.productName}
              rotation={customPlacement?.rotation ?? item.rotation}
              isSelected={isSelected}
              layerNumber={item.layerNumber}
              cartonIndex={item.cartonIndex}
              gridX={item.gridX}
              gridY={item.gridY}
              gridZ={item.gridZ}
              isVertical={customPlacement?.isVertical ?? item.isVertical}
              palletId="P1"
              onInfoClick={setClickedCartonInfo}
              onClick={isClickEnabled ? (clickedLayer, clickedIndex) => {
                console.log('🖱️ 段ボールクリック:', {
                  clickedLayer,
                  clickedIndex,
                  currentEditingLayer: editingLayer
                });
                
                // 実際にクリックされた段ボールの情報を使用
                if (editingLayer !== clickedLayer) {
                  // 異なる段をクリック → その段を編集モードに
                  setEditingLayer(clickedLayer);
                  setSelectedCarton(null);
                } else {
                  // すでに編集中の段をクリック → 個別の段ボールを選択
                  handleCartonSelect(clickedLayer, clickedIndex);
                }
              } : undefined}
            />
          );
        })}
        
        {/* グリッド表示（床）- 正面左手前を原点に */}
        <primitive object={new THREE.GridHelper(5, 20, '#444', '#222')} position={[palletSize * scale / 2, -0.1, palletSize * scale / 2]} />
        
        {/* 削除: 中央のaxesHelperは不要 */}
        
        {/* 軸ラベル（X: 赤、Y: 緑、Z: 青）- 常に手前に表示 */}
        <group position={[0, 0, 0]}>
          {/* X軸（赤）- 左右方向 */}
          <mesh position={[0.8, 0, 0]} renderOrder={999}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ff0000" depthTest={false} />
          </mesh>
          {/* Z軸（青）- 前後方向 */}
          <mesh position={[0, 0, 0.8]} renderOrder={999}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#0000ff" depthTest={false} />
          </mesh>
          {/* Y軸（緑）- 上下方向 */}
          <mesh position={[0, 0.8, 0]} renderOrder={999}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#00ff00" depthTest={false} />
          </mesh>
        </group>
        
        {/* マウス操作コントロール */}
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={1.5}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
          target={[0.55, 0.4, 0.4]}
        />
        
        {/* 軸ヘルパー（開発用） */}
        {/* <axesHelper args={[2]} /> */}
      </Canvas>
      
      {/* 操作説明 */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '11px',
        fontFamily: 'monospace'
      }}>
        <div>🖱️ 左ドラッグ: 回転</div>
        <div>🖱️ 右ドラッグ: 移動</div>
        <div>🖱️ ホイール: ズーム</div>
      </div>
      
      {/* 座標系の説明 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '10px 14px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        lineHeight: '1.8',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fbbf24', fontSize: '13px' }}>📐 座標系（原点：正面左手前）</div>
        <div style={{ marginBottom: '6px' }}>
          <span style={{ color: '#0000ff', fontWeight: 'bold' }}>━↗</span>
          <span style={{ color: '#4dabf7', fontWeight: '600', marginLeft: '6px' }}>青い線</span>
          <span style={{ color: '#9ca3af', marginLeft: '6px' }}>= X軸（1→2→3：手前→奥）</span>
        </div>
        <div style={{ marginBottom: '6px' }}>
          <span style={{ color: '#ff0000', fontWeight: 'bold' }}>━→</span>
          <span style={{ color: '#ff6b6b', fontWeight: '600', marginLeft: '6px' }}>赤い線</span>
          <span style={{ color: '#9ca3af', marginLeft: '6px' }}>= Y軸（1→2→3：左→右）</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#00ff00', fontWeight: 'bold' }}>↑━</span>
          <span style={{ color: '#51cf66', fontWeight: '600', marginLeft: '6px' }}>緑の線</span>
          <span style={{ color: '#9ca3af', marginLeft: '6px' }}>= Z軸（1→2→3：下→上）</span>
        </div>
        <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
            ▬▬ 赤い板 = 正面 ▬▬
          </div>
          <div style={{ color: '#9ca3af', fontSize: '11px' }}>
            （フォークリフト差込側）
          </div>
          <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>
            原点(0,0,0) = 正面から見て左手前
          </div>
        </div>
      </div>
      
      {/* パレットサイズ表示 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: '#ffff00',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '11px',
        fontFamily: 'monospace',
        fontWeight: 'bold'
      }}>
        パレット: {palletSize}mm × {palletSize}mm
      </div>
      
      {/* 「軸の方向」インジケーターは削除（3D空間内にラベル表示） */}
      
      
      {/* 編集モード用コントロールパネル */}
      {editable && (
        <div style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '13px',
          fontFamily: 'sans-serif',
          width: '280px',
          maxHeight: '480px',
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', borderBottom: '2px solid #4a9eff', paddingBottom: '8px' }}>
            🎛️ 配置編集
          </h3>
          
          {editingLayer && (
            <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(255, 153, 102, 0.2)', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#ff9966', marginBottom: '6px' }}>編集中: 段 {editingLayer}</div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>
                横にずらして表示中
              </div>
            </div>
          )}
          
          {!editingLayer && (
            <div style={{ color: '#888', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>
              パレット上の段をクリックして選択してください
            </div>
          )}
          
          {/* 段ボール情報表示エリア */}
          {clickedCartonInfo && (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))', borderRadius: '8px', border: '1px solid rgba(147, 51, 234, 0.3)' }}>
              <div style={{ fontSize: '13px', color: '#a78bfa', marginBottom: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📦</span>
                <span>段ボール情報</span>
              </div>
              <div style={{ fontSize: '12px', lineHeight: '1.8', color: '#e0e0e0' }}>
                <div style={{ display: 'flex', marginBottom: '6px' }}>
                  <span style={{ color: '#9ca3af', minWidth: '80px' }}>商品:</span>
                  <span style={{ fontWeight: '500' }}>{clickedCartonInfo.productName}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: '6px' }}>
                  <span style={{ color: '#9ca3af', minWidth: '80px' }}>パレット:</span>
                  <span style={{ fontWeight: '500', color: '#60a5fa' }}>{clickedCartonInfo.palletId}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: '6px' }}>
                  <span style={{ color: '#9ca3af', minWidth: '80px' }}>番号:</span>
                  <span style={{ fontWeight: '500', color: '#fbbf24' }}>{clickedCartonInfo.cartonNumber}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ color: '#9ca3af', minWidth: '80px' }}>配置:</span>
                  <span style={{ fontWeight: '500', color: '#34d399' }}>{clickedCartonInfo.orientation}</span>
                </div>
              </div>
            </div>
          )}
          
          {selectedCartonInfo && editingLayer ? (
            <>
              <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(74, 158, 255, 0.1)', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#4a9eff', marginBottom: '6px' }}>選択中の段ボール</div>
                <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                  <div>📦 商品: {selectedCartonInfo.carton.productName}</div>
                  <div>📐 サイズ: {selectedCartonInfo.carton.length} × {selectedCartonInfo.carton.width} × {selectedCartonInfo.carton.height} mm</div>
                  <div>🔢 段数: {selectedCartonInfo.layerNumber}</div>
                  <div>🔄 回転: {Math.round((selectedCartonInfo.rotation / Math.PI) * 180)}°</div>
                  <div>↕️ {selectedCartonInfo.isVertical ? '縦置き' : '横置き'}</div>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', marginBottom: '6px', color: '#aaa' }}>操作</div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                  <button
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: undoStack.length === 0 ? '#333' : '#666',
                      color: undoStack.length === 0 ? '#666' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ↶ 元に戻す
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: redoStack.length === 0 ? '#333' : '#666',
                      color: redoStack.length === 0 ? '#666' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ↷ やり直し
                  </button>
                </div>
                <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>
                  Ctrl+Z / Ctrl+Shift+Z
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', marginBottom: '6px', color: '#aaa' }}>回転・向き</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleRotate}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#4a9eff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🔄 90度回転
                  </button>
                  <button
                    onClick={handleToggleVertical}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ↕️ 縦/横
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', marginBottom: '6px', color: '#aaa' }}>位置調整（100mm単位）</div>
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', fontStyle: 'italic' }}>
                  ※ 移動経路上の全ての段ボールが一緒に移動
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  <button onClick={() => handleMoveCarton('x', -1)} style={buttonStyle}>← X</button>
                  <div></div>
                  <button onClick={() => handleMoveCarton('x', 1)} style={buttonStyle}>X →</button>
                  <button onClick={() => handleMoveCarton('z', -1)} style={buttonStyle}>↑ Z</button>
                  <div></div>
                  <button onClick={() => handleMoveCarton('z', 1)} style={buttonStyle}>Z ↓</button>
                </div>
              </div>
            </>
          ) : editingLayer ? (
            <div style={{ color: '#888', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>
              段ボールをクリックして選択してください
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '6px',
  background: '#555',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '11px'
};

