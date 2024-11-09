'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface EditStylistFormProps {
	stylist: any;
	mode: 'add' | 'edit';
	onClose: () => void;
}

export default function EditStylistForm({ stylist, mode, onClose }: EditStylistFormProps) {
	return (
		<div className='relative overflow-y-auto w-full'>
			<Card className='mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-4xl bg-gray-900 text-white relative z-10 px-4 py-6 sm:p-8 border-none'>
				<CardContent className='p-3'>
					<h1 className='mb-2 text-center text-2xl font-bold'>
						{mode === 'edit' ? 'Edit Stylist Information' : 'Add Stylist Information'}
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
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='fullname'>Full name</Label>
									<Input
										id='fullname'
										defaultValue='Ngo Duy Hieu'
										className='bg-gray-700/50 border-gray-600'
									/>
								</div>
								<div className='space-y-2'>
									<Label className='text-white'>Gender</Label>
									<RadioGroup defaultValue='male' className='flex gap-4'>
										<RadioGroupItem
											value='male'
											id='male'
											className='checked:bg-white text-white'
										/>
										<Label htmlFor='male' className='text-white'>
											Male
										</Label>
										<RadioGroupItem
											value='female'
											id='female'
											className='checked:bg-white text-white'
										/>
										<Label htmlFor='female' className='text-white'>
											Female
										</Label>
										<RadioGroupItem
											value='other'
											id='other'
											className='checked:bg-white text-white'
										/>
										<Label htmlFor='other' className='text-white'>
											Other
										</Label>
									</RadioGroup>
								</div>
							</div>
							{/* Birthday and Identity */}
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='birthday'>Birthday</Label>
									<Input
										id='birthday'
										type='date'
										defaultValue='2002-06-12'
										className='bg-gray-700/50 border-gray-600 block'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='identity'>Identity number</Label>
									<Input
										id='identity'
										defaultValue='2031212121'
										className='bg-gray-700/50 border-gray-600'
									/>
								</div>
							</div>
							{/* Position */}
							<div className='space-y-2'>
								<Label htmlFor='position'>Position</Label>
								<Select defaultValue='stylist'>
									<SelectTrigger className='bg-gray-700/50 border-gray-600'>
										<SelectValue placeholder='Select position' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='stylist'>Stylist</SelectItem>
										<SelectItem value='senior'>Senior Stylist</SelectItem>
										<SelectItem value='manager'>Manager</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{/* Email, Address */}
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										defaultValue='ngoduyhieu@gmail.com'
										className='bg-gray-700/50 border-gray-600'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='address'>Address</Label>
									<Input
										id='address'
										defaultValue='Vinh Dien, Dien Ban, Quang Nam'
										className='bg-gray-700/50 border-gray-600'
									/>
								</div>
							</div>
							{/* Phone and Stylist ID */}
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='phone'>Phone</Label>
									<Input
										id='phone'
										defaultValue='0987654321'
										className='bg-gray-700/50 border-gray-600'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='stylishId'>Stylish ID</Label>
									<Input
										id='stylishId'
										defaultValue='00000001'
										className='bg-gray-700/50 border-gray-600'
									/>
								</div>
							</div>
							{/* Bio */}
							<div className='space-y-2'>
								<Label htmlFor='bio'>Bio</Label>
								<Textarea
									id='bio'
									defaultValue='Hair care and styling techniques'
									className='bg-gray-700/50 border-gray-600'
								/>
							</div>
							{/* Specialization */}
							<div className='space-y-2'>
								<Label htmlFor='specialization'>Specialization</Label>
								<Textarea
									id='specialization'
									defaultValue='5 years experience\nWorked with Sinh Do, a top stylist'
									className='bg-gray-700/50 border-gray-600'
									rows={3}
								/>
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
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
