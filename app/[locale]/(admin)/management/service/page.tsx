'use client';

import { SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import PageContainer from '@/app/components/page-container';
import EditStylistForm from '@/app/[locale]/(admin)/components/form';
import { Modal } from '@/app/[locale]/(admin)/components/modal';
import ServiceImage from '@/public/root/service-img.png';

const services = Array(18).fill({
	name: 'Combo 10 step hair cut and shampoo',
	description: 'Combo Cut and Massage Shampoo',
	duration: '45 minutes',
	price: '120K',
	label: 'Same price all week',
	image: ServiceImage,
});

export default function Service() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedService, setSelectedService] = useState(null);
	const [mode, setMode] = useState<'add' | 'edit'>('add');

	const servicesPerPage = 10;
	const totalPages = Math.ceil(services.length / servicesPerPage);

	const getCurrentServices = () => {
		const startIndex = (currentPage - 1) * servicesPerPage;
		const endIndex = startIndex + servicesPerPage;
		return services.slice(startIndex, endIndex);
	};

	const handleEditClick = (service: SetStateAction<null>) => {
		setSelectedService(service);
		setMode('edit');
		setModalOpen(true);
	};

	const handleDeleteClick = (service: SetStateAction<null>) => {
		// Add your delete logic here, e.g., removing the service from the list
		console.log('Deleting service:', service);
	};

	const handleAddServiceClick = () => {
		setSelectedService(null);
		setMode('add');
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	return (
		<PageContainer>
			<Button
				className='fixed top-8 right-8 rounded-full shadow-lg border'
				size='lg'
				onClick={handleAddServiceClick}
			>
				<Plus className='w-6 h-6 mr-2' />
				ADD SERVICE
			</Button>

			<div className='grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8'>
				{getCurrentServices().map((service, index) => (
					<Card key={index} className='overflow-hidden transition-shadow hover:shadow-lg relative z-10'>
						<CardContent className='p-0'>
							<div className='relative h-48'>
								<Image src={service.image} alt={service.name} fill className='object-cover' />
								<div className='absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded flex items-center'>
									<Clock className='mr-1 w-4 h-4' /> {service.duration}
								</div>
							</div>
							<div className='p-4'>
								<h3 className='font-bold text-lg mb-1'>{service.name}</h3>
								<p className='text-sm text-gray-600'>{service.description}</p>
								<span className='bg-yellow-600 text-white text-xs px-2 py-1 rounded mt-2 inline-block'>
									{service.label}
								</span>
								<p className='font-semibold text-xl mt-2'>Standard price {service.price}</p>
							</div>
						</CardContent>
						<CardFooter className='bg-gray-50 border-t flex justify-between p-2'>
							<Button
								variant='outline'
								size='sm'
								className='text-green-600 hover:text-green-700 hover:bg-green-50'
								onClick={() => handleEditClick(service)}
							>
								<Edit className='w-4 h-4 mr-2' />
								Edit
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='text-red-600 hover:text-red-700 hover:bg-red-50'
								onClick={() => handleDeleteClick(service)}
							>
								<Trash2 className='w-4 h-4 mr-2' />
								Delete
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			<div className='flex justify-between items-center'>
				<Button
					variant='outline'
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className='bg-white text-black'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Previous
				</Button>
				<span className='text-sm text-white'>
					Page {currentPage} of {totalPages}
				</span>
				<Button
					variant='outline'
					onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
					disabled={currentPage === totalPages}
					className='bg-white text-black'
				>
					Next
					<ChevronRight className='w-4 h-4 ml-2' />
				</Button>
			</div>

			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<EditStylistForm stylist={selectedService} mode={mode} onClose={handleCloseModal} />
			</Modal>
		</PageContainer>
	);
}
