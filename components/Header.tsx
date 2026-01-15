import Link from 'next/link';
import Image from 'next/image';
import { Zap, Camera, Heart } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-white/20 group-hover:border-pink-500 transition-colors">
            <Image src="/gpm_logo.png" alt="GPM Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-widest text-lg leading-none group-hover:text-pink-400 transition-colors">G PUTNAM MUSIC</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em]">LLC</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/kleigh" className="text-xs font-bold text-white/70 hover:text-pink-400 tracking-[0.2em] uppercase">KLEIGH</Link>
          <Link href="/jazz" className="text-xs font-bold text-white/70 hover:text-blue-400 tracking-[0.2em] uppercase">JAZZ</Link>
          <Link href="/heroes" className="flex items-center gap-2 text-xs font-bold text-yellow-400 hover:text-yellow-300 tracking-[0.2em] border border-yellow-500/30 px-3 py-1 rounded-full bg-yellow-500/10">
            <Heart size={12} className="fill-current" /> HEROES ACCESS
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg tracking-widest">
            <Zap size={14} className="fill-current" /> DREAM THE STREAM
          </a>
        </div>
      </div>
    </header>
  );
}
