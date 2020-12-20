import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    app: { loading: false },
  },
  reducers: {
    loading: (state) => {
      state.app.loading = true;
    },
    loaded: (state) => {
      state.app.loading = false;
    },
  },
});

export const { loading, loaded } = appSlice.actions;
export const selectApp = (state: RootState) => state.app.app;
export default appSlice.reducer;
