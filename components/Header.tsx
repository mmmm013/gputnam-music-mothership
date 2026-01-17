'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF5] border-b border-[#2C241B]/10 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-black tracking-tighter text-[#A0522D] group-hover:text-[#DAA520] transition-colors">
            G PUTNAM MUSIC
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-[10px] lg:text-xs font-bold tracking-widest uppercase text-[#2C241B]">
          <Link href="/kleigh" className="hover:text-[#A0522D] transition-colors">KLEIGH</Link>
          <Link href="/heroes" className="hover:text-[#DAA520] transition-colors">HEROES</Link>
          <Link href="/ships" className="hover:text-[#A0522D] transition-colors">SHIPS</Link>
          <Link href="/who" className="hover:text-[#DAA520] transition-colors">WHO</Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#2C241B] p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-[#FFFDF5] border-b border-[#2C241B]/10 absolute w-full left-0 top-20 shadow-xl z-50 flex flex-col p-6 gap-6 text-center text-sm font-bold uppercase tracking-widest text-[#5D4037]">
             <Link href="/kleigh" onClick={() => setIsOpen(false)}>Kleigh</Link>
             <Link href="/heroes" onClick={() => setIsOpen(false)}>Heroes</Link>
             <Link href="/ships" onClick={() => setIsOpen(false)}>Ships</Link>
             <Link href="/who" onClick={() => setIsOpen(false)}>Who Is GPM?</Link>
        </div>
      )}
    </header>
  );
}
