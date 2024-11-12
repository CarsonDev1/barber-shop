'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

// Define schema for Reset Password
const resetPasswordSchema = z.object({
	token: z.string().min(1, { message: 'Token is required' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
	re_password: z.string().min(6, { message: 'Password confirmation must be at least 6 characters' }),
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordData>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = async (data: ResetPasswordData) => {
		if (data.password !== data.re_password) {
			toast.error('Passwords do not match');
			return;
		}

		setLoading(true);
		try {
			const response = await api.post('/auth/reset-password', {
				token: data.token,
				password: data.password,
				re_password: data.re_password,
			});

			if (response?.data?.status === 200) {
				toast.success('Password has been reset successfully!');
				router.push('/login');
			} else {
				toast.error(response?.data?.message || 'Failed to reset password');
			}
		} catch (err: any) {
			toast.error(err?.response?.data?.message || 'An error occurred');
			console.error('Reset Password error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative'>
			<div className='w-full max-w-lg relative pb-4 pt-20 px-8 rounded-lg bg-black bg-opacity-100 border border-gray-400'>
				<div className='space-y-6 mb-8'>
					<h1 className='text-2xl font-bold text-white text-center'>Reset Password</h1>
				</div>

				<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
					{/* Token Field */}
					<div>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Enter Token'
							type='text'
							{...register('token')}
						/>
						{errors.token && <p className='text-red-500'>{errors.token.message}</p>}
					</div>

					{/* New Password Field */}
					<div>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='New Password'
							type='password'
							{...register('password')}
						/>
						{errors.password && <p className='text-red-500'>{errors.password.message}</p>}
					</div>

					{/* Confirm Password Field */}
					<div>
						<Input
							className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
							placeholder='Confirm Password'
							type='password'
							{...register('re_password')}
						/>
						{errors.re_password && <p className='text-red-500'>{errors.re_password.message}</p>}
					</div>

					{/* Submit Button */}
					<div className='mt-6'>
						<Button
							className='w-full h-12 text-lg font-bold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'
							type='submit'
							disabled={loading}
						>
							{loading ? 'Resetting...' : 'RESET PASSWORD'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
