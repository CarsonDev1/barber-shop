'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { getServiceTypes } from '@/app/api/service/getServiceType';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Swal from 'sweetalert2';
import PageContainer from '@/app/components/page-container';
import { createServiceType } from '@/app/api/service/createServiceType';
import { updateServiceType } from '@/app/api/service/updateServiceType';
import { deleteServiceType } from '@/app/api/service/deleteServiceType';

const ServiceType = () => {
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingServiceType, setEditingServiceType] = useState<any | null>(null);
	const [newServiceName, setNewServiceName] = useState('');

	const {
		data: serviceTypeData,
		isLoading: isLoadingServiceType,
		error: errorServiceType,
	} = useQuery<ApiResponseServiceType>({
		queryKey: ['dataServiceType'],
		queryFn: getServiceTypes,
	});

	const serviceTypes = serviceTypeData?.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(serviceTypes.length / itemsPerPage);

	// Mutation for creating a new service type
	const { mutate: mutateCreateService } = useMutation({
		mutationFn: async (name: string) => {
			const serviceData = { name };
			await createServiceType(serviceData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataServiceType'] });
			Swal.fire({
				title: 'Success!',
				text: 'Service Type created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			setDialogOpen(false);
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the service type.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Mutation for updating an existing service type
	const { mutate: mutateUpdateServiceType } = useMutation({
		mutationFn: async ({ id, name }: { id: number; name: string }) => {
			const serviceData = { id, name }; // Ensure both id and name are passed
			await updateServiceType(serviceData); // This will send {id, name} to the API
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataServiceType'] });
			Swal.fire({
				title: 'Updated!',
				text: 'Service Type updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			setEditingServiceType(null);
			setDialogOpen(false);
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating the service type.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Mutation for deleting a service type
	const { mutate: mutateDeleteServiceType } = useMutation({
		mutationFn: async (id: number) => {
			await deleteServiceType(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataServiceType'] });
			Swal.fire({
				title: 'Deleted!',
				text: 'Service Type deleted successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error deleting the service type.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const handleDeleteServiceType = (id: number) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'Cancel',
		}).then((result) => {
			if (result.isConfirmed) {
				mutateDeleteServiceType(id);
			}
		});
	};

	const handleEditServiceType = (serviceType: any) => {
		if (serviceType?.id && serviceType.id > 0) {
			setEditingServiceType(serviceType);
			setNewServiceName(serviceType.name);
			setDialogOpen(true);
		} else {
			Swal.fire({
				title: 'Error!',
				text: 'Invalid service type ID.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		}
	};

	const handleCreateServiceType = (e: React.FormEvent) => {
		e.preventDefault();
		if (newServiceName.trim()) {
			mutateCreateService(newServiceName);
			setNewServiceName('');
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Service Type Name cannot be empty.',
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		}
	};

	const handleUpdateServiceType = (e: React.FormEvent) => {
		e.preventDefault();
		// Check if ID and name are valid
		if (newServiceName.trim() && editingServiceType?.id > 0) {
			mutateUpdateServiceType({
				id: editingServiceType.id, // Ensure id is passed
				name: newServiceName, // Pass the updated name
			});
			setNewServiceName('');
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Service Type Name cannot be empty, or Service Type ID is invalid.',
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		}
	};

	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return serviceTypes.slice(startIndex, endIndex);
	};

	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='flex justify-between mb-4'>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button variant='default' onClick={() => setDialogOpen(true)}>
							{editingServiceType ? 'Edit Service Type' : 'Create Service Type'}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editingServiceType ? 'Edit Service Type' : 'Create Service Type'}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={editingServiceType ? handleUpdateServiceType : handleCreateServiceType}>
							<div className='space-y-4'>
								<Input
									id='name'
									name='name'
									placeholder='Service Type Name'
									className='w-full'
									value={newServiceName}
									onChange={(e) => setNewServiceName(e.target.value)}
									required
								/>
							</div>
							<div className='flex justify-end mt-4'>
								<Button
									variant='outline'
									type='button'
									className='mr-2'
									onClick={() => setDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button variant='default' type='submit'>
									{editingServiceType ? 'Update' : 'Create'}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
				<div className='overflow-x-auto'>
					{isLoadingServiceType ? (
						<div className='p-6 text-center text-gray-400'>Loading service types...</div>
					) : errorServiceType ? (
						<div className='p-6 text-center text-red-400'>Failed to load service types</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Service Id</TableHead>
									<TableHead>Service Type Name</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((serviceType) => (
									<TableRow key={serviceType.id}>
										<TableCell>{serviceType.id}</TableCell>
										<TableCell>{serviceType.name}</TableCell>
										<TableCell>
											<div className='flex space-x-2'>
												<Button
													variant='outline'
													className='bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-500'
													onClick={() => handleEditServiceType(serviceType)}
												>
													Edit
												</Button>
												<Button
													variant='outline'
													className='bg-red-500 text-white hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-500'
													onClick={() => handleDeleteServiceType(serviceType.id)}
												>
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</div>

			<div className='flex justify-between items-center mt-4'>
				<div className='flex space-x-2'>
					<Button onClick={goToFirstPage} disabled={currentPage === 1}>
						<ChevronFirst />
					</Button>
					<Button onClick={goToPreviousPage} disabled={currentPage === 1}>
						<ChevronLeft />
					</Button>
					<Button onClick={goToNextPage} disabled={currentPage === totalPages}>
						<ChevronRight />
					</Button>
					<Button onClick={goToLastPage} disabled={currentPage === totalPages}>
						<ChevronLast />
					</Button>
				</div>
				<div>
					Page {currentPage} of {totalPages}
				</div>
			</div>
		</PageContainer>
	);
};

export default ServiceType;
