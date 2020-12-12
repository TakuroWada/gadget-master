import React from "react";
import styles from "../assets/Item.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import DeleteIcon from "../assets/images/delete.png";

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

const Item: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);

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

  return (
    <div className={styles.item_card}>
      <div className={styles.item_icon}>
        <img src={props.gadgetIcon} alt="icon" />
      </div>

      <div>
        <div className={styles.item_flex}>
          <p className={styles.maker_name}>{props.maker}</p>
          <img
            className={styles.delete_icon}
            src={DeleteIcon}
            onClick={() => {
              deleteItem(props.itemId);
            }}
            alt="削除"
          />
        </div>

        <p className={styles.item_name}>{props.gadgetname}</p>

        <div className={styles.item_diteils}>
          <p>¥{props.price}</p>
          <p>{props.possessionStatus}</p>
          <p>購入日:{props.purchaseDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
