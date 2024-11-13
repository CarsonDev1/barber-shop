'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { getServiceTypes } from '@/app/apis/service/getServiceType';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Swal from 'sweetalert2';
import PageContainer from '@/app/components/page-container';
import { createServiceType } from '@/app/apis/service/createServiceType';

const ServiceType = () => {
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false); // State for dialog open/close
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
		},
		onError: (error) => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the service type.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const [newServiceName, setNewServiceName] = useState('');

	// Handle form submission for creating a new service type
	const handleCreateServiceType = (e: React.FormEvent) => {
		e.preventDefault();
		if (newServiceName.trim()) {
			mutateCreateService(newServiceName);
			setNewServiceName('');
			setDialogOpen(false); // Close dialog on success
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Service Type Name cannot be empty.',
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
							Create Service Type
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Service Type</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleCreateServiceType}>
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
									Create
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
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((serviceType) => (
									<TableRow key={serviceType.id}>
										<TableCell>{serviceType.id}</TableCell>
										<TableCell>{serviceType.name}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</div>

			<div className='flex items-center justify-between mt-4'>
				<div className='flex items-center space-x-2'>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToFirstPage}
						disabled={currentPage === 1}
					>
						<ChevronFirst className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToPreviousPage}
						disabled={currentPage === 1}
					>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<span className='text-sm text-gray-400'>
						Page <span className='text-white'>{currentPage}</span> of {totalPages}
					</span>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToNextPage}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToLastPage}
						disabled={currentPage === totalPages}
					>
						<ChevronLast className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</PageContainer>
	);
};

export default ServiceType;
