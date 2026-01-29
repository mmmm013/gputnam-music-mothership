<<<<<<< HEAD
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './Providers';
import Header from '@/components/Header';
=======
import "./globals.css";
import { PlayerProvider } from "@/components/PlayerContext";
>>>>>>> 08d812d (Deploy mip page)

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
<<<<<<< HEAD
      <body className="antialiased bg-[#3E2723]">
        <Providers>
          <Header />
          {children}
        </Providers>
=======
      <body>
        <PlayerProvider>{children}</PlayerProvider>
>>>>>>> 08d812d (Deploy mip page)
      </body>
    </html>
  );
}
