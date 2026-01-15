'use client';

import { Play, Heart, Star, BookOpen, Music, Sun, Moon, Coffee, Activity } from 'lucide-react';

export default function Singalongs() {
  return (
    <main className="min-h-screen bg-[#F0F8FF] text-[#3E2723] font-sans selection:bg-[#FF7043] selection:text-white">
      
      {/* 1. TOP NAV: GPM AUTHORITY */}
      <nav className="p-6 flex justify-between items-center bg-white shadow-sm border-b-4 border-[#FF7043] sticky top-0 z-50">
         <div className="flex items-center gap-3">
            {/* THE GPM LOGO (Brown/Tan) */}
            <div className="w-12 h-12 bg-[#3E2723] rounded-lg flex items-center justify-center border-2 border-[#F5DEB3] shadow-md">
               <span className="text-[#FFCA28] font-black text-xs tracking-tighter leading-none text-center">
                 GPM<br/>LLC
               </span>
            </div>
            <div className="leading-tight">
               <h1 className="font-black text-xl tracking-tight text-[#3E2723]">The Singalongs</h1>
               <p className="text-xs font-bold text-[#FF7043] uppercase tracking-widest">By G Putnam Music</p>
            </div>
         </div>
         
         <div className="hidden md:flex gap-4">
             <button className="text-[#3E2723] font-bold hover:text-[#FF7043]">For Schools</button>
             <button className="text-[#3E2723] font-bold hover:text-[#FF7043]">For Hospitals</button>
         </div>

         <button className="bg-[#FF7043] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:bg-[#FF5722] transition flex items-center gap-2">
            <Star size={18} fill="currentColor" />
            Get Access
         </button>
      </nav>

      {/* 2. HERO SECTION */}
      <div className="container mx-auto mt-16 px-4 text-center">
         <div className="inline-block bg-[#E1F5FE] text-[#0288D1] px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest mb-6 border border-[#B3E5FC]">
            Pediatric & Classroom Approved
         </div>
         <h1 className="text-5xl md:text-7xl font-black text-[#0277BD] mb-6 drop-shadow-sm tracking-tight leading-tight">
            Songs that <br/>
            <span className="text-[#FF7043] underline decoration-[#FFCCBC] decoration-4 underline-offset-4">Heal & Teach.</span>
         </h1>
         <p className="text-xl max-w-2xl mx-auto mb-16 font-bold text-[#3E2723]/70 leading-relaxed">
            Professional-grade music tools designed for Nurses, Teachers, and Parents.
            Instant access to the GPM "Wounded & Willing" catalog, curated for care.
         </p>

         {/* 3. THE "SQUISHY" BUTTON GRID (The Product) */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-24">
            
            {/* BUTTON 1: CALMING */}
            <button className="group bg-white border-b-8 border-[#4FC3F7] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 active:translate-y-1 active:border-b-0 transition-all flex flex-col items-center gap-4 text-[#3E2723]">
               <div className="w-20 h-20 bg-[#E1F5FE] rounded-full flex items-center justify-center group-hover:scale-110 transition">
                 <Moon size={40} className="text-[#0288D1]" />
               </div>
               <span className="font-black text-xl uppercase tracking-wide group-hover:text-[#0288D1]">Calming</span>
            </button>

            {/* BUTTON 2: ACTIVITY */}
            <button className="group bg-white border-b-8 border-[#FFD54F] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 active:translate-y-1 active:border-b-0 transition-all flex flex-col items-center gap-4 text-[#3E2723]">
               <div className="w-20 h-20 bg-[#FFF8E1] rounded-full flex items-center justify-center group-hover:scale-110 transition">
                 <Sun size={40} className="text-[#FF8F00]" />
               </div>
               <span className="font-black text-xl uppercase tracking-wide group-hover:text-[#FF8F00]">Activity</span>
            </button>

            {/* BUTTON 3: FOCUS */}
            <button className="group bg-white border-b-8 border-[#AED581] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 active:translate-y-1 active:border-b-0 transition-all flex flex-col items-center gap-4 text-[#3E2723]">
               <div className="w-20 h-20 bg-[#F1F8E9] rounded-full flex items-center justify-center group-hover:scale-110 transition">
                 <BookOpen size={40} className="text-[#558B2F]" />
               </div>
               <span className="font-black text-xl uppercase tracking-wide group-hover:text-[#558B2F]">Focus</span>
            </button>

            {/* BUTTON 4: SLEEP */}
            <button className="group bg-white border-b-8 border-[#BA68C8] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 active:translate-y-1 active:border-b-0 transition-all flex flex-col items-center gap-4 text-[#3E2723]">
               <div className="w-20 h-20 bg-[#F3E5F5] rounded-full flex items-center justify-center group-hover:scale-110 transition">
                 <Star size={40} className="text-[#7B1FA2]" />
               </div>
               <span className="font-black text-xl uppercase tracking-wide group-hover:text-[#7B1FA2]">Sleep</span>
            </button>

         </div>
      </div>

      {/* 4. FOOTER: TRUST BADGES */}
      <footer className="bg-[#3E2723] text-[#F5DEB3] py-12 text-center">
         <div className="container mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-8 opacity-50">Trusted By Professionals</h3>
            <div className="flex justify-center gap-12 opacity-80 font-black text-2xl">
               <span>SCHOOLS</span>
               <span>CLINICS</span>
               <span>FAMILIES</span>
            </div>
            <div className="mt-12 text-xs opacity-40">
               © 2026 G Putnam Music, LLC. All Rights Reserved.
            </div>
         </div>
      </footer>
    </main>
  );
}
