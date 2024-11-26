import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Users2, Heart, Target, MessageSquare, School, Star, Goal } from 'lucide-react';
import BackGroundRoot from '@/public/root/background-root.png';
import About01 from '@/public/root/about-01.jpg';
import About02 from '@/public/root/about-02.jpg';

export default function AboutPage() {
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
							<h1 className='mb-4 text-4xl font-bold md:text-5xl lg:text-6xl'>Giới thiệu</h1>
							<p className='mx-auto max-w-2xl text-lg md:text-xl'>
								Với sự mệnh tôn vinh vẻ đẹp và sự tự tin của phái mạnh
							</p>
						</div>
					</div>
				</section>

				{/* Introduction Section */}
				<section className='py-16'>
					<div className='container'>
						<div className='mx-auto max-w-3xl space-y-6 text-center flex flex-col gap-3'>
							<p className='text-lg text-muted-foreground border border-slate-200 p-4 rounded-md'>
								Barber mang đến trải nghiệm cắt tóc đẳng cấp, kết hợp giữa kỹ thuật tinh tế, không gian
								hiện đại và dịch vụ chăm sóc tận tâm.
							</p>
							<div className='grid gap-8 md:grid-cols-2 text-white'>
								<div className='space-y-4 rounded-lg border border-slate-200 p-4'>
									<h3 className='text-xl font-semibold'>Đội ngũ chuyên nghiệp</h3>
									<p className='text-muted-foreground'>
										Đội ngũ stylist giàu kinh nghiệm, luôn cập nhật xu hướng mới nhất.
									</p>
								</div>
								<div className='space-y-4 rounded-lg border border-slate-200 p-4'>
									<h3 className='text-xl font-semibold'>Không gian sang trọng</h3>
									<p className='text-muted-foreground'>
										Không gian thiết kế sang trọng, mang đến cảm giác gần gũi và phong cách.
									</p>
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
						<h2 className='mb-12 text-center text-3xl font-bold'>Giá trị cốt lõi</h2>
						<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Users2 className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>Quan tâm</h3>
									<p className='text-sm text-muted-foreground'>
										Luôn tìm cơ hội và cách làm khác tốt hơn trong mọi tình huống
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Heart className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>Quan tâm</h3>
									<p className='text-sm text-muted-foreground'>
										Làm thêm chút nữa mang lại giá trị cho mọi người
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<School className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>Ham học hỏi</h3>
									<p className='text-sm text-muted-foreground'>
										Chia sẻ kiến thức, kinh nghiệm với mọi người cùng là học tập
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<MessageSquare className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>Chân thành</h3>
									<ul className='text-sm text-muted-foreground space-y-2'>
										<li>Lắng nghe để hiểu cảm xúc, mong muốn của người khác</li>
										<li>Nói rõ cảm xúc, mong muốn của mình</li>
									</ul>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Goal className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>Khích lệ phát triển</h3>
									<ul className='text-sm text-muted-foreground space-y-2'>
										<li>Tin rằng mọi người đều có thể 'tỏa sáng'</li>
										<li>Lãnh đạo sẵn sàng trao quyền</li>
										<li>Anh em làm chủ công việc</li>
									</ul>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='flex flex-col items-center p-6 text-center'>
									<Target className='mb-4 h-12 w-12 text-primary' />
									<h3 className='mb-2 font-semibold'>Tầm nhìn</h3>
									<p className='text-sm text-muted-foreground'>
										Barber đạt quy mô 1000 salon tại Việt Nam, trở thành thương hiệu lớn Đông Nam Á,
										mang tính biểu tượng trong ngành tóc thế giới
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
