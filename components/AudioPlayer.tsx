'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState({ title: 'Loading Library...', artist: 'GPM Archives' });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-Load the first track
  useEffect(() => {
    setTrack({ title: '038 - kleigh - bought into your game', artist: 'G Putnam Music' });
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#2C241B] text-[#FDF6E3] p-4 border-t border-[#FDF6E3]/10 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
           <button onClick={togglePlay} className="w-12 h-12 bg-[#FFD54F] rounded-full flex items-center justify-center text-[#2C241B] hover:scale-105 transition shadow-lg">
             {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
           </button>
           <div>
             <div className="font-bold text-sm text-[#FFD54F]">{track.title}</div>
             <div className="text-xs opacity-50 uppercase tracking-widest">{track.artist}</div>
           </div>
        </div>
        {/* The Audio Engine */}
        <audio ref={audioRef} src="https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/songs/038%20-%20kleigh%20-%20bought%20into%20your%20game.mp3" />
      </div>
    </div>
  );
}
