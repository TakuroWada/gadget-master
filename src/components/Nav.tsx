import React from "react";
//import { Link } from "react-router-dom";
//import { auth } from "../firebase";
import styles from "../assets/scss/Nav.module.scss";
import SimpleMenu from "./SimpleMenu";

const Navbar: React.FC = () => {
  return (
    <div className={styles.hnav}>
      <SimpleMenu />
      {/* <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/list">一覧</Link>
        </li>
        <li>
          <Link to="/register">登録</Link>
        </li>

        <li>
          <Link to="/data">データ</Link>
        </li>

        <li>
          <Link to="/setting">設定</Link>
        </li>
        <li
          onClick={async () => {
            await auth.signOut();
          }}
        >
          <Link to="/">ログアウト</Link>
        </li>
      </ul> */}
    </div>
  );
};

export default Navbar;
