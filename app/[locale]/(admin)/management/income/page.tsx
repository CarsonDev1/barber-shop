'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Swal from 'sweetalert2';
import PageContainer from '@/app/components/page-container';
import { getSalary } from '@/app/api/salary/getSalary';
import { getSalaryById } from '@/app/api/salary/getSalaryById'; // Import your getSalaryById function
import { updateSalary } from '@/app/api/salary/updateSalary';

interface FormData {
	staff_id: number;
	rate: number;
	percentage: number;
}

const Income = () => {
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingSalary, setEditingSalary] = useState<any | null>(null);
	const [salaryDetails, setSalaryDetails] = useState<any | null>(null); // For showing details
	const [formData, setFormData] = useState<FormData>({
		staff_id: 0,
		rate: 0,
		percentage: 0,
	});

	const {
		data: salaryData,
		isLoading: isLoadingSalary,
		error: errorSalary,
	} = useQuery<any>({
		queryKey: ['dataSalary'],
		queryFn: getSalary,
	});

	const staffData = salaryData?.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(staffData.length / itemsPerPage);

	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return staffData.slice(startIndex, endIndex);
	};

	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	// Mutation for updating an existing salary
	const { mutate: mutateUpdateSalary } = useMutation({
		mutationFn: async (formData: FormData & { id: string }) => {
			const staffData = { ...formData };
			await updateSalary(staffData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataSalary'] });
			Swal.fire({
				title: 'Updated!',
				text: 'Staff member updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			setDialogOpen(false);
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating the staff member.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const handleUpdateSalary = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData && editingSalary?.id) {
			mutateUpdateSalary({ id: editingSalary.id, ...formData });
			setFormData({
				staff_id: 0,
				rate: 0,
				percentage: 0,
			});
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Salary cannot be empty, or Salary ID is invalid.',
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		}
	};

	const handleViewDetails = async (id: number) => {
		try {
			// Giả sử getSalaryById là một hàm lấy dữ liệu từ API trả về như bạn đã mô tả
			const response = await getSalaryById(id);

			// Kiểm tra xem response có đúng không
			if (response.status === 200) {
				const salaryDetails = response.payload; // Dữ liệu chi tiết ở trong trường 'payload'
				setSalaryDetails(salaryDetails); // Lưu dữ liệu vào state để hiển thị
				setDialogOpen(true); // Mở dialog
			} else {
				// Nếu không có dữ liệu hoặc lỗi
				Swal.fire({
					title: 'Error!',
					text: 'Failed to fetch salary details.',
					icon: 'error',
					confirmButtonText: 'OK',
				});
			}
		} catch (error) {
			Swal.fire({
				title: 'Error!',
				text: 'Failed to fetch salary details.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		}
	};

	const handleEditClick = (salary: any) => {
		if (salary?.id && salary.id > 0) {
			setEditingSalary(salary);
			setFormData({
				staff_id: salary.staff.id || 0,
				rate: salary.rate || 0,
				percentage: salary.percentage || 0,
			});
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

	return (
		<PageContainer>
			<div className='flex justify-between mb-4'>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button variant='default' onClick={() => setDialogOpen(true)}>
							{editingSalary ? 'Edit Salary' : 'Create Salary'}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{editingSalary ? 'Edit Salary' : 'Salary Details'}</DialogTitle>
						</DialogHeader>
						{/* Form or View Salary Details */}
						{editingSalary ? (
							<form onSubmit={handleUpdateSalary}>
								<div className='space-y-4'>
									<Input
										id='rate'
										name='rate'
										type='number'
										placeholder='Rate'
										className='w-full'
										value={formData.rate}
										onChange={(e) =>
											setFormData({ ...formData, rate: parseInt(e.target.value, 10) })
										}
										required
									/>
									<Input
										id='percentage'
										name='percentage'
										type='number'
										placeholder='Percentage'
										className='w-full'
										value={formData.percentage}
										onChange={(e) =>
											setFormData({ ...formData, percentage: parseInt(e.target.value, 10) })
										}
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
										{editingSalary ? 'Update' : 'Create'}
									</Button>
								</div>
							</form>
						) : salaryDetails ? (
							<div>
								<p>
									<strong>Staff Name:</strong> {salaryDetails.staff.name}
								</p>
								<p>
									<strong>Email:</strong> {salaryDetails.staff.email}
								</p>
								<p>
									<strong>Phone:</strong> {salaryDetails.staff.phone}
								</p>
								<p>
									<strong>Rate:</strong> {salaryDetails.rate}
								</p>
								<p>
									<strong>Percentage:</strong> {salaryDetails.percentage}%
								</p>
								<p>
									<strong>Date of Birth:</strong> {salaryDetails.staff.dob}
								</p>
								<p>
									<strong>Role:</strong> {salaryDetails.staff.role}
								</p>
								<p>
									<strong>Created At:</strong> {new Date(salaryDetails.createdAt).toLocaleString()}
								</p>
								<p>
									<strong>Updated At:</strong> {new Date(salaryDetails.updatedAt).toLocaleString()}
								</p>
							</div>
						) : (
							<p>No data available</p>
						)}
					</DialogContent>
				</Dialog>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Staff Name</TableHead>
						<TableHead>Rate</TableHead>
						<TableHead>Percentage</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{getCurrentPageItems().map((salary: any) => (
						<TableRow key={salary.id}>
							<TableCell>{salary.staff.name}</TableCell>
							<TableCell>{salary.rate}</TableCell>
							<TableCell>{salary.percentage}</TableCell>
							<TableCell>
								<Button onClick={() => handleEditClick(salary)} variant='outline'>
									Edit
								</Button>
								<Button onClick={() => handleViewDetails(salary.id)} variant='outline' className='ml-2'>
									View Details
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className='mt-4 flex justify-between'>
				<Button variant='outline' onClick={goToFirstPage} disabled={currentPage === 1}>
					<ChevronFirst />
				</Button>
				<Button variant='outline' onClick={goToPreviousPage} disabled={currentPage === 1}>
					<ChevronLeft />
				</Button>
				<Button variant='outline' onClick={goToNextPage} disabled={currentPage === totalPages}>
					<ChevronRight />
				</Button>
				<Button variant='outline' onClick={goToLastPage} disabled={currentPage === totalPages}>
					<ChevronLast />
				</Button>
			</div>
		</PageContainer>
	);
};

export default Income;
