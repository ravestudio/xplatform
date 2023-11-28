import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface ProductsState {
  isLoading: boolean;
  products: Product[];
}

export interface Product {
  productId: string;
  positions: ProductPosition[];
  profit: number;
}

export interface ProductPosition {
  code: string;
  date: Date;
  limit: number;
  price: number;
  cost: number;
  currentPrice: number;
  currentCost: number;
  profit: number;
}

interface RequestProductsAction {
  type: "PRODUCTS_REQUEST";
}

interface ReceiveProductsAction {
  type: "PRODUCTS_RECEIVE";
  products: Product[];
}

type KnownAction = RequestProductsAction | ReceiveProductsAction;

export const actionCreators = {
  requestProducts: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`/api/product/`)
      .then((response) => response.json() as Promise<Product[]>)
      .then((data) => {
        dispatch({ type: "PRODUCTS_RECEIVE", products: data });
      });

    dispatch({
      type: "PRODUCTS_REQUEST",
    });
  },
};

const unloadedState: ProductsState = {
  products: [],
  isLoading: false,
};

export const reducer: Reducer<ProductsState> = (
  state: ProductsState | undefined,
  incomingAction: Action
): ProductsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "PRODUCTS_REQUEST":
      return { ...state, isLoading: true };

    case "PRODUCTS_RECEIVE":
      return { ...state, products: action.products, isLoading: false };

    default:
      return state;
  }
};
