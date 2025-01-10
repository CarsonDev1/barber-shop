'use client';
import { createAIChange } from '@/app/api/ai/AIChange';
import { getAISuggest } from '@/app/api/ai/AISuggest';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react';
import BackGroundRoot from '@/public/root/background-root.png';

const AISuggest = () => {
	const {
		data: dataAISuggest,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dataAISuggest'],
		queryFn: getAISuggest,
	});

	const [selectedStyle, setSelectedStyle] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [responseMessage, setResponseMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (isLoading) return <div>Đang tải dữ liệu...</div>;
	if (error) return <div>Lỗi khi tải dữ liệu</div>;

	const { men_hair_styles, color } = dataAISuggest.payload;

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedImage(e.target.files[0]);
		}
	};

	const downloadImage = (url: string) => {
		const link = document.createElement('a');
		link.href = url;
		link.download = 'hairstyle_result.jpeg';
		link.click();
	};

	const handleSubmit = async () => {
		if (!selectedImage || !selectedStyle || !selectedColor) {
			setResponseMessage('Vui lòng chọn ảnh, kiểu tóc và màu tóc.');
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await createAIChange(selectedImage, selectedStyle, selectedColor);
			setResponseMessage('Yêu cầu thay đổi kiểu tóc thành công!');
			console.log('Response:', response.data);

			if (response.data.payload && response.data.payload[0]) {
				downloadImage(response.data.payload[0]);
			}
		} catch (error) {
			setResponseMessage('Lỗi khi xử lý yêu cầu của bạn.');
			console.error('Error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-white'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full h-full object-cover'
			/>
			<div className='absolute inset-0 bg-black bg-opacity-50'></div>

			<div className='relative z-40'>
				<h1 className='text-2xl mb-4'>Chọn kiểu tóc và màu tóc</h1>

				<div className='w-full max-w-md'>
					<label htmlFor='men-hair-styles' className='block text-sm font-medium mb-2'>
						Kiểu tóc nam
					</label>
					<select
						id='men-hair-styles'
						className='block w-full p-2 border border-gray-300 rounded mb-4 text-black'
						value={selectedStyle}
						onChange={(e) => setSelectedStyle(e.target.value)}
					>
						<option value=''>Chọn kiểu tóc</option>
						{men_hair_styles.map((style: any, index: any) => (
							<option key={index} value={style}>
								{style}
							</option>
						))}
					</select>

					<label htmlFor='color' className='block text-sm font-medium mb-2'>
						Màu tóc
					</label>
					<select
						id='color'
						className='block w-full p-2 border border-gray-300 rounded mb-4 text-black'
						value={selectedColor}
						onChange={(e) => setSelectedColor(e.target.value)}
					>
						<option value=''>Chọn màu tóc</option>
						{color.map((colorOption: any, index: any) => (
							<option key={index} value={colorOption}>
								{colorOption}
							</option>
						))}
					</select>

					<label htmlFor='image-upload' className='block text-sm font-medium mb-2'>
						Tải lên hình ảnh
					</label>
					<input
						type='file'
						id='image-upload'
						className='block w-full p-2 border border-gray-300 rounded mb-4 text-white'
						onChange={handleImageUpload}
					/>

					<button
						onClick={handleSubmit}
						className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						{isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
					</button>
				</div>

				<div className='mt-4'>
					<p>{responseMessage}</p>
				</div>
			</div>
		</div>
	);
};

export default AISuggest;
