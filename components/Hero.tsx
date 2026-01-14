'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// We pull keys from Vercel. If missing, we show a red error.
const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PROJECT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STRIPE_LINK = 'https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03';

// Initialize Client Safe Mode
const supabase = (PROJECT_URL && PROJECT_KEY) 
  ? createClient(PROJECT_URL, PROJECT_KEY) 
  : null;

export default function Hero() {
  const [fullLibrary, setFullLibrary] = useState<string[]>([]);
  const [displayedTracks, setDisplayedTracks] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // DIAGNOSTICS
  const [debugMsg, setDebugMsg] = useState('Initializing Audio...');
  const [rotationIndex, setRotationIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Rotation Logic (3h 33m)
    const interval = 12780000;
    setRotationIndex(Math.floor(Date.now() / interval) % 2);

    // Audio Logic
    const fetchTracks = async () => {
      if (!supabase) {
        setDebugMsg('CRITICAL ERROR: Keys are missing in Vercel. Go to Settings -> Environment Variables.');
        return;
      }
      try {
        setDebugMsg('Connecting to Audio Bucket...');
        const { data, error } = await supabase.storage.from('audio').list();
        
        if (error) {
            setDebugMsg(`CONNECTION ERROR: ${error.message}`);
            return;
        }

        if (data && data.length > 0) {
          const mp3s = data.filter((f: any) => f.name.endsWith('.mp3')).map((f: any) => f.name);
          if (mp3s.length > 0) {
             setFullLibrary(mp3s);
             setDisplayedTracks(mp3s);
             setDebugMsg(`ONLINE: ${mp3s.length} Tracks Loaded.`);
             setCurrentTrack(mp3s[Math.floor(Math.random() * mp3s.length)]);
          } else {
             setDebugMsg('BUCKET EMPTY: No .mp3 files found in Supabase.');
          }
        } else {
            setDebugMsg('BUCKET ERROR: Could not list files.');
        }
      } catch (e: any) {
        setDebugMsg(`CRASH: ${e.message}`);
      }
    };
    fetchTracks();
  }, []);

  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setDisplayedTracks(fullLibrary.filter(t => t.toLowerCase().includes(term)));
  };

  const playTrack = (track: string) => { setCurrentTrack(track); setIsPlaying(true); };
  
  const getUrl = (file: string) => 
    file && PROJECT_URL ? `${PROJECT_URL}/storage/v1/object/public/audio/${encodeURIComponent(file)}` : '';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error); }
  };

  const heroImages = ['/kleigh_portrait.jpg', '/logo.png'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC107] to-[#FF9800] text-[#3E2723] font-serif overflow-x-hidden">
      <nav className="flex justify-between items-center px-8 py-4 relative z-50 bg-[#FFC107]/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 relative bg-white rounded-full overflow-hidden border border-[#3E2723]/20">
              <Image src="/logo.png" fill className="object-contain p-1" alt="GPM Logo" onError={(e) => { e.currentTarget.style.display='none'; }}/>
           </div>
           <span className="text-sm font-bold tracking-widest uppercase text-[#3E2723]">G Putnam Music, LLC</span>
        </div>
        <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest items-center text-[#5D4037]">
            <a href="#" className="hover:text-[#D84315]">Artists</a>
            <a href="#" className="hover:text-[#D84315]">SHiPs</a>
            <a href={STRIPE_LINK} target="_blank" className="bg-[#D84315] text-white px-4 py-2 rounded hover:bg-[#BF360C] transition shadow-lg">Dream the Stream</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 text-left mt-8">
           <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] text-[#3E2723]">G Putnam Music<br/><span className="italic text-[#D84315]">MOODs</span></h1>
           <p className="text-lg leading-relaxed opacity-90 max-w-lg font-sans text-[#4E342E]">Discover the revolutionary approach to music streaming that matches your exact mood.</p>
           
           <div className="space-y-2 w-full max-w-md">
              <div className="bg-white/40 border border-[#3E2723]/10 rounded-lg p-1 shadow-inner">
                 <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Enter a mood..." className="w-full bg-transparent p-3 outline-none placeholder-[#3E2723]/60 font-sans font-medium" />
              </div>
              {searchTerm && (<div className="mt-2 max-h-40 overflow-y-auto bg-white rounded p-2 custom-scrollbar shadow-xl">{displayedTracks.map((t, i) => (<button key={i} onClick={() => playTrack(t)} className="w-full text-left px-3 py-2 text-sm truncate hover:bg-[#FFC107] rounded font-sans text-[#3E2723] border-b border-gray-100">{t.replace('.mp3', '')}</button>))}</div>)}
           </div>

           {/* DIAGNOSTICS PANEL - TELLS US WHY AUDIO FAILS */}
           <div className="mt-8 p-4 bg-black/90 rounded font-mono text-xs text-white border border-white/20 max-w-md shadow-2xl">
              <p className="font-bold border-b border-white/20 mb-2 pb-1 text-[#FFC107]">SYSTEM STATUS:</p>
              <p>{debugMsg}</p>
           </div>
        </div>

        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-white/20">
           <Image src={heroImages[rotationIndex]} alt="GPM Visual" fill className="object-cover opacity-90" onError={(e) => { e.currentTarget.style.opacity = '0.2'; }}/>
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pb-8 px-8 text-white">
              <div className="flex items-end justify-between gap-4">
                  <div className="overflow-hidden">
                     <p className="text-[#FFC107] text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Now Playing • GPM Library</p>
                     <h3 className="font-bold text-2xl truncate font-sans leading-tight">{currentTrack ? currentTrack.replace(/_/g, ' ').replace('.mp3', '') : 'Select a Track'}</h3>
                  </div>
                  <button onClick={togglePlay} className="flex-shrink-0 h-16 w-16 bg-[#FFC107] text-[#3E2723] rounded-full flex items-center justify-center hover:scale-110"><span className="text-3xl ml-1">{isPlaying ? '⏸' : '▶'}</span></button>
              </div>
           </div>
        </div>
      </main>
      
      <div className="bg-[#EF6C00] text-[#3E2723] text-center py-20 px-6 border-t border-[#3E2723]/10">
         <h2 className="text-4xl font-bold mb-4 font-serif">Explore the GPM Playlist</h2>
      </div>
      <audio ref={audioRef} src={getUrl(currentTrack)} onEnded={() => {}} crossOrigin="anonymous"/>
    </div>
  );
}
