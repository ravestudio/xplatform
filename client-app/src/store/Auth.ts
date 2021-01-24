import { Action, Reducer } from "redux";

import { AppThunkAction } from "./";

export interface AuthState {
  token?: string;
}

interface LoginAction {
  type: "AUTH/LOGIN";
}

type KnownAction = LoginAction;

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
    default:
      return state;
  }
};
