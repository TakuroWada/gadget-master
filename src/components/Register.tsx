import React, { useState } from "react";
import styles from "../assets/scss/Register.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { storage, db } from "../firebase";
import firebase from "firebase/app";

const Register: React.FC = () => {
  const user = useSelector(selectUser);
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

  return (
    <>
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

          <input
            className={styles.text_input}
            placeholder="ガジェット名"
            type="text"
            autoFocus
            value={gadgetName}
            onChange={(e) => setGadgetName(e.target.value)}
          />

          <input
            className={styles.text_input}
            placeholder="メーカー"
            type="text"
            autoFocus
            value={maker}
            onChange={(e) => setMaker(e.target.value)}
          />

          <input
            className={styles.text_input}
            placeholder="カテゴリー"
            type="text"
            autoFocus
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            className={styles.text_input}
            placeholder="値段"
            type="text"
            autoFocus
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className={styles.text_input}
            placeholder="購入日"
            type="date"
            autoFocus
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />

          <input
            className={styles.text_input}
            placeholder="所持状況"
            type="text"
            autoFocus
            value={possessionStatus}
            onChange={(e) => setPossessionStatus(e.target.value)}
          />

          <textarea
            className={styles.text_input}
            placeholder="詳細"
            autoFocus
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <button
            className={styles.submit_button}
            type="submit"
            disabled={!gadgetName}
            /*   className={
            gadgetName ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          } */
          >
            新規登録
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
