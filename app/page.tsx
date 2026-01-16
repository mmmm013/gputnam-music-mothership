'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const [mood, setMood] = useState('');

  return (
    <main className="min-h-screen bg-[#FBC02D] text-[#2C241B] font-serif flex flex-col">
      <Header />
      
      {/* MAIN HERO SECTION */}
      <div className="flex-1 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 p-8 items-center">
        
        {/* LEFT COLUMN: TEXT & SEARCH */}
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-black leading-tight text-[#2C241B]">
            Dream the Stream <br />
            <span className="text-[#3E2723]">MOODs</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-lg">
            Discover the revolutionary approach to music streaming that matches your exact mood. 
            Our innovative SHIPS platform finds the perfect tracks for every moment of your life.
          </p>

          <div className="space-y-2">
            <label className="font-bold uppercase text-xs tracking-widest opacity-60">Find Your Perfect Mood</label>
            <div className="relative">
              <input 
                type="text" 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Enter one or two moods (e.g., relaxing, energetic)..."
                className="w-full bg-[#FDF6E3]/50 border border-[#2C241B]/10 rounded-full px-6 py-4 text-lg focus:outline-none focus:bg-[#FDF6E3] transition placeholder-[#2C241B]/40"
              />
            </div>
          </div>

          <button className="bg-[#C04000] text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest hover:bg-[#A03000] transition shadow-lg transform hover:-translate-y-1">
            Get Music Maykers Now
          </button>
        </div>

        {/* RIGHT COLUMN: THE PORTRAIT (Restoring the Template Look) */}
        <div className="relative h-[600px] w-full hidden md:block">
          <div className="absolute inset-0 bg-black/10 rounded-3xl transform rotate-3 scale-95 origin-bottom-right"></div>
          {/* Using a placeholder for now - REPLACE with your actual image URL later */}
          <div className="absolute inset-0 bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden" 
               style={{ backgroundImage: 'url("https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/images/gpm-portrait.jpg")' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION: DISCO PLAYLIST */}
      <div className="bg-[#EF6C00] text-[#FDF6E3] p-12 text-center">
        <h2 className="text-3xl font-black uppercase mb-4 opacity-90">Explore the DISCO Playlist</h2>
        <p className="max-w-2xl mx-auto opacity-80 mb-8">
          Dive into our ever-growing library. While this embedded playlist gives you a taste, 
          use our MOODs search above for an enhanced experience.
        </p>
      </div>

      {/* THE AUDIO PLAYER (Floating Bottom Bar - Always Accessible) */}
      <AudioPlayer />
    </main>
  );
}
