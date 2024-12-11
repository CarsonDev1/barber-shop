'use client';

import Link from 'next/link';
import AI from '@/public/root/btn-ai.png';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { createAI } from '@/app/api/ai/createAI';

export default function Chats() {
	const [isChatOpen, setChatOpen] = useState(false);
	const [formData, setFormData] = useState({ characteristics: '', language: 'vi', gender: 'male' });
	const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]); // For chat history
	const [loading, setLoading] = useState(false);
	const chatBoxRef = useRef<HTMLDivElement>(null); // Reference for chat box to detect outside click

	// Handle form submit
	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Add user message to the chat
		setMessages((prevMessages) => [
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
			const message = response?.payload || 'No message returned'; // Extract the message field
			setMessages((prevMessages) => [
				...prevMessages,
				{ text: message, sender: 'ai' }, // Use the message field to display the AI's response
			]);
			setFormData({ gender: 'male', characteristics: '', language: 'vi' }); // Reset form data
		} catch (error) {
			console.error('Error creating AI:', error);
			setMessages((prevMessages) => [...prevMessages, { text: 'Sorry, something went wrong!', sender: 'ai' }]);
		} finally {
			setLoading(false);
		}
	};

	// Close chat when clicking outside
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

	return (
		<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-4'>
			{/* AI Chat Button */}
			<button
				className='relative rounded-full shadow-lg hover:shadow-xl transition-all group'
				onClick={() => setChatOpen((prev) => !prev)} // Toggle chat on button click
			>
				<span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-[#2196f3]/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple'></span>
				<Image src={AI} alt='btn-chat' className='w-14 h-14 animate-shake' />
			</button>

			{/* Chat UI */}
			{isChatOpen && (
				<div
					ref={chatBoxRef}
					className='w-80 p-4 bg-white shadow-lg rounded-lg transform transition-transform ease-in-out duration-500 absolute bottom-20 right-0'
				>
					{/* Chat History */}
					<div className='overflow-y-auto max-h-60 mb-4'>
						{messages.map((message, index) => (
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
							<button type='submit' className='w-full bg-blue-500 text-white p-2 rounded'>
								Submit
							</button>
						</form>
					)}
				</div>
			)}
		</div>
	);
}
