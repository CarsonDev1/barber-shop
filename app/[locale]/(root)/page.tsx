'use client';
import { Fragment } from 'react';
import Banner from '@/app/pages/home/banner';
import Introduce from '@/app/pages/home/introduce';
import Feature from '@/app/pages/home/feature';
import StyleList from '@/app/pages/home/stylist';
import '@/i18n';
import Address from '@/app/pages/home/address';
import { useAuth } from '@/context/AuthProvider';

export default function Home() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		window.location.href = '/login';
		return null;
	}
	return (
		<Fragment>
			<Banner />
			<Introduce />
			<Feature />
			<StyleList />
			<Address />
		</Fragment>
	);
}
