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

        {/* EXPANDED NAVIGATION (Added KLEIGH) */}
        <nav className="hidden md:flex items-center gap-6 text-[10px] lg:text-xs font-bold tracking-widest uppercase text-[#2C241B]">
          <Link href="/artists" className="hover:text-[#A0522D] transition-colors">R-TISTS</Link>
          <Link href="/kleigh" className="hover:text-[#A0522D] transition-colors">KLEIGH</Link> {/* NEW */}
          <Link href="/ships" className="hover:text-[#DAA520] transition-colors">SHIPS</Link>
          <Link href="/mip" className="hover:text-[#A0522D] transition-colors">MIP</Link>
          <Link href="/heroes" className="hover:text-[#DAA520] transition-colors">HEROES</Link>
          <Link href="/uru" className="hover:text-[#A0522D] transition-colors">URU</Link>
          <Link href="/accolades" className="hover:text-[#DAA520] transition-colors">ACCOLADES</Link>
        </nav>

        {/* MOBILE MENU TRIGGER */}
        <button className="md:hidden text-[#2C241B]">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
