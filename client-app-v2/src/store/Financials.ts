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
            dispatch({
              type: "FINANCIALS_RECEIVE",
              code: code,
              financials: data,
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
