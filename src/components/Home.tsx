import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import styles from "../assets/scss/Home.module.scss";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

const rankList = [
  {
    rank: "一般人",
    price: 200000,
  },
  {
    rank: "ガジェット好き",
    price: 600000,
  },
  {
    rank: "ガジェットオタク",
    price: 1500000,
  },
  {
    rank: "ガジェット系YouTuber",
    price: 3000000,
  },
  {
    rank: "散財人",
    price: 5000000,
  },
  {
    rank: "ガジェットマスター",
    price: -1,
  },
];

const Home: React.FC = () => {
  const user = useSelector(selectUser);
  const [totalRegistrationAmount, setTotalRegistrationAmount] = React.useState(
    0
  );
  const [totalPossessionAmount, setTotalPossessionAmount] = React.useState(0);
  const [rank, setRank] = React.useState("");

  useEffect(() => {
    let registTotal = 0;
    let possessionTotal = 0;
    (async () => {
      await db
        .collection("users")
        .doc(user.uid)
        .collection("items")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            registTotal += parseInt(doc.data().price);
            if (doc.data().possessionStatus === "所持中") {
              possessionTotal += parseInt(doc.data().price);
            }
          });
        });
      setTotalRegistrationAmount(registTotal);
      setTotalPossessionAmount(possessionTotal);
      rankSet(registTotal);
    })();
  }, [user.uid]);

  const rankSet = (registTotal: number) => {
    rankList.some((item) => {
      if (registTotal < item.price || item.price === -1) {
        setRank(item.rank);
        return true;
      }
      return false;
    });
  };

  return (
    <div className={styles.home}>
      <section className={styles.status_section}>
        <h2 className={styles.title}>Your Status</h2>
        <div className={styles.status_box}>
          <div className={styles.avatar_area}>
            <Avatar className={styles.avatar_img} src={user.photoUrl} />
            <p>{user.displayName}</p>
          </div>

          <div className={styles.text_area}>
            <div className={styles.text_item}>
              <h3 className={styles.sub_title}>あなたの肩書き</h3>
              <p>{rank}</p>
            </div>

            <div className={styles.text_item}>
              <h3 className={styles.sub_title}>登録した総額</h3>
              <p className={styles.price}>¥{totalRegistrationAmount}</p>
            </div>

            <div className={styles.text_item}>
              <h3 className={styles.sub_title}>所持品の総額</h3>
              <p className={styles.price}>¥{totalPossessionAmount}</p>
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

          <Link to="/recommendedvideos">
            <span>
              おすすめの
              <br />
              ガジェット動画
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
