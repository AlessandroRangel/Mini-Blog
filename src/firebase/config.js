import {getFirestore} from 'firebase/firestore'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCyJUZk6vIvBBOROHsnGzuar3-KHcTt_tA",
  authDomain: "miniblog-2cf9f.firebaseapp.com",
  projectId: "miniblog-2cf9f",
  storageBucket: "miniblog-2cf9f.appspot.com",
  messagingSenderId: "1049521425352",
  appId: "1:1049521425352:web:aaa038f26d6f9930b20efd"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);