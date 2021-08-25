import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBl5PCqJsso6Yq-vIaP84WLB4YmLbGHOYY",
  authDomain: "campus-mate-c41f8.firebaseapp.com",
  projectId: "campus-mate-c41f8",
  storageBucket: "campus-mate-c41f8.appspot.com",
  messagingSenderId: "531671006863",
  appId: "1:531671006863:web:baf1706cbbe1a2f5ffbafa",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const fBase = firebase;
export const authService = firebase.auth;
