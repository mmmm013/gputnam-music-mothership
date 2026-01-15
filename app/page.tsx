'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const SUPABASE_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhanhncmJ4dmtoZm1tZmlvdHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzUwMTEsImV4cCI6MjA4MjYxMTAxMX0.8RrewbW4vlmABH5dS2zeykaj6_MFE8yHiZjKtteAfUU";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DATA CLEANING (Standard GPM Engine) ---
function cleanTrackTitle(rawTitle: string) {
  if (!rawTitle) return "Unknown Track";
  return rawTitle
    .replace(/Music Maykers\s?-\s?/gi, '')
    .replace(/KLEIGH\s?-\s?/gi, '')
    .replace(/The Singalongs\s?-\s?/gi, '') // Custom for this domain
    .replace(/\.mp3$/i, '')
    .trim();
}

export default function SingalongsSite() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [systemMessage, setSystemMessage] = useState("SINGALONGS READY");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function init() {
      // FETCH LOGIC: Pulls ALL tracks (since default is 'ALL')
      const { data } = await supabase.from('tracks').select('*');
      setTracks(data || []);
    }
    init();
  }, []);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setSystemMessage(`NOW PLAYING: ${cleanTrackTitle(track.title)}`);
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
        audioRef.current.src = currentTrack.url;
        audioRef.current.play();
    }
  }, [currentTrack]);

  return (
    <main className="min-h-screen bg-[#3E2723] text-white font-sans selection:bg-[#FBBC05]">
      
      {/* HEADER: Identity + Mothership Link */}
      <nav className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-white/10 bg-black/20">
        <div className="text-3xl font-black tracking-tighter uppercase text-[#FBBC05] mb-4 md:mb-0">
          The Singalongs
        </div>
        <div className="flex gap-6 text-xs font-bold tracking-widest uppercase items-center">
          <a href="https://gputnammusic.com" target="_blank" className="opacity-50 hover:opacity-100 hover:text-[#FBBC05]">
            Powered by G Putnam Music
          </a>
          <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="bg-[#FBBC05] text-[#3E2723] px-6 py-2 rounded-sm shadow-lg hover:bg-white transition-all">
            Join the Circle (Sponsor)
          </a>
        </div>
      </nav>

      {/* MAIN CONTENT: Community Vibe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-6xl mx-auto min-h-[70vh]">
        
        {/* PLAYER SIDE */}
        <div className="flex flex-col justify-center items-center text-center space-y-8 order-2 md:order-1">
           <div className="w-64 h-64 bg-black/40 rounded-full border-4 border-[#FBBC05] flex items-center justify-center relative overflow-hidden shadow-2xl">
              {currentTrack ? (
                 <div className="z-10 px-4">
                    <div className="text-[#FBBC05] text-xs font-bold tracking-[0.3em] uppercase mb-2 animate-pulse">Live Track</div>
                    <h2 className="text-xl font-serif font-bold leading-tight">{cleanTrackTitle(currentTrack.title)}</h2>
                 </div>
              ) : (
                 <div className="text-white/10 text-6xl font-black">SING</div>
              )}
           </div>
           <audio ref={audioRef} crossOrigin="anonymous" onEnded={() => setSystemMessage("Track Finished.")}/>
           <div className="text-[#FBBC05] font-mono text-xs uppercase">{systemMessage}</div>
        </div>

        {/* LIST SIDE */}
        <div className="bg-black/20 p-6 rounded-lg border border-white/5 overflow-y-auto max-h-[60vh] order-1 md:order-2">
           <h3 className="text-xs font-bold text-[#FBBC05] uppercase tracking-widest mb-4 sticky top-0 bg-[#32201d] py-2">Select a Song</h3>
           <div className="space-y-2">
              {tracks.map((t, i) => (
                 <div key={i} onClick={() => playTrack(t)} className={`p-3 text-sm cursor-pointer hover:bg-white/5 transition-colors border-l-2 ${currentTrack === t ? 'border-[#FBBC05] bg-white/5' : 'border-transparent opacity-60'}`}>
                    {cleanTrackTitle(t.title)}
                 </div>
              ))}
           </div>
        </div>
      </div>

    </main>
  );
}
