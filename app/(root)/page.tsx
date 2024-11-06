import { Fragment } from 'react';
import Banner from '@/app/pages/home/banner';
import Introduce from '@/app/pages/home/introduce';
import Feature from '@/app/pages/home/feature';
import StyleList from '@/app/pages/home/stylist';

export default function Home() {
	return (
		<Fragment>
			<Banner />
			<Introduce />
			<Feature />
			<StyleList />
		</Fragment>
	);
}
