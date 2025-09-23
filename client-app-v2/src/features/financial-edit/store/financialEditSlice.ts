import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

export interface FinancialEditState {
  years: number[];
}

const initialState: FinancialEditState = {
  years: [1],
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
  },
});

export const { addYear, removeYear } = financialEditSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectYears = (state: RootState) => state.financialEdit.years;

export default financialEditSlice.reducer;
