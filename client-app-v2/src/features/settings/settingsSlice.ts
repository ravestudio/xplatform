import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { Settings } from "./model";
import { fetchSettings, saveSettings } from "./settingsAPI";

export interface SettingsState {
  value?: Settings;
  status: "idle" | "loading" | "failed";
}

const initialState: SettingsState = {
  status: "idle",
};

export const loadAsync = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    const response = await fetchSettings();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const saveAsync = createAsyncThunk("settings/saveSettings", async () => {
  const response = await saveSettings();
  // The value we return becomes the `fulfilled` action payload
  return response;
});

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
      .addCase(loadAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value = action.payload;
      })

      .addCase(saveAsync.fulfilled, (state, action) => {
        state.status = "idle";
      });
  },
});

export const selectSettings = (state: RootState) => state.settings.value;

export default settingsSlice.reducer;
