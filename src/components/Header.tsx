import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import styles from "../assets/scss/Header.module.scss";
import Nav from "./Nav";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import MainTitle from "../assets/images/maintitle.png";

const Header: React.FC = () => {
  const user = useSelector(selectUser);
  return (
    <header className={styles.header}>
      <Avatar className={styles.avatar} src={user.photoUrl} />
      <Link to="/">
        <img src={MainTitle} className={styles.title} alt="Gadget Master" />
      </Link>
      <Nav />
    </header>
  );
};

export default Header;
