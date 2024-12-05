'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageContainer from '@/app/components/page-container';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { getVouchers } from '@/app/api/voucher/getVoucher';
import { createVoucher } from '@/app/api/voucher/createVoucher';
import { deleteVoucher } from '@/app/api/voucher/deleteVoucher';
import { updateVoucher } from '@/app/api/voucher/updateVoucher';

interface Voucher {
	id: number;
	code: string;
	maxUses: number;
	discount: number;
	maxDiscount: number;
	startDate: string;
	endDate: string;
	minPrice: number;
	disabled: boolean;
}

const VoucherManagement = () => {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
	const [voucherData, setVoucherData] = useState<Voucher>({
		id: 0,
		code: '',
		maxUses: 0,
		discount: 0,
		maxDiscount: 0,
		startDate: '',
		endDate: '',
		minPrice: 0,
		disabled: false,
	});

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	// Fetch vouchers data
	const {
		data: vouchersData,
		isLoading: isLoadingVoucher,
		error: errorVoucher,
	} = useQuery({
		queryKey: ['dataVouchers'],
		queryFn: getVouchers,
	});

	const { mutate: mutateDeleteVoucher } = useMutation({
		mutationFn: async (id: number) => {
			await deleteVoucher(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataVouchers'] });
			Swal.fire({
				title: 'Deleted!',
				text: 'Voucher deleted successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error deleting the voucher.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const handleDeleteVoucher = (id: number) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'Cancel',
		}).then((result) => {
			if (result.isConfirmed) {
				mutateDeleteVoucher(id);
			}
		});
	};

	// Create voucher mutation
	const { mutate: mutateCreateVoucher } = useMutation({
		mutationFn: async () => {
			await createVoucher(voucherData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataVouchers'] });
			Swal.fire({
				title: 'Success!',
				text: 'Voucher created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			setIsDialogOpen(false); // Close dialog after successful create
			resetVoucherData(); // Reset the form
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the voucher.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Update voucher mutation
	const { mutate: mutateUpdateVoucher } = useMutation({
		mutationFn: async () => {
			await updateVoucher(voucherData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataVouchers'] });
			Swal.fire({
				title: 'Success!',
				text: 'Voucher updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			setIsDialogOpen(false); // Close dialog after successful update
			resetVoucherData(); // Reset the form
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating the voucher.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Reset form data
	const resetVoucherData = () => {
		setVoucherData({
			id: 0,
			code: '',
			maxUses: 0,
			discount: 0,
			maxDiscount: 0,
			startDate: '',
			endDate: '',
			minPrice: 0,
			disabled: false,
		});
	};

	// Handle form input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;

		let newValue = value;
		if (type === 'number') {
			newValue = Math.max(0, Number(value)).toString();
		}

		// Validate Discount and Max Discount constraints
		if (name === 'discount' || name === 'maxDiscount') {
			// Ensure Discount and Max Discount are not smaller than 0
			if (Number(newValue) < 0) {
				newValue = '0';
			}

			// Ensure Max Discount is not smaller than Discount
			if (name === 'maxDiscount' && Number(newValue) < Number(voucherData.discount)) {
				newValue = voucherData.discount.toString(); // Set maxDiscount to the value of discount if it's smaller
			}
		}

		// Ensure Max Discount is not more than 100
		if (name === 'discount' && Number(newValue) > 100) {
			newValue = '100'; // Limit discount to 100%
		}

		if (name === 'maxDiscount' && Number(newValue) > 100) {
			newValue = '100'; // Limit maxDiscount to 100%
		}

		if (name === 'minPrice' && Number(newValue) < 0) {
			newValue = '0'; // Prevent minPrice from being negative
		}

		if (name === 'startDate' && new Date(newValue) < new Date()) {
			newValue = new Date().toISOString().split('T')[0]; // Prevent past startDate
		}

		if (name === 'endDate' && new Date(newValue) > new Date('2030-12-31')) {
			newValue = '2030-12-31'; // Prevent endDate from exceeding 2030
		}

		if (name === 'disabled') {
			newValue = checked ? 'true' : 'false';
		}

		setVoucherData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : newValue,
		}));
	};

	// Submit handler
	const handleSubmit = () => {
		if (voucherData.id > 0) {
			mutateUpdateVoucher(); // Update voucher
		} else {
			mutateCreateVoucher(); // Create voucher
		}
	};

	// Open dialog with voucher data for editing
	const openDetailDialog = (voucher: Voucher) => {
		setSelectedVoucher(voucher);
		setVoucherData(voucher);
		setIsDialogOpen(true);
	};

	// Pagination logic
	const vouchers = vouchersData?.payload || [];
	const paginatedVouchers = vouchers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	if (isLoadingVoucher) return <PageContainer>Loading...</PageContainer>;
	if (errorVoucher) return <PageContainer>Error loading voucher data.</PageContainer>;

	return (
		<PageContainer>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-semibold mb-6'>Voucher Management</h2>
				<Button className='bg-green-600 hover:bg-green-700' onClick={() => setIsDialogOpen(true)}>
					Add Voucher
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Voucher Code</TableHead>
						<TableHead>Discount</TableHead>
						<TableHead>Max Discount</TableHead>
						<TableHead>Min Price</TableHead>
						<TableHead>Start Date</TableHead>
						<TableHead>End Date</TableHead>
						{/* <TableHead>Disabled</TableHead> */}
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginatedVouchers.map((voucher) => (
						<TableRow key={voucher.id}>
							<TableCell>{voucher.code}</TableCell>
							<TableCell>{voucher.discount}%</TableCell>
							<TableCell>{voucher.maxDiscount}%</TableCell>
							<TableCell>{voucher.minPrice.toLocaleString()} VNĐ</TableCell>
							<TableCell>{voucher.startDate}</TableCell>
							<TableCell>{voucher.endDate}</TableCell>
							{/* <TableCell>{voucher.disabled ? <span>True</span> : <span>False</span>}</TableCell> */}
							<TableCell>
								<Button variant='secondary' size='sm' onClick={() => openDetailDialog(voucher)}>
									Update
								</Button>
							</TableCell>
							<TableCell>
								<Button variant='destructive' onClick={() => handleDeleteVoucher(voucher.id)}>
									Delete
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
					disabled={currentPage * itemsPerPage >= vouchers.length}
					onClick={() => setCurrentPage(currentPage + 1)}
				>
					Next
				</Button>
			</div>

			{/* Add Voucher Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogOverlay />
				<DialogContent className='bg-white p-6 rounded-lg shadow-lg'>
					<h3 className='text-xl font-semibold mb-6 text-center'>
						{voucherData.id ? 'Update Voucher' : 'Add New Voucher'}
					</h3>

					<div className='space-y-4'>
						<div>
							<label htmlFor='code' className='block text-sm font-medium text-gray-700'>
								Voucher Code
							</label>
							<input
								id='code'
								name='code'
								placeholder='Voucher Code'
								value={voucherData.code}
								onChange={handleInputChange}
								className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>

						<div>
							<label htmlFor='discount' className='block text-sm font-medium text-gray-700'>
								Discount
							</label>
							<input
								id='discount'
								name='discount'
								type='number'
								placeholder='Discount'
								value={voucherData.discount}
								onChange={handleInputChange}
								className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>

						<div>
							<label htmlFor='maxDiscount' className='block text-sm font-medium text-gray-700'>
								Max Discount
							</label>
							<input
								id='maxDiscount'
								name='maxDiscount'
								type='number'
								placeholder='Max Discount'
								value={voucherData.maxDiscount}
								onChange={handleInputChange}
								className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>

						<div>
							<label htmlFor='minPrice' className='block text-sm font-medium text-gray-700'>
								Min Price
							</label>
							<input
								id='minPrice'
								name='minPrice'
								type='number'
								placeholder='Min Price'
								value={voucherData.minPrice}
								onChange={handleInputChange}
								className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>

						<div>
							<label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
								Start Date
							</label>
							<input
								id='startDate'
								name='startDate'
								type='date'
								value={voucherData.startDate}
								onChange={handleInputChange}
								className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>

						<div>
							<label htmlFor='endDate' className='block text-sm font-medium text-gray-700'>
								End Date
							</label>
							<input
								id='endDate'
								name='endDate'
								type='date'
								value={voucherData.endDate}
								onChange={handleInputChange}
								className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>

						{/* <div className='flex items-center'>
							<input
								id='disabled'
								type='checkbox'
								name='disabled'
								checked={voucherData.disabled}
								onChange={handleInputChange}
								className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
							/>
							<label htmlFor='disabled' className='ml-2 text-sm text-gray-700'>
								Disabled
							</label>
						</div> */}

						<Button
							onClick={handleSubmit}
							className='mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700'
						>
							Submit
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</PageContainer>
	);
};

export default VoucherManagement;
