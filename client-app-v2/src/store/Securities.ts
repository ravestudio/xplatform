import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface SecuritiesState {
  isLoading: boolean;
  securities: Security[];

  editModel?: any;
}

export interface Security {
  id: number;
  name: string;
  type: string;
}

export interface Share extends Security {}

export interface Bond extends Security {
  nominalPrice: number;
}

interface RequestSecurityAction {
  type: "SECURITY_REQUEST";
}

interface ReceiveSecurityAction {
  type: "SECURITY_RECEIVE";
  securities: Security[];
}

interface ReceiveEditModelAction {
  type: "EDIT_MODEL_RECEIVE";
  model: any;
}

interface updSuccesAction {
  type: "SECURITY/UPD_SUCCES";
}

type KnownAction =
  | RequestSecurityAction
  | ReceiveSecurityAction
  | ReceiveEditModelAction
  | updSuccesAction;

export const updateSecurity = (data: any) =>
  fetch(`/api/Security`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const actionCreators = {
  updateSucces: () => ({ type: "SECURITY/UPD_SUCCES" }),
  requestSecurities:
    (): AppThunkAction<KnownAction> => (dispatch, getState) => {
      const appState = getState();

      const shares = fetch(`/api/share`).then(
        (response) => response.json() as Promise<Security[]>
      );

      const bonds = fetch(`/api/bond`).then(
        (response) => response.json() as Promise<Security[]>
      );

      const etf = fetch(`/api/etf`).then(
        (response) => response.json() as Promise<Security[]>
      );

      Promise.all([shares, bonds, etf]).then(([shares, bonds, etf]) => {
        dispatch({
          type: "SECURITY_RECEIVE",
          securities: [...shares, ...bonds, ...etf],
        });
      });

      dispatch({ type: "SECURITY_REQUEST" });
    },

  requestEditModel:
    (code: string): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      fetch(`/api/security/${code}`)
        .then((response) => response.json() as Promise<any>)
        .then((model) => dispatch({ type: "EDIT_MODEL_RECEIVE", model }));
    },
};

const unloadedState: SecuritiesState = {
  securities: [],
  editModel: undefined,
  isLoading: false,
};

export const reducer: Reducer<SecuritiesState> = (
  state: SecuritiesState | undefined,
  incomingAction: Action
): SecuritiesState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "SECURITY_REQUEST":
      return { ...state, isLoading: true };
    case "SECURITY_RECEIVE":
      return {
        securities: action.securities,
        isLoading: false,
      };
    case "SECURITY/UPD_SUCCES":
      return {
        ...state,
        editModel: undefined,
      };

    case "EDIT_MODEL_RECEIVE":
      return { ...state, editModel: action.model };
    default:
      return state;
  }
};
