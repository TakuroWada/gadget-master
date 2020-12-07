import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD41VuZs3LG4nTe8lWY2Ms70jSHk4Z-Xf8",
  authDomain: "gadget-master.firebaseapp.com",
  projectId: "gadget-master",
  storageBucket: "gadget-master.appspot.com",
  messagingSenderId: "376571503351",
  appId: "1:376571503351:web:d04aaf55681845f14d29f2",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
