'use client';

import { Heart, Star, Shield, Check, ExternalLink, Radio, Users, Coffee, Zap, Crown } from 'lucide-react';

export default function JoinPage() {
  return (
    // BRANDING: AMBER/GOLD (Standard)
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      
      {/* NAV */}
      <nav className="p-4 flex flex-col md:flex-row justify-between items-center bg-[#FFD54F]/90 border-b border-[#3E2723]/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src="/gpm_logp.jpg" alt="GPM" className="w-10 h-10 rounded border border-[#3E2723]/20" />
          <a href="/" className="font-black text-xs tracking-widest text-[#3E2723] hover:text-white transition">BACK TO HOME</a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-[0.1em] uppercase text-[#3E2723]">
          <a href="/jazz" className="hover:text-white transition">JAZZ</a>
          <a href="/heroes" className="hover:text-white transition">HEROES</a>
          <span className="border-b-2 border-[#3E2723]">JOIN THE PRIDE</span>
          <a href="/mip" className="bg-[#3E2723] text-[#FFD54F] px-3 py-1 rounded-full hover:scale-105 transition flex items-center gap-1"><Radio size={10} /> MIP PORTAL</a>
        </div>
      </nav>

      {/* HEADER */}
      <div className="container mx-auto px-4 mt-16 text-center max-w-3xl">
         <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-8 shadow-xl">
            <Heart size={48} className="text-[#FFD54F] animate-pulse" fill="currentColor" />
         </div>
         <h1 className="text-5xl md:text-7xl font-black text-[#3E2723] mb-4 tracking-tight drop-shadow-sm leading-none">
            Become a <br/>Sponsor CUB.
         </h1>
         <div className="inline-block bg-[#FFF8E1] border-2 border-[#3E2723] px-6 py-2 rounded-full mb-8">
            <p className="text-sm font-black text-[#3E2723] uppercase tracking-widest">
               Community Underwriter Benefit
            </p>
         </div>
      </div>

      {/* THE OFFER: OFFICIAL SCRIPT */}
      <div className="container mx-auto px-4 pb-20 max-w-5xl">
         <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* LEFT: THE MISSION SCRIPT */}
            <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(62,39,35,1)]">
               <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Users size={24} /> The Mission
               </h2>
               <div className="space-y-6 text-lg font-bold text-[#3E2723]/80 leading-relaxed">
                  <p>
                     SponsorCUBs keep the stream free for fans, nurses, and the Kleigh community.
                  </p>
                  <p>
                     For less than the price of a fancy coffee (<span className="text-[#E65100]">$5.00</span>), you power the platform.
                  </p>
                  <p>
                     100% of proceeds go directly to GPM Development & Artist Support.
                  </p>
               </div>
               
               <div className="mt-8 pt-8 border-t-2 border-[#3E2723]/10 space-y-4">
                  <h3 className="font-black text-sm uppercase">CUB Benefits:</h3>
                  <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> UNLIMITED Plays (No Daily Limits)</div>
                  <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Unlock URU Story Engine</div>
                  <div className="flex items-center gap-3 font-bold"><Check size={20} className="text-[#E65100]" /> Verified "Sponsor" Badge</div>
               </div>
            </div>

            {/* RIGHT: THE TIERS (FROM MODAL) */}
            <div className="space-y-4">
               
               {/* TIER 1: FAN */}
               <div className="bg-[#3E2723] text-[#FFD54F] p-6 rounded-2xl border-2 border-[#3E2723] shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#FFD54F] text-[#3E2723] p-3 rounded-full"><Coffee size={24} /></div>
                     <div>
                        <div className="font-black text-xl">FAN CUB</div>
                        <div className="text-xs opacity-70 font-bold uppercase">The Essentials</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="font-black text-2xl">$5</div>
                     <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] underline hover:text-white">SELECT</a>
                  </div>
               </div>

               {/* TIER 2: SUPER FAN */}
               <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#E65100] text-white p-3 rounded-full"><Heart size={24} fill="currentColor" /></div>
                     <div>
                        <div className="font-black text-xl text-[#3E2723]">SUPER FAN</div>
                        <div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">Double the Love</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="font-black text-2xl text-[#3E2723]">$10</div>
                     <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#E65100]">SELECT</a>
                  </div>
               </div>

               {/* TIER 3: PRODUCER */}
               <div className="bg-white border-2 border-[#3E2723] p-6 rounded-2xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition group">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#2E7D32] text-white p-3 rounded-full"><Zap size={24} fill="currentColor" /></div>
                     <div>
                        <div className="font-black text-xl text-[#3E2723]">PRODUCER</div>
                        <div className="text-xs text-[#3E2723] opacity-60 font-bold uppercase">Inner Circle</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="font-black text-2xl text-[#3E2723]">$25</div>
                     <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] text-[#3E2723] font-bold underline hover:text-[#2E7D32]">SELECT</a>
                  </div>
               </div>

               {/* TIER 4: LIFETIME */}
               <div className="bg-gradient-to-r from-[#FFD54F] to-[#FFB300] border-2 border-[#3E2723] p-6 rounded-2xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#3E2723] text-[#FFD54F] p-3 rounded-full"><Crown size={24} fill="currentColor" /></div>
                     <div>
                        <div className="font-black text-xl text-[#3E2723]">LIFETIME CUB</div>
                        <div className="text-xs text-[#3E2723] font-bold uppercase">Forever Status</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="font-black text-2xl text-[#3E2723]">$100</div>
                     <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="text-[10px] text-[#3E2723] font-bold underline hover:text-white">SELECT</a>
                  </div>
               </div>

               <p className="text-center text-[10px] font-bold opacity-50 uppercase mt-4">
                  Secure Payment via Stripe | Cancel Anytime
               </p>

            </div>
         </div>
      </div>
    </main>
  );
}
