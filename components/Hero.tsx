'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, RefreshCw, Heart, Download, Share2, Menu, Star } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ROTATION_MS = 12780000; // 3h 33m

// THE 6 FIXED FPs
const FEATURED_ROTATION = [
  { id: 'FP1', title: 'KLEIGH: POP ANTHEMS', mood_tag: 'energy' },
  { id: 'FP2', title: 'SCHERER: JAZZ MASTERS', mood_tag: 'classy' },
  { id: 'FP3', title: 'GPM: STUDIO SESSIONS', mood_tag: 'raw' },
  { id: 'FP4', title: 'KLEIGH: ACOUSTIC SOUL', mood_tag: 'soul' },
  { id: 'FP5', title: 'GPM: MOODS & AMBIENCE', mood_tag: 'ambient' },
  { id: 'FP6', title: 'SCHERER: PIANO LOUNGE', mood_tag: 'sad' }
];

export default function Hero() {
  const [currentFPIndex, setCurrentFPIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEagle, setShowEagle] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const now = Date.now();
    const cyclePosition = Math.floor(now / ROTATION_MS) % FEATURED_ROTATION.length;
    setCurrentFPIndex(cyclePosition);
    const interval = setInterval(() => {
      setCurrentFPIndex((prev) => (prev + 1) % FEATURED_ROTATION.length);
    }, ROTATION_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchTracks() {
      setLoading(true);
      const currentFP = FEATURED_ROTATION[currentFPIndex];
      const { data, error } = await supabase
        .from('tracks') 
        .select('*')
        .ilike('tags', `%${currentFP.mood_tag}%`)
        .limit(50);
      if (!error && data) setPlaylist(data);
      setLoading(false);
    }
    fetchTracks();
  }, [currentFPIndex]);

  useEffect(() => {
    const eagleTimer = setInterval(() => {
      setShowEagle(true);
      setTimeout(() => setShowEagle(false), 10000);
    }, 120000); 
    return () => clearInterval(eagleTimer);
  }, []);

  const cleanTitle = (track: any) => {
    if (!track) return 'Loading...';
    let text = track.title || track.name || 'Unknown';
    text = text.replace(/^\d+\s*-\s*/, '');
    text = text.replace(/g\s*putnam\s*music\s*-\s*/i, '');
    text = text.replace(/\.mp3|\.wav|\.m4a/gi, '').replace(/_/g, ' ');
    return text;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const currentFP = FEATURED_ROTATION[currentFPIndex];
  const activeTrack = playlist[currentTrackIndex];

  return (
    <section className="relative min-h-screen w-full bg-[#5D4037] text-[#D7CCC8] pt-24 flex flex-col items-center overflow-hidden font-sans">
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center bg-[#3E2723]/80 backdrop-blur-sm z-50 border-b border-[#D7CCC8]/10">
        <div className="flex gap-6 text-xs font-bold tracking-[0.2em] uppercase text-[#D7CCC8]/80">
          <span className="cursor-pointer hover:text-white transition">GPM Home</span>
          <span className="cursor-pointer hover:text-white transition">Artists</span>
          <span className="cursor-pointer hover:text-white transition">K-Series</span>
          <span className="cursor-pointer hover:text-[#FFCCBC] transition flex items-center gap-1 text-[#FFCCBC]"><Star size={10}/> Heroes</span>
        </div>
        <Menu size={24} className="text-[#D7CCC8]" />
      </nav>

      {showEagle && (
        <div className="absolute top-40 left-[-200px] animate-eagle-fly z-0 opacity-10 pointer-events-none text-white">
           <div className="text-[150px] rotate-12 drop-shadow-2xl">🦅</div>
        </div>
      )}

      {activeTrack && (
        <audio 
          ref={audioRef}
          src={activeTrack.public_url || activeTrack.url}
          onEnded={() => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)}
          autoPlay={isPlaying}
        />
      )}

      <div className="container mx-auto px-4 text-center z-10 mt-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#D7CCC8] mb-2 drop-shadow-lg">
          G Putnam <br/> Music
        </h1>
        <h2 className="text-5xl md:text-7xl font-black text-[#FFCCBC] italic tracking-tight mb-8 opacity-90 border-b-4 border-[#FFCCBC] inline-block pb-2">
          MOODs
        </h2>
        <p className="text-[#D7CCC8]/80 text-lg max-w-xl mx-auto mb-12 font-medium">
          From K-Kisses to K-Kourage. Find your feeling.
        </p>

        <div className="max-w-xl mx-auto relative mb-16 group">
          <input 
            type="text" 
            placeholder="How are you feeling? (e.g. 'Heroes', 'Love')"
            className="w-full bg-[#4E342E] border border-[#D7CCC8]/30 placeholder-[#D7CCC8]/30 text-[#D7CCC8] font-bold text-xl px-8 py-6 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D7CCC8]/50 transition-all"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#D7CCC8] rounded-xl text-[#5D4037] hover:scale-105 transition">
            <Search size={24} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8 items-start max-w-6xl z-10">
        <div className="bg-[#3E2723] border border-[#D7CCC8]/20 rounded-xl shadow-2xl overflow-hidden h-[400px] flex flex-col">
          <div className="p-6 border-b border-[#D7CCC8]/10 bg-[#2D1B15]">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-[#FFCCBC] uppercase tracking-widest">Wounded & Willing Collection</span>
                <h3 className="text-xl font-bold text-white">{currentFP.title}</h3>
              </div>
              <RefreshCw size={16} className="text-[#D7CCC8] animate-spin-slow opacity-50" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {loading ? (
              <p className="text-[#D7CCC8]/30 text-center py-10">Loading K-Series Catalog...</p>
            ) : (
              playlist.map((track, idx) => (
                <div 
                  key={track.id || idx}
                  onClick={() => playTrack(idx)}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${idx === currentTrackIndex ? 'bg-[#D7CCC8] text-[#3E2723]' : 'bg-[#4E342E] text-[#D7CCC8] hover:bg-[#5D4037] hover:text-white'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 flex items-center justify-center bg-black/10 rounded-full">
                      {idx === currentTrackIndex && isPlaying ? <span className="animate-pulse">lıl</span> : <Play size={10} fill="currentColor" />}
                    </div>
                    <span className="font-bold text-sm truncate">{cleanTitle(track)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#3E2723] p-8 rounded-3xl shadow-2xl text-center border border-[#D7CCC8]/20 h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
           <div className="w-40 h-40 bg-[#D7CCC8] rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10 ring-4 ring-[#FFCCBC]/30">
              <button onClick={togglePlay} className="hover:scale-110 transition">
                {isPlaying ? <Pause size={56} className="text-[#5D4037]" fill="currentColor" /> : <Play size={56} className="text-[#5D4037] ml-2" fill="currentColor" />}
              </button>
           </div>
           <div className="relative z-10">
             <h2 className="text-2xl font-black text-white mb-2 max-w-xs mx-auto leading-tight">{cleanTitle(activeTrack)}</h2>
             <p className="text-[#FFCCBC] font-bold uppercase tracking-widest text-xs">G Putnam Music, LLC</p>
           </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes eagle-fly {
          0% { transform: translateX(0) translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateX(120vw) translateY(-20vh) scale(1.2); opacity: 0; }
        }
        .animate-eagle-fly {
          animation: eagle-fly 20s linear forwards;
        }
      `}</style>
    </section>
  );
}
