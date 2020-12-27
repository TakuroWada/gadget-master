import React, { useState } from "react";
import styles from "../assets/scss/Register.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectApp } from "../features/appSlice";
import { useDispatch } from "react-redux";
import { loading, loaded } from "../features/appSlice";
import { storage, db } from "../firebase";
import firebase from "firebase/app";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  gadgetIcon: File;
  gadgetname: String;
  maker: String;
  category: String;
  price: String;
  purchaseDate: String;
  possessionStatus: String;
  details: String;
};

const Register: React.FC = () => {
  const user = useSelector(selectUser);
  const app = useSelector(selectApp);
  const { register, handleSubmit, errors, reset } = useForm();
  const dispatch = useDispatch();
  const [gadgetIcon, setGadgetIcon] = useState<File | null>(null);
  const [gadgetName, setGadgetName] = useState("");
  const [maker, setMaker] = useState("");
  const [category, setCategory] = useState("未設定");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState("");
  const [possessionStatus, setPossessionStatus] = useState("未設定");
  const [details, setDetails] = useState("");

  //アイコン変更時の関数
  const onChangeIconHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setGadgetIcon(e.target.files![0]);
      e.target.value = "";
    }
  };

  //登録ボタン押下時の関数
  const registerNewItem: SubmitHandler<FormValues> = (data: FormValues) => {
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
      (async () => {
        await db.collection("users").doc(user.uid).collection("items").add({
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
        dispatch(loaded());
        alert("登録が完了しました");
      })();
    }
    //登録後ステート初期化
    setGadgetIcon(null);
    setGadgetName("");
    setMaker("");
    setCategory("未設定");
    setPurchaseDate("");
    setPrice("");
    setPossessionStatus("未設定");
    setDetails("");

    //登録フォームリセット
    reset();
  };

  return (
    <>
      {app.loading && (
        <div className={styles.loading}>
          <p>登録中...</p>
          <img src={app.loadingImg} alt="icon" />
        </div>
      )}
      <div className={styles.register}>
        <h1 className={styles.title}>ガジェット新規登録</h1>
        <form
          className={styles.register_form}
          onSubmit={handleSubmit(registerNewItem)}
        >
          <label>
            <p
              className={gadgetIcon ? styles.add_icon_loaded : styles.add_icon}
            >
              {gadgetIcon ? "選択済み" : "画像選択"}
            </p>
            <input
              className={styles.icon}
              name="gadgetIcon"
              type="file"
              onChange={onChangeIconHandler}
            />
          </label>

          <div className={styles.input_area}>
            <div className={styles.input_item}>
              <label>ガジェット名</label>
              <input
                className={styles.text_input}
                name="gadgetName"
                ref={register({
                  required: "ガジェット名は必須項目です。",
                  maxLength: {
                    value: 20,
                    message: "20文字以内で指定してください",
                  },
                })}
                placeholder="例:iphone"
                type="text"
                value={gadgetName}
                onChange={(e) => setGadgetName(e.target.value)}
              />
              {errors.gadgetName && (
                <span className={styles.error_message}>
                  {errors.gadgetName.message}
                </span>
              )}
            </div>

            <div className={styles.input_item}>
              <label>メーカー</label>
              <input
                className={styles.text_input}
                name="maker"
                ref={register({
                  required: "メーカー名は必須項目です。",
                  maxLength: {
                    value: 10,
                    message: "10文字以内で指定してください",
                  },
                })}
                placeholder="例:apple"
                type="text"
                value={maker}
                onChange={(e) => setMaker(e.target.value)}
              />
              {errors.maker && (
                <span className={styles.error_message}>
                  {errors.maker.message}
                </span>
              )}
            </div>

            <div className={styles.input_item}>
              <label>カテゴリー</label>
              <select
                className={styles.text_input}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option hidden>カテゴリーを選択 ▼</option>
                {app.categoryList.map((item) => (
                  <option value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className={styles.input_item}>
              <label>値段</label>
              <input
                className={styles.text_input}
                name="price"
                ref={register({
                  required: "値段は必須項目です。",
                  maxLength: {
                    value: 10,
                    message: "10文字以内で指定してください",
                  },
                })}
                placeholder="例:80000"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && (
                <span className={styles.error_message}>
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className={styles.input_item}>
              <label>購入日</label>
              <input
                className={styles.text_input}
                name="purchaseDate"
                ref={register({ required: "購入日は必須項目です。" })}
                placeholder="例:2020-12-01"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
              {errors.purchaseDate && (
                <span className={styles.error_message}>
                  {errors.purchaseDate.message}
                </span>
              )}
            </div>

            <div className={styles.input_item}>
              <label>所持状況</label>
              <select
                className={styles.text_input}
                name="possessionStatus"
                onChange={(e) => setPossessionStatus(e.target.value)}
              >
                <option hidden>状況を選択 ▼</option>
                {app.possessionStatusList.map((item) => (
                  <option value={item}>{item}</option>
                ))}
              </select>
              {errors.possessionStatus && (
                <span className={styles.error_message}>
                  {errors.possessionStatus.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.input_details}>
            <label>詳細</label>
            <textarea
              className={styles.text_area}
              name="datails"
              ref={register({
                maxLength: {
                  value: 50,
                  message: "50文字以内で指定してください",
                },
              })}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            {errors.datails && (
              <span className={styles.error_message}>
                {errors.datails.message}
              </span>
            )}
          </div>

          <button className={styles.submit_button} type="submit">
            新規登録
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
