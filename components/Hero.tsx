'use client';

import { useState, useEffect } from 'react';
import { Search, Play, Pause, RefreshCw } from 'lucide-react';
import Image from 'next/image';

// GPM ROTATION CONFIG: 6 Featured Playlists
// Rotates every 3 Hours 33 Minutes (12,780,000 ms)
const ROTATION_TIME = 12780000;

const FEATURED_PLAYLISTS = [
  { id: 'FP1', title: 'GPM: POP ANTHEMS', mood: 'energetic' },
  { id: 'FP2', title: 'JAZZ: MICHAEL SCHERER', mood: 'classy' },
  { id: 'FP3', title: 'KLEIGH: ACOUSTIC SOUL', mood: 'soulful' },
  { id: 'FP4', title: 'GPM: STUDIO SESSIONS', mood: 'raw' },
  { id: 'FP5', title: 'GPM: MOODS & AMBIENCE', mood: 'chill' },
  { id: 'FP6', title: 'SCHERER: PIANO LOUNGE', mood: 'melancholy' }
];

export default function Hero() {
  const [moodInput, setMoodInput] = useState('');
  const [currentFPIndex, setCurrentFPIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ROTATION LOGIC: Updates the "Black Box" FP every 3h 33m
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFPIndex((prev) => (prev + 1) % FEATURED_PLAYLISTS.length);
    }, ROTATION_TIME);
    return () => clearInterval(interval);
  }, []);

  const currentFP = FEATURED_PLAYLISTS[currentFPIndex];

  const handleMoodSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching Supabase for synonym match: ${moodInput}`);
  };

  return (
    // BRANDING UPDATE: LIGHTER AMBER BACKGROUND (#FFCA28)
    <section className="relative min-h-screen w-full bg-[#FFCA28] text-[#3E2723] pt-24 flex flex-col items-center">
      
      {/* 1. GPM BRANDING HEADLINE */}
      <div className="container mx-auto px-4 text-center z-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#3E2723] mb-2">
          G Putnam <br/> Music
        </h1>
        {/* REPLACED ORANGE WITH DEEP BROWN */}
        <h2 className="text-5xl md:text-7xl font-black text-[#3E2723] italic tracking-tight mb-8 opacity-90 border-b-4 border-[#3E2723] inline-block pb-2">
          MOODs
        </h2>
        
        <p className="text-[#3E2723] text-lg max-w-xl mx-auto mb-12 font-bold">
          Discover the revolutionary approach to music streaming that matches your exact mood.
        </p>

        {/* 2. THE MOOD SEARCH - Thin Brown Border */}
        <form onSubmit={handleMoodSearch} className="max-w-xl mx-auto relative mb-16">
          <input 
            type="text" 
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="Enter a mood... (e.g. 'Longing', 'Hype')"
            className="w-full bg-[#FFD54F] border border-[#3E2723] placeholder-[#3E2723]/50 text-[#3E2723] font-bold text-xl px-8 py-6 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-[#3E2723] transition-all"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#3E2723] rounded-xl text-[#FFCA28] hover:scale-105 transition">
            <Search size={24} />
          </button>
        </form>
      </div>

      {/* 3. THE "BLACK BOX" (System Status -> Featured Playlists) */}
      <div className="container mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8 items-end max-w-6xl">
        
        {/* LEFT: The "System Status" Box - THIN BROWN BORDER */}
        <div className="bg-black border border-[#3E2723] p-8 rounded-xl shadow-2xl font-mono relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#3E2723]"></div>
          
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FFCA28]/70">System Status: ONLINE</span>
            <RefreshCw size={14} className="text-[#FFCA28] animate-spin-slow opacity-70" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white mb-1">CURRENT ROTATION</h3>
            <p className="text-sm text-neutral-400 mb-4">Refreshes every 3h 33m</p>
            
            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#3E2723]/50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 flex items-center justify-center bg-[#3E2723] text-[#FFCA28] rounded-full hover:scale-110 transition border border-[#FFCA28]/20"
                >
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs text-[#FFCA28] uppercase tracking-widest font-bold">Now Featuring</p>
                  <p className="text-white font-bold text-lg">{currentFP.title}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-[10px] uppercase tracking-widest text-neutral-500">
              <span>Next Shift: +3h 33m</span>
              <span>Source: GPM Catalog</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Visual / Player Placeholder - THIN BROWN BORDER */}
        <div className="relative aspect-square md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#3E2723]">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
               <div className="w-20 h-20 bg-[#3E2723] rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center border border-[#FFCA28]/30">
                 <Play size={40} className="text-[#FFCA28] ml-2" fill="currentColor" />
               </div>
               <p className="text-[#FFCA28] font-bold tracking-widest">GPM AUDIO ENGINE</p>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
