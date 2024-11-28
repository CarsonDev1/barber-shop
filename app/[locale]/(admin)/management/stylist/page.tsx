'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import PageContainer from '@/app/components/page-container';
import { Modal } from '@/app/[locale]/(admin)/components/modal';
import { CustomersResponse, Customer } from '@/types/Customer.type';
import { useQuery } from '@tanstack/react-query';
import { getStaffs } from '@/app/apis/customer/getStaffs';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { getShift } from '@/app/apis/shifft/getShift';
import { createStaffShift } from '@/app/apis/staff-shift/createStaffShift';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FormData {
	name: string;
	email: string;
	phone: string;
	dob: string | null;
	password: string;
	role: 'ROLE_ADMIN' | 'ROLE_USER';
}

export default function Stylist() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isShiftModalOpen, setShiftModalOpen] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState<Customer | null>(null);
	const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
	const [shiftDate, setShiftDate] = useState<string>('');
	const [mode, setMode] = useState<'add' | 'edit'>('add');
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		phone: '',
		dob: '',
		password: '',
		role: 'ROLE_ADMIN',
	});

	const {
		data: staffData,
		isLoading: isLoadingStaffs,
		error: errorStaffs,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataStaffs'],
		queryFn: getStaffs,
	});

	const {
		data: ShiftData,
		isLoading: isLoadingShiftData,
		error: errorShiftData,
	} = useQuery<ApiResponseServiceType>({
		queryKey: ['dataShift'],
		queryFn: getShift,
	});

	const shifts = ShiftData?.payload || [];
	const members = staffData?.payload || [];
	const membersPerPage = 10;
	const totalPages = Math.ceil(members.length / membersPerPage);

	const getCurrentMembers = () => {
		const startIndex = (currentPage - 1) * membersPerPage;
		const endIndex = startIndex + membersPerPage;
		return members.slice(startIndex, endIndex);
	};

	const handleEditClick = (member: Customer) => {
		setSelectedMember(member);
		setMode('edit');
		setModalOpen(true);
	};

	const handleAddMemberClick = () => {
		setSelectedMember(null);
		setMode('add');
		setFormData({
			name: '',
			email: '',
			phone: '',
			dob: '',
			password: '',
			role: 'ROLE_ADMIN',
		});
		setModalOpen(true);
	};

	const handleSetShiftClick = (member: Customer) => {
		setSelectedMember(member);
		setShiftModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setShiftModalOpen(false);
	};

	const handleCreateShift = async () => {
		if (selectedMember && selectedShiftId && shiftDate) {
			try {
				const staffShiftData = {
					staffId: selectedMember.id,
					shiftId: selectedShiftId,
					date: shiftDate,
				};
				await createStaffShift(staffShiftData);
				Swal.fire({
					title: 'Success!',
					text: 'Staff shift has been set successfully.',
					icon: 'success',
					confirmButtonText: 'OK',
				});
				setShiftModalOpen(false);
			} catch (error) {
				Swal.fire({
					title: 'Error!',
					text: 'Failed to set staff shift.',
					icon: 'error',
					confirmButtonText: 'OK',
				});
			}
		}
	};

	// Handle form input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		// Handle form submission (add or edit member)
		console.log(formData);
	};

	return (
		<PageContainer>
			<Dialog open={isModalOpen} onOpenChange={setModalOpen}>
				<DialogTrigger>
					<Button
						className='fixed top-8 right-8 rounded-full shadow-lg border'
						size='lg'
						onClick={handleAddMemberClick}
					>
						<Plus className='w-6 h-6 mr-2' />
						ADD MEMBER
					</Button>
				</DialogTrigger>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>{mode === 'add' ? 'Add New Member' : 'Edit Member'}</DialogTitle>
					</DialogHeader>

					<div className='p-6'>
						<div className='mb-4'>
							<Label htmlFor='name' className='block text-sm font-medium text-gray-700'>
								Name:
							</Label>
							<Input
								type='text'
								id='name'
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								className='w-full p-2 border border-gray-300 rounded-lg'
							/>
						</div>

						<div className='mb-4'>
							<Label htmlFor='email' className='block text-sm font-medium text-gray-700'>
								Email:
							</Label>
							<Input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleInputChange}
								className='w-full p-2 border border-gray-300 rounded-lg'
							/>
						</div>

						<div className='mb-4'>
							<Label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
								Phone:
							</Label>
							<Input
								type='text'
								id='phone'
								name='phone'
								value={formData.phone}
								onChange={handleInputChange}
								className='w-full p-2 border border-gray-300 rounded-lg'
							/>
						</div>

						<div className='mb-4'>
							<Label htmlFor='dob' className='block text-sm font-medium text-gray-700'>
								Date of Birth:
							</Label>
							<Input
								type='date'
								id='dob'
								name='dob'
								value={formData.dob ?? ''}
								onChange={handleInputChange}
								className='w-full p-2 border border-gray-300 rounded-lg'
							/>
						</div>

						<div className='mb-4'>
							<Label htmlFor='password' className='block text-sm font-medium text-gray-700'>
								Password:
							</Label>
							<Input
								type='password'
								id='password'
								name='password'
								value={formData.password}
								onChange={handleInputChange}
								className='w-full p-2 border border-gray-300 rounded-lg'
							/>
						</div>

						<div className='mb-4'>
							<Label htmlFor='role' className='block text-sm font-medium text-gray-700'>
								Role:
							</Label>
							<select
								id='role'
								name='role'
								value={formData.role}
								onChange={handleInputChange}
								className='w-full p-2 border border-gray-300 rounded-lg'
							>
								<option value='ROLE_ADMIN'>Admin</option>
								<option value='ROLE_USER'>User</option>
							</select>
						</div>
					</div>

					<CardFooter>
						<Button onClick={handleSubmit}>Save</Button>
					</CardFooter>
				</DialogContent>
			</Dialog>

			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8'>
				{getCurrentMembers().map((member, index) => (
					<Card key={index} className='overflow-hidden transition-shadow hover:shadow-lg relative z-10'>
						<CardContent className='p-0'>
							<div className='relative h-48'>
								<Image src={member.avatar.thumbUrl} alt='avt' fill className='object-contain' />
								<span className='absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded'>
									{member.role}
								</span>
							</div>
							<div className='p-4'>
								<h3 className='font-bold text-lg mb-1'>{member.name}</h3>
								<p className='text-sm text-gray-600'>{member.phone}</p>
								<p className='text-sm text-gray-600'>{member.verified}</p>
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
								className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
								onClick={() => handleSetShiftClick(member)}
							>
								Set Staff Shift
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

			<div className='flex justify-center gap-4 items-center'>
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

			{/* Modal to set staff shift */}
			<Modal isOpen={isShiftModalOpen} onClose={handleCloseModal}>
				<div className='p-6'>
					<h2 className='text-2xl font-semibold mb-4'>Set Staff Shift</h2>
					{/* Shift selection */}
					<div className='mb-4'>
						<Label htmlFor='shiftSelect' className='block text-sm font-medium text-gray-700'>
							Select Shift:
						</Label>
						<select
							id='shiftSelect'
							value={selectedShiftId || ''}
							onChange={(e) => setSelectedShiftId(Number(e.target.value))}
							className='w-full p-2 border border-gray-300 rounded-lg'
						>
							<option value=''>Select Shift</option>
							{shifts.map((shift) => (
								<option key={shift.id} value={shift.id}>
									{shift.name}
								</option>
							))}
						</select>
					</div>
					{/* Date selection */}
					<div className='mb-4'>
						<Label htmlFor='shiftDate' className='block text-sm font-medium text-gray-700'>
							Select Date:
						</Label>
						<Input
							type='date'
							id='shiftDate'
							value={shiftDate}
							onChange={(e) => setShiftDate(e.target.value)}
							className='w-full p-2 border border-gray-300 rounded-lg'
						/>
					</div>
					{/* Set Shift Button */}
					<Button onClick={handleCreateShift} className='w-full bg-green-600 text-white'>
						Set Shift
					</Button>
				</div>
			</Modal>
		</PageContainer>
	);
}
