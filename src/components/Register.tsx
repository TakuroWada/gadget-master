import React, { useState } from "react";
import styles from "../assets/scss/Register.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectApp } from "../features/appSlice";
import { useDispatch } from "react-redux";
import { loading, loaded } from "../features/appSlice";
import { storage, db } from "../firebase";
import firebase from "firebase/app";

const Register: React.FC = () => {
  const user = useSelector(selectUser);
  const app = useSelector(selectApp);
  const dispatch = useDispatch();
  const [gadgetIcon, setGadgetIcon] = useState<File | null>(null);
  const [gadgetName, setGadgetName] = useState("");
  const [maker, setMaker] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState("");
  const [possessionStatus, setPossessionStatus] = useState("");
  const [details, setDetails] = useState("");

  //アイコン変更時の関数
  const onChangeIconHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setGadgetIcon(e.target.files![0]);
      e.target.value = "";
    }
  };

  //登録ボタン押下時の関数
  const registerNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(loading());
    //アイコンが指定された場合
    if (gadgetIcon) {
      //登録ファイル名を一意にする処理
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + gadgetIcon.name;

      //アイコン画像をfirebaseのstorageに保存/ログイン中ユーザーのドキュメントにアイテムを登録
      const uploadGadgetIcon = storage
        .ref(`images/${fileName}`)
        .put(gadgetIcon);
      uploadGadgetIcon.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db
                .collection("users")
                .doc(user.uid)
                .collection("items")
                .add({
                  gadgetIcon: url,
                  gadgetname: gadgetName,
                  maker: maker,
                  category: category,
                  price: price,
                  purchaseDate: purchaseDate,
                  possessionStatus: possessionStatus,
                  username: user.displayName,
                  details: details,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
              dispatch(loaded());
              alert("登録が完了しました");
            })
            .catch((error) => {
              alert(error.message);
            });
        }
      );
    } else {
      //アイコンが指定されていない場合
      db.collection("users").doc(user.uid).collection("items").add({
        gadgetIcon: "",
        gadgetname: gadgetName,
        maker: maker,
        category: category,
        price: price,
        purchaseDate: purchaseDate,
        possessionStatus: possessionStatus,
        username: user.displayName,
        details: details,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    //登録後ステート初期化
    setGadgetIcon(null);
    setGadgetName("");
    setMaker("");
    setCategory("");
    setPurchaseDate("");
    setPrice("");
    setPossessionStatus("");
    setDetails("");
  };

  const categoryList = [
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

  const possessionStatusList = ["所持中", "売却済", "譲渡済", "なくした"];

  return (
    <>
      {app.loading && <p className={styles.loading}>登録中...</p>}
      <div className={styles.register}>
        <h1 className={styles.title}>ガジェット新規登録</h1>
        <form className={styles.register_form} onSubmit={registerNewItem}>
          <label>
            <p
              className={gadgetIcon ? styles.add_icon_loaded : styles.add_icon}
            >
              {gadgetIcon ? "選択済み" : "画像選択"}
            </p>
            <input
              className={styles.icon}
              type="file"
              onChange={onChangeIconHandler}
            />
          </label>

          <div className={styles.input_area}>
            <div className={styles.input_item}>
              <label>ガジェット名</label>
              <input
                className={styles.text_input}
                placeholder="ガジェット名"
                type="text"
                value={gadgetName}
                onChange={(e) => setGadgetName(e.target.value)}
              />
            </div>

            <div className={styles.input_item}>
              <label>メーカー</label>
              <input
                className={styles.text_input}
                placeholder="メーカー"
                type="text"
                value={maker}
                onChange={(e) => setMaker(e.target.value)}
              />
            </div>

            <div className={styles.input_item}>
              <label>カテゴリー</label>
              <select
                className={styles.text_input}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option hidden value="未設定">
                  カテゴリーを選択 ▼
                </option>
                {categoryList.map((item) => (
                  <option value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className={styles.input_item}>
              <label>値段</label>
              <input
                className={styles.text_input}
                placeholder="値段"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className={styles.input_item}>
              <label>購入日</label>
              <input
                className={styles.text_input}
                placeholder="購入日"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            <div className={styles.input_item}>
              <label>所持状況</label>
              <select
                className={styles.text_input}
                onChange={(e) => setPossessionStatus(e.target.value)}
              >
                <option hidden value="未設定">
                  状況を選択 ▼
                </option>
                {possessionStatusList.map((item) => (
                  <option value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.input_details}>
            <label>詳細</label>
            <textarea
              className={styles.text_area}
              placeholder="詳細"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <button
            className={
              gadgetName && maker && price && purchaseDate
                ? styles.submit_button
                : styles.submit_button_false
            }
            type="submit"
            disabled={!gadgetName && !maker && !price && !purchaseDate}
          >
            新規登録
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
