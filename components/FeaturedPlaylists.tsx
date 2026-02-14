'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

/**
 * FEATURED PLAYLISTS - BIC Audio Media Players
 * DEPENDABILITY: Rotation STOPS when audio is playing
 * QUALITY: Error handling on every audio operation
 * SATISFACTION: Playlist name shown, no interrupted playback
 */

interface Track {
  title: string;
  vocalist: string;
  src: string;
}

interface Playlist {
  name: string;
  tracks: Track[];
}

const PLAYLISTS: Playlist[] = [
  {
    name: "Grandpa's Story",
    tracks: [
      { title: 'Reflections', vocalist: 'Kleigh', src: '/pix/kleigh--reflections.mp3' },
      { title: 'I Need an Angel', vocalist: 'G Putnam Music', src: '/pix/i-need-an-angel.mp3' },
      { title: 'Bought Into Your Game', vocalist: 'Kleigh', src: '/pix/bought-into-your-game.mp3' },
    ],
  },
  {
    name: 'Kleigh Spotlight',
    tracks: [
      { title: 'Breathing Serenity', vocalist: 'Kleigh', src: '/pix/kleigh--breathing-serenity.mp3' },
      { title: 'Nighttime', vocalist: 'G Putnam Music', src: '/pix/nighttime.mp3' },
      { title: 'Down (Stripped)', vocalist: 'Kleigh', src: '/pix/kleigh--down-(stripped)-with-reverb--69bpm-fmaj.mp3' },
    ],
  },
  {
    name: 'Who is G Putnam Music',
    tracks: [
      { title: 'I Was Made to Be Awesome', vocalist: 'G Putnam Music', src: '/pix/i-was-made-to-be-awesome.mp3' },
      { title: 'Perfect Day', vocalist: 'G Putnam Music', src: '/pix/perfect-day.mp3' },
      { title: 'Why Does Life Gotta Be This Hard', vocalist: 'G Putnam Music', src: '/pix/why-does-life-gotta-be-this-hard.mp3' },
    ],
  },
  {
    name: 'The First Note',
    tracks: [
      { title: 'Dance Party', vocalist: 'G Putnam Music', src: '/pix/dance-party.mp3' },
      { title: 'Going Outside', vocalist: 'G Putnam Music', src: '/pix/going-outside.mp3' },
      { title: 'I Am a Fighter', vocalist: 'G Putnam Music', src: '/pix/i-am-a-fighter--el-mix-instro.mp3' },
    ],
  },
  {
    name: 'The SHIPS Engine',
    tracks: [
      { title: 'I Live Free', vocalist: 'G Putnam Music', src: '/pix/i-live-free--instro.mp3' },
      { title: "We'll Be Free", vocalist: 'G Putnam Music', src: "/pix/we'll-be-free.mp3" },
      { title: "Fool's Game", vocalist: 'G Putnam Music', src: '/pix/fools-game-(master-2).mp3' },
    ],
  },
  {
    name: 'Scherer Jazz Sessions',
    tracks: [
      { title: 'Jump', vocalist: 'Michael Scherer', src: '/pix/jump.mp3' },
      { title: 'New Orleans Piano Trio', vocalist: 'Michael Scherer', src: '/pix/new-orleans-piano-trio-1.mp3' },
      { title: 'Score 3: The End', vocalist: 'Michael Scherer', src: '/pix/score-3--the-end.mp3' },
    ],
  },
  {
    name: "Valentine's Day",
    tracks: [
      { title: 'A Calm Evening', vocalist: 'Kleigh', src: '/pix/kleigh--a-calm-evening.mp3' },
      { title: 'Wanna Know You', vocalist: 'G Putnam Music', src: '/pix/wanna-know-you.mp3' },
      { title: 'Waterfall', vocalist: 'Kleigh', src: '/pix/kleigh--waterfall.mp3' },
    ],
  },
];

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlaylistPlayer({ playlist, index, onPlayStateChange }: {
  playlist: Playlist;
  index: number;
  onPlayStateChange: (playing: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState('');

  const track = playlist.tracks[currentTrack];

  // Notify parent when play state changes (for rotation control)
  useEffect(() => {
    onPlayStateChange(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // DEPENDABILITY: Pause this FP when GlobalPlayer starts OR another FP starts
  useEffect(() => {
    const handleGlobalPlay = () => {
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    const handleFPPlay = (e: CustomEvent) => {
      if (e.detail?.index !== index) {
        const audio = audioRef.current;
        if (audio && isPlaying) {
          audio.pause();
          setIsPlaying(false);
        }
      }
    };
    window.addEventListener('play-track', handleGlobalPlay);
    window.addEventListener('fp-play', handleFPPlay as EventListener);
    return () => {
      window.removeEventListener('play-track', handleGlobalPlay);
      window.removeEventListener('fp-play', handleFPPlay as EventListener);
    };
  }, [isPlaying, index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrack < playlist.tracks.length - 1) {
        setCurrentTrack((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        setCurrentTrack(0);
      }
    };
    const handleError = () => {
      setError('Track unavailable');
      setIsPlaying(false);
    };
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, playlist.tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      setError('');
      audio.play().catch(() => {
        setIsPlaying(false);
        setError('Playback failed');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = useCallback(() => {
    // Broadcast that this FP is playing so others pause
    if (!isPlaying) {
      window.dispatchEvent(new CustomEvent('fp-play', { detail: { index } }));
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying, index]);

  const selectTrack = useCallback((idx: number) => {
    window.dispatchEvent(new CustomEvent('fp-play', { detail: { index } }));
    setCurrentTrack(idx);
    setIsPlaying(true);
  }, [index]);

  const skipNext = useCallback(() => {
    if (currentTrack < playlist.tracks.length - 1) {
      setCurrentTrack((prev) => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrack, playlist.tracks.length]);

  const skipPrev = useCallback(() => {
    if (currentTrack > 0) {
      setCurrentTrack((prev) => prev - 1);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="bg-[#1a100e] border border-[#C8A882]/20 rounded-xl overflow-hidden">
      {/* Playlist Name */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-xs font-bold text-[#DA8917] tracking-widest uppercase">{playlist.name}</span>
      </div>
      <audio ref={audioRef} src={track.src} preload="metadata" />
      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-2">
        <button onClick={skipPrev} className="text-[#C8A882]/60 hover:text-[#C8A882] transition-colors">
          <SkipBack size={16} />
        </button>
        <button onClick={togglePlay} className="text-[#DA8917] hover:text-[#C8A882] transition-colors">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={skipNext} className="text-[#C8A882]/60 hover:text-[#C8A882] transition-colors">
          <SkipForward size={16} />
        </button>
        {/* Volume */}
        <Volume2 size={14} className="text-[#C8A882]/40 ml-2" />
        <input
          type="range" min="0" max="1" step="0.01"
          value={volume} onChange={handleVolumeChange}
          className="flex-1 h-1 accent-[#DA8917] bg-[#FFFFFF]/10 rounded-full cursor-pointer"
        />
      </div>
      {/* Error */}
      {error && (
        <div className="px-4 py-1 text-xs text-red-400">{error}</div>
      )}
      {/* Track List */}
      <div className="border-t border-[#C8A882]/10">
        {playlist.tracks.map((t, idx) => (
          <button
            key={idx}
            onClick={() => selectTrack(idx)}
            className={`w-full flex flex-row justify-between items-center gap-3 px-4 py-3 text-left transition ${
              currentTrack === idx ? 'bg-[#DA8917]/30' : ''
            } hover:bg-[#FFFFFF]/10`}
          >
            <span className="text-sm text-[#C8A882] truncate">{t.title}</span>
            <span className="text-xs text-[#C4A882]/50 shrink-0">
              {currentTrack === idx && isPlaying ? '▶' : idx + 1}
            </span>
          </button>
        ))}
      </div>
      {/* Seeker */}
      <div className="px-4 py-2 border-t border-[#C8A882]/10">
        <input
          type="range" min="0" max={duration || 100} step="0.1"
          value={currentTime} onChange={handleSeek}
          className="w-full h-2 accent-[#DA8917] bg-[#FFFFFF]/10 rounded-full cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#C4A882]/40">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-[#DA8917]/60">{track.vocalist}</span>
          <span className="text-[10px] text-[#C4A882]/40">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedPlaylists() {
  const [visibleIndices, setVisibleIndices] = useState([0, 1]);
  // DEPENDABILITY: Track if ANY FP is playing to stop rotation
  const [anyPlaying, setAnyPlaying] = useState(false);
  const playingRef = useRef<Set<number>>(new Set());

  const handlePlayStateChange = useCallback((index: number, playing: boolean) => {
    if (playing) {
      playingRef.current.add(index);
    } else {
      playingRef.current.delete(index);
    }
    setAnyPlaying(playingRef.current.size > 0);
  }, []);

  useEffect(() => {
    const indices = Array.from({ length: PLAYLISTS.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    let pos = 0;
    setVisibleIndices([indices[pos], indices[(pos + 1) % indices.length]]);

    const interval = setInterval(() => {
      // DEPENDABILITY: Do NOT rotate if audio is playing
      if (playingRef.current.size > 0) return;
      pos = (pos + 2) % indices.length;
      setVisibleIndices([indices[pos], indices[(pos + 1) % indices.length]]);
    }, 15000); // Slower rotation: 15s instead of 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-[#DA8917] tracking-widest uppercase mb-1">
        Featured Playlists
      </h2>
      <p className="text-xs text-[#C4A882]/50 mb-4">
        Stream the freshest tracks from the GPM catalog.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleIndices.map((playlistIdx) => (
          <PlaylistPlayer
            key={`fp-${playlistIdx}`}
            playlist={PLAYLISTS[playlistIdx]}
            index={playlistIdx}
            onPlayStateChange={(playing) => handlePlayStateChange(playlistIdx, playing)}
          />
        ))}
      </div>
    </section>
  );
}
