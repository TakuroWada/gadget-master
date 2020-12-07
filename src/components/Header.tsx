import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import styles from "../assets/Header.module.scss";
import Nav from "./Nav";
import { Avatar } from "@material-ui/core";

const Header: React.FC = () => {
  const user = useSelector(selectUser);
  return (
    <header className={styles.header}>
      <Avatar className={styles.tweet_avatar} src={user.photoUrl} />
      <Nav />
    </header>
  );
};

export default Header;
