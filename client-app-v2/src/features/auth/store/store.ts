import { Action, Reducer } from "redux";

import { AppThunkAction } from "../../../store";

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

export const login = (username: string, password: string) =>
  fetch(`/api/Users/Authenticate`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const actionCreators = {
  SetToken: (payload: any) => ({ type: "AUTH/LOGIN_RECEIVE", payload }),
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
