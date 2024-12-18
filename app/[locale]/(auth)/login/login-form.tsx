'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Logo from '@/public/root/Logo.png';
import Google from '@/public/root/google.png';
import Meta from '@/public/root/meta.png';
import Apple from '@/public/root/apple.png';
import BackGroundRoot from '@/public/root/background-root.png';
import Link from 'next/link';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// Define the validation schema with Zod for login
const schema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Define the type for the form data
type FormData = z.infer<typeof schema>;

// Define schema for Forgot Password
const forgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function LoginForm() {
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const {
		register: forgotPasswordRegister,
		handleSubmit: handleForgotPasswordSubmit,
		formState: { errors: forgotPasswordErrors },
	} = useForm<ForgotPasswordData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: FormData) => {
		setLoading(true);
		try {
			const response = await api.post('/auth/login', {
				email: data.email,
				password: data.password,
			});

			if (response?.data?.status === 200) {
				const accessToken = response.data.payload;
				localStorage.setItem('accessToken', accessToken);
				const decoded: any = jwtDecode(accessToken);
				const userRole = decoded?.role;

				toast.success('Login successful!');
				if (userRole === 'ROLE_ADMIN') {
					router.push('/management');
				} else if (userRole === 'ROLE_STAFF') {
					router.push('/management-staff/staff-shift');
				} else {
					router.push('/');
				}
			} else {
				toast.error(response?.data?.message || 'Login failed');
			}
		} catch (err: any) {
			toast.error(err?.response?.data?.message || 'Login failed');
			console.error('Login error:', err);
		} finally {
			setLoading(false);
		}
	};

	const onForgotPasswordSubmit = async (data: ForgotPasswordData) => {
		setLoading(true);
		try {
			const response = await api.post('/auth/forgot-password', {
				email: data.email,
			});

			if (response?.data?.status === 200) {
				toast.success('Password reset instructions sent to your email!');
				setIsForgotPassword(false);
				router.push('/reset-password');
			} else {
				toast.error(response?.data?.message || 'Failed to send password reset instructions');
			}
		} catch (err: any) {
			toast.error(err?.response?.data?.message || 'An error occurred');
			console.error('Forgot Password error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
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
					<h1 className='text-2xl font-bold text-white text-center'>
						{isForgotPassword ? 'Forgot Password' : 'LOG IN'}
					</h1>
				</div>

				{/* Forgot Password Form */}
				{isForgotPassword ? (
					<form className='space-y-4' onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}>
						{/* Email Field */}
						<div>
							<Input
								className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
								placeholder='Email'
								type='email'
								{...forgotPasswordRegister('email')}
							/>
							{forgotPasswordErrors.email && (
								<p className='text-red-500'>{forgotPasswordErrors.email.message}</p>
							)}
						</div>

						{/* Submit Button */}
						<div className='mt-6 flex flex-col gap-2'>
							<Button
								className='w-full h-12 text-lg font-bold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'
								type='submit'
								disabled={loading}
							>
								{loading ? 'Sending...' : 'SEND RESET LINK'}
							</Button>
							<Button
								variant='outline'
								className='w-full h-12 text-lg font-bold border-[#F5A524] text-[#F5A524] hover:bg-[#F5A524] hover:text-black'
								onClick={() => setIsForgotPassword(false)} // Go back to login form
							>
								BACK TO LOGIN
							</Button>
						</div>
					</form>
				) : (
					// Login Form
					<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
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

						{/* Submit Button */}
						<div className='mt-6 flex flex-col gap-2'>
							<Button
								className='w-full h-12 text-lg font-bold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'
								type='submit'
								disabled={loading}
							>
								{loading ? 'Logging in...' : 'LOG IN'}
							</Button>
							<Link href='/register'>
								<Button
									variant='outline'
									className='w-full h-12 text-lg font-bold border-[#F5A524] text-[#F5A524] hover:bg-[#F5A524] hover:text-black'
								>
									REGISTER
								</Button>
							</Link>
							<div className='text-center text-sm text-gray-400'>
								<button
									type='button'
									className='text-[#F5A524] hover:text-[#F5A524] focus:outline-none'
									onClick={() => setIsForgotPassword(true)} // Switch to forgot password form
								>
									Forgot your password?
								</button>
							</div>
						</div>
					</form>
				)}

				{/* Social Login Options */}
				{!isForgotPassword && (
					<div className='mt-8'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<span className='w-full border-t border-gray-700' />
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-[#0a0a0a] px-2 text-gray-400'>Or continue with</span>
							</div>
						</div>
						<div className='mt-6 grid grid-cols-3 gap-4'>
							<a href='https://fauction.online/oauth2/authorization/google' className='w-full'>
								<Button variant='outline' className='bg-white hover:bg-gray-100 w-full'>
									<Image src={Google} alt='Google' width={46} height={46} className='size-6' />
								</Button>
							</a>
							<Button variant='outline' className='bg-white hover:bg-gray-100'>
								<Image src={Meta} alt='Meta' width={46} height={46} className='size-6' />
							</Button>
							<Button variant='outline' className='bg-white hover:bg-gray-100'>
								<Image src={Apple} alt='Apple' width={46} height={46} className='size-6' />
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
