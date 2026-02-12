'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [track, setTrack] = useState({ title: 'PICK AN ACTIVITY', artist: 'Click any T20 box or GPM PIX to stream' });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Listen for play-track events from FeaturedPlaylists and T20
  useEffect(() => {
    const handlePlayTrack = (event: any) => {
      const trackData = event.detail;
      console.log('[AUDIO PLAYER] Received play-track event:', trackData);

      // Update track state
      setTrack({
        title: trackData.title,
        artist: trackData.artist
      });

      // Update audio source
      if (audioRef.current) {
        audioRef.current.src = trackData.url;
        audioRef.current.load();

        // Auto-play the new track
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setError('');
              console.log('[AUDIO PLAYER] Now playing:', trackData.title);
            })
            .catch((err) => {
              console.error('[AUDIO PLAYER] Playback failed:', err);
              setError('Playback failed. Check permissions.');
            });
        }
      }
    };

    window.addEventListener('play-track', handlePlayTrack);

    return () => {
      window.removeEventListener('play-track', handlePlayTrack);
    };
  }, []);

  // Listen for audio end event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
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
            console.error('Playback failed:', err);
            setIsPlaying(false);
            setError('Select a track from Featured Playlists or T20.');
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
        <audio ref={audioRef} preload="none" />
      </div>
    </div>
  );
}
