'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'GPM Is?', href: '/who' },      // FIXED
    { name: 'R-tists', href: '/artists' },  // CREATIVE BRANDING
    { name: 'Heroes', href: '/heroes' },    // RESTORED
    { name: 'Ships', href: '/ships' },
    { name: 'Accolades', href: '/accolades' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF5]/90 backdrop-blur-md border-b border-[#8B4513]/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-black text-[#8B4513] tracking-tighter">
          Dream the Stream
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#2C241B] hover:text-[#8B4513] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-[#8B4513] transition-all group-hover:w-full group-hover:left-0"></span>
            </Link>
          ))}
          <Link 
            href="/ships" 
            className="bg-[#A0522D] text-white px-6 py-2 rounded-full text-xs font-black tracking-widest hover:bg-[#8B4513] transition shadow-lg"
          >
            DREAM THE STREAM
          </Link>
        </div>

        <button className="md:hidden text-[#8B4513]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#FFFDF5] border-t border-[#8B4513]/10 p-6 absolute w-full shadow-xl">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-lg font-bold text-[#2C241B]" onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
