'use client';

import { useState, useRef } from 'react';
import { Search, Play, Pause, Download, ShieldCheck, Lock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// GPM CONFIG
const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function MIPPortal() {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. THE GATEKEEPER
  const checkAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple Hardcoded "Hero" Code for MVP
    if (accessCode.toUpperCase() === 'HERO2026' || accessCode.toUpperCase() === 'MIPGPM') {
      setIsAuthorized(true);
      fetchMasterCatalog();
    } else {
      alert('Invalid Access Code. Contact GPM for credentials.');
    }
  };

  // 2. THE MASTER FETCH (Unlimited)
  const fetchMasterCatalog = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false });
      // NO LIMITS applied here - Wholesale gets everything.
    
    if (!error && data) setTracks(data);
    setLoading(false);
  };

  // 3. FILTER LOGIC
  const filteredTracks = tracks.filter(t => 
    (t.title || t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.tags || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cleanTitle = (text: string) => {
    if (!text) return 'Untitled';
    return text.replace(/^\d+\s*-\s*/, '').replace(/g\s*putnam\s*music\s*-\s*/i, '').replace(/\.mp3|\.wav/gi, '').replace(/_/g, ' ');
  };

  const playTrack = (track: any) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.public_url || track.url;
        audioRef.current.play();
        setPlayingId(track.id);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8E1] text-[#3E2723] font-sans selection:bg-[#3E2723] selection:text-[#FFD54F]">
      
      {/* GLOBAL AUDIO ENGINE */}
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      {/* HEADER */}
      <nav className="p-6 bg-[#FFD54F] border-b-4 border-[#3E2723] flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-[#3E2723] rounded flex items-center justify-center text-[#FFD54F] font-black border border-[#3E2723]">GPM</div>
           <div>
             <h1 className="font-black text-xl leading-none">MIP / HEROES</h1>
             <p className="text-xs font-bold opacity-70 tracking-widest uppercase">Wholesale Portal</p>
           </div>
        </div>
        <a href="/" className="text-xs font-bold underline hover:text-white">Back to Retail</a>
      </nav>

      {/* VIEW A: THE GATE (Login) */}
      {!isAuthorized && (
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
           <div className="bg-white p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(62,39,35,1)] border-2 border-[#3E2723] max-w-md w-full text-center">
              <ShieldCheck size={48} className="mx-auto text-[#3E2723] mb-4" />
              <h2 className="text-2xl font-black mb-2">Restricted Access</h2>
              <p className="mb-6 font-bold opacity-70">For Medical Staff, First Responders & Industry Pros only.</p>
              
              <form onSubmit={checkAccess} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Enter Access Code..." 
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="p-4 bg-[#FFF8E1] border-2 border-[#3E2723] rounded-xl font-bold text-center uppercase focus:outline-none focus:ring-4 focus:ring-[#FFD54F]"
                />
                <button type="submit" className="bg-[#3E2723] text-[#FFD54F] font-black py-4 rounded-xl hover:scale-105 transition flex items-center justify-center gap-2">
                   <Lock size={18} /> UNLOCK CATALOG
                </button>
              </form>
              <p className="mt-4 text-xs opacity-50">Hint: Try HERO2026</p>
           </div>
        </div>
      )}

      {/* VIEW B: THE DASHBOARD (Authorized) */}
      {isAuthorized && (
        <div className="container mx-auto px-4 py-8">
           
           {/* SEARCH TOOL */}
           <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search Master Catalog (Mood, Title, ID)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 pl-12 bg-white border-2 border-[#3E2723] rounded-xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3E2723]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
              </div>
              <div className="bg-[#3E2723] text-[#FFD54F] px-6 rounded-xl flex items-center font-black">
                 {filteredTracks.length} ASSETS
              </div>
           </div>

           {/* ASSET TABLE */}
           <div className="bg-white border-2 border-[#3E2723] rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 bg-[#FFECB3] border-b-2 border-[#3E2723] font-black text-xs uppercase tracking-widest">
                 <div className="w-12 text-center">Status</div>
                 <div>Asset Title</div>
                 <div>Actions</div>
              </div>
              
              <div className="divide-y-2 divide-[#3E2723]/10">
                {loading ? <div className="p-8 text-center font-bold animate-pulse">Syncing Database...</div> : filteredTracks.map((track) => (
                   <div key={track.id} className={`grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center hover:bg-[#FFF8E1] transition ${playingId === track.id ? 'bg-[#FFD54F]/20' : ''}`}>
                      
                      {/* PLAY BUTTON */}
                      <button onClick={() => playTrack(track)} className="w-12 h-12 bg-[#3E2723] rounded-full flex items-center justify-center text-[#FFD54F] hover:scale-110 transition shadow-sm">
                         {playingId === track.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                      </button>

                      {/* INFO */}
                      <div className="min-w-0">
                         <div className="font-black text-lg truncate leading-tight">{cleanTitle(track.name || track.title)}</div>
                         <div className="text-xs font-bold opacity-50 uppercase mt-1 flex gap-2">
                            <span className="bg-[#FFECB3] px-2 py-0.5 rounded text-[#3E2723]">{track.tags || 'General'}</span>
                            <span>ID: {track.id.split('-')[0]}</span>
                         </div>
                      </div>

                      {/* DOWNLOAD BUTTON (The Hero Perk) */}
                      <a 
                        href={track.public_url || track.url} 
                        download={cleanTitle(track.name || track.title)}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#FFF8E1] border-2 border-[#3E2723] text-[#3E2723] px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-[#3E2723] hover:text-[#FFD54F] transition flex items-center gap-2"
                      >
                         <Download size={14} /> <span className="hidden md:inline">Download Master</span>
                      </a>
                   </div>
                ))}
              </div>
           </div>
        </div>
      )}
    </main>
  );
}
