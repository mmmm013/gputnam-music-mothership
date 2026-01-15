'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, RefreshCw, Download, LockOpen, ExternalLink, Radio } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// GPM CONFIG
const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ROTATION_MS = 12780000; 

// INTERNAL ROTATION
const FEATURED_ROTATION = [
  { id: 'FP1', mood_tag: 'energy' },
  { id: 'FP2', mood_tag: 'classy' },
  { id: 'FP3', mood_tag: 'raw' },
  { id: 'FP4', mood_tag: 'soul' },
  { id: 'FP5', mood_tag: 'ambient' },
  { id: 'FP6', mood_tag: 'sad' }
];

export default function Hero() {
  const [currentFPIndex, setCurrentFPIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
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
      const { data, error } = await supabase.from('tracks').select('*').ilike('tags', `%${currentFP.mood_tag}%`).limit(6);
      if (!error && data) setPlaylist(data);
      setLoading(false);
    }
    fetchTracks();
  }, [currentFPIndex]);

  const cleanTitle = (track: any) => {
    if (!track) return 'Select a Taste Treat...';
    let text = track.title || track.name || 'Unknown';
    text = text.replace(/^\d+\s*-\s*/, '').replace(/g\s*putnam\s*music\s*-\s*/i, '').replace(/\s*-\s*[Mm]$/, '').replace(/\.mp3|\.wav|\.m4a/gi, '').replace(/_/g, ' ');
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

  const activeTrack = playlist[currentTrackIndex];

  return (
    // BRANDING: DREAM THE STREAM GOLD GRADIENT (UNCHANGED)
    <section className="relative min-h-screen w-full bg-gradient-to-b from-[#FFD54F] to-[#FF8F00] text-[#3E2723] pt-32 flex flex-col items-center overflow-hidden font-sans">
      
      <nav className="absolute top-0 w-full p-4 flex flex-col md:flex-row justify-between items-center bg-[#FFD54F]/90 backdrop-blur-md z-50 border-b border-[#3E2723]/10 shadow-sm">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src="/gpm_logp.jpg" alt="GPM Logo" className="w-12 h-12 rounded-md object-cover border border-[#3E2723]/20" />
          <span className="font-black text-lg tracking-tight text-[#3E2723]">G Putnam Music, LLC</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold tracking-[0.1em] uppercase text-[#3E2723]">
          <a href="https://2kleigh.com" target="_blank" className="hover:text-white transition flex items-center gap-1">KLEIGH <ExternalLink size={10}/></a>
          <a href="/jazz" className="hover:text-white transition">JAZZ</a>
          <a href="/heroes" className="hover:text-white transition">HEROES</a>
          <a href="/join" className="hover:text-white transition">JOIN THE PRIDE (CUBs)</a>
          <a href="/uru" className="hover:text-white transition">URU</a>
          <a href="/mip" className="bg-[#3E2723] text-[#FFD54F] px-4 py-2 rounded-full hover:scale-105 transition flex items-center gap-2 border border-[#FFD54F]">
            <Radio size={12} className="animate-pulse" /> <span className="text-[10px] opacity-70">+</span> <Download size={12} /> MIP / HEROES
          </a>
        </div>
      </nav>

      {activeTrack && (
        <audio ref={audioRef} src={activeTrack.public_url || activeTrack.url} onEnded={() => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)} autoPlay={isPlaying} />
      )}

      <div className="container mx-auto px-4 text-center z-10 mt-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#3E2723] mb-2 drop-shadow-sm text-shadow">G Putnam <br/> Music</h1>
        <h2 className="text-5xl md:text-7xl font-black text-[#3E2723] italic tracking-tight mb-8 opacity-90 border-b-4 border-[#3E2723] inline-block pb-2">MOODs</h2>
        
        <div className="max-w-xl mx-auto relative mb-16">
          <input type="text" placeholder="Find Your Perfect Mood..." className="w-full bg-[#FFF8E1] border-2 border-[#3E2723] placeholder-[#3E2723]/50 text-[#3E2723] font-bold text-xl px-8 py-6 rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-[#3E2723]/20" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-[#3E2723] rounded-full text-[#FFD54F] hover:scale-110 transition"><Search size={20} /></button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8 items-start max-w-6xl z-10">
        
        <div className="bg-[#FFF8E1] border-2 border-[#3E2723] rounded-2xl shadow-[8px_8px_0px_0px_rgba(62,39,35,1)] overflow-hidden h-[450px] flex flex-col">
          <div className="p-6 border-b-2 border-[#3E2723] bg-[#FFECB3]">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-black text-[#3E2723] uppercase tracking-widest bg-[#FFD54F] px-2 py-1 rounded flex items-center gap-1 w-max">
                   <LockOpen size={10} /> Free-Play Active
                </span>
                {/* YOUR REQUESTED TITLE UPDATE */}
                <h3 className="text-2xl font-black text-[#3E2723] mt-2 leading-none">Wounded & Willing <br/><span className="italic text-[#E65100]">Taste Treats</span></h3>
              </div>
              <RefreshCw size={20} className="text-[#3E2723] animate-spin-slow opacity-80" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {loading ? <p className="text-[#3E2723]/50 text-center py-10 font-bold">Loading Treats...</p> : playlist.map((track, idx) => (
              <div key={track.id || idx} onClick={() => playTrack(idx)} className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition border-2 ${idx === currentTrackIndex ? 'bg-[#3E2723] text-[#FFD54F] border-[#3E2723]' : 'bg-white text-[#3E2723] border-[#3E2723]/10 hover:border-[#3E2723] hover:translate-x-1'}`}>
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="font-mono font-bold opacity-50">0{idx + 1}</div>
                  <span className="font-bold text-lg truncate">{cleanTitle(track)}</span>
                </div>
                {idx === currentTrackIndex && isPlaying ? <div className="animate-pulse w-3 h-3 bg-[#FFD54F] rounded-full"></div> : <Play size={16} fill="currentColor" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#3E2723] p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(255,213,79,1)] text-center border-2 border-[#3E2723] h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
           <div className="w-48 h-48 bg-[#FFD54F] rounded-full flex items-center justify-center mb-8 shadow-2xl relative z-10 ring-8 ring-[#FFECB3]/20 border-4 border-[#3E2723]">
              <button onClick={togglePlay} className="hover:scale-110 transition active:scale-95">
                {isPlaying ? <Pause size={72} className="text-[#3E2723]" fill="currentColor" /> : <Play size={72} className="text-[#3E2723] ml-3" fill="currentColor" />}
              </button>
           </div>
           
           <div className="relative z-10 w-full px-8">
             <div className="h-1 w-20 bg-[#FFD54F] mx-auto mb-4 rounded-full opacity-50"></div>
             <h2 className="text-3xl font-black text-[#FFD54F] mb-1 leading-tight truncate">{cleanTitle(activeTrack)}</h2>
             <p className="text-[#FFECB3] font-bold uppercase tracking-widest text-xs opacity-70">G Putnam Music, LLC</p>
           </div>
        </div>

      </div>
    </section>
  );
}
