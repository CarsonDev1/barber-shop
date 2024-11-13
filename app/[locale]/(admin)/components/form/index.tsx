import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { getServiceTypes } from '@/app/apis/service/getServiceType';

interface EditStylistFormProps {
	stylist: any;
	mode: 'add' | 'edit';
	onClose: () => void;
}

export default function EditStylistForm({ stylist, mode, onClose }: EditStylistFormProps) {
	const { data: serviceTypeData, isLoading: isLoadingServiceType } = useQuery<ApiResponseServiceType>({
		queryKey: ['dataServiceType'],
		queryFn: getServiceTypes,
	});

	const serviceTypes = serviceTypeData?.payload || [];

	const handleValueChange = (value: string) => {
		// Handle the serviceTypeId as a string now
		console.log('Selected Service Type ID:', value);
	};

	return (
		<div className='relative overflow-y-auto w-full'>
			<Card className='mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-4xl bg-gray-900 text-white relative z-10 px-4 py-6 sm:p-8 border-none'>
				<CardContent className='p-3'>
					<h1 className='mb-2 text-center text-2xl font-bold'>
						{mode === 'edit' ? 'Edit Service Information' : 'Add Service Information'}
					</h1>

					<div className='grid gap-6 sm:gap-8 md:grid-cols-[200px_1fr]'>
						{/* Profile Picture Section */}
						<div className='text-center'>
							<div className='relative mx-auto mb-3 h-32 w-32 sm:h-48 sm:w-48 overflow-hidden rounded-lg'>
								<Image
									src='/placeholder.svg?height=200&width=200'
									alt='Profile picture'
									fill
									className='object-cover'
								/>
								<div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100'>
									<Plus className='h-8 w-8' />
								</div>
							</div>
							<p className='text-sm text-gray-300'>Edit profile picture</p>
						</div>

						{/* Form Section */}
						<div className='grid gap-3'>
							{/* Service Type */}
							<div className='space-y-2'>
								<Label htmlFor='serviceTypeId'>Service Type</Label>
								<Select
									defaultValue={String(stylist?.serviceTypeId)} // Make sure it's a string here
									onValueChange={handleValueChange} // Pass a string here
								>
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

							{/* Other fields like Name, Description, etc. */}
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

							{/* Image upload section */}
							<div className='space-y-2'>
								<Label htmlFor='images'>Images</Label>
								<Input id='images' type='file' multiple className='bg-gray-700/50 border-gray-600' />
							</div>
						</div>

						{/* Buttons */}
						<div className='flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end'>
							<Button className='bg-orange-500 hover:bg-orange-600 text-black font-semibold'>
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
		</div>
	);
}
