import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

export interface FinancialEditState {
  years: number[];
  actions: TAction[];
}

const initialState: FinancialEditState = {
  years: [1],
  actions: [],
};

export type TAction = {
  type: "save";
};

export const financialEditSlice = createSlice({
  name: "financialEdit",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addYear: (state) => {
      state.years = [
        ...state.years,
        state.years.length > 0 ? Math.max(...state.years) + 1 : 1,
      ];
    },
    removeYear: (state, action: PayloadAction<number>) => {
      state.years = state.years.filter((item) => item !== action.payload);
    },
    save: (state) => {
      state.actions = [...state.actions, { type: "save" }];
    },
  },
});

export const { addYear, removeYear, save } = financialEditSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectYears = (state: RootState) => state.financialEdit.years;

export const selectActions = (state: RootState) => state.financialEdit.actions;

export default financialEditSlice.reducer;
