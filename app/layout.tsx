import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'G Putnam Music',
  description: 'Dream The Stream',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#3E2723] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}