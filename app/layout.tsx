import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://allocation-lab.ptothea.chatgpt.site'),
  title: 'Allocation Lab — Decision Workbench',
  description:
    'Explore difficult decisions through tradeoffs, scenarios, reversibility, learning, and S-Process-inspired allocation models.',
  openGraph: {
    title: 'Allocation Lab — Decision Workbench',
    description:
      'Explore difficult decisions through several mathematical and strategic lenses.',
    type: 'website',
    images: [
      {
        url: 'https://allocation-lab.ptothea.chatgpt.site/og.png',
        width: 1734,
        height: 907,
        alt: 'Allocation Lab — a mini S-Process explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allocation Lab — Decision Workbench',
    description:
      'Explore difficult decisions through several mathematical and strategic lenses.',
    images: ['https://allocation-lab.ptothea.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
