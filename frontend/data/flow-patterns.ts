// 物流フローパターンの定義

export type FlowPatternType = 'direct' | 'via-packer';

export interface FlowPattern {
  id: string;
  type: FlowPatternType;
  name: string;
  description: string;
  steps: FlowStep[];
}

export interface FlowStep {
  stepNumber: number;
  from: 'manufacturer' | 'packer' | 'forwarder' | 'destination';
  to: 'manufacturer' | 'packer' | 'forwarder' | 'destination';
  label: string;
  description: string;
}

// 物流フローパターン
export const flowPatterns: FlowPattern[] = [
  {
    id: 'direct',
    type: 'direct',
    name: 'ダイレクト配送',
    description: 'メーカー → フォワーダー → アメリカ（梱包業者を経由しない）',
    steps: [
      {
        stepNumber: 1,
        from: 'manufacturer',
        to: 'forwarder',
        label: 'メーカー → フォワーダー',
        description: 'メーカーから直接フォワーダーに発送'
      },
      {
        stepNumber: 2,
        from: 'forwarder',
        to: 'destination',
        label: 'フォワーダー → アメリカ',
        description: 'フォワーダーからアメリカの最終目的地に発送'
      }
    ]
  },
  {
    id: 'via-packer',
    type: 'via-packer',
    name: '梱包業者経由',
    description: 'メーカー → 梱包業者 → フォワーダー → アメリカ（梱包業者で梱包作業）',
    steps: [
      {
        stepNumber: 1,
        from: 'manufacturer',
        to: 'packer',
        label: 'メーカー → 梱包業者',
        description: 'メーカーから梱包業者に発送（梱包作業のため）'
      },
      {
        stepNumber: 2,
        from: 'packer',
        to: 'forwarder',
        label: '梱包業者 → フォワーダー',
        description: '梱包業者から梱包完了品をフォワーダーに発送'
      },
      {
        stepNumber: 3,
        from: 'forwarder',
        to: 'destination',
        label: 'フォワーダー → アメリカ',
        description: 'フォワーダーからアメリカの最終目的地に発送'
      }
    ]
  }
];

// フローパターンIDから取得
export const getFlowPatternById = (id: string) => {
  return flowPatterns.find(fp => fp.id === id);
};

// ステップ番号から該当するステップを取得
export const getStepByNumber = (patternId: string, stepNumber: number) => {
  const pattern = getFlowPatternById(patternId);
  return pattern?.steps.find(s => s.stepNumber === stepNumber);
};

// 現在のステップが全体の何番目かを取得
export const getCurrentStepInfo = (patternId: string, from: string, to: string) => {
  const pattern = getFlowPatternById(patternId);
  if (!pattern) return null;
  
  const step = pattern.steps.find(s => s.from === from && s.to === to);
  if (!step) return null;
  
  return {
    step,
    current: step.stepNumber,
    total: pattern.steps.length,
    isFirst: step.stepNumber === 1,
    isLast: step.stepNumber === pattern.steps.length
  };
};
