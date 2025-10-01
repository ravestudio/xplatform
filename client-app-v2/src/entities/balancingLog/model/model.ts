export interface BalancingLog {
  changeDate: string;
  balancingLogItems: BalancingLogItem[];
  structure: structureItem[];
}

export interface BalancingLogItem {
  code: string;
  dealNumber: number;
  operation: string;
  count: number;
  price: number;
  cost: number;
  account: string;
}

export interface structureItem {
  portfolio: string;
  period: string;
  shares: number;
  bond: number;
}
