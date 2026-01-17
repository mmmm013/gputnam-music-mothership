import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import { ArrowRight, Music } from 'lucide-react';

const STORAGE_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";
const HERO_IMAGE = `${STORAGE_URL}/k-hero.jpg`; 

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B] font-sans selection:bg-[#D2691E] selection:text-[#FFFDF5]">
      <Header />
      
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FFF8E7] via-[#FFE4B5] to-[#DAA520] opacity-80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: TEXT */}
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[#5D4037] drop-shadow-sm">
              Dream the <br/>
              <span className="text-[#8B4513] italic font-serif">Stream</span> <br/>
              MOODs
            </h1>
            <p className="text-lg md:text-xl font-medium text-[#8B4513]/80 max-w-md leading-relaxed">
              An inviting space to match your music to your moment.
            </p>
            <button className="bg-[#A0522D] text-[#FFFDF5] px-8 py-4 rounded-full font-bold tracking-widest hover:bg-[#8B4513] transition shadow-xl flex items-center gap-2">
              START LISTENING <ArrowRight size={18} />
            </button>
          </div>

          {/* RIGHT: DUAL DISPLAY */}
          <div className="relative h-[500px] w-full bg-[#8B4513] rounded-sm p-4 shadow-2xl flex flex-col md:flex-row shadow-[#8B4513]/40 border-4 border-[#5D4037]">
            <div className="w-full h-full border-2 border-[#DAA520]/50 rounded-sm flex flex-col md:flex-row overflow-hidden bg-[#2C241B]">

              {/* ZONE 1: HERO PORTRAIT (REAL IMAGE) */}
              <div className="w-full md:w-1/2 h-full relative group cursor-default border-b md:border-b-0 md:border-r border-[#DAA520]/30 overflow-hidden bg-[#A0522D]">
                <img 
                  src={HERO_IMAGE} 
                  alt="Hero Portrait" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                />
                <div className="absolute top-4 left-4 z-10 bg-[#5D4037] text-[#DAA520] text-[10px] font-bold px-2 py-1 rounded shadow-md border border-[#DAA520]/20">VISUAL</div>
                <div className="absolute bottom-6 left-0 right-0 text-center z-10 pointer-events-none">
                   <h3 className="text-2xl font-black uppercase text-[#FFFDF5] tracking-widest font-serif drop-shadow-md">Hero<br/>Portrait</h3>
                   <p className="text-xs font-serif italic mt-2 text-[#DAA520]">The Artist</p>
                </div>
              </div>

              {/* ZONE 2: FEATURED CONTENT */}
              <div className="w-full md:w-1/2 h-full bg-gradient-to-br from-[#D2B48C] to-[#C19A6B] flex flex-col items-center justify-center p-6 text-center relative">
                <div className="absolute top-4 left-4 bg-[#8B4513] text-[#FFFDF5] text-[10px] font-bold px-2 py-1 rounded shadow-md border border-[#FFFDF5]/20">CONTENT</div>
                <div className="w-24 h-32 border-2 border-dashed border-[#5D4037]/20 rounded-lg mb-4 flex items-center justify-center text-[#5D4037] shadow-inner bg-[#FFFDF5]/10">
                  <Music size={32} className="animate-pulse text-[#5D4037]" />
                </div>
                <h3 className="text-xl font-bold uppercase text-[#5D4037] tracking-widest font-serif">Featured<br/>Content</h3>
                <p className="text-xs font-serif italic mt-2 text-[#5D4037]/80">Tap to Play</p>
              </div>

            </div>
          </div>
        </div>
      </section>
      <FeaturedPlaylists />
      <Footer />
      <GlobalPlayer />
    </main>
  );
}
