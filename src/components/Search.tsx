import React, { useState } from "react";
import styles from "../assets/Search.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";

interface ITEM {
  itemId: string;
  gadgetIcon: string;
  gadgetname: string;
  maker: string;
  category: string;
  price: string;
  purchaseDate: string;
  possessionStatus: string;
  username: string;
  timestamp: any;
}

interface PROPS {
  setSearchItems: React.Dispatch<React.SetStateAction<ITEM[]>>;
  setSearchFlg: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
  const [gadgetName, setGadgetName] = useState("");
  const [maker, setMaker] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate1, setPurchaseDate1] = useState("");
  const [purchaseDate2, setPurchaseDate2] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [possessionStatus, setPossessionStatus] = useState("");
  const [openSearchForm, setOpenSearchForm] = useState(false);

  const itemSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // firesoteから条件で絞った一覧を取得
    db.collection("users")
      .doc(user.uid)
      .collection("items")
      .orderBy("purchaseDate", "desc")
      .where("category", "==", "ノートpc")
      .onSnapshot((snapshot) =>
        props.setSearchItems(
          snapshot.docs.map((doc) => ({
            itemId: doc.id,
            gadgetIcon: doc.data().gadgetIcon,
            gadgetname: doc.data().gadgetname,
            maker: doc.data().maker,
            category: doc.data().category,
            price: doc.data().price,
            purchaseDate: doc.data().purchaseDate,
            possessionStatus: doc.data().possessionStatus,
            username: doc.data().username,
            timestamp: doc.data().timestamp,
          }))
        )
      );
    // 検索状態のフラグを立てる
    props.setSearchFlg(true);
  };

  return (
    <div>
      <div>
        <h2 className={styles.title}>条件検索</h2>
        <form className={styles.register_form} onSubmit={itemSearch}>
          <input
            className={styles.text_input}
            placeholder="ガジェット名"
            type="text"
            autoFocus
            value={gadgetName}
            onChange={(e) => setGadgetName(e.target.value)}
          />

          <p
            className={styles.post_commentIcon}
            onClick={() => setOpenSearchForm(!openSearchForm)}
          >
            {openSearchForm ? "▲ 閉じる" : "▼ 絞り込み条件追加"}
          </p>

          {openSearchForm && (
            <>
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
                placeholder="値段下限"
                type="text"
                autoFocus
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />

              <input
                className={styles.text_input}
                placeholder="値段上限"
                type="text"
                autoFocus
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />

              <input
                className={styles.text_input}
                placeholder="購入日1"
                type="date"
                autoFocus
                value={purchaseDate1}
                onChange={(e) => setPurchaseDate1(e.target.value)}
              />

              <input
                className={styles.text_input}
                placeholder="購入2"
                type="date"
                autoFocus
                value={purchaseDate2}
                onChange={(e) => setPurchaseDate2(e.target.value)}
              />

              <input
                className={styles.text_input}
                placeholder="所持状況"
                type="text"
                autoFocus
                value={possessionStatus}
                onChange={(e) => setPossessionStatus(e.target.value)}
              />
            </>
          )}

          <button
            className={styles.submit_button}
            type="submit"
            disabled={!gadgetName}
            /*   className={
            gadgetName ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          } */
          >
            検索
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;
