import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import styles from "../assets/scss/Home.module.scss";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

interface ITEMDATA {
  price: string;
  possessionStatus: string;
}

const Home: React.FC = () => {
  const user = useSelector(selectUser);

  const [totalRegistrationAmount, setTotalRegistrationAmount] = React.useState(
    ""
  );
  const [totalPossessionAmount, setTotalPossessionAmount] = React.useState("");
  const [allPrice, setAllPrice] = React.useState<ITEMDATA[]>([
    {
      price: "",
      possessionStatus: "",
    },
  ]);

  useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .collection("items")
      .onSnapshot((snapshot) =>
        setAllPrice(
          snapshot.docs.map((doc) => ({
            price: doc.data().price,
            possessionStatus: doc.data().possessionStatus,
          }))
        )
      );
    sumPrice();
  }, [user.uid]);

  const sumPrice = () => {
    //登録合計金額と所持中の合計金額を計算
    let registTotal = 0;
    let possessionTotal = 0;
    allPrice.forEach(function (item) {
      registTotal += parseInt(item.price);
      if (item.possessionStatus === "所持中") {
        possessionTotal += parseInt(item.price);
      }
    });
    setTotalRegistrationAmount(String(registTotal));
    setTotalPossessionAmount(String(possessionTotal));
  };

  return (
    <div className={styles.home}>
      <section className={styles.status_section}>
        <h2 className={styles.title}>ステータス</h2>
        <div className={styles.status_box}>
          <div className={styles.avatar_area}>
            <Avatar className={styles.avatar_img} src={user.photoUrl} />
            <p>{user.displayName}</p>
          </div>

          <div className={styles.text_area}>
            {/*  <div className={styles.text_item}>
              <h3 className={styles.sub_title}>現在の肩書き</h3>
              <p>一般人</p>
            </div> */}

            <div className={styles.text_item}>
              <h3 className={styles.sub_title}>登録した総額</h3>
              <p>¥{totalRegistrationAmount}</p>
            </div>

            <div className={styles.text_item}>
              <h3 className={styles.sub_title}>所持品の総額</h3>
              <p>¥{totalPossessionAmount}</p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.menu_section}>
        <h2 className={styles.menu_title}>Menu</h2>
        <div className={styles.link_area}>
          <Link to="/list">
            <br />
            <span>
              ガジェット
              <br />
              一覧を見る
            </span>
            <br />
          </Link>

          <Link to="/register">
            <span>
              ガジェットを
              <br />
              登録する
            </span>
          </Link>

          <Link to="/news">
            <span>
              最新の
              <br />
              Tecニュース
            </span>
          </Link>

          <Link to="/setting">
            <span>設定</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
