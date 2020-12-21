import React from "react";
import styles from "../assets/scss/Footer.module.scss";
import { Link } from "react-router-dom";
import MainTitle from "../assets/images/maintitle.png";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Copyright:2020 GagetMaster.All Rights Resarved.</p>
      <Link to="/">
        <img src={MainTitle} className={styles.title} alt="Gadget Master" />
      </Link>
    </footer>
  );
};

export default Footer;
