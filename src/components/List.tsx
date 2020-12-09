import React, { useState, useEffect } from "react";
import styles from "../assets/List.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import Item from "./Item";

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

const List: React.FC = () => {
  const user = useSelector(selectUser);
  const [items, setItems] = useState<ITEM[]>([
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
        setItems(
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
    return () => {
      unSub();
    };
  }, [user.uid]);
  return (
    <div className={styles.list}>
      <h1>ガジェット一覧</h1>
      {items.map((item) => (
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
          timestamp={item.timestamp}
        />
      ))}
    </div>
  );
};

export default List;
