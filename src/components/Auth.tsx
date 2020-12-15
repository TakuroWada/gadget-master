import React, { useState } from "react";
import styles from "../assets/scss/Auth.module.scss";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";

//material-ui
import { TextField, makeStyles, Modal, IconButton } from "@material-ui/core";

//icon
import SendIcon from "@material-ui/icons/Send";

//モーダルスタイル
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
}));

//Authコンポーネント
const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [resetEmail, setResetEmail] = useState("");

  //Emailパスワードリセット関数
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };

  //アバター画像変更時の関数
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  //Googleアカウントログイン時の関数
  const singInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };

  //ログイン時の関数
  const singInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  //新規登録の関数
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      //アバター画像をstorageに登録する際に一意な名称で保存する
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    //firebaseのuserステートを更新
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });
    //userステートの更新
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
  };

  return (
    <div className={styles.auth}>
      <div className={styles.chatch}>
        <h1 className={styles.title}>Gadget Master</h1>
        <p className={styles.chatch_text}>
          Gadget Masterはあなたの持っている
          <br />
          ガジェットを管理するアプリです。
        </p>
      </div>

      <form className={styles.auth_form} noValidate>
        <h2 className={styles.sub_title}>
          {isLogin ? "ログイン" : "新規登録"}
        </h2>
        {!isLogin && (
          <>
            <div>
              <div className={styles.select_icon}>
                <label>
                  <div
                    className={
                      avatarImage
                        ? styles.login_add_icon_loaded
                        : styles.login_add_icon
                    }
                  >
                    {avatarImage ? "選択済" : "画像選択"}
                  </div>
                  <input
                    className={styles.login_hidden_icon}
                    type="file"
                    required
                    onChange={onChangeImageHandler}
                  />
                </label>
              </div>
            </div>

            <input
              className={styles.text_input}
              placeholder="UserName"
              value={username}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
            />
          </>
        )}
        <input
          className={styles.text_input}
          placeholder="Email Address"
          value={email}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className={styles.text_input}
          type="password"
          placeholder="PassWord"
          value={password}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />
        <div className={styles.linkbox}>
          <span
            onClick={() => setOpenModal(true)}
            className={styles.login_reset}
          >
            パスワードをお忘れの方
          </span>

          <span
            className={styles.login_toggleMode}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "新規ユーザー作成" : "ログイン"}
          </span>
        </div>

        <div className={styles.button_area}>
          <button
            type="button"
            className={
              (
                isLogin
                  ? !email || password.length < 6
                  : !username || !email || password.length < 6 || !avatarImage
              )
                ? styles.submit_button_false
                : styles.submit_button
            }
            disabled={
              isLogin
                ? !email || password.length < 6
                : !username || !email || password.length < 6 || !avatarImage
            }
            onClick={
              isLogin
                ? async () => {
                    try {
                      await singInEmail();
                    } catch (err) {
                      alert(err.message);
                    }
                  }
                : async () => {
                    try {
                      await signUpEmail();
                    } catch (err) {
                      alert(err.message);
                    }
                  }
            }
          >
            {isLogin ? "ログイン" : "新規登録"}
          </button>

          <button
            type="button"
            className={styles.button_google}
            onClick={singInGoogle}
          >
            Googleサインイン
          </button>
        </div>
      </form>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={getModalStyle()} className={classes.modal}>
          <div className={styles.login_modal}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              type="email"
              name="email"
              label="Reset E-mail"
              value={resetEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setResetEmail(e.target.value);
              }}
            />
            <IconButton onClick={sendResetEmail}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Auth;
