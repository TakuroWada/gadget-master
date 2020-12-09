import React, { useState } from "react";
import styles from "../assets/Register.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { storage, db } from "../firebase";
import { Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const Register: React.FC = () => {
  const user = useSelector(selectUser);
  const [gadgetIcon, setGadgetIcon] = useState<File | null>(null);
  const [gadgetName, setGadgetName] = useState("");
  const [maker, setMaker] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState("");
  const [possessionStatus, setPossessionStatus] = useState("");

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
  };

  return (
    <>
      <div className={styles.register}>
        <form onSubmit={registerNewItem}>
          <IconButton>
            <label>
              <AddAPhotoIcon
              /*  className={
                  gadgetIcon ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                } */
              />
              <input
                className={styles.add_icon}
                type="file"
                onChange={onChangeIconHandler}
              />
            </label>
          </IconButton>

          <input
            placeholder="ガジェット名"
            type="text"
            autoFocus
            value={gadgetName}
            onChange={(e) => setGadgetName(e.target.value)}
          />

          <input
            placeholder="メーカー"
            type="text"
            autoFocus
            value={maker}
            onChange={(e) => setMaker(e.target.value)}
          />

          <input
            placeholder="カテゴリー"
            type="text"
            autoFocus
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            placeholder="値段"
            type="text"
            autoFocus
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="購入日"
            type="date"
            autoFocus
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />

          <input
            placeholder="所持状況"
            type="text"
            autoFocus
            value={possessionStatus}
            onChange={(e) => setPossessionStatus(e.target.value)}
          />

          <Button
            type="submit"
            disabled={!gadgetName}
            /*   className={
            gadgetName ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          } */
          >
            新規登録
          </Button>
        </form>
      </div>
    </>
  );
};

export default Register;
