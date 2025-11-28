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
  sellingGeneralAdministrative: FinValue;
  operatingIncome: FinValue;
  netIncome: FinValue;
  grossProfit: FinValue;
  costOfRevenue: FinValue;
  incomeTaxExpense: FinValue;
  interestIncome: FinValue;
  interestExpense: FinValue;
}

export interface BalanceSheet {
  totalCurrentLiabilities: FinValue;
  totalLiab: FinValue;
  totalCurrentAssets: FinValue;
  totalAssets: FinValue;
  totalStockholderEquity: FinValue;
  minorityInterest: FinValue;
}

export interface CashflowStatement {
  depreciation: FinValue;
  impairmentOfCapitalAssets: FinValue;
  totalCashflowsFromInvestingActivities: FinValue;
  capitalExpenditures: FinValue;
  repurchaseOfStock: FinValue;
  dividendsPaid: FinValue;
  changeToLiabilities: FinValue;
  changeToInventory: FinValue;
  changeToAccountReceivables: FinValue;
  changeToOperatingActivities: FinValue;
  totalCashFromOperatingActivities: FinValue;
  totalCashFromFinancingActivities: FinValue;
}

export interface ComputedViewFields {
  totalNonCurrentLiabilities: FinValue;
  EBITDA: FinValue;
  NWC: FinValue;
}

export type viewKeys =
  | keyof IncomeStatement
  | keyof BalanceSheet
  | keyof CashflowStatement
  | keyof ComputedViewFields;

export const viewConfig: { [key in viewKeys]: string } = {
  //income
  totalRevenue: "Total Revenue",
  costOfRevenue: "Cost Of Revenue",
  sellingGeneralAdministrative: "SGA",
  operatingIncome: "Operating Income",
  netIncome: "Net Income",
  grossProfit: "Gross Profit",
  interestIncome : "InterestIncome",
  incomeTaxExpense: "Income Tax Expense",
  interestExpense: "Interest Expense",
  EBITDA: "EBITDA",
  //balance
  totalCurrentLiabilities: "Current Liabilities",
  totalNonCurrentLiabilities: "Non-Current Liabilities",
  totalLiab: "Total Liabilities",
  totalCurrentAssets: "Current Assets",
  totalAssets: "Total Assets",
  totalStockholderEquity: "Stockholder Equity",
  minorityInterest: "Minority Interest",
  //flow
  depreciation: "Depreciation",
  impairmentOfCapitalAssets: "Impairment Of Capital Assets",
  totalCashflowsFromInvestingActivities: "Flows from investing activities",
  capitalExpenditures: "Capital expenditures",
  NWC: "NWC",
  repurchaseOfStock: "Repurchase Of Stock",
  dividendsPaid: "Dividends Paid",
  changeToLiabilities: "Change To Liabilities",
  changeToInventory: "Change To Inventory",
  changeToAccountReceivables: "Change To Account Receivables",
  changeToOperatingActivities: "Change To Operating Activities",

  totalCashFromOperatingActivities: "Cash From Operating Activities",
  totalCashFromFinancingActivities: "Cash From Financing Activities",
};

export const editConfig: { [key in viewKeys]?: string } = {
  //income
  totalRevenue: "Total Revenue",
  costOfRevenue: "Cost Of Revenue",
  netIncome: "Net Income",
  grossProfit: "Gross Profit",
  incomeTaxExpense: "Income Tax Expense",
  interestExpense: "Interest Expense",
  //balance
  totalCurrentLiabilities: "Current Liabilities",
  totalLiab: "Total Liabilities",
  totalCurrentAssets: "Current Assets",
  totalAssets: "Total Assets",
  totalStockholderEquity: "Stockholder Equity",
  //flow
  depreciation: "Depreciation",
  totalCashflowsFromInvestingActivities: "Flows from investing activities",
  capitalExpenditures: "Capital expenditures",
  repurchaseOfStock: "Repurchase Of Stock",
  dividendsPaid: "Dividends Paid",
  changeToLiabilities: "Change To Liabilities",
  changeToInventory: "Change To Inventory",
  changeToAccountReceivables: "Change To Account Receivables",
  changeToOperatingActivities: "Change To Operating Activities",
  totalCashFromOperatingActivities: "Cash From Operating Activities",
  totalCashFromFinancingActivities: "Cash From Financing Activities",
};
