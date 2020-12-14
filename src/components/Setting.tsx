import React, { useState } from "react";
import { storage } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import firebase from "firebase/app";
import styles from "../assets/scss/Setting.module.scss";

const Setting: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(user.displayName);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  //アバター画像変更時の関数
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const updateLoginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let loginUser = firebase.auth().currentUser;
    let url = user.photoUrl;

    if (loginUser != null) {
      if (avatarImage) {
        //アバター画像をstorageに登録する際に一意な名称で保存する
        const S =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N = 16;
        const randomChar = Array.from(
          crypto.getRandomValues(new Uint32Array(N))
        )
          .map((n) => S[n % S.length])
          .join("");
        const fileName = randomChar + "_" + avatarImage.name;
        await storage.ref(`avatars/${fileName}`).put(avatarImage);
        url = await storage.ref("avatars").child(fileName).getDownloadURL();
      }

      //firebaseのuserステートを更新
      await loginUser.updateProfile({
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
      alert("ユーザー情報を更新しました");
    } else {
      alert("エラー：ユーザー情報が取得できませんでした");
    }
  };

  return (
    <div className={styles.setting}>
      <h1 className={styles.title}>ユーザー設定</h1>
      <form className={styles.setting_form} onSubmit={updateLoginUser}>
        <label>
          <div
            className={avatarImage ? styles.add_icon_loaded : styles.add_icon}
          >
            {avatarImage ? (
              "選択済み"
            ) : (
              <img src={user.photoUrl} alt="usericon" />
            )}
          </div>
          <input
            className={styles.icon}
            type="file"
            onChange={onChangeImageHandler}
          />
        </label>

        <div className={styles.input_area}>
          <div className={styles.input_item}>
            <label>ユーザー名</label>
            <input
              className={styles.text_input}
              placeholder="ユーザー名"
              type="text"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <button
          className={
            username ? styles.submit_button : styles.submit_button_false
          }
          type="submit"
          disabled={!username}
        >
          更新
        </button>
      </form>
    </div>
  );
};

export default Setting;
