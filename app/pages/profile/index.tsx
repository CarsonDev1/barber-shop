'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Pencil } from 'lucide-react';
import BackGroundRoot from '@/public/root/background-root.png';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccount } from '@/app/api/getProfile';
import { updateProfile } from '@/app/api/updateProfile';
import { updateAvatar } from '@/app/api/updateAvatar';
import Swal from 'sweetalert2';
import { UserProfile } from '@/types/Profile.type';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
	const [profileImage, setProfileImage] = useState('/placeholder.svg');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();
	const { t } = useTranslation('common');

	// Fetch profile data
	const { data: dataProfile } = useQuery<UserProfile>({
		queryKey: ['dataProfile'],
		queryFn: getAccount,
	});

	const [formData, setFormData] = useState<UserProfile>({
		id: 1,
		name: '',
		email: '',
		phone: '',
		dob: '',
		avatar: { id: 0, name: '', url: '', thumbUrl: profileImage, mediumUrl: '', createdAt: '', updatedAt: '' },
		verified: false,
		blocked: false,
		role: '',
		createdAt: '',
		updatedAt: '',
	});

	const { mutate: mutateUpdateProfile } = useMutation({
		mutationFn: async (profileData: UserProfile) => {
			const response = await updateProfile(profileData);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataProfile'] });
			Swal.fire({
				title: 'Success!',
				text: 'Profile updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: (error) => {
			console.error('Error updating profile:', error);
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating your profile.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Handle image selection
	const handleImageSelect = () => {
		fileInputRef.current?.click();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		if (name === 'dob') {
			const dateValue = new Date(value);
			const formattedDate = dateValue.toISOString().split('T')[0];
			setFormData((prev) => ({ ...prev, [name]: formattedDate }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	// Set profileImage initially based on dataProfile once it's available
	useEffect(() => {
		if (dataProfile) {
			setProfileImage(dataProfile.avatar.thumbUrl || '/placeholder.svg');
			setFormData({ ...dataProfile });
		}
	}, [dataProfile]);

	// Modify handleFileChange to set profileImage immediately
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const objectUrl = URL.createObjectURL(file);
			setProfileImage(objectUrl); // Update profileImage to show immediately
		}
	};

	// Validate profile data
	const validateForm = () => {
		const today = new Date();
		const dob = new Date(formData.dob);
		const age = today.getFullYear() - dob.getFullYear();
		const isRoleStaff = formData.role === 'ROLE_STAFF';
		const phonePattern = /^[0-9]{10}$/;
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		// Check if any required field is empty
		if (!formData.name || !formData.email || !formData.phone || !formData.dob) {
			Swal.fire({
				title: 'Error!',
				text: 'All fields must be filled.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return false;
		}

		// Check birthday validation: Age must be between 12 and 70
		if (age < 12 || age > 70) {
			Swal.fire({
				title: 'Error!',
				text: 'Your age must be between 12 and 70 years.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return false;
		}

		// If role is STAFF, age must be 18 or older
		if (isRoleStaff && age < 18) {
			Swal.fire({
				title: 'Error!',
				text: 'As a staff member, you must be at least 18 years old.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return false;
		}

		// Check phone number validation (10 digits)
		if (!phonePattern.test(formData.phone)) {
			Swal.fire({
				title: 'Error!',
				text: 'Phone number must be exactly 10 digits.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return false;
		}

		// Check email format validation
		if (!emailPattern.test(formData.email)) {
			Swal.fire({
				title: 'Error!',
				text: 'Please enter a valid email address.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return false;
		}

		return true;
	};

	// Handle avatar update on submit
	const handleSubmit = async () => {
		if (!validateForm()) return; // Stop if validation fails

		try {
			if (selectedFile) {
				// Update avatar if a new file is selected
				await updateAvatar(selectedFile);
				Swal.fire({
					title: 'Success!',
					text: 'Avatar updated successfully.',
					icon: 'success',
					confirmButtonText: 'OK',
				});
			}
			// Update other profile data
			mutateUpdateProfile(formData);
		} catch (error) {
			console.error('Error updating avatar:', error);
			Swal.fire({ title: 'Error!', text: 'Error uploading avatar.', icon: 'error', confirmButtonText: 'OK' });
		} finally {
			queryClient.invalidateQueries({ queryKey: ['dataProfile'] });
		}
	};

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
						<div className='flex flex-col items-center gap-4'>
							<div className='relative'>
								<div className='w-40 h-40 rounded-lg overflow-hidden bg-gray-800'>
									<Image
										src={profileImage}
										alt={dataProfile?.name || 'Profile Image'}
										width={160}
										height={160}
										className='w-full h-full object-cover'
									/>
								</div>
								<Button
									size='icon'
									variant='outline'
									onClick={handleImageSelect}
									className='absolute -top-2 -right-2 rounded-full w-8 h-8 bg-gray-900 border-gray-700 hover:bg-gray-800'
								>
									<Pencil className='w-4 h-4 text-white' />
								</Button>
								<input
									type='file'
									ref={fileInputRef}
									onChange={handleFileChange}
									className='hidden'
									accept='image/*'
								/>
							</div>
						</div>

						{/* Form Section */}
						<div className='space-y-6'>
							<div className='space-y-2'>
								<Label htmlFor='name'>{t('fullName')}</Label>
								<Input
									id='name'
									name='name'
									value={formData.name}
									onChange={(e) => handleChange(e)}
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='dob'>{t('birthday')}</Label>
								<div className='relative'>
									<Input
										id='dob'
										name='dob'
										type='date'
										value={formData.dob}
										onChange={(e) => handleChange(e)}
										className='bg-gray-800/50 border-gray-700 block'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='email'>{t('email')}</Label>
								<Input
									id='email'
									name='email'
									type='email'
									value={formData.email}
									onChange={(e) => handleChange(e)}
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='phone'>{t('phone')}</Label>
								<Input
									id='phone'
									name='phone'
									type='tel'
									value={formData.phone}
									onChange={(e) => handleChange(e)}
									className='bg-gray-800/50 border-gray-700'
								/>
							</div>

							<div className='flex gap-4 pt-4'>
								<Button
									className='flex-1 bg-amber-500 hover:bg-amber-600 text-black'
									onClick={() => setFormData(dataProfile || formData)}
								>
									Reset
								</Button>
								<Button
									className='flex-1 bg-amber-500 hover:bg-amber-600 text-black'
									onClick={handleSubmit}
								>
									Submit
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
