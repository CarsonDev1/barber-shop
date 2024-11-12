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

// Define the validation schema with Zod for the token
const schema = z.object({
	token: z.string().min(6, { message: 'Token must be at least 6 characters' }), // Assuming token length is 6
});

// Define the type for the form data
type FormData = z.infer<typeof schema>;

export default function EmailVerificationForm() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: FormData) => {
		setLoading(true);
		try {
			// Use GET request with token as query parameter
			const response = await api.get(`/auth/verify-email?token=${data.token}`);

			if (response?.data.status === 400) {
				toast.error(response.data.message);
			} else {
				toast.success('Email verified successfully!');
				router.push('/login');
			}
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Email verification failed');
			console.error('Verification error:', err);
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
					<h1 className='text-2xl font-bold text-white text-center'>VERIFY EMAIL</h1>
				</div>
				<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
					<div>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Enter Verification Token'
							type='text'
							{...register('token')}
						/>
						{errors.token && <p className='text-red-500'>{errors.token.message}</p>}
					</div>
					<div className='mt-6 flex flex-col gap-2'>
						<Button
							className='w-full h-12 text-lg font-bold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'
							type='submit'
							disabled={loading}
						>
							{loading ? 'Verifying...' : 'VERIFY'}
						</Button>
						<p className='text-center text-gray-400 mt-4'>
							Didn't receive the token?{' '}
							<Link href='/resend-token' className='text-[#F5A524] hover:underline'>
								Resend Token
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
