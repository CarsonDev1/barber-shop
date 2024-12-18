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
import { toast } from 'react-toastify';

interface Voucher {
	id: number;
	code: string;
	maxUses: number;
	discount: number;
	startDate: string;
	endDate: string;
	maxDiscount: number;
	disabled: boolean;
	minPrice: number;
	forRank: string;
}

const rankOptions = ['BRONZE', 'SILVER', 'GOLD', 'DIAMOND'];

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
		disabled: false,
		minPrice: 0,
		forRank: 'BRONZE',
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
			setIsDialogOpen(false);
			resetVoucherData();
		},
		onError: () => {
			toast.error('There was an error creating the voucher.', {
				autoClose: 5000,
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
			toast.error('There was an error updating the voucher.', {
				autoClose: 5000,
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
			forRank: 'BRONZE',
		});
	};

	// Handle form input changes
	const handleInputChange = (e: any) => {
		const { name, value, type, checked } = e.target;

		let newValue = value;
		if (type === 'number') {
			newValue = Math.max(0, Number(value)).toString();
		}

		// Kiểm tra ngày hợp lệ nhưng không chặn nhập liệu
		if (name === 'startDate' && new Date(newValue) > new Date(voucherData.endDate)) {
			Swal.fire({
				title: 'Error!',
				text: 'Start date cannot be later than the end date.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		}

		if (name === 'endDate' && new Date(newValue) < new Date(voucherData.startDate)) {
			// Thông báo lỗi nhưng không thay đổi giá trị
			Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				iconColor: 'red',
				didOpen: (toast) => {
					toast.addEventListener('mouseenter', Swal.stopTimer);
					toast.addEventListener('mouseleave', Swal.resumeTimer);
				},
			}).fire({
				icon: 'error',
				title: 'End date cannot be earlier than the start date.',
			});
		}

		if (name === 'disabled') {
			newValue = checked ? 'true' : 'false';
		}

		// Cập nhật dữ liệu form
		setVoucherData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : newValue,
		}));
	};

	// Validate form fields
	const validateForm = () => {
		if (!voucherData.code || !voucherData.discount || !voucherData.startDate || !voucherData.endDate) {
			toast.error('Please fill in all required fields (Voucher Code, Discount, Start Date, End Date)');
			return false;
		}

		if (new Date(voucherData.startDate) > new Date(voucherData.endDate)) {
			toast.error('Start date cannot be later than the end date.');
			return false;
		}

		return true;
	};

	// Submit handler
	const handleSubmit = () => {
		if (!validateForm()) {
			return; // Prevent form submission if validation fails
		}

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
						<TableHead>For Rank</TableHead>
						<TableHead>Start Date</TableHead>
						<TableHead>End Date</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginatedVouchers.map((voucher) => (
						<TableRow key={voucher.id}>
							<TableCell>{voucher.code}</TableCell>
							<TableCell>{voucher.discount}%</TableCell>
							<TableCell>{voucher.maxDiscount}</TableCell>
							<TableCell>{voucher.minPrice.toLocaleString()} VNĐ</TableCell>
							<TableCell>{voucher.forRank}</TableCell>
							<TableCell>{voucher.startDate}</TableCell>
							<TableCell>{voucher.endDate}</TableCell>
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
							<label htmlFor='forRank' className='block mb-1'>
								For Rank
							</label>
							<select
								name='forRank'
								id='forRank'
								className='w-full px-2 py-1 border rounded'
								value={voucherData.forRank}
								onChange={handleInputChange}
								required
							>
								{rankOptions.map((rank) => (
									<option key={rank} value={rank}>
										{rank}
									</option>
								))}
							</select>
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
