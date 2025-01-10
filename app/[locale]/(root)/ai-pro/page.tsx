'use client';
import { createAIPro } from '@/app/api/ai/AIPro';
import { useState } from 'react';
import BackGroundRoot from '@/public/root/background-root.png';
import Image from 'next/image';

export default function AIProPage() {
	const [image, setImage] = useState(null);
	const [aiProResponse, setAIProResponse] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleImageUpload = (e: any) => {
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

	return (
		<div className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full h-full object-cover'
			/>
			<div className='absolute inset-0 bg-black bg-opacity-50'></div>
			<div className='w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative z-40'>
				<h2 className='text-2xl font-bold text-center text-blue-600 mb-6'>AI Pro</h2>
				<div className='mb-4'>
					<label className='block text-gray-700 font-medium mb-2' htmlFor='imageUpload'>
						Upload Image
					</label>
					<input
						id='imageUpload'
						type='file'
						accept='image/*'
						onChange={handleImageUpload}
						className='w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
					/>
				</div>
				<button
					onClick={handleAIProSubmit}
					className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-50'
					disabled={loading}
				>
					{loading ? 'Processing...' : 'Submit'}
				</button>

				{aiProResponse && (
					<div className='mt-6 bg-gray-100 p-4 rounded-lg'>
						{aiProResponse.faceCharacteristics ? (
							<div className='mb-4'>
								<h3 className='text-lg font-semibold text-gray-700 mb-2'>Face Characteristics:</h3>
								<ul className='list-disc pl-5'>
									{Object.entries(aiProResponse.faceCharacteristics).map(([key, value]: any) => (
										<li key={key} className='text-sm text-gray-600'>
											<strong>{key}:</strong>{' '}
											{typeof value === 'object' ? JSON.stringify(value) : value}
										</li>
									))}
								</ul>
							</div>
						) : (
							<p className='text-red-500'>No face characteristics found.</p>
						)}

						{aiProResponse.hairstyles ? (
							<div className='w-full relative overflow-hidden'>
								<h3 className='text-lg font-semibold text-gray-700 mb-2'>Suggested Hairstyles:</h3>
								<ul className='list-disc'>
									{aiProResponse.hairstyles.map((style: any, index: any) => (
										<li key={index} className='text-sm text-gray-600 mb-2'>
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
		</div>
	);
}
