'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Logo from '@/public/root/Logo.png';
import Link from 'next/link';

export default function RegisterForm() {
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
				<form className='space-y-4'>
					<Input
						className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
						placeholder='Email'
						type='email'
					/>
					<Input
						className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
						placeholder='Phone Number'
						type='tel'
					/>
					<Input
						className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
						placeholder='Password'
						type='password'
					/>
					<Input
						className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
						placeholder='Confirm Password'
						type='password'
					/>
				</form>
				<div className='mt-6 flex flex-col gap-2'>
					<Button className='w-full h-12 text-lg font-bold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'>
						REGISTER
					</Button>
					<p className='text-center text-gray-400 mt-4'>
						Already have an account?{' '}
						<Link href='/login' className='text-[#F5A524] hover:underline'>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
