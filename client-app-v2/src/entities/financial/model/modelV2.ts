export interface IncomeStatement {
  TotalRevenue: number;
  NetIncome: number;
  TotalExpenses: number;
  GrossProfit: number;
  CostOfRevenue: number;
  TaxProvision: number; //налоги
  InterestIncome: number; //процентные доходы
  InterestExpense: number; //процентные расходы
}

export interface BalanceSheet {
  CurrentLiabilities: number;
  TotalLiabilitiesNetMinorityInterest: number;
  CurrentAssets: number;
  TotalAssets: number;
  StockholdersEquity: number;
  MinorityInterest: number;
}

export interface CashflowStatement {
  Depreciation: number;
  InvestingCashFlow: number;
  PurchaseOfPPE: number; //Personal Protective Equipment (capex)

  RepurchaseOfCapitalStock: number;
  CashDividendsPaid: number;
  ChangeInPayable: number;
  ChangeInInventory: number;
  ChangeInReceivables: number;
  ChangeInPrepaidAssets: number;

  OperatingCashFlow: number;
  FinancingCashFlow: number;
}

export type FinancialModel = IncomeStatement & BalanceSheet & CashflowStatement;

export interface ComputedViewFields {
  NWC: number;
  EquityAndLiabilities: number;
  EBITDA: number;
}

export type viewKeysV2 =
  | keyof IncomeStatement
  | keyof BalanceSheet
  | keyof CashflowStatement
  | keyof ComputedViewFields;

type GroupItem = {
  caption: string;

  items: { [key in viewKeysV2]?: string };
};

export type EditGroup = {
  income: GroupItem;
  balance: GroupItem;
  flow: GroupItem;
  indicators: GroupItem;
};

export const editConfigV2: EditGroup = {
  income: {
    caption: "Income",
    items: {
      TotalRevenue: "Total Revenue",
      CostOfRevenue: "Cost Of Revenue",
      TotalExpenses: "Total Operating Expenses",
      NetIncome: "Net Income",
      GrossProfit: "Gross Profit",
      TaxProvision: "Income Tax Expense",
      InterestIncome: "Interest Income",
      InterestExpense: "Interest Expense",
    },
  },
  balance: {
    caption: "balance",
    items: {
      CurrentLiabilities: "Current Liabilities",
      TotalLiabilitiesNetMinorityInterest: "Total Liabilities",
      StockholdersEquity: "Stockholder Equity",
      MinorityInterest: "Minority Interest",
      EquityAndLiabilities: "Equity And Liabilities",
      CurrentAssets: "Current Assets",
      TotalAssets: "Total Assets",
    },
  },
  flow: {
    caption: "flow",
    items: {
      Depreciation: "Depreciation",
      InvestingCashFlow: "Flows from investing activities",
      PurchaseOfPPE: "Capital expenditures",
      RepurchaseOfCapitalStock: "Repurchase Of Stock",
      CashDividendsPaid: "Dividends Paid",
      ChangeInPayable: "Change To Liabilities",
      ChangeInInventory: "Change To Inventory",
      ChangeInReceivables: "Change To Account Receivables",
      ChangeInPrepaidAssets: "Change To Operating Activities",
      OperatingCashFlow: "Cash From Operating Activities",
      FinancingCashFlow: "Cash From Financing Activities",
      NWC: "NWC",
    },
  },
  indicators: {
    caption: "indicators",
    items: {
      EBITDA: "EBITDA",
    },
  },
};
