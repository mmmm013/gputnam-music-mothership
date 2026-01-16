'use client';
import Link from 'next/link';
import { Menu, Music, User, Trophy, Ship } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-[#FDF6E3] text-[#2C241B] border-b border-[#2C241B]/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#C04000] rounded-full flex items-center justify-center text-white font-black text-xs">GP</div>
        <span className="font-black tracking-tighter uppercase text-lg">Dream the Stream</span>
      </div>
      
      <nav className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest opacity-80 items-center">
        <Link href="/who" className="hover:text-[#C04000] transition">Who's mmmm-?™</Link>
        <Link href="/artists" className="hover:text-[#C04000] transition">Artists</Link>
        <Link href="/ships" className="hover:text-[#C04000] transition">SHIPS</Link>
        <Link href="/accolades" className="hover:text-[#C04000] transition">Accolades</Link>
        <Link href="/join">
          <button className="bg-[#C04000] text-white px-4 py-2 rounded-md font-black text-xs uppercase hover:bg-[#A03000] transition shadow-md">
            Dream the Stream
          </button>
        </Link>
      </nav>

      <div className="md:hidden">
        <Menu />
      </div>
    </header>
  );
}
