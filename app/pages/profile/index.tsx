'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronDown, Pencil, Upload } from 'lucide-react';
import BackGroundRoot from '@/public/root/background-root.png';
import Image from 'next/image';
import { useState } from 'react';

export default function ProfilePage() {
	const [profileImage, setProfileImage] = useState('/placeholder.svg');

	return (
		<div className='min-h-screen bg-black text-white sec-com relative'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-full'
			/>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-2xl md:text-3xl font-bold mb-8 text-center'>Edit profile</h1>
				<div className='bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6 md:p-8'>
					<div className='grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8'>
						{/* Profile Image Section */}
						<div className='flex flex-col items-center gap-4'>
							<div className='relative'>
								<div className='w-40 h-40 rounded-lg overflow-hidden bg-gray-800'>
									<Image
										src={profileImage}
										alt='Profile'
										width={160}
										height={160}
										className='w-full h-full object-cover'
									/>
								</div>
								<Button
									size='icon'
									variant='outline'
									className='absolute -top-2 -right-2 rounded-full w-8 h-8 bg-gray-900 border-gray-700 hover:bg-gray-800'
								>
									<Pencil className='w-4 h-4 text-white' />
								</Button>
							</div>
						</div>

						{/* Form Section */}
						<div className='space-y-6'>
							{/* Full Name */}
							<div className='space-y-2'>
								<Label htmlFor='fullName'>Full name</Label>
								<Input
									id='fullName'
									defaultValue='Tran Van Binh'
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>

							{/* Gender */}
							<div className='space-y-2'>
								<Label>Gender</Label>
								<RadioGroup defaultValue='male' className='flex gap-4'>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='male' id='male' />
										<Label htmlFor='male'>Male</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='female' id='female' />
										<Label htmlFor='female'>Female</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='other' id='other' />
										<Label htmlFor='other'>Other</Label>
									</div>
								</RadioGroup>
							</div>

							{/* Birthday */}
							<div className='space-y-2'>
								<Label htmlFor='birthday'>Birthday</Label>
								<div className='relative'>
									<Input
										id='birthday'
										defaultValue='19-01-2000'
										className='bg-gray-800/50 border-gray-700'
									/>
									<Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
								</div>
							</div>

							{/* Email */}
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									defaultValue='vanbinh.tran@gmail.com'
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>

							{/* Country */}
							<div className='space-y-2'>
								<Label htmlFor='country'>Country</Label>
								<Select defaultValue='danang'>
									<SelectTrigger className='bg-gray-800/50 border-gray-700'>
										<SelectValue placeholder='Select country' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='danang'>Da Nang</SelectItem>
										<SelectItem value='hanoi'>Ha Noi</SelectItem>
										<SelectItem value='hcm'>Ho Chi Minh</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Address */}
							<div className='space-y-2'>
								<Label htmlFor='address'>Address</Label>
								<Input
									id='address'
									defaultValue='Mai Dang Cho, Hoa Quy, Da Nang'
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>

							{/* Phone */}
							<div className='space-y-2'>
								<Label htmlFor='phone'>Phone</Label>
								<Input
									id='phone'
									type='tel'
									defaultValue='0987654321'
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>

							{/* Change Password */}
							<div className='space-y-2'>
								<Label htmlFor='password'>Change Password</Label>
								<Input
									id='password'
									type='password'
									defaultValue='************'
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>

							{/* Action Buttons */}
							<div className='flex gap-4 pt-4'>
								<Button className='flex-1 bg-amber-500 hover:bg-amber-600 text-black'>Edit</Button>
								<Button className='flex-1 bg-amber-500 hover:bg-amber-600 text-black'>Submit</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
