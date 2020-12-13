import React, { useState, useEffect, memo } from "react";
import styles from "../assets/scss/List.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import Item from "./Item";
import Search from "./Search";

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
  details: string;
  timestamp: any;
}

const List: React.FC = memo(() => {
  const user = useSelector(selectUser);
  const [searchFlg, setSearchFlg] = useState(false);
  const [allItems, setAllItems] = useState<ITEM[]>([
    {
      itemId: "",
      gadgetIcon: "",
      gadgetname: "",
      maker: "",
      category: "",
      price: "",
      purchaseDate: "",
      possessionStatus: "",
      username: "",
      details: "",
      timestamp: null,
    },
  ]);

  const [searchItems, setSearchItems] = useState<ITEM[]>([
    {
      itemId: "",
      gadgetIcon: "",
      gadgetname: "",
      maker: "",
      category: "",
      price: "",
      purchaseDate: "",
      possessionStatus: "",
      username: "",
      details: "",
      timestamp: null,
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("users")
      .doc(user.uid)
      .collection("items")
      .orderBy("purchaseDate", "desc")
      .onSnapshot((snapshot) =>
        setAllItems(
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
            details: doc.data().details,
            timestamp: doc.data().timestamp,
          }))
        )
      );
    return () => {
      unSub();
    };
  }, [user.uid]);

  let viewItems;

  if (searchFlg) {
    viewItems = searchItems;
  } else {
    viewItems = allItems;
  }

  return (
    <div className={styles.list}>
      <h1 className={styles.title}>ガジェット一覧</h1>
      <Search setSearchItems={setSearchItems} setSearchFlg={setSearchFlg} />
      {searchFlg ? (
        <p
          className={styles.allitem_link}
          onClick={() => {
            setSearchFlg(false);
          }}
        >
          全てのアイテムを表示
        </p>
      ) : (
        ""
      )}
      <div className={styles.item_area}>
        {viewItems.map((item) => (
          <Item
            key={item.itemId}
            itemId={item.itemId}
            gadgetIcon={item.gadgetIcon}
            gadgetname={item.gadgetname}
            maker={item.maker}
            category={item.category}
            price={item.price}
            purchaseDate={item.purchaseDate}
            possessionStatus={item.possessionStatus}
            username={item.username}
            details={item.details}
            timestamp={item.timestamp}
          />
        ))}
      </div>
    </div>
  );
});

export default List;
