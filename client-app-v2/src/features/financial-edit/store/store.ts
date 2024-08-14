import { Action, Reducer } from "redux";

export interface FinancialEditState {
  years: number[];
}

interface AddYearAction {
  type: "FINANCIALEDIT/ADDYEAR";
}

type KnownAction = AddYearAction;

const unloadedState: FinancialEditState = {
  years: [],
};

export const actionCreators = {
  AddYear: () => ({ type: "FINANCIALEDIT/ADDYEAR" }),
};

export const reducer: Reducer<FinancialEditState> = (
  state: FinancialEditState | undefined,
  incomingAction: Action
): FinancialEditState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "FINANCIALEDIT/ADDYEAR":
      return {
        ...state,
        years: [...state.years, 0],
      };

    default:
      return state;
  }
};
