'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageContainer from '@/app/components/page-container';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Dialog, DialogTrigger, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import Select, { MultiValue } from 'react-select';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { getServices } from '@/app/apis/service/getServices';
import { getCombos } from '@/app/apis/combo/getCombo';
import { createCombo } from '@/app/apis/combo/createCombo';

interface Service {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Array<{
		id: number;
		name: string;
		url: string;
		thumbUrl: string;
		mediumUrl: string;
	}>;
}

interface Combo {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Array<{
		id: number;
		name: string;
		url: string;
		thumbUrl: string;
		mediumUrl: string;
	}>;
	services: Service[];
}

const ComboManagement = () => {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
	const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
	const [comboData, setComboData] = useState({
		serviceIds: [] as number[],
		name: '',
		description: '',
		price: 0,
		estimateTime: 0,
		images: [] as File[],
	});
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const {
		data: combosData,
		isLoading: isLoadingCombos,
		error: errorCombos,
	} = useQuery({
		queryKey: ['dataCombos'],
		queryFn: getCombos,
	});

	const {
		data: servicesData,
		isLoading: isLoadingServices,
		error: errorServices,
	} = useQuery({
		queryKey: ['dataServices'],
		queryFn: getServices,
	});

	const services = servicesData?.payload || [];
	const serviceOptions = services.map((service) => ({
		value: service.id,
		label: service.name,
	}));

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setComboData((prev) => ({
				...prev,
				images: [files[0]],
			}));
		}
	};

	const { mutate: mutateCreateCombo } = useMutation({
		mutationFn: async () => {
			const formData = new FormData();
			formData.append('name', comboData.name);
			formData.append('description', comboData.description);
			formData.append('price', comboData.price.toString());
			formData.append('estimateTime', comboData.estimateTime.toString());
			if (comboData.images[0]) {
				formData.append('images', comboData.images[0]);
			}
			comboData.serviceIds.forEach((id, index) => {
				formData.append(`serviceIds[${index}]`, id.toString());
			});

			await createCombo(formData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataCombos'] });
			Swal.fire({
				title: 'Success!',
				text: 'Combo created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			setIsDialogOpen(false);
		},
		onError: (error) => {
			console.error('Error creating combo:', error);
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the combo.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setComboData({
			...comboData,
			[e.target.name]: e.target.value,
		});
	};

	const handleServiceSelect = (selectedOptions: MultiValue<{ value: number; label: string }>) => {
		const selectedIds = selectedOptions.map((option) => option.value);
		setComboData((prev) => ({
			...prev,
			serviceIds: selectedIds,
		}));
	};

	const handleSubmit = () => {
		mutateCreateCombo();
	};

	const openDetailDialog = (combo: Combo) => {
		setSelectedCombo(combo);
		setIsDetailDialogOpen(true);
	};

	if (isLoadingCombos) return <PageContainer>Loading...</PageContainer>;
	if (errorCombos) return <PageContainer>Error loading combos data.</PageContainer>;

	const combos = combosData?.payload || [];
	const paginatedCombos = combos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	return (
		<PageContainer>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-semibold mb-6'>Combo Management</h2>
				<Button className='bg-green-600 hover:bg-green-700' onClick={() => setIsDialogOpen(true)}>
					Add Combo
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Combo Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Estimate Time</TableHead>
						<TableHead>Image</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginatedCombos.map((combo) => (
						<TableRow key={combo.id}>
							<TableCell>{combo.name}</TableCell>
							<TableCell>{combo.description}</TableCell>
							<TableCell>{combo.price.toLocaleString()} VND</TableCell>
							<TableCell>{combo.estimateTime} min</TableCell>
							<TableCell>
								<Image src={combo.images[0].thumbUrl} width={100} height={100} alt='combo image' />
							</TableCell>
							<TableCell>
								<Button variant='secondary' size='sm' onClick={() => openDetailDialog(combo)}>
									View Details
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Pagination Controls */}
			<div className='flex justify-center gap-4 items-center mt-4'>
				<Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
					Previous
				</Button>
				<span>Page {currentPage}</span>
				<Button
					disabled={currentPage * itemsPerPage >= combos.length}
					onClick={() => setCurrentPage(currentPage + 1)}
				>
					Next
				</Button>
			</div>

			{/* Add Combo Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogOverlay />
				<DialogContent className='bg-white p-6'>
					<h3 className='text-xl font-semibold mb-4'>Add New Combo</h3>
					<input
						name='name'
						placeholder='Name'
						value={comboData.name}
						onChange={handleInputChange}
						className='mb-2 p-2 border'
					/>
					<textarea
						name='description'
						placeholder='Description'
						value={comboData.description}
						onChange={handleInputChange}
						className='mb-2 p-2 border'
					/>
					<label>Price</label>
					<input
						name='price'
						type='number'
						placeholder='Price'
						value={comboData.price}
						onChange={handleInputChange}
						className='mb-2 p-2 border'
					/>
					<label>Estimate Time</label>
					<input
						name='estimateTime'
						type='number'
						placeholder='Estimate Time'
						value={comboData.estimateTime}
						onChange={handleInputChange}
						className='mb-2 p-2 border'
					/>
					<input type='file' accept='image/*' onChange={handleImageChange} className='mb-2 p-2 border' />
					<div className='mb-4'>
						<h4>Select Services</h4>
						<Select
							isMulti
							options={serviceOptions}
							onChange={handleServiceSelect}
							placeholder='Select services'
						/>
					</div>

					<Button onClick={handleSubmit} className='mt-4 bg-blue-600 hover:bg-blue-700'>
						Submit
					</Button>
				</DialogContent>
			</Dialog>

			{/* View Detail Dialog */}
			{selectedCombo && (
				<Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
					<DialogOverlay />
					<DialogContent className='bg-white p-6'>
						<h3 className='text-xl font-semibold mb-4'>Combo Details</h3>
						<p>
							<strong>Name:</strong> {selectedCombo.name}
						</p>
						<p>
							<strong>Description:</strong> {selectedCombo.description}
						</p>
						<p>
							<strong>Price:</strong> {selectedCombo.price.toLocaleString()} VND
						</p>
						<p>
							<strong>Estimate Time:</strong> {selectedCombo.estimateTime} min
						</p>
						<h4 className='mt-4 mb-2'>Services Included:</h4>
						<ul>
							{selectedCombo.services.map((service) => (
								<li key={service.id}>{service.name}</li>
							))}
						</ul>
						<Button className='mt-4' onClick={() => setIsDetailDialogOpen(false)}>
							Close
						</Button>
					</DialogContent>
				</Dialog>
			)}
		</PageContainer>
	);
};

export default ComboManagement;
