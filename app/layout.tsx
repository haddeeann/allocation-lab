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
  title: 'Allocation Lab — Mini S-Process Explorer',
  description:
    'Explore how multiple evaluator perspectives and diminishing returns shape an optimal funding allocation.',
  openGraph: {
    title: 'Allocation Lab — Mini S-Process Explorer',
    description:
      'Explore how multiple evaluator perspectives and diminishing returns shape an optimal funding allocation.',
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
    title: 'Allocation Lab — Mini S-Process Explorer',
    description:
      'Explore how multiple evaluator perspectives and diminishing returns shape an optimal funding allocation.',
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
