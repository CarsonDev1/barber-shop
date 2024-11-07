'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Logo from '@/public/root/Logo.png';
import Google from '@/public/root/google.png';
import Meta from '@/public/root/meta.png';
import Apple from '@/public/root/apple.png';
import BackGroundRoot from '@/public/root/background-root.png';
import Link from 'next/link';

export default function LoginForm() {
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
					<h1 className='text-2xl font-bold text-white text-center'>LOG IN</h1>
				</div>
				<form className='space-y-4'>
					<Input
						className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
						placeholder='Email'
						type='email'
					/>
					<Input
						className='h-12 bg-white text-black placeholder:text-gray-500 text-lg'
						placeholder='Password'
						type='password'
					/>
				</form>
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
						<Button variant='outline' className='bg-white hover:bg-gray-100'>
							<Image src={Google} alt='Google' width={46} height={46} className='size-6' />
						</Button>
						<Button variant='outline' className='bg-white hover:bg-gray-100'>
							<Image src={Meta} alt='Meta' width={46} height={46} className='size-6' />
						</Button>
						<Button variant='outline' className='bg-white hover:bg-gray-100'>
							<Image src={Apple} alt='Apple' width={46} height={46} className='size-6' />
						</Button>
					</div>
				</div>
				<div className='mt-6 flex flex-col gap-2'>
					<Button className='w-full h-12 text-lg font-bold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'>
						LOG IN
					</Button>
					<Link href='/register'>
						<Button
							variant='outline'
							className='w-full h-12 text-lg font-bold border-[#F5A524] text-[#F5A524] hover:bg-[#F5A524] hover:text-black'
						>
							REGISTER
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
