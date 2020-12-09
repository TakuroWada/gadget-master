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
      <img src={props.gadgetIcon} alt="icon" />

      <div>
        <p>{props.maker}</p>
        <p>{props.gadgetname}</p>

        <div>
          <p>¥{props.price}</p>
          <p>{props.possessionStatus}</p>
          <p>購入日:{props.purchaseDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
