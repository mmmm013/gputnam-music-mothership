'use client';

import { Heart, Star, Shield, Check, ExternalLink, Radio } from 'lucide-react';

export default function JoinPage() {
  return (
    // BRANDING: AMBER/GOLD (Standard)
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      
      {/* NAV */}
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
          <span className="border-b-2 border-[#3E2723]">JOIN THE PRIDE</span>
          <a href="/mip" className="bg-[#3E2723] text-[#FFD54F] px-3 py-1 rounded-full hover:scale-105 transition flex items-center gap-1">
            <Radio size={10} /> MIP PORTAL
          </a>
        </div>
      </nav>

      {/* HEADER */}
      <div className="container mx-auto px-4 mt-16 text-center max-w-3xl">
         <div className="inline-block p-6 rounded-full bg-[#3E2723] mb-8 shadow-xl">
            <Heart size={48} className="text-[#FFD54F] animate-pulse" fill="currentColor" />
         </div>
         <h1 className="text-6xl md:text-8xl font-black text-[#3E2723] mb-6 tracking-tight drop-shadow-sm leading-none">
            Join the <br/>Pride.
         </h1>
         <p className="text-2xl font-bold text-[#3E2723] opacity-80 mb-12">
            Become a <span className="text-white underline decoration-[#3E2723]">Sponsor CUB</span> today.
         </p>
      </div>

      {/* THE OFFER */}
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
         <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(62,39,35,1)]">
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
               
               {/* LEFT: THE MISSION */}
               <div className="text-left space-y-6">
                  <h2 className="text-3xl font-black uppercase tracking-tight">Why Sponsor?</h2>
                  <p className="font-bold text-lg opacity-80 leading-relaxed">
                     G Putnam Music is dedicated to providing <span className="text-[#E65100]">Free Streaming & Downloads</span> to Nurses, Doctors, Teachers, and First Responders.
                  </p>
                  <p className="font-bold text-lg opacity-80 leading-relaxed">
                     Your sponsorship covers the bandwidth costs and keeps the "Healing & Teaching" playlists accessible to those who need them most.
                  </p>
                  
                  <div className="space-y-3 mt-4">
                     <div className="flex items-center gap-3 font-bold">
                        <Check size={20} className="text-[#3E2723]" /> Support Independent Music
                     </div>
                     <div className="flex items-center gap-3 font-bold">
                        <Check size={20} className="text-[#3E2723]" /> Fuel the "Singalongs" Project
                     </div>
                     <div className="flex items-center gap-3 font-bold">
                        <Check size={20} className="text-[#3E2723]" /> Keep Ads OFF the Platform
                     </div>
                  </div>
               </div>

               {/* RIGHT: THE ACTION */}
               <div className="bg-[#3E2723] text-[#FFD54F] p-8 rounded-2xl text-center border-2 border-[#3E2723] shadow-lg">
                  <Star size={40} className="mx-auto mb-4 text-[#FFD54F]" fill="currentColor" />
                  <h3 className="text-2xl font-black uppercase mb-2">Sponsor CUB</h3>
                  <div className="text-sm font-bold opacity-70 mb-8 uppercase tracking-widest">Official Supporter</div>
                  
                  <a 
                    href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
                    target="_blank"
                    className="block w-full bg-[#FFD54F] text-[#3E2723] font-black text-xl py-4 rounded-xl hover:scale-105 hover:bg-white transition shadow-lg flex items-center justify-center gap-2"
                  >
                     SPONSOR NOW <ExternalLink size={20} />
                  </a>
                  
                  <p className="text-[10px] mt-4 opacity-50 uppercase font-bold">
                     Secure Payment via Stripe
                  </p>
               </div>

            </div>
         </div>
      </div>

    </main>
  );
}
