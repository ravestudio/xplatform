import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { Settings } from "./model";
import { fetchSettings } from "./settingsAPI";

export interface SettingsState {
  value?: Settings;
  status: "idle" | "loading" | "failed";
}

const initialState: SettingsState = {
  status: "idle",
};

export const incrementAsync = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    const response = await fetchSettings();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

/*export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await userAPI.fetchAll();
  // Normalize the data before passing it to our reducer
  const normalized = normalize(response.data, [userEntity]);
  return normalized.entities;
});*/

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value = action.payload;
      });
  },
});

export const selectSettings = (state: RootState) => state.settings.value;

export default settingsSlice.reducer;
