'use client';
import { useState, useEffect, useRef } from 'react';
import { Pause, Play, AlertCircle } from 'lucide-react';

export default function GlobalPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [track, setTrack] = useState({
    title: "Select a Feeling", 
    artist: "Choose from above to play",
    url: "", 
    moodColor: "#8B4513"
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleTrackSelect = (e: CustomEvent) => {
      setError(''); // Clear previous errors
      setIsLoading(true);
      
      // Clean artist name
      let safeArtist = e.detail.artist || "G Putnam Music";
      if (safeArtist.toLowerCase().includes("mayker")) {
        safeArtist = "G Putnam Music";
      }

      const newTrack = {
        title: e.detail.title || "Unknown Track", 
        artist: safeArtist,
        url: e.detail.url, 
        moodColor: e.detail.moodTheme?.primary || "#8B4513"
      };
      
      console.log('[GlobalPlayer] Track selected:', newTrack);
      setTrack(newTrack);
      setIsPlaying(true);
    };

    window.addEventListener('play-track', handleTrackSelect as EventListener);
    return () => window.removeEventListener('play-track', handleTrackSelect as EventListener);
  }, []);

  // Handle playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track.url) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log('[GlobalPlayer] Audio ready to play');
    };

    const handleError = (e: Event) => {
      console.error('[GlobalPlayer] Audio error:', e);
      const target = e.target as HTMLAudioElement;
      setIsLoading(false);
      setIsPlaying(false);
      
      if (target.error) {
        switch (target.error.code) {
          case 1:
            setError('Playback aborted');
            break;
          case 2:
            setError('Network error - file not found');
            break;
          case 3:
            setError('Decode error - unsupported format');
            break;
          case 4:
            setError('File not supported');
            break;
          default:
            setError('Unknown playback error');
        }
      }
    };

    const handleLoadStart = () => {
      console.log('[GlobalPlayer] Loading audio:', track.url);
      setIsLoading(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('[GlobalPlayer] Playback failed:', err);
        setError('Playback failed - check browser permissions');
        setIsPlaying(false);
        setIsLoading(false);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, track.url]);

  const togglePlay = () => {
    if (!track.url) {
      setError('No track selected');
      return;
    }
    setError('');
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-[#2C241B] text-[#FFFDF5] p-4 shadow-2xl border-t z-50 transition-all duration-500" 
      style={{ borderColor: track.moodColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Error Banner */}
        {error && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce shadow-lg">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <h4 
            className="text-sm font-bold uppercase tracking-widest transition-colors duration-500 truncate" 
            style={{ color: track.moodColor === "#8B4513" ? "#FFD54F" : track.moodColor }}
          >
            {track.title}
          </h4>
          <p className="text-xs opacity-60 truncate">{track.artist}</p>
          
          {/* Loading indicator */}
          {isLoading && (
            <p className="text-xs text-yellow-400 mt-1 animate-pulse">Loading audio...</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            disabled={!track.url && !isLoading}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform text-[#2C241B] disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ 
              backgroundColor: track.moodColor === "#8B4513" ? "#FFD54F" : track.moodColor 
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#2C241B] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-1" />
            )}
          </button>
        </div>

        <audio 
          ref={audioRef} 
          src={track.url} 
          preload="metadata"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
}
