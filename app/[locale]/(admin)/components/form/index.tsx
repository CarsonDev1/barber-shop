'use client';

import { SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { createService } from '@/app/apis/service/createService';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { getServiceTypes } from '@/app/apis/service/getServiceType';

interface EditStylistFormProps {
	stylist: any;
	mode: 'add' | 'edit';
	onClose: () => void;
}

export default function EditStylistForm({ stylist, mode, onClose }: EditStylistFormProps) {
	const queryClient = useQueryClient();
	const [serviceTypeId, setServiceTypeId] = useState<string>(stylist?.serviceTypeId || '');

	// Mutation for creating a new service
	const { mutate: mutateCreateService } = useMutation({
		mutationFn: async (serviceData: FormData) => {
			await createService(serviceData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataServices'] });
			Swal.fire({
				title: 'Success!',
				text: 'Service created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			onClose(); // Close the modal after success
		},
		onError: (error) => {
			console.error('Error creating service:', error);
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the service.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Fetch service types for dropdown
	const { data: serviceTypeData, isLoading: isLoadingServiceType } = useQuery<ApiResponseServiceType>({
		queryKey: ['dataServiceType'],
		queryFn: getServiceTypes,
	});

	const serviceTypes = serviceTypeData?.payload || [];

	// Handle form submission
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('serviceTypeId', serviceTypeId);
		formData.append('name', (e.target as any).name.value);
		formData.append('description', (e.target as any).description.value);
		formData.append('price', (e.target as any).price.value);
		formData.append('estimateTime', (e.target as any).estimateTime.value);

		// Append files to FormData
		const images = (e.target as HTMLFormElement).images.files;
		if (images) {
			Array.from(images).forEach((file) => {
				if (file instanceof File) {
					formData.append('images', file);
				}
			});
		}

		// Trigger mutation
		mutateCreateService(formData);
	};

	return (
		<form onSubmit={handleFormSubmit} className='relative overflow-y-auto w-full'>
			<Card className='mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-4xl bg-gray-900 text-white relative z-10 px-4 py-2 sm:p-3 border-none'>
				<CardContent className='p-3'>
					<h1 className='mb-2 text-center text-2xl font-bold'>
						{mode === 'edit' ? 'Edit Service Information' : 'Add Service Information'}
					</h1>

					<div className='flex flex-col gap-3'>
						{/* Profile Picture Section */}

						{/* Form Section */}
						<div className='grid gap-3'>
							{/* Service Type */}
							<div className='space-y-2'>
								<Label htmlFor='serviceTypeId'>Service Type</Label>
								<Select defaultValue={serviceTypeId} onValueChange={(value) => setServiceTypeId(value)}>
									<SelectTrigger className='bg-gray-700/50 border-gray-600'>
										<SelectValue placeholder='Select service type' />
									</SelectTrigger>
									<SelectContent>
										{serviceTypes.map((type) => (
											<SelectItem key={type.id} value={String(type.id)}>
												{type.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Name */}
							<div className='space-y-2'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									defaultValue={stylist?.name || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							{/* Description */}
							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									defaultValue={stylist?.description || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							{/* Price */}
							<div className='space-y-2'>
								<Label htmlFor='price'>Price</Label>
								<Input
									id='price'
									type='number'
									defaultValue={stylist?.price || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							{/* Estimated Time */}
							<div className='space-y-2'>
								<Label htmlFor='estimateTime'>Estimated Time</Label>
								<Input
									id='estimateTime'
									type='number'
									defaultValue={stylist?.estimateTime || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							{/* Images */}
							<div className='space-y-2'>
								<Label htmlFor='images'>Images</Label>
								<Input id='images' type='file' multiple className='bg-gray-700/50 border-gray-600' />
							</div>
						</div>

						{/* Buttons */}
						<div className='flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end'>
							<Button
								type='submit'
								className='bg-orange-500 hover:bg-orange-600 text-black font-semibold'
							>
								{mode === 'edit' ? 'UPDATE' : 'ADD'}
							</Button>
							<Button
								variant='outline'
								className='border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
								onClick={onClose}
							>
								CANCEL
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
