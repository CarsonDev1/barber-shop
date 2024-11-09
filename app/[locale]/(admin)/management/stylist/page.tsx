'use client';

import { SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceImage from '@/public/root/service-img.png';
import PageContainer from '@/app/components/page-container';
import EditStylistForm from '@/app/[locale]/(admin)/components/form';
import { Modal } from '@/app/[locale]/(admin)/components/modal';

const members = Array(18).fill({
	name: 'Xinh Đỗ',
	phone: '0123456789',
	location: 'Son Tra, Da Nang, Viet Nam',
	image: ServiceImage,
});

export default function Stylist() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState(null);
	const [mode, setMode] = useState<'add' | 'edit'>('add');

	const membersPerPage = 10;
	const totalPages = Math.ceil(members.length / membersPerPage);

	const getCurrentMembers = () => {
		const startIndex = (currentPage - 1) * membersPerPage;
		const endIndex = startIndex + membersPerPage;
		return members.slice(startIndex, endIndex);
	};

	const handleEditClick = (member: SetStateAction<null>) => {
		setSelectedMember(member);
		setMode('edit');
		setModalOpen(true);
	};

	const handleAddMemberClick = () => {
		setSelectedMember(null);
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
				onClick={handleAddMemberClick}
			>
				<Plus className='w-6 h-6 mr-2' />
				ADD MEMBER
			</Button>

			<div className='grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8'>
				{getCurrentMembers().map((member, index) => (
					<Card key={index} className='overflow-hidden transition-shadow hover:shadow-lg relative z-10'>
						<CardContent className='p-0'>
							<div className='relative h-48'>
								<Image src={member.image} alt={member.name} fill className='object-cover' />
								<span className='absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded'>
									BARBER
								</span>
							</div>
							<div className='p-4'>
								<h3 className='font-bold text-lg mb-1'>{member.name}</h3>
								<p className='text-sm text-gray-600'>{member.phone}</p>
								<p className='text-sm text-gray-600'>{member.location}</p>
							</div>
						</CardContent>
						<CardFooter className='bg-gray-50 border-t flex justify-between p-2'>
							<Button
								variant='outline'
								size='sm'
								className='text-green-600 hover:text-green-700 hover:bg-green-50'
								onClick={() => handleEditClick(member)}
							>
								<Edit className='w-4 h-4 mr-2' />
								Edit
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='text-red-600 hover:text-red-700 hover:bg-red-50'
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
				<EditStylistForm stylist={selectedMember} mode={mode} onClose={handleCloseModal} />
			</Modal>
		</PageContainer>
	);
}
