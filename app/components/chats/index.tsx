'use client';

import { useEffect, useRef, useState } from 'react';
import { CometChat } from '@cometchat-pro/chat';
import { createOrJoinGroup, initializeCometChat, loginToCometChat } from '@/lib/comechat';

interface Message {
	text: string;
	sender: string;
}

export default function Chats() {
	const [isChatOpen, setChatOpen] = useState<boolean>(false);
	const [formData, setFormData] = useState<{ userId: string; message: string }>({
		userId: '',
		message: '',
	});
	const [messages, setMessages] = useState<Message[]>([]);
	const chatBoxRef = useRef<HTMLDivElement>(null);

	const groupID = 'cometchat-guid-1'; // Unique group ID
	const groupName = 'Hiking Group'; // Group name

	// Initialize CometChat
	useEffect(() => {
		initializeCometChat();

		const joinGroup = async () => {
			await createOrJoinGroup(groupID, groupName);
		};

		joinGroup();
	}, []);

	// Listen for incoming messages
	// Listen for incoming messages
	useEffect(() => {
		const listenerID = 'GROUP_CHAT_LISTENER';

		CometChat.addMessageListener(
			listenerID,
			new CometChat.MessageListener({
				onTextMessageReceived: (message: any) => {
					console.log('Message received:', message); // Debugging để kiểm tra tin nhắn nhận được
					if (message.receiver === groupID && message.receiverType === CometChat.RECEIVER_TYPE.GROUP) {
						// Cập nhật state messages khi có tin nhắn mới
						setMessages((prev) => [...prev, { text: message.text, sender: message.sender.uid }]);
					}
				},
			})
		);

		// Xóa listener khi component unmount
		return () => {
			CometChat.removeMessageListener(listenerID);
		};
	}, [groupID]);

	const handleLogin = async () => {
		try {
			await loginToCometChat(formData.userId);
			alert('Logged in successfully');
		} catch (error) {
			alert('Login failed. Please try again.');
		}
	};

	const sendMessageToGroup = async (messageText: string): Promise<void> => {
		const textMessage = new CometChat.TextMessage(groupID, messageText, CometChat.RECEIVER_TYPE.GROUP);

		try {
			const message = await CometChat.sendMessage(textMessage);
			console.log('Message sent successfully:', message);
			setMessages((prev) => [...prev, { text: messageText, sender: formData.userId }]);
		} catch (error) {
			console.error('Message sending failed:', error);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		if (!formData.message) return;

		await sendMessageToGroup(formData.message);
		setFormData((prev) => ({ ...prev, message: '' }));
	};

	return (
		<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-4'>
			<button
				className='bg-blue-500 text-white p-4 rounded-full shadow-lg'
				onClick={() => setChatOpen((prev) => !prev)}
			>
				Open Chat
			</button>

			{isChatOpen && (
				<div
					ref={chatBoxRef}
					className='w-96 p-4 bg-white shadow-lg rounded-lg transform transition-transform ease-in-out duration-500'
				>
					<div className='overflow-y-auto max-h-60 mb-4'>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`mb-2 ${message.sender === formData.userId ? 'text-right' : 'text-left'}`}
							>
								<span
									className={`inline-block p-2 rounded-lg ${
										message.sender === formData.userId ? 'bg-blue-500 text-white' : 'bg-gray-200'
									}`}
								>
									{message.text} - <small>{message.sender}</small>
								</span>
							</div>
						))}
					</div>

					<form onSubmit={handleFormSubmit}>
						<div>
							<input
								type='text'
								value={formData.userId}
								onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
								placeholder='Enter User ID'
								className='w-full p-2 border mb-2'
								required
							/>
						</div>

						<div>
							<input
								type='text'
								value={formData.message}
								onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
								placeholder='Type a message'
								className='w-full p-2 border'
								required
							/>
						</div>

						<button
							type='button'
							onClick={handleLogin}
							className='w-full bg-green-500 text-white p-2 rounded mt-2'
						>
							Login
						</button>
						<button type='submit' className='w-full bg-blue-500 text-white p-2 rounded mt-2'>
							Send
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
