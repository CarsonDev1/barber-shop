'use client';

import Link from 'next/link';
import AI from '@/public/root/btn-ai.png';
import Mess from '@/public/root/btn-mess.png';
import What from '@/public/root/btn-what.png';
import Zalo from '@/public/root/btn-zalo.png';
import Image from 'next/image';
import { useChat } from 'ai/react';

export default function Chats() {
	return (
		<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-4'>
			{/* AI Chat Button with Ripple and Shake */}
			<Link href='#' className='relative rounded-full shadow-lg hover:shadow-xl transition-all group'>
				<span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-[#2196f3]/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple'></span>
				<Image src={AI} alt='btn-chat' className='w-14 h-14 animate-shake' />
			</Link>

			{/* Zalo */}
			<Link
				href='#'
				className='relative rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all group'
			>
				<span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-[#de3ee4]/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple'></span>
				<Image src={Mess} alt='btn-chat' className='w-14 h-14 animate-shake' />
			</Link>

			{/* Messenger */}
			<Link
				href='#'
				className='relative rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all group'
			>
				<span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-[#63f038]/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple'></span>
				<Image src={What} alt='btn-chat' className='w-14 h-14 animate-shake' />
			</Link>

			{/* WhatsApp */}
			<Link
				href='#'
				className='relative rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all group'
			>
				<span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-[#389df0]/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple'></span>
				<Image src={Zalo} alt='btn-chat' className='w-14 h-14 animate-shake' />
			</Link>
		</div>
	);
}
