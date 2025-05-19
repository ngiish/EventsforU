import{ initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA65Hsc5XpAE4BFRuj-AHoLn24EGpI7pqw",
    authDomain: "eventsfou.firebaseapp.com",
    projectId: "eventsfou",
    storageBucket: "eventsfou.firebasestorage.app",
    messagingSenderId: "687863014138",
    appId: "1:687863014138:web:38017b25191df720b99f43",
};

const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const db = getFirestore(app);