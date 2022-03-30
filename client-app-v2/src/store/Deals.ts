import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface DealsState {
  isLoading: boolean;
  deals: Deal[];
}

export interface Deal {
  id: number;
  accountId: number;
  number: number;
  operation: number;
  date: string;
  deliveryDate: string;
  price: number;
  count: number;
  volume: number;
  securityId: number;
  nkd: number;
}

interface RequestDealsAction {
  type: "DEALS_REQUEST";
}

interface ReceiveDealsAction {
  type: "DEALS_RECEIVE";
  deals: Deal[];
}

type KnownAction = ReceiveDealsAction | RequestDealsAction;

export const actionCreators = {
  requestDeals: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();

    fetch(`/api/deal`)
      .then((response) => response.json() as Promise<Deal[]>)
      .then((data) => {
        dispatch({ type: "DEALS_RECEIVE", deals: data });
      });

    dispatch({ type: "DEALS_REQUEST" });
  },

  postDeal:
    (deal: any): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      fetch(`/api/deal`, {
        method: "POST",
        body: JSON.stringify(deal),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        console.log(response.status);

        if (response.status == 200) {
          //dispatch(reset('dealForm'))
        }
      });
      /*.then(response => response.json() as Promise<any>)
        .then(data => {
            console.log(data)
        });*/

      console.log(deal);
    },
};

const unloadedState: DealsState = {
  deals: [],
  isLoading: false,
};

export const reducer: Reducer<DealsState> = (
  state: DealsState | undefined,
  incomingAction: Action
): DealsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "DEALS_REQUEST":
      return { ...state, isLoading: true };
    case "DEALS_RECEIVE":
      return {
        deals: action.deals,
        isLoading: false,
      };
    default:
      return state;
  }
};
