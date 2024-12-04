'use client';

import Link from 'next/link';
import AI from '@/public/root/btn-ai.png';
import Mess from '@/public/root/btn-mess.png';
import What from '@/public/root/btn-what.png';
import Zalo from '@/public/root/btn-zalo.png';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { useChat } from 'ai/react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, SquareIcon } from 'lucide-react';

export default function Chats() {
	const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
		api: 'api/chat',
	});

	return (
		<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-4'>
			{/* <div className='flex flex-col h-[80vh] w-full  mx-auto bg-gr rounded-lg shadow-lg'>
				<div className='flex-1 overflow-auto p-6'>
					{messages.length === 0 && (
						<div className='flex flex-col justify-center items-center h-full'>
							<Image src='/ai.png' alt='AI' width={80} height={80} />
							<p className='text-lg text-muted-foreground mt-4'>
								Chào mừng bạn đến với Chatbot! Hãy hỏi tôi bất cứ điều gì về rác thải tôi có thể trả lời
								bạn.
							</p>
						</div>
					)}
					<div className='flex flex-col gap-4'>
						{messages.map((message) =>
							message.role === 'assistant' ? (
								<div key={message.id} className='flex items-start gap-3'>
									<div className='p-2 border border-green-700 rounded-full'>
										<Image src='/ai.png' alt='AI' width={20} height={20} />
									</div>
									<div className='bg-muted rounded-lg p-3 max-w-[70%] '>
										<Markdown className='text-sm text-muted-foreground'>{message.content}</Markdown>
									</div>
								</div>
							) : (
								<div key={message.id} className='flex justify-end'>
									<div className='bg-green-500 rounded-lg p-3 max-w-[70%]'>
										<p className='text-sm text-primary-foreground'>{message.content}</p>
									</div>
								</div>
							)
						)}
					</div>
				</div>
				<form onSubmit={handleSubmit} className='bg-muted/50 px-4 py-3 flex items-center gap-2'>
					<div className='relative flex-1'>
						<Textarea
							placeholder='Type your message...'
							className='rounded-lg pr-12 min-h-[64px]'
							rows={1}
							value={input}
							onChange={handleInputChange}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(new Event('submit'));
								}
							}}
						/>

						{!isLoading ? (
							<Button
								type='submit'
								size='icon'
								disabled={!input || isLoading}
								className='absolute bottom-3 right-3 rounded-full bg-white'
							>
								<SendIcon className='w-5 h-5 text-green-500' />
								<span className='sr-only'>Send</span>
							</Button>
						) : (
							<Button
								type='button'
								size='icon'
								disabled={!isLoading}
								onClick={stop}
								className='absolute bottom-3 right-3 rounded-full'
							>
								<SquareIcon className='w-5 h-5' fill='white' />
								<span className='sr-only'>Send</span>
							</Button>
						)}
					</div>
				</form>
			</div> */}
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
