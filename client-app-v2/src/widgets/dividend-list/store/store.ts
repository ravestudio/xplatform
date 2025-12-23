import { Action, Reducer } from "redux";
import { AppThunkAction } from "../../../store";
import { v4 } from "uuid";
import { Dividend } from "../../../entities/dividend";

export interface DividendListState {
  isLoading: boolean;
  dividends: Dividend[];
  requestId?: string;
}

interface RequestDividendsAction {
  type: "DIVIDENDS_REQUEST";
  requestId: string;
}

interface ReceiveDividendsAction {
  type: "DIVIDENDS_RECEIVE";
  dividends: Dividend[];
}

interface ResetAction {
  type: "DIVIDENDS_RESET";
}

type KnownAction =
  | RequestDividendsAction
  | ReceiveDividendsAction
  | ResetAction;

export const actionCreators = {
  requestDividends:
    (code: string): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      if (appState.dividendList?.requestId === undefined) {
        fetch(`/api/dividend/?code=${code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: appState.auth?.token as string,
          },
        })
          .then((response) => response.json() as Promise<Dividend[]>)
          .then((data) => {
            dispatch({ type: "DIVIDENDS_RECEIVE", dividends: data });
          });

        dispatch({
          type: "DIVIDENDS_REQUEST",
          requestId: v4(),
        });
      }
    },

  reset: () => ({ type: "DIVIDENDS_RESET" }),
};

export const unloadedState: DividendListState = {
  dividends: [],
  isLoading: false,
};

export const reducer: Reducer<DividendListState> = (
  state: DividendListState | undefined,
  incomingAction: Action
): DividendListState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "DIVIDENDS_REQUEST":
      return { ...state, isLoading: true, requestId: action.requestId };

    case "DIVIDENDS_RECEIVE":
      return {
        ...state,
        dividends: action.dividends.slice(0, 10),
        isLoading: false,
      };

    case "DIVIDENDS_RESET":
      return unloadedState;

    default:
      return state;
  }
};
