import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { Play, Mic2 } from 'lucide-react';

export default function KleighPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B]">
      <Header />
      
      {/* HEADER HERO */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-[#A0522D] to-[#8B4513] text-[#FFFDF5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FFFDF5]/10 backdrop-blur-md mb-6 border border-[#FFFDF5]/20">
            <Mic2 size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Kleigh</h1>
          <p className="text-xl font-serif italic opacity-80">The Legacy Collection</p>
        </div>
      </section>

      {/* TRACK LISTING (Static for now, Dynamic Ready) */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-[#A0522D] mb-8 border-b border-[#A0522D]/20 pb-4">Essential Tracks</h2>
        
        <div className="space-y-4">
          {/* TRACK 1 */}
          <div className="group flex items-center justify-between p-6 bg-white rounded-lg shadow-sm border border-[#A0522D]/10 hover:shadow-md hover:border-[#A0522D]/40 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#A0522D]/10 flex items-center justify-center text-[#A0522D] group-hover:bg-[#A0522D] group-hover:text-white transition">
                <Play size={20} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-[#5D4037]">Bought Into Your Game</h3>
                <p className="text-xs font-serif text-[#A0522D]">Original Mix</p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A0522D]/60">3:42</span>
          </div>
        </div>
      </section>

      <Footer />
      <GlobalPlayer />
    </main>
  );
}
