'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const [mood, setMood] = useState('');
  return (
    <main className="min-h-screen bg-[#FBC02D] text-[#2C241B] font-serif flex flex-col">
      <Header />
      {/* Reduced padding on mobile (p-6 instead of p-12) */}
      <div className="flex-1 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-8 items-center pb-32">
        <div className="space-y-6 md:space-y-8">
          <h1 className="text-5xl md:text-8xl font-black leading-tight text-[#2C241B]">
            Dream the Stream <br /> <span className="text-[#3E2723]">MOODs</span>
          </h1>
          <p className="text-base md:text-lg opacity-80 leading-relaxed max-w-lg">
            Discover the revolutionary approach to music streaming that matches your exact mood.
          </p>
          <div className="relative">
            <input type="text" value={mood} onChange={(e) => setMood(e.target.value)}
              placeholder="Enter a mood..."
              className="w-full bg-[#FDF6E3]/50 border border-[#2C241B]/10 rounded-full px-6 py-4 text-lg focus:outline-none placeholder-[#2C241B]/50" />
          </div>
          <button className="w-full md:w-auto bg-[#C04000] text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest shadow-lg">
            Get Music Maykers Now
          </button>
        </div>
        <div className="hidden md:block relative h-[500px] w-full">
           <img src="https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/images/gpm-portrait.jpg" 
                alt="Artist Portrait" className="w-full h-full object-cover rounded-3xl shadow-2xl transform rotate-2" />
        </div>
      </div>
      <AudioPlayer />
    </main>
  );
}
