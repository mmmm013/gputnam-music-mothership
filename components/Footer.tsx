'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2C241B] text-[#FFFDF5] py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm opacity-80">
        
        {/* COL 1: BRAND */}
        <div className="space-y-4">
          <h5 className="font-bold uppercase tracking-widest text-[#DAA520]">G Putnam Music</h5>
          <p className="leading-relaxed opacity-60">
            Pioneering the Mood-Based Streaming standard.
          </p>
        </div>

        {/* COL 2: DISCOVER ("R-Tists") */}
        <div className="flex flex-col gap-3">
          <h5 className="font-bold uppercase tracking-widest text-[#DAA520]">Discover</h5>
          <Link href="/heroes" className="hover:text-[#FFF] transition">Grandpa's Story</Link>
          <Link href="/artists" className="hover:text-[#FFF] transition">R-Tists</Link>
          <Link href="/ships" className="hover:text-[#FFF] transition">Sponsorships</Link>
        </div>

        {/* COL 3: CORPORATE ("GPM Is?") */}
        <div className="flex flex-col gap-3">
          <h5 className="font-bold uppercase tracking-widest text-[#DAA520]">Corporate</h5>
          <Link href="/who" className="hover:text-[#FFF] transition">GPM Is?</Link>
          <Link href="/legal" className="hover:text-[#FFF] transition">Legal</Link>
          <Link href="/contact" className="hover:text-[#FFF] transition">Contact</Link>
        </div>

        {/* COL 4: LEGAL */}
        <div className="space-y-4 text-xs opacity-50">
          <p>&copy; {new Date().getFullYear()} G Putnam Music. All Rights Reserved.</p>
          <p>MMMM-?™ is a trademark of G Putnam Music.</p>
        </div>
      </div>
    </footer>
  );
}
