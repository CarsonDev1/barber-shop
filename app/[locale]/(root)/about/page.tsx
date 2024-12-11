'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Users2, Heart, Target, MessageSquare, School, Star, Goal } from 'lucide-react';
import BackGroundRoot from '@/public/root/background-root.png';
import About01 from '@/public/root/about-01.jpg';
import About02 from '@/public/root/about-02.jpg';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
	const { t } = useTranslation('common');
	return (
		<div className='min-h-screen bg-[#0a0a0a]'>
			<div className='container-lg'>
				{/* Hero Section */}
				<section className='relative overflow-hidden'>
					<Image
						src={BackGroundRoot}
						alt='Team celebration silhouette'
						width={1920}
						height={400}
						className='object-cover brightness-50'
					/>
					<div className='absolute inset-0 flex items-center justify-center'>
						<div className='container text-center text-white'>
							<h1 className='mb-4 text-4xl font-bold md:text-5xl lg:text-6xl'>{t('introduceAbout')}</h1>
							<p className='mx-auto max-w-2xl text-lg md:text-xl'>{t('introductDes')}</p>
						</div>
					</div>
				</section>

				{/* Introduction Section */}
				<section className='py-16'>
					<div className='container'>
						<div className='mx-auto max-w-3xl space-y-6 text-center flex flex-col gap-3'>
							<p className='text-lg text-muted-foreground border border-slate-200 p-4 rounded-md'>
								{t('aboutIntro01')}
							</p>
							<div className='grid gap-8 md:grid-cols-2 text-white'>
								<div className='space-y-4 rounded-lg border border-slate-200 p-4'>
									<h3 className='text-xl font-semibold'>{t('aboutIntro02')}</h3>
									<p className='text-muted-foreground'>{t('aboutIntro03')}</p>
								</div>
								<div className='space-y-4 rounded-lg border border-slate-200 p-4'>
									<h3 className='text-xl font-semibold'>{t('aboutIntro04')}</h3>
									<p className='text-muted-foreground'>{t('aboutIntro05')}</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Services Images */}
				<section className='py-16'>
					<div className='container-lg'>
						<div className='grid gap-8 md:grid-cols-2'>
							<Image
								src={About01}
								alt='Barber service 1'
								width={1000}
								height={900}
								className='rounded-lg object-cover'
							/>
							<Image
								src={About02}
								alt='Barber service 2'
								width={1000}
								height={900}
								className='rounded-lg object-cover'
							/>
						</div>
					</div>
				</section>

				{/* Core Values */}
				<section className='py-16 text-white'>
					<div className='container'>
						<h2 className='mb-12 text-center text-3xl font-bold'>{t('aboutIntro06')}</h2>
						<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Users2 className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>{t('aboutIntro07')}</h3>
									<p className='text-sm text-muted-foreground'>{t('aboutIntro08')}</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Heart className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>{t('aboutIntro09')}</h3>
									<p className='text-sm text-muted-foreground'>{t('aboutIntro10')}</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<School className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>{t('aboutContact')}</h3>
									<p className='text-sm text-muted-foreground'>{t('aboutContactDes')}</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<MessageSquare className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>{t('aboutContact01')}</h3>
									<ul className='text-sm text-muted-foreground space-y-2'>
										<li>{t('aboutContact02')}</li>
									</ul>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Goal className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>{t('aboutContact03')}</h3>
									<ul className='text-sm text-muted-foreground space-y-2'>
										<li>{t('aboutContact04')}</li>
									</ul>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Target className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>{t('aboutContact05')}</h3>
									<p className='text-sm text-muted-foreground'>{t('aboutContact06')}</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
