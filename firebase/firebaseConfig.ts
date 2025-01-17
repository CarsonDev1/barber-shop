// Import các thư viện Firebase cần thiết
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Cấu hình Firebase của ứng dụng bạn
const firebaseConfig = {
	apiKey: 'AIzaSyAKqlDPE3hU0s1uhQmc4_H_oVZ0469LeYA',
	authDomain: 'barber-shop-ee686.firebaseapp.com',
	projectId: 'barber-shop-ee686',
	storageBucket: 'barber-shop-ee686.firebasestorage.app',
	messagingSenderId: '715393501875',
	appId: '1:715393501875:web:2fa6e612d24afe2be2bec6',
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
export const db = getFirestore(app);
