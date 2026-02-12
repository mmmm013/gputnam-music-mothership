'use client';
import { useState, useEffect, useRef } from 'react';
import { Pause, Play, AlertCircle, Radio } from 'lucide-react';

// GPM Master Vault - Standardized bucket URL for all audio
const SITE_CATALOG_BASE = 'https://lbzpfqarraegkghxwbah.supabase.co/storage/v1/object/public/tracks/';

// Resolve any audio URL to the standardized tracks bucket
const resolveAudioUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('tracks')) return url;
  let filename = url;
  if (url.includes('supabase.co/storage')) {
    const parts = url.split('/public/');
    if (parts.length > 1) {
      const pathParts = parts[1].split('/');
      filename = pathParts[pathParts.length - 1];
    }
  } else if (url.includes('/')) {
    filename = url.split('/').pop() || url;
  }
  filename = filename.split('?')[0];
  console.log('[GlobalPlayer] Resolved URL:', { original: url, resolved: SITE_CATALOG_BASE + filename });
  return SITE_CATALOG_BASE + filename;
};

export default function GlobalPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [track, setTrack] = useState({
    title: "Pick an Activity",
    vocalist: "Click any T20 box or GPM PIX to stream",
    url: "",
    moodColor: "#8B4513"
  });
  const [pendingPlay, setPendingPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleTrackSelect = (e: CustomEvent) => {
      setError('');
      setIsLoading(true);
      setIsPlaying(false);
      setPendingPlay(true);
      let safeArtist = e.detail.vocalist || "G Putnam Music";
      if (safeArtist.toLowerCase().includes("mayker")) {
        safeArtist = "G Putnam Music";
      }
      const newTrack = {
        title: e.detail.title || "Unknown Track",
        vocalist: safeArtist,
        url: e.detail.url,
        moodColor: e.detail.moodTheme?.primary || "#8B4513"
      };
      console.log('[GlobalPlayer] Track selected:', newTrack);
      setTrack(newTrack);
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
      if (pendingPlay) {
        setPendingPlay(false);
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error('[GlobalPlayer] Playback failed:', err);
            setError('Playback failed - click play to try again');
            setIsPlaying(false);
          });
      }
    };
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      setIsLoading(false);
      setIsPlaying(false);
      setPendingPlay(false);
      if (target.error) {
        switch (target.error.code) {
          case 1: setError('Playback aborted'); break;
          case 2: setError('Network error - file not found'); break;
          case 3: setError('Decode error - unsupported format'); break;
          case 4: setError('File not supported'); break;
          default: setError('Unknown playback error');
        }
      }
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('ended', handleEnded);
    audio.load();
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [track.url, pendingPlay]);

  // Handle play/pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track.url) return;
    if (isPlaying) {
      audio.play().catch(err => {
        setError('Playback failed - click play to try again');
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!track.url) { setError('No track selected'); return; }
    setError('');
    setIsPlaying(!isPlaying);
  };

  const hasTrack = track.url !== '';
  const activeColor = track.moodColor === "#8B4513" ? "#C8A882" : track.moodColor;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500"
    >
      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-center gap-2 bg-red-600 text-white text-xs px-4 py-1.5 font-bold">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* MC BOT Player Bar */}
      <div
        className="bg-[#1a1206] border-t-2 px-4 py-3 transition-all duration-500"
        style={{ borderColor: activeColor }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* MC BOT Identity Block */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: `${activeColor}15`, border: `2px solid ${activeColor}40` }}
            >
              <Radio
                className="w-6 h-6 transition-colors duration-500"
                style={{ color: activeColor }}
              />
              {(isPlaying || isLoading) && (
                <span
                  className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: activeColor }}
                />
              )}
            </div>
            <div className="flex flex-col">
              <span
                className="text-sm font-black uppercase tracking-[0.2em] transition-colors duration-500"
                style={{ color: activeColor }}
              >
                MC BOT
              </span>
              <span className="text-[10px] text-[#f5e6c8]/40 font-medium tracking-wide">
                {isPlaying ? 'NOW STREAMING' : isLoading ? 'LOADING' : 'READY'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-[#f5e6c8]/10 flex-shrink-0" />

          {/* Track Info */}
          <div className="flex flex-col min-w-0 flex-1">
            <h4
              className="text-sm font-bold uppercase tracking-widest truncate transition-colors duration-500"
              style={{ color: hasTrack ? activeColor : '#D7CCC8' }}
            >
              {track.title}
            </h4>
            <p className="text-xs text-[#f5e6c8]/50 truncate">
              {track.vocalist}
            </p>
            {isLoading && (
              <p className="text-[10px] text-yellow-400 mt-0.5 animate-pulse">Loading audio...</p>
            )}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={!track.url && !isLoading}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all text-[#1a1206] disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            style={{ backgroundColor: activeColor }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#1a1206] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-1" />
            )}
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.url}
        preload="auto"
      />
    </div>
  );
}
