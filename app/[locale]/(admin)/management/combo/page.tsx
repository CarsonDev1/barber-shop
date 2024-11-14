'use client';

import { useQuery } from '@tanstack/react-query';
import { getCombos } from '@/app/apis/combo/getCombo';
import PageContainer from '@/app/components/page-container';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Dialog, DialogTrigger, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useState } from 'react';

interface Service {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Array<{
		id: number;
		name: string;
		url: string;
		thumbUrl: string;
		mediumUrl: string;
	}>;
}

interface Combo {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Array<{
		id: number;
		name: string;
		url: string;
		thumbUrl: string;
		mediumUrl: string;
	}>;
	services: Service[];
}

const ComboManagement = () => {
	const {
		data: combosData,
		isLoading: isLoadingCombos,
		error: errorCombos,
	} = useQuery({
		queryKey: ['dataCombos'],
		queryFn: getCombos,
	});

	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to manage the dialog visibility
	const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null); // State to hold the selected combo

	const combos: Combo[] = combosData?.payload || [];

	if (isLoadingCombos) {
		return <PageContainer>Loading...</PageContainer>;
	}

	if (errorCombos) {
		return <PageContainer>Error loading combos data.</PageContainer>;
	}

	// Function to open dialog and set the selected combo
	const handleViewDetails = (combo: Combo) => {
		setSelectedCombo(combo);
		setIsDialogOpen(true);
	};

	// Close dialog
	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedCombo(null);
	};

	return (
		<PageContainer>
			<h2 className='text-2xl font-semibold mb-6'>Combo Management</h2>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Combo Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Estimate Time</TableHead>
						<TableHead>Image</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{combos?.map((combo) => (
						<TableRow key={combo.id}>
							<TableCell>{combo.name}</TableCell>
							<TableCell>{combo.description}</TableCell>
							<TableCell>{combo.price.toLocaleString()} VND</TableCell>
							<TableCell>{combo.estimateTime} min</TableCell>
							<TableCell>
								<Image src={combo.images[0].thumbUrl} width={100} height={100} alt='combo image' />
							</TableCell>
							<TableCell>
								<Button variant='secondary' size='sm' onClick={() => handleViewDetails(combo)}>
									View Details
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{selectedCombo && (
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>View Services</Button>
					</DialogTrigger>
					<DialogOverlay />
					<DialogContent className='bg-black/35 border text-white !max-w-xl'>
						<h3 className='text-xl font-semibold mb-4'>{selectedCombo.name} - Services</h3>
						<ul className='space-y-4'>
							{selectedCombo.services?.map((service) => (
								<li key={service.id} className='border-b border-gray-300 pb-2'>
									<h4 className='text-lg font-medium'>{service.name}</h4>
									<p>{service.description}</p>
									<div className='flex justify-between mt-2'>
										<span>{service.price.toLocaleString()} VND</span>
										<span>{service.estimateTime} min</span>
									</div>
								</li>
							))}
						</ul>
						<Button variant='default' size='sm' onClick={handleCloseDialog} className='mt-4'>
							Close
						</Button>
					</DialogContent>
				</Dialog>
			)}
		</PageContainer>
	);
};

export default ComboManagement;
