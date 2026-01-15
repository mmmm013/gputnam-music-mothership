'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Radio, ExternalLink, Music, Mic2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// GPM CONFIG
const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function JazzPage() {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // FETCH JAZZ / CLASSY TRACKS
  useEffect(() => {
    async function fetchJazz() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        // Pulling 'Jazz' or 'Classy' tags for the Scherer vibe
        .or('tags.ilike.%jazz%,tags.ilike.%classy%')
        .limit(20);
        
      if (!error && data) setPlaylist(data);
      setLoading(false);
    }
    fetchJazz();
  }, []);

  const cleanTitle = (track: any) => {
    if (!track) return 'Loading...';
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
    if (currentTrackIndex === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const activeTrack = playlist[currentTrackIndex];

  return (
    // BRANDING: BRONZE & GOLD (The Jazz Club Vibe)
    <main className="min-h-screen w-full bg-gradient-to-b from-[#4E342E] to-[#3E2723] text-[#FFD54F] font-sans selection:bg-[#FFD54F] selection:text-[#3E2723]">
      
      {/* NAV: STANDARD GPM MOTHERSHIP MENU */}
      <nav className="p-4 flex flex-col md:flex-row justify-between items-center bg-[#3E2723]/90 border-b border-[#FFD54F]/10 sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src="/gpm_logp.jpg" alt="GPM" className="w-10 h-10 rounded border border-[#FFD54F]/20" />
          <a href="/" className="font-black text-xs tracking-widest text-[#FFD54F] hover:text-white transition">
             BACK TO HOME
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-[0.1em] uppercase text-[#D7CCC8]">
          <span className="text-[#FFD54F] border-b border-[#FFD54F]">JAZZ</span>
          <a href="/heroes" className="hover:text-white transition">HEROES</a>
          <a href="/join" className="hover:text-white transition">JOIN THE PRIDE</a>
          <a href="/mip" className="bg-[#FFD54F] text-[#3E2723] px-3 py-1 rounded-full hover:scale-105 transition flex items-center gap-1">
            <Radio size={10} /> MIP PORTAL
          </a>
        </div>
      </nav>

      {activeTrack && (
        <audio ref={audioRef} src={activeTrack.public_url || activeTrack.url} onEnded={() => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)} autoPlay={isPlaying} />
      )}

      {/* HEADER: MICHAEL SCHERER SPOTLIGHT */}
      <div className="container mx-auto px-4 mt-12 text-center">
         <div className="inline-block p-4 rounded-full border-2 border-[#FFD54F]/20 mb-6 bg-[#3E2723]">
            <Mic2 size={40} className="text-[#FFD54F]" />
         </div>
         <h1 className="text-5xl md:text-7xl font-black text-[#FFD54F] mb-4 tracking-tight drop-shadow-lg">
            Jazz Masters
         </h1>
         <p className="text-xl text-[#D7CCC8] font-bold tracking-widest uppercase mb-12">
            Featuring Michael Scherer
         </p>
      </div>

      {/* THE PLAYER INTERFACE */}
      <div className="container mx-auto px-4 pb-20 max-w-5xl grid md:grid-cols-[1fr_350px] gap-8">
         
         {/* TRACK LIST */}
         <div className="bg-[#3E2723] border border-[#FFD54F]/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#FFD54F]/10 border-b border-[#FFD54F]/10 flex justify-between items-center">
               <span className="text-xs font-bold uppercase tracking-widest text-[#FFD54F]">Session Tracks</span>
               <div className="flex gap-2 text-[#FFD54F]">
                  <Music size={14} />
                  <span className="text-xs font-bold">{playlist.length}</span>
               </div>
            </div>
            <div className="divide-y divide-[#FFD54F]/10">
               {loading ? <div className="p-8 text-center text-[#FFD54F]/50 animate-pulse">Setting the Stage...</div> : playlist.map((track, idx) => (
                  <div key={track.id || idx} onClick={() => playTrack(idx)} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-[#FFD54F]/10 transition ${currentTrackIndex === idx ? 'bg-[#FFD54F]/20' : ''}`}>
                     <div className="w-8 text-center font-mono text-[#FFD54F]/50 text-xs">0{idx + 1}</div>
                     <div className="flex-1 font-bold text-sm truncate">{cleanTitle(track)}</div>
                     {currentTrackIndex === idx && isPlaying ? <div className="text-[10px] animate-pulse text-[#FFD54F]">PLAYING</div> : <Play size={12} className="opacity-50" />}
                  </div>
               ))}
            </div>
         </div>

         {/* NOW PLAYING CARD */}
         <div className="bg-[#FFD54F] text-[#3E2723] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl h-fit sticky top-24">
            <div className="w-40 h-40 bg-[#3E2723] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#3E2723]/10">
               <button onClick={togglePlay} className="hover:scale-110 transition active:scale-95">
                  {isPlaying ? <Pause size={64} className="text-[#FFD54F]" fill="currentColor" /> : <Play size={64} className="text-[#FFD54F] ml-2" fill="currentColor" />}
               </button>
            </div>
            <h2 className="text-2xl font-black leading-tight mb-2">{cleanTitle(activeTrack)}</h2>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-6">GPM Jazz Archives</p>
            
            <div className="w-full h-1 bg-[#3E2723]/10 rounded-full overflow-hidden">
               <div className="h-full bg-[#3E2723] animate-pulse w-2/3"></div>
            </div>
         </div>

      </div>
    </main>
  );
}
