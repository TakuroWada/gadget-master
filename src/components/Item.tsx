import React from "react";
import styles from "../assets/Item.module.scss";

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
  timestamp: any;
}

const Item: React.FC<PROPS> = (props) => {
  return (
    <div className={styles.item_card}>
      <div className={styles.item_icon}>
        <img src={props.gadgetIcon} alt="icon" />
      </div>

      <div>
        <p className={styles.maker_name}>{props.maker}</p>
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
