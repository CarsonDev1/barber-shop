'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/app/api/service/getServices';
import { searchServices } from '@/app/api/service/searchService';
import { getServiceTypes } from '@/app/api/service/getServiceType';

export default function Service() {
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: number]: boolean }>({});

	const toggleDescription = (index: number) => {
		setExpandedDescriptions((prevState) => ({
			...prevState,
			[index]: !prevState[index],
		}));
	};
	const [isSearching, setIsSearching] = useState(false);
	const [searchParams, setSearchParams] = useState({
		name: '',
		description: '',
		estimateTimeMin: 0,
		estimateTimeMax: 0,
		priceMin: 0,
		priceMax: 0,
		serviceType: 0,
	});
	const [filteredServices, setFilteredServices] = useState<any[]>([]);

	const { data: servicesData } = useQuery({
		queryKey: ['dataServices'],
		queryFn: getServices,
	});

	const { data: serviceTypesData } = useQuery({
		queryKey: ['serviceTypes'],
		queryFn: getServiceTypes,
	});

	const handleSearch = async () => {
		setIsSearching(true);

		try {
			const response = await searchServices(searchParams);
			if (response.payload && Array.isArray(response.payload)) {
				setFilteredServices(response.payload);
			} else {
				setFilteredServices([]);
			}
			setCurrentPage(1); // Reset lại trang
		} catch (error) {
			console.error('Lỗi tìm kiếm:', error);
			setFilteredServices([]);
		} finally {
			setIsSearching(true);
		}
	};

	const handleClearSearch = () => {
		setSearchParams({
			name: '',
			description: '',
			estimateTimeMin: 0,
			estimateTimeMax: 0,
			priceMin: 0,
			priceMax: 0,
			serviceType: 0,
		});
		setFilteredServices([]);
		setIsSearching(false);
	};

	const servicesToShow = isSearching ? filteredServices : servicesData?.payload || [];
	const servicesPerPage = 10;
	const totalPages = Math.ceil(servicesToShow.length / servicesPerPage);

	return (
		<div className='pt-24 pb-8 bg-[#0a0a0a] flex flex-col gap-6'>
			{/* Form tìm kiếm */}
			<div className='container-lg mb-6'>
				<h2 className='text-white text-2xl font-bold mb-4 text-center'>Tìm kiếm dịch vụ</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					<input
						type='text'
						placeholder='Tên dịch vụ'
						value={searchParams.name}
						onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
						className='w-full p-2 rounded border'
					/>
					<input
						type='text'
						placeholder='Mô tả'
						value={searchParams.description}
						onChange={(e) => setSearchParams({ ...searchParams, description: e.target.value })}
						className='w-full p-2 rounded border'
					/>
					<input
						type='number'
						placeholder='Thời gian ước lượng (tối thiểu)'
						value={searchParams.estimateTimeMin || ''}
						onChange={(e) => setSearchParams({ ...searchParams, estimateTimeMin: Number(e.target.value) })}
						className='w-full p-2 rounded border'
					/>
					<input
						type='number'
						placeholder='Thời gian ước lượng (tối đa)'
						value={searchParams.estimateTimeMax || ''}
						onChange={(e) => setSearchParams({ ...searchParams, estimateTimeMax: Number(e.target.value) })}
						className='w-full p-2 rounded border'
					/>
					<input
						type='number'
						placeholder='Giá tối thiểu'
						value={searchParams.priceMin || ''}
						onChange={(e) => setSearchParams({ ...searchParams, priceMin: Number(e.target.value) })}
						className='w-full p-2 rounded border'
					/>
					<input
						type='number'
						placeholder='Giá tối đa'
						value={searchParams.priceMax || ''}
						onChange={(e) => setSearchParams({ ...searchParams, priceMax: Number(e.target.value) })}
						className='w-full p-2 rounded border'
					/>
					<select
						value={searchParams.serviceType}
						onChange={(e) => setSearchParams({ ...searchParams, serviceType: Number(e.target.value) })}
						className='w-full p-2 rounded border'
					>
						<option value={0}>Chọn loại dịch vụ</option>
						{serviceTypesData?.payload.map((type) => (
							<option key={type.id} value={type.id}>
								{type.name}
							</option>
						))}
					</select>
				</div>
				<div className='flex gap-4 mt-4'>
					<button onClick={handleSearch} className='p-2 bg-yellow-600 text-white rounded'>
						Tìm kiếm
					</button>
					<button onClick={handleClearSearch} className='p-2 bg-gray-500 text-white rounded'>
						Xóa tìm kiếm
					</button>
				</div>
			</div>

			{/* Hiển thị kết quả */}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 container-lg'>
				{servicesToShow.length === 0 && (
					<p className='text-white text-center col-span-full h-dvh'>Không tìm thấy kết quả.</p>
				)}
				{servicesToShow.map((service, index) => (
					<Card
						key={index}
						className='overflow-hidden transition-shadow hover:shadow-lg relative z-10 flex flex-col justify-between'
					>
						<CardContent className='p-0'>
							<div className='relative h-48'>
								<Image src={service.images[0].url} alt={service.name} fill className='object-cover' />
								<div className='absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded flex items-center'>
									<Clock className='mr-1 w-4 h-4' /> <span>{service.estimateTime} phút</span>
								</div>
							</div>
							<div className='p-4 flex flex-col gap-2'>
								<h3 className='font-bold text-lg min-h-14 line-clamp-2'>{service.name}</h3>
								<span className='bg-yellow-600 text-white text-xs px-2 py-1 rounded inline-block w-fit'>
									{service.serviceType.name}
								</span>
								<p
									className={`text-sm text-gray-600 ${
										expandedDescriptions[index] ? '' : 'line-clamp-2'
									}`}
								>
									{service.description}
								</p>
								{service.description.length > 50 && (
									<Button
										variant='link'
										className='text-blue-500 text-xs p-0'
										onClick={() => toggleDescription(index)}
									>
										{expandedDescriptions[index] ? 'Thu gọn' : 'Xem thêm'}
									</Button>
								)}
							</div>
						</CardContent>
						<CardFooter>
							<p className='font-semibold text-xl mt-2 text-red-500'>
								{service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
							</p>
						</CardFooter>
					</Card>
				))}
			</div>
			<div className='flex justify-between items-center container-lg'>
				<Button
					variant='outline'
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className='bg-white text-black'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Trang trước
				</Button>
				<span className='text-sm text-white'>
					Trang {currentPage} trên {totalPages}
				</span>
				<Button
					variant='outline'
					onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
					disabled={currentPage === totalPages}
					className='bg-white text-black'
				>
					Trang sau
					<ChevronRight className='w-4 h-4 ml-2' />
				</Button>
			</div>
		</div>
	);
}
