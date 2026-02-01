import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './Providers';
import Header from '@/components/Header';
export const metadata = {
  title: "G Putnam Music",
  description: "Official site for G Putnam Music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#3E2723]">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
