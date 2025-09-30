export interface BalancingLog {
  changeDate: string;
  balancingLogItems: BalancingLogItem[];
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
