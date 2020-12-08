import React, { useEffect } from "react";
import styles from "./assets/App.module.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import Home from "./components/Home";
import List from "./components/List";
import Register from "./components/Register";
import Data from "./components/Data";
import Setting from "./components/Setting";
import Auth from "./components/Auth";
import Header from "./components/Header";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      <Router>
        {user.uid ? (
          <div className={styles.app}>
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/list" component={List} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/data" component={Data} />
            <Route exact path="/setting" component={Setting} />
          </div>
        ) : (
          <Auth />
        )}
      </Router>
    </>
  );
};

export default App;
