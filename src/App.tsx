import React, { useEffect } from "react";
import "./assets/scss/App.module.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth, db } from "./firebase";
import firebase from "firebase/app";
import Home from "./components/Home";
import List from "./components/List";
import Register from "./components/Register";
import Setting from "./components/Setting";
import Auth from "./components/Auth";
import Header from "./components/Header";
import RecommendedVideos from "./components/RecommendedVideos";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

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

        db.collection("users").doc(authUser.uid).set({
          userId: authUser.uid,
          userName: authUser.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
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
        <ScrollToTop>
          {user.uid ? (
            <div>
              <Header />
              <Route exact path="/" component={Home} />
              <Route exact path="/list" component={List} />
              <Route exact path="/register" component={Register} />
              <Route
                exact
                path="/recommendedvideos"
                component={RecommendedVideos}
              />
              <Route exact path="/setting" component={Setting} />
              <Footer />
            </div>
          ) : (
            <Auth />
          )}
        </ScrollToTop>
      </Router>
    </>
  );
};

export default App;
