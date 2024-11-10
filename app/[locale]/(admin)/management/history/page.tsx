'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import PageContainer from '@/app/components/page-container';
import ServiceImage from '@/public/root/service-img.png';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const barbers = Array(18).fill({
	id: '1',
	name: 'Xinh Đỗ',
	phone: '0123456789',
	address: 'Son Tra, Da Nang, Viet Nam',
	image: ServiceImage,
});

export default function BarberHistory() {
	const [currentPage, setCurrentPage] = useState(1);
	const barbersPerPage = 6;
	const totalPages = Math.ceil(barbers.length / barbersPerPage);

	const getCurrentBarbers = () => {
		const startIndex = (currentPage - 1) * barbersPerPage;
		const endIndex = startIndex + barbersPerPage;
		return barbers.slice(startIndex, endIndex);
	};

	const router = useRouter();

	return (
		<PageContainer>
			<div className='container-lg flex flex-col gap-6'>
				<h1 className='text-2xl font-bold text-center text-white'>MANAGEMENT BABER HISTORY</h1>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
					{getCurrentBarbers().map((barber, index) => (
						<Card
							key={index}
							className='bg-gray-200 overflow-hidden transition-shadow hover:shadow-lg rounded-lg'
						>
							<CardContent className='p-4'>
								<div className='relative h-40 mb-3 rounded-md overflow-hidden'>
									<Image src={barber.image} alt={barber.name} fill className='object-cover' />
									<span className='absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold rounded'>
										BARBER
									</span>
								</div>
								<h3 className='font-bold text-base mb-1 truncate' title={barber.name}>
									{barber.name}
								</h3>
								<p className='text-sm text-gray-600 truncate'>{barber.phone}</p>
								<p className='text-sm text-gray-600 truncate' title={barber.address}>
									{barber.address}
								</p>
							</CardContent>
							<CardFooter className='bg-gray-300 p-2'>
								<Link href={`/management/history/${barber.id}`} className='w-full'>
									<Button
										variant='default'
										size='sm'
										className='w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold'
									>
										<History className='w-4 h-4 mr-2' />
										View history
									</Button>
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>

				<div className='flex justify-center items-center space-x-4'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
						className='bg-gray-200 text-gray-800 hover:bg-gray-300'
					>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<span className='text-white'>
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={currentPage === totalPages}
						className='bg-gray-200 text-gray-800 hover:bg-gray-300'
					>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</PageContainer>
	);
}
