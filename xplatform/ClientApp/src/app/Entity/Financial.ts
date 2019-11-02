export class financial {
  id: number;
  emitentId: number;
  period: number;
  year: number;

  emitentCode: string;

  revenue: number;
  operatingIncome: number;
  netIncome: number;

  currentAssets: number;
  fixedAssets: number;

  currentLiabilities: number;
  longTermLiabilities: number;

  flowOperatingActivities: number;
  amortization: number;
  nwc: number;

  flowInvestingActivities: number;
  capex: number;

  flowFinancingActivities: number;
  incomeTaxPaid: number;
  stockIssuance: number;
  dividendsPaid: number;

  earningsPerShare: number;
  price: number;
}
