export interface Device {
  id: string;
  name: string;
  model: string;
  coreDevice: string;
  brandName: string;
  imageUrl?: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  description?: string;
  options: DecisionOption[];
  isTerminal?: boolean;
  solution?: string;
  additionalInfo?: string;
}

export interface DecisionOption {
  id: string;
  text: string;
  nextNodeId?: string;
  action?: string;
  solution?: string;
}

export interface DecisionTree {
  deviceId: string;
  rootNodeId: string;
  nodes: Record<string, DecisionNode>;
}

export interface NavigationHistory {
  nodeId: string;
  selectedOption?: string;
}