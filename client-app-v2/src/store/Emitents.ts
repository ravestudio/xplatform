import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { v4 } from "uuid";

export interface EmitentsState {
  isLoading: boolean;
  emitents: Emitent[];
}

export interface Emitent {
  id: number;
  name: string;
  code: string;
}

interface RequestEmitentAction {
  type: "EMITENT_REQUEST";
}

interface ReceiveEmitentAction {
  type: "EMITENT_RECEIVE";
  emitents: Emitent[];
}

type KnownAction = RequestEmitentAction | ReceiveEmitentAction;

export const updateSecurity = (data: any) =>
  fetch(`/api/Security`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const actionCreators = {
  requestEmitents: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();

    fetch(`/api/emitent`)
      .then((response) => response.json() as Promise<Emitent[]>)
      .then((emitents) => {
        dispatch({
          type: "EMITENT_RECEIVE",
          emitents,
        });
      });

    dispatch({ type: "EMITENT_REQUEST" });
  },

  saveChanges:
    (changes: any): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      return fetch(`/api/emitent`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: appState.auth?.token as string,
        },
        body: JSON.stringify(changes.data),
      });
    },
};

const unloadedState: EmitentsState = {
  emitents: [],
  isLoading: false,
};

export const reducer: Reducer<EmitentsState> = (
  state: EmitentsState | undefined,
  incomingAction: Action
): EmitentsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "EMITENT_REQUEST":
      return { ...state, isLoading: true };
    case "EMITENT_RECEIVE":
      return {
        emitents: action.emitents,
        isLoading: false,
      };
    default:
      return state;
  }
};
