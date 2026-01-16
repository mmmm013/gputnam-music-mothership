'use client';
import { useState, useEffect, useRef } from 'react';
import { Pause, Play, Radio } from 'lucide-react';

export default function GlobalPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // TRACER CONFIGURATION: VISUAL & AUDIO HARDCODE
  const [track, setTrack] = useState({
    title: "TRACER SIGNAL: ONLINE", 
    artist: "Pipeline Validation Mode",
    // DIRECT LINK TO SUPABASE FILE (Bypassing logic)
    url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks/Jump.mp3", 
    moodColor: "#DC143C" // CRIMSON RED (Visual Proof of Update)
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- THE LISTENER ---
  useEffect(() => {
    const handleTrackSelect = (e: CustomEvent) => {
      console.log("TRACER RECEIVED:", e.detail);
      const incoming = e.detail;
      setTrack({
        title: incoming.title,
        artist: incoming.artist,
        url: incoming.url,
        moodColor: incoming.moodTheme?.primary || "#DC143C"
      });
      setIsPlaying(true);
    };

    window.addEventListener('play-track', handleTrackSelect as EventListener);
    return () => window.removeEventListener('play-track', handleTrackSelect as EventListener);
  }, []);

  // --- AUDIO ENGINE ---
  useEffect(() => {
    if (audioRef.current && track.url) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Autoplay Prevented:", error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track.url]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 shadow-2xl border-t-4 border-white z-50 text-white"
         style={{ backgroundColor: track.moodColor }}> {/* FORCED COLOR */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* DIAGNOSTIC INFO */}
        <div className="flex flex-col">
          <h4 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <Radio size={18} className="animate-pulse"/> {track.title}
          </h4>
          <p className="text-xs font-mono opacity-80">{track.artist}</p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition shadow-lg"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* ENGINE */}
        <audio 
          ref={audioRef} 
          src={track.url} 
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
