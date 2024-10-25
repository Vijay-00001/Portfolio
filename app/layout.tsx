import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import StarBackground from '@/components/main/StarBackground';
import Navbar from '@/components/main/Navbar';

const geistSans = localFont({
   src: './fonts/GeistVF.woff',
   variable: '--font-geist-sans',
   weight: '100 900',
});
const geistMono = localFont({
   src: './fonts/GeistMonoVF.woff',
   variable: '--font-geist-mono',
   weight: '100 900',
});

export const metadata: Metadata = {
   title: 'Vijay Chauhan Portfolio',
   description:
      'Portfolio of Vijay Chauhan, a passionate full-stack developer specializing in modern web technologies.',
   keywords: [
      'Vijay Chauhan',
      'Full-Stack Developer',
      'MERN',
      'JavaScript',
      'Next.js',
      'Portfolio',
   ],
   authors: [{ name: 'Vijay Chauhan' }],
   openGraph: {
      title: 'Vijay Chauhan Portfolio',
      description:
         'Explore the projects and skills of Vijay Chauhan, a full-stack developer passionate about web development.',
      type: 'website',
      url: 'https://your-portfolio-url.com',
      images: [
         {
            url: '/path-to-image.jpg',
            width: 800,
            height: 600,
            alt: 'Vijay Chauhan Portfolio',
         },
      ],
   },
   twitter: {
      card: 'summary_large_image',
      title: 'Vijay Chauhan Portfolio',
      description:
         'Portfolio of Vijay Chauhan, showcasing projects and skills in full-stack development.',
      images: ['/path-to-image.jpg'],
   },
   viewport: 'width=device-width, initial-scale=1',
   themeColor: '#030014',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <head>
            <link rel="icon" href="/favicon.ico" />
         </head>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030014] overflow-y-scroll overflow-x-hidden`}
         >
            <StarBackground />
            <Navbar />
            <main className="px-4 sm:px-6 md:px-8">{children}</main>
         </body>
      </html>
   );
}
