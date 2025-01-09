// Import các thư viện Firebase cần thiết
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase của ứng dụng bạn
const firebaseConfig = {
  apiKey: "AIzaSyBN7-FLqpIZv12xZzrxlGtgz4Qlw7LbDTw",
  authDomain: "barber-shop-839df.firebaseapp.com",
  projectId: "barber-shop-839df",
  storageBucket: "barber-shop-839df.appspot.com",
  messagingSenderId: "165333213279",
  appId: "1:165333213279:web:4dbf6af188d28f7cd63bea",
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db = getFirestore(app);
