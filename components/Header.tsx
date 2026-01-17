'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF5] border-b border-[#2C241B]/10 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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

        {/* MOBILE MENU TRIGGER */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#2C241B] p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE NAV DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-[#FFFDF5] border-b border-[#2C241B]/10 p-4 absolute w-full">
           <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-[#2C241B]">
             <Link href="/kleigh" onClick={() => setIsOpen(false)}>KLEIGH</Link>
             <Link href="/heroes" onClick={() => setIsOpen(false)}>HEROES</Link>
             <Link href="/ships" onClick={() => setIsOpen(false)}>SHIPS</Link>
           </div>
        </div>
      )}
    </header>
  );
}
