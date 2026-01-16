'use client';

import { Anchor, Wind, Ship, Compass, Check, Users, ShieldCheck, Film, Video } from 'lucide-react';

export default function JoinPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      
      {/* UPDATED NAV: INCLUDES CLIPS & VIDEOS */}
      <nav className="p-4 flex flex-col md:flex-row justify-between items-center bg-[#FFD54F]/90 border-b border-[#3E2723]/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src="/gpm_logp.jpg" alt="GPM" className="w-10 h-10 rounded border border-[#3E2723]/20" />
          <a href="/" className="font-black text-xs tracking-widest text-[#3E2723] hover:text-white transition">BACK TO HOME</a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-[0.1em] uppercase text-[#3E2723]">
          <a href="/jazz" className="hover:text-white transition">JAZZ</a>
          <a href="/heroes" className="hover:text-white transition">HEROES</a>
          {/* NEW LINKS */}
          <a href="/clips" className="hover:text-white transition">CLIPS</a>
          <a href="/videos" className="hover:text-white transition">VIDEOS</a>
          
          <span className="border-b-2 border-[#3E2723]">JOIN THE FLEET</span>
          <a href="/mip" className="bg-[#3E2723] text-[#FFD54F] px-3 py-1 rounded-full hover:scale-105 transition flex items-center gap-1">MIP PORTAL</a>
        </div>
      </nav>

      <div className="container mx-auto px-4 mt-16 text-center max-w-3xl">
         <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-8 shadow-xl">
            <Anchor size={48} className="text-[#FFD54F]" strokeWidth={2} />
         </div>
         <h1 className="text-5xl md:text-7xl font-black text-[#3E2723] mb-4 tracking-tight drop-shadow-sm leading-none">
            Board the <br/>SponsorSHIP.
         </h1>
         <p className="text-xl font-bold text-[#3E2723] opacity-80 mb-8 uppercase tracking-widest">
            Partner with us to keep the music flowing.
         </p>
      </div>

      <div className="container mx-auto px-4 pb-20 max-w-5xl">
         <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(62,39,35,1)]">
               <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2"><Compass size={24} /> The Course</h2>
               <div className="space-y-6 text-lg font-bold text-[#3E2723]/80 leading-relaxed">
                  <p>SponsorSHIPs are the engine of G Putnam Music. You aren't just a fan; you are a partner.</p>
                  <p>Your contribution keeps the <strong>Singalongs</strong> free for pediatric wards and the <strong>Kleigh</strong> stream running for fans worldwide.</p>
                  <p><span className="text-[#E65100]">100% of proceeds</span> fuel development & artist support.</p>
               </div>
               <div className="mt-8 pt-8 border-t-2 border-[#3E2723]/10 space-y-4">
                  <h3 className="font-black text-sm uppercase">Crew Benefits:</h3>
                  <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Access to URU Story Engine</div>
                  <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Unlimited Plays (No Limits)</div>
                  <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Verified "Sponsor" Rank</div>
               </div>
            </div>

            <div className="space-y-4">
               {/* KAYAK */}
               <div className="bg-[#3E2723] text-[#FFD54F] p-6 rounded-2xl border-2 border-[#3E2723] shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#FFD54F] text-[#3E2723] p-3 rounded-full"><Wind size={24} /></div>
                     <div><div className="font-black text-xl">KAYAK</div><div className="text-xs opacity-70 font-bold uppercase">Solo Paddler</div></div>
                  </div>
                  <div className="text-right"><div className="font-black text-2xl">$5</div><a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] underline hover:text-white">BOARD</a></div>
               </div>

               {/* SPEEDBOAT */}
               <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#E65100] text-white p-3 rounded-full"><Wind size={24} /></div>
                     <div><div className="font-black text-xl text-[#3E2723]">SPEEDBOAT</div><div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">Fast Lane</div></div>
                  </div>
                  <div className="text-right"><div className="font-black text-2xl text-[#3E2723]">$10</div><a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#E65100]">BOARD</a></div>
               </div>

               {/* CLIPPER */}
               <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#2E7D32] text-white p-3 rounded-full"><Ship size={24} /></div>
                     <div><div className="font-black text-xl text-[#3E2723]">CLIPPER</div><div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">Full Sails</div></div>
                  </div>
                  <div className="text-right"><div className="font-black text-2xl text-[#3E2723]">$25</div><a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#2E7D32]">BOARD</a></div>
               </div>

               {/* CRUISELINER */}
               <div className="bg-gradient-to-r from-[#FFD54F] to-[#FFB300] border-2 border-[#3E2723] p-6 rounded-2xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#3E2723] text-[#FFD54F] p-3 rounded-full"><Anchor size={24} /></div>
                     <div><div className="font-black text-xl text-[#3E2723]">CRUISELINER</div><div className="text-xs text-[#3E2723] font-bold uppercase">The Captain</div></div>
                  </div>
                  <div className="text-right"><div className="font-black text-2xl text-[#3E2723]">$100</div><a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] text-[#3E2723] font-bold underline hover:text-white">BOARD</a></div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
