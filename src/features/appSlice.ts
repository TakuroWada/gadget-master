import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import LoadingIcon from "../assets/images/loading.gif";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    app: { loading: false, loadingImg: LoadingIcon },
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
