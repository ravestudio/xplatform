import { Action, Reducer } from "redux";

export interface FinancialListState {
  time1: string;
  time2: string;
}

interface SaveTimeAction {
  type: "FINANCIAL_SAVETIME";
  time1?: string;
  time2?: string;
}

type KnownAction = SaveTimeAction;

export const actionCreators = {
  save: (data: { time1?: string; time2?: string }) => ({
    type: "FINANCIAL_SAVETIME",
    ...data,
  }),
};

export const unloadedState: FinancialListState = {
  time1: "0200",
  time2: "0300",
};

export const reducer: Reducer<FinancialListState> = (
  state: FinancialListState | undefined,
  incomingAction: Action
): FinancialListState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "FINANCIAL_SAVETIME":
      return {
        ...state,
        time1: action.time1 ? action.time1 : state.time1,
        time2: action.time2 ? action.time2 : state.time2,
      };

    default:
      return state;
  }
};
