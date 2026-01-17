import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import { ArrowRight, User, Music } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B] font-sans selection:bg-[#FFD54F] selection:text-[#2C241B]">
      <Header />
      
      {/* HERO SECTION: THE DUAL ZONE SPLIT */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-[#FFC107]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: TEXT ENGINE */}
          <div className="space-y-8 z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[#2C241B]">
              Dream the <br/>
              <span className="text-[#FFFDF5]">Stream</span> <br/>
              MOODs
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-md leading-relaxed">
              Discover the revolutionary approach to music streaming that matches your exact mood.
            </p>
            
            <div className="bg-[#FFFDF5]/20 p-2 rounded-full backdrop-blur-sm max-w-sm flex items-center">
               <input 
                 type="text" 
                 placeholder="Enter a mood..." 
                 className="bg-transparent border-none outline-none text-[#2C241B] placeholder-[#2C241B]/50 px-4 w-full font-medium"
               />
            </div>

            <button className="bg-[#A0522D] text-white px-8 py-4 rounded-full font-bold tracking-widest hover:bg-[#8B4513] transition shadow-lg flex items-center gap-2">
              START YOUR STREAM <ArrowRight size={18} />
            </button>
          </div>

          {/* RIGHT: DUAL DISPLAY (HERO PORTRAIT + FP PLACEHOLDER) */}
          <div className="relative h-[500px] w-full bg-[#DAA520] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border-4 border-[#FFFDF5]/20">
            
            {/* ZONE 1: HERO PORTRAIT (Left Half) */}
            <div className="w-full md:w-1/2 h-full bg-[#B8860B] flex flex-col items-center justify-center p-6 text-center border-b md:border-b-0 md:border-r border-[#FFFDF5]/20 relative group hover:bg-[#986F0B] transition-colors cursor-default">
              <div className="absolute top-4 left-4 bg-black/20 text-white text-[10px] font-bold px-2 py-1 rounded">ZONE 1</div>
              <User size={64} className="text-[#FFFDF5] mb-4 opacity-80" />
              <h3 className="text-2xl font-black uppercase text-[#FFFDF5] tracking-widest">Hero<br/>Portrait</h3>
              <p className="text-xs font-mono mt-2 opacity-60 text-[#FFFDF5]">Artist Visual Asset</p>
            </div>

            {/* ZONE 2: FP PLACEHOLDER (Right Half) */}
            <div className="w-full md:w-1/2 h-full bg-[#CD853F] flex flex-col items-center justify-center p-6 text-center relative group hover:bg-[#A0522D] transition-colors cursor-pointer">
              <div className="absolute top-4 left-4 bg-black/20 text-white text-[10px] font-bold px-2 py-1 rounded">ZONE 2</div>
              <div className="w-24 h-32 border-2 border-dashed border-[#FFFDF5]/40 rounded-lg mb-4 flex items-center justify-center text-[#FFFDF5]">
                <Music size={32} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-bold uppercase text-[#FFFDF5] tracking-widest">FP<br/>Placeholder</h3>
              <p className="text-xs font-mono mt-2 opacity-60 text-[#FFFDF5]">Linked Content Slot</p>
            </div>

          </div>
        </div>
      </section>

      {/* REST OF PAGE */}
      <FeaturedPlaylists />
      <Footer />
      <GlobalPlayer />
    </main>
  );
}
