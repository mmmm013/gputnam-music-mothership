'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#8B4513] border-b border-[#D2B48C]/20 shadow-lg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* BRAND IDENTITY */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/gpm_logo.jpg"
            alt="G Putnam Music Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
          <span className="hidden sm:inline text-xs font-bold tracking-[0.25em] uppercase text-[#FFE4B5]">
            G Putnam Music
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase text-[#D2B48C]">
          <Link
            href="/kleigh"
            className="hover:text-white hover:underline decoration-[#DAA520] underline-offset-4 transition-all"
          >
            Kleigh
          </Link>
          <Link
            href="/jazz"
            className="hover:text-white hover:underline decoration-[#DAA520] underline-offset-4 transition-all"
          >
            Jazz
          </Link>
          <Link
            href="/heroes"
            className="hover:text-white hover:underline decoration-[#DAA520] underline-offset-4 transition-all"
          >
            Heroes
          </Link>
          <Link
            href="/ships"
            className="hover:text-white hover:underline decoration-[#DAA520] underline-offset-4 transition-all"
          >
            Ships
          </Link>
          <Link
            href="/who"
            className="hover:text-white hover:underline decoration-[#DAA520] underline-offset-4 transition-all"
          >
            Who
          </Link>
        </nav>

        {/* MOBILE TRIGGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#D2B48C] hover:text-white transition p-2"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-[#8B4513] border-b border-[#D2B48C]/20 absolute w-full left-0 top-24 shadow-2xl z-50 flex flex-col p-8 gap-6 text-center text-sm font-bold uppercase tracking-widest text-[#FFE4B5]">
          <Link href="/kleigh" onClick={() => setIsOpen(false)}>
            Kleigh
          </Link>
          <Link href="/jazz" onClick={() => setIsOpen(false)}>
            Jazz
          </Link>
          <Link href="/heroes" onClick={() => setIsOpen(false)}>
            Heroes
          </Link>
          <Link href="/ships" onClick={() => setIsOpen(false)}>
            Ships
          </Link>
          <Link href="/who" onClick={() => setIsOpen(false)}>
            Who Is GPM?
          </Link>
        </div>
      )}
    </header>
  );
}
