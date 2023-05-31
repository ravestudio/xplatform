import { Action, Reducer } from "redux";

import { AppThunkAction } from "./";

import { parseISO } from "date-fns";

export interface ImportState {
  isLoading: boolean;
  importType?: string;

  deals: Deal[];
  securities: Security[];
  yahooFinancials: YahooFinancial[];
}

export interface Deal {
  number: number;
  board: string;
  symbol: string;
  operation: string;
  date: string;
  delivery_date: string;
  price: number;
  count: number;
  volume: number;
  nkd: number;
  client: string;
}

export interface Security {
  id: string;
  isin: string;
  ticker: string;
  currency: string;
  name: string;
  board: string;
  emitent: string;
  processed: boolean;
}

export interface YahooFinancial {
  id: string;
  code: string;
  region: string;
  name: string;
  loadDate?: Date;
  lastFinance?: Date;
  status: string;
}

interface RequestDataAction {
  type: "IMPORT/DATA_REQUEST";
  importType: string;
}

interface ReceiveDataAction {
  type: "IMPORT/DATA_RECEIVE";
  importType: string;
  payload: any;
}

type KnownAction = RequestDataAction | ReceiveDataAction;

export const actionCreators = {
  RequestDataAction:
    (importType: string): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      if (importType === "stock") {
        fetch(`/api/SecurityRaw`, {
          headers: {
            Authorization: appState.auth?.token as string,
          },
        })
          .then((response) => response.json())
          .then((payload) => {
            dispatch({ type: "IMPORT/DATA_RECEIVE", importType, payload });
          });
      }

      if (importType === "deal") {
        fetch(`/api/dealRaw`, {
          headers: {
            Authorization: appState.auth?.token as string,
          },
        })
          .then((response) => response.json())
          .then((payload) => {
            dispatch({ type: "IMPORT/DATA_RECEIVE", importType, payload });
          });
      }

      if (importType === "financial") {
        fetch(`/api/Yahoo`)
          .then((response) => response.json())
          .then((payload) => {
            dispatch({ type: "IMPORT/DATA_RECEIVE", importType, payload });
          });
      }

      dispatch({ type: "IMPORT/DATA_REQUEST", importType });
    },

  ImportDataAction:
    (importType: string, isin: string[]): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      if (importType === "stock") {
        fetch(`/api/Import`, {
          method: "POST",
          body: JSON.stringify({
            object: "stock",
            isin,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: appState.auth?.token as string,
          },
        }).then((response) => {
          console.log(response.status);
        });
      }

      if (importType === "deal") {
        fetch(`/api/Import`, {
          method: "POST",
          body: JSON.stringify({
            object: "deal",
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: appState.auth?.token as string,
          },
        }).then((response) => {
          console.log(response.status);
        });
      }

      if (importType === "financial") {
        fetch(`/api/Yahoo`, {
          method: "POST",
          body: JSON.stringify({
            Type: "init",
            Codes: isin,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          console.log(response.status);
        });
      }
    },

  ProcessData:
    (importType: string, code: string[]): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      if (importType === "financial") {
        fetch(`/api/Yahoo`, {
          method: "POST",
          body: JSON.stringify({
            Type: "process",
            Codes: code,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: appState.auth?.token as string,
          },
        }).then((response) => {
          console.log(response.status);
        });
      }

      if (importType === "deal") {
        fetch(`/api/position/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: appState.auth?.token as string,
          },
        }).then((response) => {
          console.log(response.status);
        });
      }
    },

  RefreshList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`/api/SecurityRaw`, {
      method: "POST",
    }).then((response) => {
      console.log(response.status);
    });
  },
};

const unloadedState: ImportState = {
  importType: "stock",
  deals: [],
  securities: [],
  yahooFinancials: [],
  isLoading: false,
};

export const reducer: Reducer<ImportState> = (
  state: ImportState | undefined,
  incomingAction: Action
): ImportState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "IMPORT/DATA_REQUEST":
      return {
        ...state,
        importType: action.importType,
        isLoading: true,
      };
    case "IMPORT/DATA_RECEIVE":
      return {
        ...state,
        importType: action.importType,
        securities:
          action.importType === "stock"
            ? action.payload.map((item: any) => ({ ...item, id: item.isin }))
            : [],
        deals:
          action.importType === "deal"
            ? action.payload.map((item: any) => ({ ...item }))
            : [],
        yahooFinancials:
          action.importType === "financial"
            ? action.payload.map((item: any) => ({
                ...item,
                id: item.code,
                /*loadDate:
                  item.loadDate !== null ? parseISO(item.loadDate) : null,
                lastFinance:
                  item.lastFinance !== null ? parseISO(item.lastFinance) : null,*/
              }))
            : [],
        isLoading: false,
      };
    default:
      return state;
  }
};
