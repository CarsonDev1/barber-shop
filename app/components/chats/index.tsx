'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { createAI } from '@/app/api/ai/createAI';
import Image from 'next/image';
import AI from '@/public/root/btn-ai.png';
import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/app/api/getProfile';
import { createAIPro } from '@/app/api/ai/AIPro';
import Link from 'next/link';

export default function RealTimeChatPopup() {
	const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái mở/đóng popup
	const [isAIProOpen, setAIProOpen] = useState(false);
	const [image, setImage] = useState<File | null>(null);
	const [aiProResponse, setAIProResponse] = useState<any>();
	const [isChatOpen, setChatOpen] = useState(false);
	const [formData, setFormData] = useState({ characteristics: '', language: 'vi', gender: 'male' });
	const [messagesAi, setMessagesAi] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]);
	const [loading, setLoading] = useState(false);
	const chatBoxRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<any>([]);
	const [input, setInput] = useState('');
	const popupRef = useRef<any>(null);
	const [unreadCount, setUnreadCount] = useState(0);

	const {
		data: dataProfile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dataProfile'],
		queryFn: getAccount,
	});

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleAIProSubmit = async () => {
		if (!image) {
			alert('Please upload an image first!');
			return;
		}

		setLoading(true);
		try {
			const response = await createAIPro(image);
			const payload = JSON.parse(response?.data?.payload || '{}');
			setAIProResponse(payload);
		} catch (error) {
			console.error('Error with AI Pro:', error);
			setAIProResponse('Error processing image. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Add user message to the chat
		setMessagesAi((prevMessages) => [
			...prevMessages,
			{
				text: `Gender: ${formData.gender}, Characteristics: ${formData.characteristics}, Language: ${formData.language}`,
				sender: 'user',
			},
		]);
		setLoading(true);

		try {
			// API call to create AI
			const AIData = {
				gender: formData.gender,
				characteristics: formData.characteristics.split(','),
				language: formData.language,
			};
			const response = await createAI(AIData); // Send data to the server

			// Assuming the response looks like: { status: string, message: string, payload: object }
			const parsedPayload = JSON.parse(response?.payload || '[]'); // Safely parse the JSON string
			const firstDescription = parsedPayload[0]?.description || 'No description available'; // Get the description of the first object
			setMessagesAi((prevMessages) => [
				...prevMessages,
				{ text: firstDescription, sender: 'ai' }, // Use the message field to display the AI's response
			]);
			setFormData({ gender: 'male', characteristics: '', language: 'vi' }); // Reset form data
		} catch (error) {
			console.error('Error creating AI:', error);
			setMessagesAi((prevMessages) => [...prevMessages, { text: 'Sorry, something went wrong!', sender: 'ai' }]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (chatBoxRef.current && !chatBoxRef.current.contains(e.target as Node)) {
				setChatOpen(false);
			}
		};

		if (isChatOpen) {
			document.addEventListener('mousedown', handleOutsideClick);
		}

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isChatOpen]);
	// Lấy tin nhắn từ Firestore
	useEffect(() => {
		const q = query(collection(db, 'chats'), orderBy('timestamp'));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
		});

		return () => unsubscribe();
	}, []);

	// Gửi tin nhắn
	const sendMessage = async (e: any) => {
		e.preventDefault();

		// if (
		// 	dataProfile?.role === 'ROLE_CUSTOMER' &&
		// 	!['ROLE_ADMIN', 'ROLE_STAFF'].includes(messages[messages.length - 1]?.senderRole)
		// ) {
		// 	alert('Bạn chỉ có thể chat với Admin hoặc Staff!');
		// 	return;
		// }

		if (input.trim() === '') return;

		try {
			await addDoc(collection(db, 'chats'), {
				text: input,
				sender: dataProfile?.name || 'Unknown',
				senderRole: dataProfile?.role || 'ROLE_UNKNOWN',
				timestamp: Timestamp.now(),
			});
			setInput(''); // Reset ô nhập liệu
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	// Đóng popup khi click bên ngoài
	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				setIsPopupOpen(false);
			}
		};
		if (isPopupOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isPopupOpen]);

	return (
		<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-4 items-center'>
			{/* Nút mở popup */}

			<Link href='/ai-suggest'>
				<button className='bg-orange-300 text-white p-3 rounded-full shadow-lg hover:shadow-xl'>
					Gợi ý kiểu tóc
				</button>
			</Link>

			<button
				className='bg-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl'
				onClick={() => setIsPopupOpen((prev) => !prev)}
			>
				Chat Admin
			</button>

			{/* Popup */}
			{isPopupOpen && (
				<div ref={popupRef} className='fixed bottom-20 right-4 w-80 p-4 bg-white shadow-lg rounded-lg z-40'>
					<h2 className='text-lg font-bold mb-4'>Real-Time Chat</h2>

					{/* Hiển thị tin nhắn */}
					<div className='overflow-y-auto h-64 mb-4 border p-2 rounded'>
						{messages.map((message: any) => (
							<div
								key={message.id}
								className={`mb-2 ${
									message.senderRole === 'ROLE_ADMIN' || message.senderRole === 'ROLE_STAFF'
										? 'text-left'
										: 'text-right'
								}`}
							>
								<span
									className={`inline-block p-2 rounded-lg ${
										message.senderRole === 'ROLE_ADMIN' || message.senderRole === 'ROLE_STAFF'
											? 'bg-gray-300'
											: 'bg-blue-500 text-white'
									}`}
								>
									<strong>{message.sender}:</strong> {message.text}
								</span>
							</div>
						))}
					</div>

					{/* Form nhập tin nhắn */}
					<form onSubmit={sendMessage} className='flex'>
						<input
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Enter your message'
							className='flex-grow border rounded p-2 mr-2'
						/>
						<button type='submit' className='bg-blue-500 text-white p-2 rounded'>
							Send
						</button>
					</form>
				</div>
			)}

			{/* AI Chat Button */}
			<button
				className='relative rounded-full shadow-lg hover:shadow-xl transition-all group w-fit'
				onClick={() => setChatOpen((prev) => !prev)}
			>
				<span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-[#2196f3]/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple'></span>
				<Image src={AI} alt='btn-chat' className='w-14 h-14 animate-shake' />
			</button>

			{/* Chat UI */}
			{isChatOpen && (
				<div
					ref={chatBoxRef}
					className='w-96 p-4 bg-white shadow-lg rounded-lg transform transition-transform ease-in-out duration-500 absolute bottom-20 right-0'
				>
					{/* Chat History */}
					<div className='overflow-y-auto max-h-60 mb-4'>
						{messagesAi.map((message, index) => (
							<div key={index} className={`mb-2 ${message.sender === 'ai' ? 'text-left' : 'text-right'}`}>
								<span
									className={`inline-block p-2 rounded-lg ${
										message.sender === 'ai' ? 'bg-gray-200' : 'bg-blue-500 text-white'
									}`}
								>
									{message.text}
								</span>
							</div>
						))}
						{loading && (
							<div className='text-left mb-2'>
								<span className='inline-block p-2 rounded-lg bg-gray-200'>Loading...</span>
							</div>
						)}
					</div>

					{/* Form to input user data */}
					{!loading && (
						<form onSubmit={handleFormSubmit}>
							<div>
								<label className='block mb-2' htmlFor='characteristics'>
									Characteristics:
								</label>
								<input
									id='characteristics'
									type='text'
									value={formData.characteristics}
									onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
									className='w-full p-2 border border-gray-300 rounded mb-4'
									placeholder='Enter characteristics'
									required
								/>
							</div>

							<div>
								<label className='block mb-2' htmlFor='language'>
									Language:
								</label>
								<select
									id='language'
									value={formData.language}
									onChange={(e) => setFormData({ ...formData, language: e.target.value })}
									className='w-full p-2 border border-gray-300 rounded mb-4'
								>
									<option value='vi'>Vietnamese</option>
									<option value='ko'>Korean</option>
								</select>
							</div>

							<div>
								<label className='block mb-2' htmlFor='gender'>
									Gender:
								</label>
								<select
									id='gender'
									value={formData.gender}
									onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
									className='w-full p-2 border border-gray-300 rounded mb-4'
								>
									<option value='male'>Male</option>
									<option value='female'>Female</option>
								</select>
							</div>

							<button type='submit' className='w-full bg-blue-500 text-white p-2 rounded'>
								Submit
							</button>
						</form>
					)}
				</div>
			)}

			{/* AI Pro Button */}
			<Link href='/ai-pro'>
				<button className='bg-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl'>AI Pro</button>
			</Link>

			{/* AI Pro Popup */}
			{isAIProOpen && (
				<div className='fixed bottom-20 right-4 w-80 p-4 overflow-y-auto h-40 bg-white shadow-lg rounded-lg'>
					<h2 className='text-lg font-bold mb-4'>AI Pro</h2>
					<input type='file' accept='image/*' onChange={handleImageUpload} className='mb-4' />
					<button
						onClick={handleAIProSubmit}
						className='w-full bg-blue-500 text-white p-2 rounded mb-4'
						disabled={loading}
					>
						{loading ? 'Processing...' : 'Submit'}
					</button>
					{aiProResponse && (
						<div className='bg-gray-100 p-4 rounded'>
							{aiProResponse.faceCharacteristics ? (
								<div className='mb-4'>
									<h3 className='font-bold mb-2'>Face Characteristics:</h3>
									<ul>
										{Object.entries(aiProResponse.faceCharacteristics).map(([key, value]: any) => (
											<li key={key} className='text-sm'>
												<strong>{key}:</strong> {value}
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className='text-red-500'>No face characteristics found.</p>
							)}

							{aiProResponse.hairstyles ? (
								<div>
									<h3 className='font-bold mb-2'>Suggested Hairstyles:</h3>
									<ul className='list-disc ml-4'>
										{aiProResponse.hairstyles.map((style: any, index: any) => (
											<li key={index} className='mb-2'>
												<strong>{style.name}</strong>: {style.description}
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className='text-red-500'>No hairstyle suggestions available.</p>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
