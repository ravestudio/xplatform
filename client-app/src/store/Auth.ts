import { Action, Reducer } from "redux";

import { AppThunkAction } from "./";

export interface AuthState {
  token?: string;
}

interface LoginAction {
  type: "AUTH/LOGIN";
}

interface ReceiveLoginAction {
  type: "AUTH/LOGIN_RECEIVE";
  payload: any;
}

type KnownAction = LoginAction | ReceiveLoginAction;

export const actionCreators = {
  Login: (username: string, password: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    fetch(`/api/Users/Authenticate`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((payload) => {
        dispatch({ type: "AUTH/LOGIN_RECEIVE", payload });
      });
  },
};

const unloadedState: AuthState = {};

export const reducer: Reducer<AuthState> = (
  state: AuthState | undefined,
  incomingAction: Action
): AuthState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "AUTH/LOGIN_RECEIVE":
      return {
        ...state,
        token: action.payload.token,
      };

    default:
      return state;
  }
};
