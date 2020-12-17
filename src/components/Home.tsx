import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import styles from "../assets/scss/Home.module.scss";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const user = useSelector(selectUser);
  const [totalRegistrationAmount, setTotalRegistrationAmount] = React.useState(
    0
  );
  const [totalPossessionAmount, setTotalPossessionAmount] = React.useState(0);

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
    })();
  }, [user.uid]);

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
