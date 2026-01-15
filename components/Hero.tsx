'use client';

import { useState, useEffect } from 'react';

const PLAYLISTS = [
  { id: '13795325', title: 'KLEIGH: POP ANTHEMS' },
  { id: '13795325', title: 'MICHAEL SCHERER: JAZZ MASTERS' }, 
  { id: '13795325', title: 'GPM: STUDIO SESSIONS' },
  { id: '13795325', title: 'KLEIGH: ACOUSTIC SOUL' },
  { id: '13795325', title: 'GPM: MOODS & AMBIENCE' },
  { id: '13795325', title: 'SCHERER: PIANO LOUNGE' }
];

const BACKGROUNDS = [
  '/hero.jpg',
  '/k-hero.jpg',
  '/k-hero-alternate.JPG'
];

export default function Hero() {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaylistIndex((prev) => (prev + 1) % PLAYLISTS.length);
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 14400000); 
    return () => clearInterval(interval);
  }, []);

  const currentPlaylist = PLAYLISTS[currentPlaylistIndex];
  const currentBg = BACKGROUNDS[currentBgIndex];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white pt-20">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: `url(${currentBg})`, opacity: 0.6 }} />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-200 to-pink-500 tracking-tighter drop-shadow-2xl mb-4">IT'S KLEIGH</h1>
        
        <div className="inline-flex items-center gap-2 border border-pink-500/30 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full mb-12">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          <span className="text-xs font-bold text-pink-100 tracking-[0.2em] uppercase">
            NOW STREAMING: <span className="text-pink-400">{currentPlaylist.title}</span>
          </span>
        </div>

        <div className="w-full max-w-5xl relative z-20 group">
          <div className="relative aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
             <iframe 
                key={currentPlaylist.id} 
                src={`https://disco.ac/e/p/${currentPlaylist.id}?color=%23ec4899&theme=dark`}
                width="100%" height="100%" frameBorder="0" 
                allowTransparency={true} allow="encrypted-media"
                className="w-full h-full"
              ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
