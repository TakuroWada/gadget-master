import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import LoadingIcon from "../assets/images/loading.gif";

const category = [
  "スマートフォン",
  "タブレット",
  "スマホ周辺機器",
  "PC",
  "キーボード",
  "マウス",
  "ディスプレイ",
  "その他PC周辺機器",
  "イヤホン",
  "ヘッドホン",
  "スピーカー",
  "マイク",
  "スマートウォッチ",
  "カメラ",
  "レンズ",
  "その他カメラ周辺機器",
  "ケーブル類",
  "その他周辺機器",
  "その他",
];

const possessionStatus = ["所持中", "売却済", "譲渡済", "なくした"];

export const appSlice = createSlice({
  name: "app",
  initialState: {
    app: {
      loading: false,
      loadingImg: LoadingIcon,
      categoryList: category,
      possessionStatusList: possessionStatus,
    },
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
