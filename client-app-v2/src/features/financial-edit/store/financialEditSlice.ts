import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { IValues } from "../../../entities/form";
import { FinancialModel } from "../../../entities/financial";

export interface FinancialEditState {
  years: number[];
  formValue: IValues | null;
  actions: UIAction[];
}

const initialState: FinancialEditState = {
  years: [1],
  formValue: null,
  actions: [],
};

export type UIAction = {
  type: "saveDraft" | "loadStored" | "loadDraft";
};

export type FinData = {
  years: number[];
  values: IValues;
};

export type FinancialPayload = {
  code: string;
  currency: string;
  unit: string;
  financials: { year: number; data: FinancialModel }[];
};

export const saveFinancial = (payload: FinancialPayload) =>
  fetch(`/api/financial`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const loadStoredAsync = createAsyncThunk<
  FinancialPayload,
  { code: string; years: number[] }
>("counter/loadStored", async (args) => {
  const response = await fetch(`/api/financial/LoadStored`, {
    method: "Post",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json() as Promise<FinancialPayload>);
  // The value we return becomes the `fulfilled` action payload
  return response;
});

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
    uiAction: (state, action: PayloadAction<UIAction>) => {
      state.actions = [...state.actions, action.payload];
    },
    removeUiAction: (state, action: PayloadAction<UIAction>) => {
      state.actions = state.actions.filter(
        (item) => item.type !== action.payload.type
      );
    },
    loadForm: (state, action: PayloadAction<FinData>) => {
      state.years = action.payload.years;
      state.formValue = action.payload.values;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadStoredAsync.fulfilled, (state, action) => {
      //state.formValue = action.payload.values;
    });
  },
});

export const { addYear, removeYear, uiAction, removeUiAction, loadForm } =
  financialEditSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectYears = (state: RootState) => state.financialEdit.years;

export const selectActions = (state: RootState) => state.financialEdit.actions;

export const selectFinData = (state: RootState) =>
  state.financialEdit.formValue;

export default financialEditSlice.reducer;
