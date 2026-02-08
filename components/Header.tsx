'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#2A1506] shadow-lg border-b border-[#5C3A1E]/40 relative z-50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* LEFT: GPM Identity - Logo + Business Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#C8A882]/60 shadow-md">
            <Image
              src="/gpm_logo.jpg"
              alt="G Putnam Music Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#C8A882] tracking-wide leading-tight group-hover:text-[#D7CCC8] transition-colors">G Putnam Music</span>
            <span className="text-[10px] text-[#C4A882]/70 uppercase tracking-widest leading-tight">The One Stop Song Shop</span>
          </div>
        </Link>

        {/* CENTER: Spacer */}
        <div className="flex-1" />

        {/* RIGHT: Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/heroes" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">Heroes</Link>
          <Link href="/artists" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">Artists</Link>
          <Link href="/jazz" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">Jazz</Link>
          <Link href="/uru" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">URU</Link>
          <Link href="/ships" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">Ships</Link>
          <Link href="/gift" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">Gift</Link>
          <Link href="/join" className="text-sm bg-[#C8A882] text-[#2A1506] px-4 py-1.5 rounded-full font-bold hover:bg-[#D7CCC8] transition-colors tracking-wide">Join</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-[#C8A882] transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#C8A882] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#C8A882] transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#2A1506] border-t border-[#5C3A1E]/40 px-4 py-4 flex flex-col gap-3">
          <Link href="/heroes" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide py-1">Heroes</Link>
          <Link href="/artists" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide py-1">Artists</Link>
          <Link href="/jazz" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide py-1">Jazz</Link>
          <Link href="/uru" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide py-1">URU</Link>
          <Link href="/ships" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide py-1">Ships</Link>
          <Link href="/gift" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide py-1">Gift</Link>
          <Link href="/join" onClick={() => setMenuOpen(false)} className="text-sm bg-[#C8A882] text-[#2A1506] px-4 py-2 rounded-full font-bold text-center hover:bg-[#D7CCC8] transition-colors tracking-wide">Join</Link>
        </div>
      )}
    </nav>
  );
}
