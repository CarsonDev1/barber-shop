import { SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { createService } from '@/app/api/service/createService';
import { updateService } from '@/app/api/service/updateService';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { getServiceTypes } from '@/app/api/service/getServiceType';

interface EditStylistFormProps {
	stylist: any;
	mode: 'add' | 'edit';
	onClose: () => void;
}

export default function EditStylistForm({ stylist, mode, onClose }: EditStylistFormProps) {
	const queryClient = useQueryClient();
	const [serviceTypeId, setServiceTypeId] = useState<string>(stylist?.serviceTypeId || '');
	const [imagesForRemoval, setImagesForRemoval] = useState<string[]>([]);

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

	// Mutation for updating an existing service
	const { mutate: mutateUpdateService } = useMutation({
		mutationFn: async (serviceData: FormData) => {
			await updateService(serviceData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataServices'] });
			Swal.fire({
				title: 'Success!',
				text: 'Service updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			onClose(); // Close the modal after success
		},
		onError: (error) => {
			console.error('Error updating service:', error);
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating the service.',
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

		// Ensure serviceTypeId is selected
		if (!serviceTypeId) {
			Swal.fire({
				title: 'Error!',
				text: 'Please select a valid service type.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return; // Don't submit the form if no service type is selected
		}

		formData.append('serviceTypeId', serviceTypeId); // Ensure valid serviceTypeId
		formData.append('name', (e.target as any).name.value);
		formData.append('description', (e.target as any).description.value);
		formData.append('price', (e.target as any).price.value);
		formData.append('estimateTime', (e.target as any).estimateTime.value);

		// Handle new images
		const images = (e.target as HTMLFormElement).images.files;
		if (images.length > 0) {
			Array.from(images).forEach((file) => {
				if (file instanceof File) {
					formData.append('new_images', file);
				}
			});
		}

		if (imagesForRemoval.length > 0) {
			formData.append('remove_images', JSON.stringify(imagesForRemoval));
		}

		// Trigger mutation based on the mode (add or edit)
		if (mode === 'edit') {
			formData.append('id', stylist.id);
			mutateUpdateService(formData);
		} else {
			mutateCreateService(formData);
		}
	};

	const handleImageRemove = (imageUrl: string) => {
		setImagesForRemoval((prev) => [...prev, imageUrl]);
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
						<div className='space-y-2'>
							{mode === 'edit' && stylist?.images?.length > 0 && (
								<div className='flex flex-wrap gap-4'>
									{stylist?.images
										?.filter((image: any) => !imagesForRemoval.includes(image.url))
										?.map((image: any) => (
											<div key={image.url} className='relative'>
												<Image src={image.url} alt={stylist.name} width={100} height={100} />
												<Button
													className='absolute top-0 right-0 bg-red-500 text-white'
													onClick={() => handleImageRemove(image.url)}
												>
													Remove
												</Button>
											</div>
										))}
								</div>
							)}
						</div>

						{/* Form Section */}
						<div className='grid gap-3'>
							{/* Service Type */}
							<div className='space-y-2'>
								<Label htmlFor='serviceTypeId'>Service Type</Label>
								<Select
									defaultValue={stylist?.serviceTypeId}
									onValueChange={(value) => setServiceTypeId(value)}
								>
									<SelectTrigger className='bg-gray-700/50 border-gray-600'>
										<SelectValue placeholder={'Select service type'} defaultValue={serviceTypeId} />
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

							{/* Other fields (name, description, price, estimate time, images) */}
							<div className='space-y-2'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									defaultValue={stylist?.name || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									defaultValue={stylist?.description || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='price'>Price</Label>
								<Input
									id='price'
									type='number'
									defaultValue={stylist?.price || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='estimateTime'>Estimated Time</Label>
								<Input
									id='estimateTime'
									type='number'
									defaultValue={stylist?.estimateTime || ''}
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='images'>Images</Label>
								<Input id='images' type='file' multiple className='bg-gray-700/50 border-gray-600' />
							</div>
						</div>
					</div>
				</CardContent>

				<div className='space-x-3'>
					<Button type='submit' variant='outline'>
						{mode === 'edit' ? 'Update Service' : 'Create Service'}
					</Button>
					<Button variant='ghost' onClick={onClose}>
						Cancel
					</Button>
				</div>
			</Card>
		</form>
	);
}
