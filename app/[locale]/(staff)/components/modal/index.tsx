import { ReactNode } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex h-full items-center justify-center z-50'>
			<div className='p-6 rounded shadow-lg relative h-screen md:h-fit overflow-y-auto md:overflow-y-hidden border bg-gray-900'>
				<button onClick={onClose} className='absolute top-0 right-3 text-white text-3xl'>
					×
				</button>
				{children}
			</div>
		</div>
	);
}
