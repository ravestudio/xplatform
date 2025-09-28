import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLogs } from "./balancingLogApi";
import { BalancingLog } from "../../entities/balancingLog";
import { RootState } from "../../app/store";

export interface BalancingLogState {
  value: BalancingLog[];
  status: "idle" | "loading" | "failed";
}

const initialState: BalancingLogState = {
  value: [],
  status: "idle",
};

export const loadAsync = createAsyncThunk(
  "balancingLog/fetchBalancingLog",
  async () => {
    const data = await fetchLogs().then(
      (resp) => resp.json() as Promise<BalancingLog[]>
    );

    return data;
  }
);
export const balancingLogSlice = createSlice({
  name: "balancingLog",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        state.value = action.payload;
      });
  },
});

export const selectBalancingLog = (state: RootState) =>
  state.balancingLog.value;

export default balancingLogSlice.reducer;
