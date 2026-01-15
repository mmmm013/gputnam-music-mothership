'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GPM CORPORATE CONFIGURATION ---
const SUPABASE_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhanhncmJ4dmtoZm1tZmlvdHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzUwMTEsImV4cCI6MjA4MjYxMTAxMX0.8RrewbW4vlmABH5dS2zeykaj6_MFE8yHiZjKtteAfUU";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- GPM DATA STANDARDIZATION ENGINE ---
// Req: "Effective, Streamlined, Measurable"
function cleanTrackTitle(rawTitle: string) {
  if (!rawTitle) return "Unknown Asset";
  // Logic: Remove "Music Maykers -", "KLEIGH -", etc.
  // Keeps the Track Number and the Song Title.
  return rawTitle
    .replace(/Music Maykers\s?-\s?/gi, '')
    .replace(/KLEIGH\s?-\s?/gi, '')
    .replace(/Lloyd G Miller\s?-\s?/gi, '')
    .replace(/Dyanne Harvey\s?-\s?/gi, '')
    .replace(/Lisa Perry\s?-\s?/gi, '')
    .replace(/Zach Linley\s?-\s?/gi, '')
    .replace(/Micheal Scherer\s?-\s?/gi, '')
    .replace(/\.mp3$/i, '')
    .trim();
}

export default function GPMConsole() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [systemMessage, setSystemMessage] = useState("Initializing GPM Command...");
  const [showFP, setShowFP] = useState(false); // Fan Perks Toggle

  const audioRef = useRef<HTMLAudioElement>(null);

  // --- 1. INITIALIZE ASSET VAULT ---
  useEffect(() => {
    async function initSystem() {
      const { data, error } = await supabase.from('tracks').select('*');
      if (error) {
        setSystemMessage("❌ ALERT: Vault Connection Failed.");
      } else {
        setTracks(data || []);
        setSystemMessage(`✅ GPM CONTROL ONLINE: ${data?.length || 0} Assets Managed.`);
      }
    }
    initSystem();
  }, []);

  // --- 2. OPS LOGIC: Playback ---
  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setSystemMessage(`▶ DEPLOYING ASSET: ${cleanTrackTitle(track.title)}`);
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
        audioRef.current.src = currentTrack.url;
        audioRef.current.play().catch(e => console.error("Auto-play blocked:", e));
    }
  }, [currentTrack]);

  return (
    <main className="min-h-screen bg-[#3E2723] text-[#FBBC05] font-sans">
      
      {/* --- GPM CORPORATE HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-[#FBBC05]/20 bg-black/40 backdrop-blur-md">
        
        {/* IDENTITY BLOCK */}
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-[#E94420] rounded-sm flex items-center justify-center font-bold text-white shadow-lg">
            GPM
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase leading-none">G Putnam Music, LLC</h1>
            <p className="text-xs opacity-60 uppercase tracking-wider">Master Control & Holdings</p>
          </div>
        </div>

        {/* OPS MENU */}
        <div className="flex items-center gap-6 text-sm font-bold tracking-widest">
           {/* DOMAIN MANAGEMENT */}
           <div className="flex gap-4 border-r border-[#FBBC05]/20 pr-6">
              <a href="https://2kleigh.com" target="_blank" className="hover:text-white transition-colors opacity-70 hover:opacity-100">
                 KLEIGH [Artist]
              </a>
              <span className="opacity-30">|</span>
              <a href="#" className="hover:text-white transition-colors opacity-70 hover:opacity-100">
                 FP [Freebies]
              </a>
           </div>

           {/* REVENUE ACTION */}
           <a 
             href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
             target="_blank" 
             className="bg-[#E94420] text-white px-6 py-3 rounded-sm shadow-md hover:bg-white hover:text-[#E94420] transition-all uppercase"
           >
             Sponsor This Platform
           </a>
        </div>
      </header>

      {/* --- DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[80vh]">
        
        {/* LEFT: ASSET LIST (Standardized) */}
        <div className="lg:col-span-4 bg-[#2C1B17] border-r border-[#FBBC05]/10 p-6 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-50 sticky top-0 bg-[#2C1B17] py-2">
            GPM Asset Library ({tracks.length})
          </h2>
          
          <div className="space-y-1">
            {tracks.slice(0, 50).map((t, i) => (
              <div 
                key={i}
                onClick={() => playTrack(t)}
                className={`p-3 text-sm cursor-pointer border-l-2 transition-all hover:bg-white/5 ${currentTrack === t ? 'border-[#E94420] bg-white/10 text-white' : 'border-transparent opacity-70'}`}
              >
                {/* DYNAMIC RENAMING ENGINE */}
                {cleanTrackTitle(t.title || `Asset ${i}`)}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: VISUALIZER & CONTROL */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center p-12 bg-[#3E2723] relative">
           
           {/* FAN PERKS (FP) TOGGLE */}
           <div className="absolute top-6 left-6">
              <button 
                onClick={() => setShowFP(!showFP)}
                className="text-xs uppercase tracking-widest border border-[#FBBC05]/30 px-4 py-2 hover:bg-[#FBBC05] hover:text-[#3E2723] transition-colors"
              >
                {showFP ? '[-] Hide Fan Perks' : '[+] Access Freebies (FP)'}
              </button>
           </div>

           {showFP && (
             <div className="absolute top-20 left-6 bg-black/90 p-6 rounded text-sm max-w-xs z-50 border border-[#E94420]">
                <h3 className="text-[#E94420] font-bold mb-2">GPM LOYALTY (FP)</h3>
                <p className="opacity-80 mb-4">Access exclusive stems, unreleased demos, and measurable discount codes.</p>
                {/* PLACEHOLDER: GPM QR CODE */}
                <div className="w-full aspect-square bg-white flex items-center justify-center text-black font-bold text-xs mb-2">
                   [QR CODE SCAN]
                </div>
                <button className="w-full bg-[#E94420] py-2 text-white font-bold text-xs">DOWNLOAD PACK</button>
             </div>
           )}

           {/* ACTIVE PLAYER */}
           <div className="w-full aspect-square bg-black rounded-full border-4 border-[#2C1B17] shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className={`absolute inset-0 bg-[#E94420] opacity-10 ${currentTrack ? 'animate-pulse' : ''}`}></div>
              
              <div className="text-center z-10 p-8">
                 <div className="text-[#E94420] text-xs font-bold tracking-[0.3em] uppercase mb-4">Now Monitoring</div>
                 <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight">
                    {currentTrack ? cleanTrackTitle(currentTrack.title) : 'GPM STANDBY'}
                 </h1>
                 <div className="h-1 w-20 bg-[#E94420] mx-auto mt-6"></div>
              </div>
           </div>

           <audio ref={audioRef} onEnded={() => setSystemMessage("Asset Playback Complete.")} crossOrigin="anonymous"/>
        </div>

        {/* RIGHT: SYSTEM LOGS & STATUS */}
        <div className="lg:col-span-3 bg-[#1a0f0d] p-6 text-xs font-mono border-l border-[#FBBC05]/10">
           <h2 className="text-[#E94420] font-bold uppercase tracking-widest mb-6">System Logs</h2>
           
           <div className="space-y-4 opacity-70">
              <div className="flex justify-between border-b border-white/10 pb-2">
                 <span>Status</span>
                 <span className="text-[#00ff00]">OPTIMAL</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                 <span>Stripe Gateway</span>
                 <span className="text-[#00ff00]">CONNECTED</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                 <span>Artist Nodes</span>
                 <span>1 ACTIVE</span>
              </div>
           </div>

           <div className="mt-10 p-4 bg-black/50 border border-[#E94420]/30 text-[#E94420]">
              <span className="block opacity-50 mb-1">CONSOLE OUTPUT:</span>
              {systemMessage}
           </div>

           <div className="mt-auto pt-20 text-center opacity-30">
              G Putnam Music, LLC<br/>
              Standardized. Measurable.
           </div>
        </div>

      </div>
    </main>
  );
}