import React, { useState } from "react";
import styles from "../assets/scss/Item.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectApp } from "../features/appSlice";
import { storage, db } from "../firebase";
import firebase from "firebase/app";
import Modal from "react-modal";
import DefaultIcon from "../assets/images/default_icon.gif";
import { useForm, SubmitHandler } from "react-hook-form";
interface PROPS {
  itemId: string;
  gadgetIcon: string;
  gadgetname: string;
  maker: string;
  category: string;
  price: string;
  purchaseDate: string;
  possessionStatus: string;
  username: string;
  details: string;
  timestamp: any;
}

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

Modal.setAppElement("#root");

const Item: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
  const app = useSelector(selectApp);
  const { register, handleSubmit, errors, reset } = useForm();
  const [openModal, setOpenModal] = React.useState(false);
  const [gadgetIcon, setGadgetIcon] = useState<File | null>(null);
  const [gadgetName, setGadgetName] = useState(props.gadgetname);
  const [maker, setMaker] = useState(props.maker);
  const [category, setCategory] = useState(props.category);
  const [purchaseDate, setPurchaseDate] = useState(props.purchaseDate);
  const [price, setPrice] = useState(props.price);
  const [possessionStatus, setPossessionStatus] = useState(
    props.possessionStatus
  );
  const [details, setDetails] = useState(props.details);

  //アイテム削除関数
  const deleteItem = (itemId: string) => {
    const deleteCheck = window.confirm("削除してよろしいですか？");
    if (deleteCheck) {
      db.collection("users")
        .doc(user.uid)
        .collection("items")
        .doc(itemId)
        .delete()
        .then(() => {
          alert("削除しました");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  const editItem: SubmitHandler<FormValues> = (data: FormValues) => {
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
                .doc(props.itemId)
                .update({
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
      db.collection("users")
        .doc(user.uid)
        .collection("items")
        .doc(props.itemId)
        .update({
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
    setOpenModal(false);
    window.alert("更新が完了しました");
  };

  //アイコン変更時の関数
  const onChangeIconHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setGadgetIcon(e.target.files![0]);
      e.target.value = "";
    }
  };

  const resetInputField = () => {
    setGadgetIcon(null);
    setGadgetName(props.gadgetname);
    setCategory(props.category);
    setMaker(props.maker);
    setPrice(props.price);
    setPossessionStatus(props.possessionStatus);
    setPurchaseDate(props.purchaseDate);
    setDetails(props.details);
  };

  return (
    <div className={styles.item_card}>
      <div className={styles.item_icon}>
        {props.gadgetIcon !== "" ? (
          <img src={props.gadgetIcon} alt="icon" />
        ) : (
          <img src={DefaultIcon} alt="icon" />
        )}
      </div>

      <div className={styles.item_text_area}>
        <h3 className={styles.item_name}>{props.gadgetname}</h3>
        <ul>
          <li>{props.maker}</li>
          <li>¥{props.price}</li>
          <li>{props.possessionStatus}</li>
          <li>購入日:{props.purchaseDate}</li>
        </ul>
      </div>

      <button
        className={styles.details_button}
        type="button"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        詳細
      </button>

      <Modal
        className={styles.modal}
        overlayClassName={styles.overlay}
        isOpen={openModal}
        onRequestClose={() => {
          setOpenModal(false);
          reset();
          resetInputField();
        }}
      >
        <form onSubmit={handleSubmit(editItem)}>
          <label className={styles.icon_area}>
            <div className={styles.modal_icon}>
              {gadgetIcon ? (
                <div className={styles.modal_icon_true}>選択済</div>
              ) : props.gadgetIcon !== "" ? (
                <img src={props.gadgetIcon} alt="icon" />
              ) : (
                <img src={DefaultIcon} alt="icon" />
              )}
            </div>
            <input
              className={styles.icon_hidden}
              type="file"
              onChange={onChangeIconHandler}
            />
          </label>

          <input
            type="text"
            className={styles.modal_title}
            name="gadgetName"
            ref={register({
              required: "ガジェット名は必須項目です。",
              maxLength: {
                value: 20,
                message: "20文字以内で指定してください",
              },
            })}
            value={gadgetName}
            onChange={(e) => setGadgetName(e.target.value)}
          />
          {errors.gadgetName && (
            <span className={styles.error_message}>
              {errors.gadgetName.message}
            </span>
          )}

          <div className={styles.modeal_flexbox}>
            <div className={styles.modal_input_area}>
              <div className={styles.modal_input}>
                <label>メーカー</label>
                <input
                  name="maker"
                  ref={register({
                    required: "メーカー名は必須項目です。",
                    maxLength: {
                      value: 10,
                      message: "10文字以内で指定してください",
                    },
                  })}
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

              <div className={styles.modal_input}>
                <label>カテゴリー</label>
                <select
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value={category}>{category}</option>
                  {app.categoryList.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modal_input}>
                <label>値段</label>
                <input
                  name="price"
                  ref={register({
                    required: "値段は必須項目です。",
                    maxLength: {
                      value: 10,
                      message: "10文字以内で指定してください",
                    },
                  })}
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

              <div className={styles.modal_input}>
                <label>所持状況</label>
                <select
                  name="possessionStatus"
                  onChange={(e) => setPossessionStatus(e.target.value)}
                >
                  <option value={possessionStatus}>{possessionStatus}</option>
                  {app.possessionStatusList.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modal_input}>
                <label>購入日</label>
                <input
                  name="purchaseDate"
                  ref={register({ required: "購入日は必須項目です。" })}
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
            </div>

            <div className={styles.modal_details}>
              <label>詳細</label>
              <textarea
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
          </div>

          <div className={styles.modal_button_area}>
            <button className={styles.submit_button} type="submit">
              変更保存
            </button>
            <button
              type="button"
              className={styles.delete_button}
              onClick={() => {
                deleteItem(props.itemId);
              }}
            >
              削除
            </button>
          </div>
        </form>

        <button
          className={styles.modal_close_btn}
          type="button"
          onClick={() => {
            setOpenModal(false);
            reset();
            resetInputField();
          }}
        >
          閉じる
        </button>
      </Modal>
    </div>
  );
};

export default Item;
