import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import styles from "../assets/scss/SimpleMenu.module.scss";

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        className={styles.button_text}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        className={styles.menu}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <Link to="/" onClick={handleClose}>
            Home
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/list" onClick={handleClose}>
            一覧
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/register" onClick={handleClose}>
            登録
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/news" onClick={handleClose}>
            最新ニュース
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/setting" onClick={handleClose}>
            設定
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to="/"
            onClick={async () => {
              await auth.signOut();
            }}
          >
            ログアウト
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
