import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { Music2 } from 'lucide-react';

export default function JazzPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-[#FFE4B5]">
      <Header />
      
      {/* JAZZ HERO */}
      <section className="relative pt-32 pb-32 text-center bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B4513]/20 to-[#1a1a1a]"></div>
        <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#DAA520] text-[#DAA520] mb-8 bg-black/50 backdrop-blur-sm">
                <Music2 size={48} />
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#DAA520] drop-shadow-lg">
              Scherer<br/>Jazz
            </h1>
            <p className="text-xl font-serif italic text-[#FFE4B5] mt-4 opacity-80">
              The Michael Scherer Collection
            </p>
        </div>
      </section>

      <Footer />
      <GlobalPlayer />
    </main>
  );
}
