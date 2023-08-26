import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface SystemState {
  isLoading: boolean;
  temperature?: Temperature;
}

export interface Temperature {
  t: number;
  unit: string;
}

interface RequestTemperatureAction {
  type: "TEMPERATURE_REQUEST";
}

interface ReceiveTemperatureAction {
  type: "TEMPERATURE_RECEIVE";
  value: Temperature;
}

type KnownAction = RequestTemperatureAction | ReceiveTemperatureAction;

export const actionCreators = {
  requestData: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`/api/RaspiTemperature/GetTemperature`)
      .then((response) => response.json() as Promise<Temperature>)
      .then((data) => {
        dispatch({ type: "TEMPERATURE_RECEIVE", value: data });
      });

    dispatch({ type: "TEMPERATURE_REQUEST" });
  },
};

const unloadedState: SystemState = {
  temperature: undefined,
  isLoading: false,
};

export const reducer: Reducer<SystemState> = (
  state: SystemState | undefined,
  incomingAction: Action
): SystemState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "TEMPERATURE_REQUEST":
      return { ...state, isLoading: true };
    case "TEMPERATURE_RECEIVE":
      return {
        temperature: action.value,
        isLoading: false,
      };
    default:
      return state;
  }
};
