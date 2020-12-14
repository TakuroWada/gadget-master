import React, { useState } from "react";
import styles from "../assets/scss/Item.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { storage, db } from "../firebase";
import firebase from "firebase/app";
import DeleteIcon from "../assets/scss/images/delete.png";
import Modal from "react-modal";

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

Modal.setAppElement("#root");

const Item: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
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

  const editItem = (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className={styles.item_card}>
      <div className={styles.item_icon}>
        <img src={props.gadgetIcon} alt="icon" />
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
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
      >
        <form onSubmit={editItem}>
          <div className={styles.icon_area}>
            <div className={styles.modal_icon}>
              <img src={props.gadgetIcon} alt="icon" />
            </div>
            <input
              className={styles.icon}
              type="file"
              onChange={onChangeIconHandler}
            />
          </div>

          <input
            type="text"
            className={styles.modal_title}
            value={gadgetName}
            onChange={(e) => setGadgetName(e.target.value)}
          />

          <div className={styles.modeal_flexbox}>
            <div className={styles.modal_input_area}>
              <div className={styles.modal_input}>
                <label>メーカー</label>
                <input
                  type="text"
                  value={maker}
                  onChange={(e) => setMaker(e.target.value)}
                />
              </div>

              <div className={styles.modal_input}>
                <label>カテゴリー</label>
                <select onChange={(e) => setCategory(e.target.value)}>
                  <option value={category}>{category}</option>
                  {categoryList.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modal_input}>
                <label>値段</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className={styles.modal_input}>
                <label>所持状況</label>
                <select onChange={(e) => setPossessionStatus(e.target.value)}>
                  <option value={possessionStatus}>{possessionStatus}</option>
                  {possessionStatusList.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modal_input}>
                <label>購入日</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modal_details}>
              <label>詳細</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
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
          }}
        >
          閉じる
        </button>
      </Modal>
    </div>
  );
};

export default Item;
