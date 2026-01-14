import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchIncome, fetchSales } from "./incomeApi";
import { SalesItem } from "../../entities/sales";
import { RootState } from "../../app/store";
import { IncomeItem } from "../../entities/income";

export interface IncomeState {
  year: number | null;
  sales: SalesItem[];
  income: IncomeItem[];
  status: "idle" | "loading" | "failed";
}

const initialState: IncomeState = {
  year: null,
  sales: [],
  income: [],
  status: "idle",
};

export const loadAsync = createAsyncThunk(
  "income/fetchData",
  async (year: number, { getState }) => {
    const appState: RootState = getState() as RootState;
    const token = appState.auth?.token as string;

    const sales = await fetchSales(year).then(
      (resp) => resp.json() as Promise<SalesItem[]>
    );

    const income = await fetchIncome(year, { token }).then(
      (resp) => resp.json() as Promise<IncomeItem[]>
    );

    return { sales, income };
  }
);

export const IncomeSlice = createSlice({
  name: "Income",
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadAsync.fulfilled, (state, action) => {
        state.sales = action.payload.sales;
        state.income = action.payload.income;
      });
  },
});

export const { setYear } = IncomeSlice.actions;

export const selectSales = (state: RootState) => state.income.sales;
export const selectIncome = (state: RootState) => state.income.income;
export const selectYear = (state: RootState) => state.income.year;

export default IncomeSlice.reducer;
