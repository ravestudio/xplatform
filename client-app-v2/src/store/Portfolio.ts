import { Action, Reducer } from "redux";
import { v4 } from "uuid";
import { AppThunkAction } from "./";

export interface PortfolioState {
  isLoading: boolean;
  viewType?: string;
  portfolio?: Portfolio;

  portfolioId?: number;
  portfolioList?: any[];
}

export interface Portfolio {
  items: PortfolioItem[];
  sharesTotal: number;
  bondsTotal: number;
  sharesPerc: number;
  bondsPerc: number;
}

export interface PortfolioItem {
  code: string;
  name: string;
  limit: number;
  cost: number;
  market: string;
}

interface RequestPortfolioAction {
  type: "REQUEST_PORTFOLIO";
  viewType: string;
}

interface ReceivePortfolioAction {
  type: "RECEIVE_PORTFOLIO";
  viewType: string;
  data: Portfolio;
}

interface RequestPortfolioListAction {
  type: "REQUEST_PORTFOLIO_LIST";
}

interface ReceivePortfolioListAction {
  type: "RECEIVE_PORTFOLIO_LIST";
  payload: any;
}

interface ChangeFilterPortfolioAction {
  type: "PORTFOLIO_CHANGE_FILTER";
  payload: any;
}

type KnownAction =
  | ChangeFilterPortfolioAction
  | RequestPortfolioAction
  | ReceivePortfolioAction
  | RequestPortfolioListAction
  | ReceivePortfolioListAction;

export const actionCreators = {
  changeFilter: (payload: any): KnownAction => ({
    type: "PORTFOLIO_CHANGE_FILTER",
    payload,
  }),
  requestPortfolio:
    (viewType: string, portfolioId: number): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      // Only load data if it's something we don't already have (and are not already loading)
      const appState = getState();
      if (
        appState &&
        appState.portfolio &&
        appState.portfolio.viewType !== viewType
      ) {
        fetch(`/api/portfolio/get?portfolioId=${portfolioId}`, {
          headers: {
            Authorization: appState.auth?.token as string,
          },
        })
          .then((response) => response.json() as Promise<Portfolio>)
          .then((data) => {
            dispatch({ type: "RECEIVE_PORTFOLIO", data: data, viewType });
          });

        dispatch({ type: "REQUEST_PORTFOLIO", viewType });
      }
    },

  requestPortfolioList:
    (): AppThunkAction<KnownAction> => (dispatch, getState) => {
      const appState = getState();

      fetch(`/api/portfolio/getPortfolioList`, {
        headers: {
          Authorization: appState.auth?.token as string,
        },
      })
        .then((response) => response.json() as Promise<Portfolio>)
        .then((data) => {
          dispatch({
            type: "RECEIVE_PORTFOLIO_LIST",
            payload: { portfolioList: data },
          });
        });

      dispatch({ type: "REQUEST_PORTFOLIO_LIST" });
    },
};

const unloadedState: PortfolioState = { isLoading: false };

export const reducer: Reducer<PortfolioState> = (
  state: PortfolioState | undefined,
  incomingAction: Action
): PortfolioState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "PORTFOLIO_CHANGE_FILTER":
      return { ...state, ...action.payload, filterId: v4() };

    case "REQUEST_PORTFOLIO_LIST":
      return {
        ...state,
        isLoading: true,
      };

    case "RECEIVE_PORTFOLIO_LIST":
      return {
        ...state,
        isLoading: false,
        ...action.payload,
      };

    case "REQUEST_PORTFOLIO":
      return {
        ...state,
        viewType: action.viewType,
        isLoading: true,
      };
    case "RECEIVE_PORTFOLIO":
      return {
        ...state,
        portfolio: action.data,
        viewType: action.viewType,
        isLoading: false,
      };
    default:
      return state;
  }
};
