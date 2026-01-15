'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, RefreshCw, Volume2, Heart, Download, Share2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://eajxgrbxvkhfmmfiotpm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ROTATION: 3 HOURS 33 MINUTES ---
const ROTATION_MS = 12780000;

// THE 6 EMOTIONAL STATES (Replacing Genres)
// These map to your 6 Earmarked Playlists
const FEATURED_ROTATION = [
  { id: 'FP1', title: 'GPM: ENERGIZED', mood_tag: 'energy' },     // Was Pop
  { id: 'FP2', title: 'GPM: SOPHISTICATED', mood_tag: 'classy' }, // Was Jazz
  { id: 'FP3', title: 'GPM: SOULFUL', mood_tag: 'soul' },         // Was Acoustic
  { id: 'FP4', title: 'GPM: RAW EMOTION', mood_tag: 'raw' },      // Was Studio
  { id: 'FP5', title: 'GPM: ATMOSPHERIC', mood_tag: 'ambient' },  // Was Moods
  { id: 'FP6', title: 'GPM: MELANCHOLY', mood_tag: 'sad' }        // Was Piano
];

export default function Hero() {
  const [currentFPIndex, setCurrentFPIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [moodInput, setMoodInput] = useState('');
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. ROTATION TIMER
  useEffect(() => {
    // Sync rotation across all GPM domains based on time
    const now = Date.now();
    const cyclePosition = Math.floor(now / ROTATION_MS) % FEATURED_ROTATION.length;
    setCurrentFPIndex(cyclePosition);

    const interval = setInterval(() => {
      setCurrentFPIndex((prev) => (prev + 1) % FEATURED_ROTATION.length);
    }, ROTATION_MS);
    return () => clearInterval(interval);
  }, []);

  // 2. FETCH TRACKS (Six Sigma Data Retrieval)
  useEffect(() => {
    async function fetchTracks() {
      setLoading(true);
      const currentFP = FEATURED_ROTATION[currentFPIndex];
      console.log(`GPM Catalog: Loading Emotional State '${currentFP.mood_tag}'...`);

      // Query Supabase for tracks matching the MOOD TAG
      const { data, error } = await supabase
        .from('tracks') 
        .select('*')
        .ilike('tags', `%${currentFP.mood_tag}%`) // Subjective matching
        .limit(50); // Fetch up to 50 tracks for the "Black Box" list

      if (!error && data) {
        setPlaylist(data);
      }
      setLoading(false);
    }
    fetchTracks();
  }, [currentFPIndex]);

  // 3. SANITIZER (Clean Naming Convention)
  // Removes "052 -", ".mp3", and underscores for display
  const cleanTitle = (track: any) => {
    if (!track) return 'Loading...';
    // Use metadata title if available, otherwise scrub filename
    let text = track.title || track.name || 'Unknown Track';
    return text.replace(/^\d+\s*-\s*/, '') // Remove "001 - "
               .replace(/\.mp3$/i, '')     // Remove ".mp3"
               .replace(/_/g, ' ');        // Swap underscores for spaces
  };

  // 4. AUDIO CONTROLS
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
    <section className="relative min-h-screen w-full bg-[#FFCA28] text-[#3E2723] pt-24 flex flex-col items-center">
      
      {/* HIDDEN ENGINE */}
      {activeTrack && (
        <audio 
          ref={audioRef}
          src={activeTrack.public_url || activeTrack.url}
          onEnded={() => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)}
          autoPlay={isPlaying}
        />
      )}

      {/* HEADER */}
      <div className="container mx-auto px-4 text-center z-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#3E2723] mb-2">
          G Putnam <br/> Music
        </h1>
        <h2 className="text-5xl md:text-7xl font-black text-[#3E2723] italic tracking-tight mb-8 opacity-90 border-b-4 border-[#3E2723] inline-block pb-2">
          MOODs
        </h2>
        <p className="text-[#3E2723] text-lg max-w-xl mx-auto mb-12 font-bold">
          Discover music that matches your exact emotional state.
        </p>

        {/* MOOD SEARCH */}
        <div className="max-w-xl mx-auto relative mb-16">
          <input 
            type="text" 
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="How are you feeling? (e.g. 'Reflective', 'Hyped')"
            className="w-full bg-[#FFD54F] border border-[#3E2723] placeholder-[#3E2723]/50 text-[#3E2723] font-bold text-xl px-8 py-6 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-[#3E2723]"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#3E2723] rounded-xl text-[#FFCA28]">
            <Search size={24} />
          </button>
        </div>
      </div>

      {/* THE "BLACK BOX" (NOW A SCROLLABLE TRACK LIST) */}
      <div className="container mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8 items-start max-w-6xl">
        
        {/* LEFT: THE TRACK LIST (E-Commerce Storefront) */}
        <div className="bg-black border border-[#3E2723] rounded-xl shadow-2xl overflow-hidden h-[400px] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-[#3E2723]">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-[#FFCA28] uppercase tracking-widest">Current Rotation</span>
                <h3 className="text-xl font-bold text-white">{currentFP.title}</h3>
              </div>
              <RefreshCw size={16} className="text-[#FFCA28] animate-spin-slow opacity-70" />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <p className="text-white/50 text-center py-10">Loading GPM Catalog...</p>
            ) : (
              playlist.map((track, idx) => (
                <div 
                  key={track.id || idx}
                  onClick={() => playTrack(idx)}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${idx === currentTrackIndex ? 'bg-[#FFCA28] text-[#3E2723]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-full">
                      {idx === currentTrackIndex && isPlaying ? <span className="animate-pulse">lıl</span> : <Play size={10} fill="currentColor" />}
                    </div>
                    <span className="font-bold text-sm truncate">{cleanTitle(track)}</span>
                  </div>
                  
                  {/* User Interactions (Love, Download, Share) */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button className="p-1 hover:text-red-500"><Heart size={14} /></button>
                    <button className="p-1 hover:text-blue-400"><Share2 size={14} /></button>
                    <button className="p-1 hover:text-green-400"><Download size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: ACTIVE PLAYER VISUAL */}
        <div className="bg-[#3E2723] p-8 rounded-3xl shadow-2xl text-center border border-[#FFCA28]/20 h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('/gpm_logo.png')] bg-center bg-contain bg-no-repeat"></div>
           
           <div className="w-32 h-32 bg-[#FFCA28] rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10">
              <button onClick={togglePlay} className="hover:scale-110 transition">
                {isPlaying ? <Pause size={48} className="text-[#3E2723]" fill="currentColor" /> : <Play size={48} className="text-[#3E2723] ml-2" fill="currentColor" />}
              </button>
           </div>
           
           <div className="relative z-10">
             <h2 className="text-2xl font-black text-white mb-2">{cleanTitle(activeTrack)}</h2>
             <p className="text-[#FFCA28] font-bold uppercase tracking-widest text-xs">G Putnam Music, LLC</p>
           </div>

           {/* Audio Visualizer Bar (Fake) */}
           {isPlaying && (
             <div className="flex gap-1 mt-8 h-8 items-end justify-center">
               {[...Array(20)].map((_, i) => (
                 <div key={i} className="w-1 bg-[#FFCA28] animate-music-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }}></div>
               ))}
             </div>
           )}
        </div>

      </div>
    </section>
  );
}
