import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import { ArrowRight, User, Music } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B] font-sans selection:bg-[#D2691E] selection:text-[#FFFDF5]">
      <Header />
      
      {/* HERO SECTION: SOFT AMBER GLOW (Replaces Flat Yellow) */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        
        {/* THE "ALLURING" BACKGROUND GRADIENT */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FFF8E7] via-[#FFE4B5] to-[#DAA520] opacity-80"></div>
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div> {/* Subtle Texture */}

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: TEXT ENGINE (Softened Colors) */}
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[#5D4037] drop-shadow-sm"> {/* Dark Sienna Text */}
              Dream the <br/>
              <span className="text-[#8B4513] italic font-serif">Stream</span> <br/> {/* Sienna + Serif for Elegance */}
              MOODs
            </h1>
            <p className="text-lg md:text-xl font-medium text-[#8B4513]/80 max-w-md leading-relaxed">
              An inviting space to match your music to your moment.
            </p>
            
            <div className="bg-[#FFFDF5]/60 border border-[#8B4513]/30 p-2 rounded-full backdrop-blur-md max-w-sm flex items-center shadow-lg">
               <input 
                 type="text" 
                 placeholder="How are you feeling?" 
                 className="bg-transparent border-none outline-none text-[#5D4037] placeholder-[#8B4513]/50 px-4 w-full font-medium"
               />
            </div>

            <button className="bg-[#A0522D] text-[#FFFDF5] px-8 py-4 rounded-full font-bold tracking-widest hover:bg-[#8B4513] transition shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 border-2 border-[#FFFDF5]/20">
              START LISTENING <ArrowRight size={18} />
            </button>
          </div>

          {/* RIGHT: DUAL DISPLAY (SIENNA FRAMES) */}
          {/* The "Frame" Container - Rich Sienna Wood Look */}
          <div className="relative h-[500px] w-full bg-[#8B4513] rounded-sm p-4 shadow-2xl flex flex-col md:flex-row shadow-[#8B4513]/40 border-4 border-[#5D4037]">
            
            {/* INNER BEVEL EFFECT (Gold Trim) */}
            <div className="w-full h-full border-2 border-[#DAA520]/50 rounded-sm flex flex-col md:flex-row overflow-hidden bg-[#2C241B]">

              {/* ZONE 1: HERO PORTRAIT (Sepia/Warm Tone) */}
              <div className="w-full md:w-1/2 h-full bg-[#A0522D] flex flex-col items-center justify-center p-6 text-center relative group hover:bg-[#8B4513] transition-colors cursor-default border-b md:border-b-0 md:border-r border-[#DAA520]/30">
                <div className="absolute top-4 left-4 bg-[#5D4037] text-[#DAA520] text-[10px] font-bold px-2 py-1 rounded shadow-md border border-[#DAA520]/20">VISUAL</div>
                <User size={64} className="text-[#DAA520] mb-4 opacity-90 drop-shadow-md" />
                <h3 className="text-2xl font-black uppercase text-[#FFFDF5] tracking-widest font-serif">Hero<br/>Portrait</h3>
                <p className="text-xs font-serif italic mt-2 text-[#DAA520]">The Artist</p>
              </div>

              {/* ZONE 2: FP PLACEHOLDER (Warm Gold) */}
              <div className="w-full md:w-1/2 h-full bg-[#B8860B] flex flex-col items-center justify-center p-6 text-center relative group hover:bg-[#CD853F] transition-colors cursor-pointer">
                <div className="absolute top-4 left-4 bg-[#5D4037] text-[#DAA520] text-[10px] font-bold px-2 py-1 rounded shadow-md border border-[#DAA520]/20">CONTENT</div>
                <div className="w-24 h-32 border-2 border-dashed border-[#FFFDF5]/40 rounded-lg mb-4 flex items-center justify-center text-[#FFFDF5] shadow-inner bg-[#000000]/10">
                  <Music size={32} className="animate-pulse text-[#FFFDF5]" />
                </div>
                <h3 className="text-xl font-bold uppercase text-[#FFFDF5] tracking-widest font-serif">Featured<br/>Content</h3>
                <p className="text-xs font-serif italic mt-2 text-[#DAA520]">Tap to Play</p>
              </div>

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
