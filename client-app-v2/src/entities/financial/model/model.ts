export type FinValue = {
  raw: string;
  fmt: string;
};

export interface Financial {
  incomeStatementHistory: IncomeStatement[];
  balanceSheetHistory: BalanceSheet[];
  cashflowStatementHistory: CashflowStatement[];
}

export interface IncomeStatement {
  totalRevenue: FinValue;
  netIncome: FinValue;
  totalOperatingExpenses: FinValue;
  grossProfit: FinValue;
  costOfRevenue: FinValue;
}

export interface BalanceSheet {
  totalCurrentLiabilities: FinValue;
  totalLiab: FinValue;
  totalCurrentAssets: FinValue;
  totalAssets: FinValue;
  totalStockholderEquity: FinValue;
}

export interface CashflowStatement {
  depreciation: FinValue;
  totalCashflowsFromInvestingActivities: FinValue;
  capitalExpenditures: FinValue;
  repurchaseOfStock: FinValue;
  dividendsPaid: FinValue;
  changeToLiabilities: FinValue;
  changeToInventory: FinValue;
  changeToAccountReceivables: FinValue;
  changeToOperatingActivities: FinValue;
}

export interface ComputedViewFields {
  totalNonCurrentLiabilities: FinValue;
  NWC: FinValue;
}

type viewKeys =
  | keyof IncomeStatement
  | keyof BalanceSheet
  | keyof CashflowStatement
  | keyof ComputedViewFields;

const viewConfig: { [key in viewKeys]: string } = {
  //income
  totalRevenue: "Total Revenue",
  costOfRevenue: "Cost Of Revenue",
  totalOperatingExpenses: "Total Operating Expenses",
  netIncome: "Net Income",
  grossProfit: "Gross Profit",
  //balance
  totalCurrentLiabilities: "Current Liabilities",
  totalNonCurrentLiabilities: "Non-Current Liabilities",
  totalLiab: "Total Liabilities",
  totalCurrentAssets: "Current Assets",
  totalAssets: "Total Assets",
  totalStockholderEquity: "Stockholder Equity",
  //flow
  depreciation: "Depreciation",
  totalCashflowsFromInvestingActivities: "Flows from investing activities",
  capitalExpenditures: "Capital expenditures",
  NWC: "NWC",
  repurchaseOfStock: "Repurchase Of Stock",
  dividendsPaid: "Dividends Paid",
  changeToLiabilities: "Change To Liabilities",
  changeToInventory: "Change To Inventory",
  changeToAccountReceivables: "Change To Account Receivables",
  changeToOperatingActivities: "Change To Operating Activities",
};
