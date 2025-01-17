import { db } from '@/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';

const getRoomId = (customerId: any, adminId: string): string => {
	// Đảm bảo luôn tạo cùng một roomId cho cặp CUSTOMER và ADMIN
	const sortedIds = [customerId, adminId].sort(); // Sắp xếp để loại bỏ vấn đề thứ tự
	return `${sortedIds[0]}_${sortedIds[1]}`;
};

// Tạo hoặc lấy phòng
export const getOrCreateRoom = async (customerId: any, adminId: string) => {
	const roomId = getRoomId(customerId, adminId); // Tạo roomId từ customerId và adminId
	const roomRef = doc(db, 'chats', roomId);

	const roomDoc = await getDoc(roomRef);
	if (!roomDoc.exists()) {
		await setDoc(roomRef, {
			createdAt: Timestamp.now(),
			participants: [customerId, adminId],
		});
	}

	return roomId;
};

// Gửi tin nhắn
export const sendMessageToRoom = async (roomId: string, message: string, sender: string, senderRole: string) => {
	try {
		console.log('Sending message:', { roomId, message, sender, senderRole });

		const messagesRef = collection(db, 'chats', roomId, 'messages');
		await addDoc(messagesRef, {
			text: message,
			sender,
			senderRole,
			timestamp: Timestamp.now(),
		});

		console.log('Message sent successfully!');
	} catch (error) {
		console.error('Error sending message:', error);
	}
};

// Lấy tin nhắn trong phòng
export const listenToRoomMessages = (roomId: string, callback: (messages: any[]) => void) => {
	const messagesRef = collection(db, 'chats', roomId, 'messages');
	const q = query(messagesRef, orderBy('timestamp'));

	const unsubscribe = onSnapshot(q, (snapshot) => {
		const messages = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		callback(messages);
	});

	return unsubscribe;
};
