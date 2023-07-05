import { Metadata } from 'next'
import { authOptions } from '@configs/auth'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { Provider } from '@provider/Provider'
import { Toaster } from '@components/ui/toaster'
import { getServerSession } from 'next-auth/next'
import { Analytics } from '@vercel/analytics/react'
import { ScrollToTop } from '@components/ScrollToTop'

import 'swiper/css'
import '../styles/globals.css'

export const metadata: Metadata = {
	title: 'DraftCode',
	creator: 'Matheus Pergoli',
	description: 'DraftCode é uma plataforma de desafios de programação.',
	keywords: [
		'DraftCode',
		'Desafios',
		'Programação',
		'Next.js',
		'React',
		'Tailwind CSS',
		'Server Components',
		'Vercel'
	],
	authors: [
		{
			name: 'Matheus Pergoli',
			url: 'https://matheuspergoli-portfolio.vercel.app/'
		},
		{
			name: 'Natan Castro',
			url: 'https://github.com/NatanCastro'
		}
	],
	icons: {
		icon: '/favicon.ico'
	}
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions)

	return (
		<html lang='pt-br'>
			<body className='flex h-screen flex-col'>
				<Provider>
					<Header user={session?.user} />
					<div className='flex-1'>{children}</div>
					<Footer />
					<ScrollToTop />
					<Toaster />
					<Analytics />
				</Provider>
			</body>
		</html>
	)
}
