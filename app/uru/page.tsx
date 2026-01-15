'use client';

import { Heart, Star, Fingerprint, Radio, ArrowRight } from 'lucide-react';

export default function UruPage() {
  return (
    // BRANDING: AMBER (#FFCA28) & WHEAT (#F5DEB3) - GPM STANDARD
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      
      {/* NAV: GPM STANDARD */}
      <nav className="p-4 flex flex-col md:flex-row justify-between items-center bg-[#FFD54F]/90 border-b border-[#3E2723]/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src="/gpm_logp.jpg" alt="GPM" className="w-10 h-10 rounded border border-[#3E2723]/20" />
          <a href="/" className="font-black text-xs tracking-widest text-[#3E2723] hover:text-white transition">
             BACK TO HOME
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-[0.1em] uppercase text-[#3E2723]">
          <a href="/jazz" className="hover:text-white transition">JAZZ</a>
          <a href="/heroes" className="hover:text-white transition">HEROES</a>
          <a href="/join" className="hover:text-white transition">JOIN THE PRIDE</a>
          <span className="border-b-2 border-[#3E2723]">URU</span>
          <a href="/mip" className="bg-[#3E2723] text-[#FFD54F] px-3 py-1 rounded-full hover:scale-105 transition flex items-center gap-1">
            <Radio size={10} /> MIP PORTAL
          </a>
        </div>
      </nav>

      {/* HEADER: URU IDENTITY */}
      <div className="container mx-auto px-4 mt-16 text-center max-w-3xl">
         <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-8 shadow-xl">
            <Fingerprint size={48} className="text-[#FFD54F]" strokeWidth={1.5} />
         </div>
         <h1 className="text-6xl md:text-8xl font-black text-[#3E2723] mb-6 tracking-tight drop-shadow-sm leading-none">
            URU
         </h1>
         <p className="text-2xl font-bold text-[#3E2723] opacity-80 mb-12 uppercase tracking-widest">
            You Are You.
         </p>
      </div>

      {/* CONTENT SHELL (WAITING FOR SB DATA) */}
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
         <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-3xl p-12 shadow-[12px_12px_0px_0px_rgba(62,39,35,1)] text-center">
            
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">The Mission</h2>
            
            <div className="space-y-6 text-lg font-bold opacity-70 leading-relaxed">
               <p>
                  [...Awaiting URU Data from Sandbox...]
               </p>
               <p>
                  This space is dedicated to the individuality of the listener and the artist.
               </p>
            </div>

            <div className="mt-12 pt-12 border-t-2 border-[#3E2723]/10">
               <a href="/" className="inline-flex items-center gap-2 bg-[#3E2723] text-[#FFD54F] px-8 py-4 rounded-xl font-black uppercase hover:scale-105 transition shadow-lg">
                  Explore The Music <ArrowRight size={20} />
               </a>
            </div>

         </div>
      </div>

    </main>
  );
}
