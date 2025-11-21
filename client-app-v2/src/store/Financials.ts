import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface FinancialsState {
  isLoading: boolean;
  financials?: Financials;
  code?: string;
}

export interface Financials {
  emitent: string;
  isin: string;
  financialPage: string;
  assetProfile: any | null;
  defaultKeyStatistics: any[];
  financialData: any | null;
  quote: any;
  currencies: any[];
  incomeStatementHistory: any;
  cashflowStatementHistory: any;
  balanceSheetHistory: any;
  years: number[];
}

interface RequestFinancialsAction {
  type: "FINANCIALS_REQUEST";
  code: string;
}

interface ReceiveFinancialsAction {
  type: "FINANCIALS_RECEIVE";
  code: string;
  financials: Financials;
}

type KnownAction = RequestFinancialsAction | ReceiveFinancialsAction;

const getValue = (sourse: any, field: string) => {
  return sourse[field]
    ? {
        raw: sourse[field],
        fmt: new Intl.NumberFormat("en", {
          notation: "compact",
          compactDisplay: "short",
        }).format(sourse[field]),
      }
    : undefined;
};

export const actionCreators = {
  requestFinancials:
    (code: string): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      if (
        appState &&
        appState.financials &&
        code !== appState.financials.code
      ) {
        fetch(`/api/yahoo/${code}`)
          .then((response) => response.json() as Promise<Financials>)
          .then((data) => {
            const adapted = {
              ...data,
              incomeStatementHistory: data.incomeStatementHistory.map(
                (income: any) =>
                  income.version === 2
                    ? {
                        ...income,
                        totalRevenue: getValue(income, "TotalRevenue"),
                        sellingGeneralAdministrative: getValue(
                          income,
                          "SellingGeneralAndAdministration"
                        ),
                        netIncome: getValue(income, "NetIncome"),
                        
                        grossProfit: getValue(income, "GrossProfit"),
                        costOfRevenue: getValue(income, "CostOfRevenue"),
                        operatingIncome: getValue(income, "OperatingIncome"),
                        interestIncome: getValue(income, "InterestIncome"),
                      }
                    : { ...income }
              ),
              balanceSheetHistory: data.balanceSheetHistory.map(
                (balance: any) =>
                  balance.version === 2
                    ? {
                        ...balance,
                        totalCurrentLiabilities: getValue(
                          balance,
                          "CurrentLiabilities"
                        ),
                        totalLiab: getValue(
                          balance,
                          "TotalLiabilitiesNetMinorityInterest"
                        ),
                        totalCurrentAssets: getValue(balance, "CurrentAssets"),
                        totalAssets: getValue(balance, "TotalAssets"),
                        totalStockholderEquity: getValue(
                          balance,
                          "StockholdersEquity"
                        ),
                        minorityInterest: getValue(balance, "MinorityInterest"),
                      }
                    : { ...balance }
              ),
              cashflowStatementHistory: data.cashflowStatementHistory.map(
                (cashflow: any) =>
                  cashflow.version === 2
                    ? {
                        ...cashflow,
                        depreciation: getValue(cashflow, "Depreciation"),
                        totalCashflowsFromInvestingActivities: getValue(
                          cashflow,
                          "InvestingCashFlow"
                        ),
                        capitalExpenditures: getValue(
                          cashflow,
                          "PurchaseOfPPE"
                        ),
                        repurchaseOfStock: getValue(
                          cashflow,
                          "RepurchaseOfCapitalStock"
                        ),
                        dividendsPaid: getValue(cashflow, "CashDividendsPaid"),
                        changeToLiabilities: getValue(
                          cashflow,
                          "ChangeInPayable"
                        ),
                        changeToInventory: getValue(
                          cashflow,
                          "ChangeInInventory"
                        ),
                        changeToAccountReceivables: getValue(
                          cashflow,
                          "ChangeInReceivables"
                        ),
                        changeToOperatingActivities: getValue(
                          cashflow,
                          "ChangeInPrepaidAssets"
                        ),
                      }
                    : { ...cashflow }
              ),

              defaultKeyStatistics: data.defaultKeyStatistics.map((stat: any) =>
                stat.version === 2
                  ? {
                      ...stat,
                      floatShares: getValue(stat, "floatShares"),
                      sharesOutstanding: getValue(stat, "sharesOutstanding"),
                    }
                  : { ...stat }
              ),
            };

            dispatch({
              type: "FINANCIALS_RECEIVE",
              code: code,
              financials: adapted,
            });
          });
        dispatch({ type: "FINANCIALS_REQUEST", code: code });
      }
    },
};

export const reducer: Reducer<FinancialsState> = (
  state: FinancialsState | undefined,
  incomingAction: Action
): FinancialsState => {
  if (state === undefined) {
    return { isLoading: false };
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "FINANCIALS_REQUEST":
      return { ...state, isLoading: true, financials: undefined };
    case "FINANCIALS_RECEIVE":
      return {
        code: action.code,
        financials: action.financials,
        isLoading: false,
      };
    default:
      return state;
  }
};
