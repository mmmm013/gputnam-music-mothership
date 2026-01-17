'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF5] border-b border-[#2C241B]/10 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-black tracking-tighter text-[#A0522D] group-hover:text-[#DAA520] transition-colors">
            G PUTNAM MUSIC
          </div>
        </Link>

        {/* NAV UPDATED: "R-Tists" */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-[#2C241B]">
          <Link href="/artists" className="hover:text-[#A0522D] transition-colors">R-Tists</Link>
          <Link href="/ships" className="hover:text-[#DAA520] transition-colors">SHIPS Engine</Link>
          <Link href="/accolades" className="hover:text-[#A0522D] transition-colors">Accolades</Link>
        </nav>

        <button className="md:hidden text-[#2C241B]">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
