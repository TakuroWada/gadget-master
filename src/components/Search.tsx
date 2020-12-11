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
  const [searchType, setSearchType] = useState("nochoice");
  const [searchWord, setSearchWord] = useState("");

  const itemSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // firesoteから条件で絞った一覧を取得
    db.collection("users")
      .doc(user.uid)
      .collection("items")
      .orderBy("purchaseDate", "desc")
      .where(searchType, "==", searchWord)
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
    <div className={styles.search_section}>
      <h2 className={styles.title}>検索</h2>
      <form className={styles.search_form} onSubmit={itemSearch}>
        <h3 className={styles.sub_title}>検索項目を選択してキーワードを入力</h3>
        <select
          className={styles.select_box}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="nochoice">項目を選択 ▼</option>
          <option value="gadgetname">ガジェット名</option>
          <option value="maker">メーカー</option>
          <option value="category">カテゴリー</option>
        </select>
        <input
          className={styles.text_input}
          placeholder="キーワードを入力"
          type="text"
          autoFocus
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />

        <button
          type="submit"
          disabled={!searchWord && !searchType}
          className={
            searchWord && searchType !== "nochoice"
              ? styles.submit_button
              : styles.submit_button_false
          }
        >
          検索
        </button>
      </form>
    </div>
  );
};

export default Search;
