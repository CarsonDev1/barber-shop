'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Logo from '@/public/root/Logo.png';
import Link from 'next/link';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Define the validation schema with Zod
const schema = z
	.object({
		name: z.string().min(1, { message: 'Name is required' }),
		email: z.string().email({ message: 'Invalid email address' }),
		phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
		dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: 'Invalid date of birth',
		}),
		password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

// Define the type for the form data
type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: FormData) => {
		if (data.password !== data.confirmPassword) {
			setError('confirmPassword', {
				type: 'manual',
				message: "Passwords don't match",
			});
			return;
		}

		setLoading(true);
		try {
			const response = await api.post('/auth/register', {
				name: data.name,
				email: data.email,
				phone: data.phone,
				dob: data.dob, // Send dob field
				password: data.password,
				re_password: data.confirmPassword,
			});

			if (response?.data.status === 400) {
				toast.error(response.data.message);
			} else {
				toast.success('Registration successful!');
				router.push('/verify-email');
			}
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Registration failed');
			console.error('Registration error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative'>
			<Image
				src='/root/background-root.png'
				alt='Barber Shop Background'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full h-full object-cover'
			/>
			<div className='absolute inset-0 bg-black bg-opacity-50'></div>
			<div className='w-full max-w-lg relative pb-4 pt-20 px-8 rounded-lg bg-black bg-opacity-100 border border-gray-400'>
				<div className='absolute top-5 right-5'>
					<Image src={Logo} alt='Barber Shop Logo' width={80} height={80} className='w-20 h-20' />
				</div>
				<div className='space-y-6 mb-8'>
					<h1 className='text-2xl font-bold text-white text-center'>REGISTER</h1>
				</div>
				<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
					{/* Name Field */}
					<div>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Full Name'
							type='text'
							{...register('name')}
						/>
						{errors.name && <p className='text-red-500'>{errors.name.message}</p>}
					</div>

					{/* Email Field */}
					<div>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Email'
							type='email'
							{...register('email')}
						/>
						{errors.email && <p className='text-red-500'>{errors.email.message}</p>}
					</div>

					{/* Phone Field */}
					<div>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Phone Number'
							type='tel'
							{...register('phone')}
						/>
						{errors.phone && <p className='text-red-500'>{errors.phone.message}</p>}
					</div>

					{/* Date of Birth Field */}
					<div>
						<Input
							className='h-12 bg-gray-200 block text-black placeholder:text-gray-500 text-lg w-full'
							placeholder='Date of Birth'
							type='date'
							{...register('dob')}
						/>
						{errors.dob && <p className='text-red-500'>{errors.dob.message}</p>}
					</div>

					{/* Password Field */}
					<div className='relative'>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Password'
							type={showPassword ? 'text' : 'password'}
							{...register('password')}
						/>
						<span
							className='absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer'
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{showPassword ? '👁️' : '👁️‍🗨️'}
						</span>
						{errors.password && <p className='text-red-500'>{errors.password.message}</p>}
					</div>

					{/* Confirm Password Field */}
					<div className='relative'>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Confirm Password'
							type={showConfirmPassword ? 'text' : 'password'}
							{...register('confirmPassword')}
						/>
						<span
							className='absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer'
							onClick={() => setShowConfirmPassword((prev) => !prev)}
						>
							{showConfirmPassword ? '👁️' : '👁️‍🗨️'}
						</span>
						{errors.confirmPassword && (
							<p className='text-red-500 text-center'>{errors.confirmPassword.message}</p>
						)}
					</div>

					{/* Submit Button */}
					<div className='mt-6 flex flex-col gap-2'>
						<Button
							className='w-full h-12 text-lg font-bold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'
							type='submit'
							disabled={loading}
						>
							{loading ? 'Registering...' : 'REGISTER'}
						</Button>
						<p className='text-center text-gray-400 mt-4'>
							Already have an account?{' '}
							<Link href='/login' className='text-[#F5A524] hover:underline'>
								Log in
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
