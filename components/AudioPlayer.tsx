'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [track, setTrack] = useState({ title: 'System Check...', artist: 'Connecting...' });
  const audioRef = useRef<HTMLAudioElement>(null);

  // We use a known public URL first to test the engine
  const STREAM_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

  useEffect(() => {
    setTrack({ title: 'GPM Audio Test', artist: 'Diagnostic Stream' });
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    // Clear previous errors
    setError('');

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
            setError('Stream Blocked. Check Permissions.');
          });
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#2C241B] text-[#FDF6E3] p-4 border-t border-[#FDF6E3]/10 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center relative">
        {/* Error Popup */}
        {error && (
          <div className="absolute -top-12 left-0 bg-red-600 text-white text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce">
            <AlertCircle size={12} /> {error}
          </div>
        )}

        <div className="flex items-center gap-4">
           <button onClick={togglePlay} className="w-12 h-12 bg-[#FFD54F] rounded-full flex items-center justify-center text-[#2C241B] hover:scale-105 transition shadow-lg shrink-0">
             {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
           </button>
           <div className="overflow-hidden">
             <div className="font-bold text-sm text-[#FFD54F] truncate">{track.title}</div>
             <div className="text-xs opacity-50 uppercase tracking-widest truncate">{track.artist}</div>
           </div>
        </div>
        {/* Using a generic test file to prove the PLAYER works. Once this plays, we swap back to your bucket. */}
        <audio ref={audioRef} src={STREAM_URL} preload="none" />
      </div>
    </div>
  );
}
