'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

/**
 * FEATURED PLAYLISTS - REAL Audio Media Players
 * Each FP is a self-contained streaming audio player widget
 * Owner: "FPs MUST BE FUCKING Media players. Playlists. Audio players."
 * "We're a fucking MOBILE MUSIC-STREAMING PLATFORM! Music is OUR REASON!"
 */

interface Track {
  title: string;
  artist: string;
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
      { title: 'Reflections', artist: 'Kleigh', src: '/pix/kleigh--reflections.mp3' },
      { title: 'I Need an Angel', artist: 'G Putnam Music', src: '/pix/i-need-an-angel.mp3' },
      { title: 'Bought Into Your Game', artist: 'Kleigh', src: '/pix/bought-into-your-game.mp3' },
    ],
  },
  {
    name: 'Kleigh Spotlight',
    tracks: [
      { title: 'Breathing Serenity', artist: 'Kleigh', src: '/pix/kleigh--breathing-serenity.mp3' },
      { title: 'Nighttime', artist: 'G Putnam Music', src: '/pix/nighttime.mp3' },
      { title: 'Down (Stripped)', artist: 'Kleigh', src: '/pix/kleigh--down-(stripped)-with-reverb--69bpm-fmaj.mp3' },
    ],
  },
  {
    name: 'Who is G Putnam Music',
    tracks: [
      { title: 'I Was Made to Be Awesome', artist: 'G Putnam Music', src: '/pix/i-was-made-to-be-awesome.mp3' },
      { title: 'Perfect Day', artist: 'G Putnam Music', src: '/pix/perfect-day.mp3' },
      { title: 'Why Does Life Gotta Be This Hard', artist: 'G Putnam Music', src: '/pix/why-does-life-gotta-be-this-hard.mp3' },
    ],
  },
  {
    name: 'The First Note',
    tracks: [
      { title: 'Dance Party', artist: 'G Putnam Music', src: '/pix/dance-party.mp3' },
      { title: 'Going Outside', artist: 'G Putnam Music', src: '/pix/going-outside.mp3' },
      { title: 'I Am a Fighter', artist: 'G Putnam Music', src: '/pix/i-am-a-fighter--el-mix-instro.mp3' },
    ],
  },
  {
    name: 'The SHIPS Engine',
    tracks: [
      { title: 'I Live Free', artist: 'G Putnam Music', src: '/pix/i-live-free--instro.mp3' },
      { title: "We'll Be Free", artist: 'G Putnam Music', src: "/pix/we'll-be-free.mp3" },
      { title: "Fool's Game", artist: 'G Putnam Music', src: '/pix/fools-game-(master-2).mp3' },
    ],
  },
];

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlaylistPlayer({ playlist, index }: { playlist: Playlist; index: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const track = playlist.tracks[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (currentTrack < playlist.tracks.length - 1) {
        setCurrentTrack(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setCurrentTrack(0);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [currentTrack, playlist.tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const selectTrack = (idx: number) => {
    setCurrentTrack(idx);
    setIsPlaying(true);
  };

  const skipPrev = () => setCurrentTrack(prev => Math.max(0, prev - 1));
  const skipNext = () => setCurrentTrack(prev => Math.min(playlist.tracks.length - 1, prev + 1));

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#1a120a] border border-[#D4A017]/20 rounded-xl overflow-hidden w-full max-w-md">
      {/* Player Header */}
      <div className="bg-gradient-to-r from-[#D4A017]/20 to-[#D4A017]/5 px-4 py-3 border-b border-[#D4A017]/10">
        <h3 className="text-sm font-black text-[#D4A017] uppercase tracking-wider">{playlist.name}</h3>
        <p className="text-xs text-[#C8A882]/60">{playlist.tracks.length} tracks</p>
      </div>

      {/* Now Playing + Controls */}
      <div className="px-4 py-4">
        <p className="text-xs text-[#C8A882]/50 uppercase tracking-wider mb-1">Now Playing</p>
        <p className="text-lg font-bold text-[#FFF8E1] truncate">{track.title}</p>
        <p className="text-sm text-[#D4A017]/70">{track.artist}</p>

        {/* Progress Bar */}
        <div
          className="mt-4 h-2 bg-[#ffffff10] rounded-full cursor-pointer relative overflow-hidden"
          onClick={handleSeek}
        >
          <div
            className="absolute inset-y-0 left-0 bg-[#D4A017] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#C8A882]/50 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button onClick={skipPrev} className="p-2 text-[#C8A882]/60 hover:text-[#D4A017] transition">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-[#D4A017] flex items-center justify-center text-[#1a120a] hover:scale-105 transition shadow-lg"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={skipNext} className="p-2 text-[#C8A882]/60 hover:text-[#D4A017] transition">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 mt-4">
          <Volume2 size={16} className="text-[#C8A882]/40" />
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 accent-[#D4A017] bg-[#ffffff10] rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* Track List */}
      <div className="border-t border-[#D4A017]/10">
        {playlist.tracks.map((t, idx) => (
          <button
            key={idx}
            onClick={() => selectTrack(idx)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition
              ${currentTrack === idx ? 'bg-[#D4A017]/10' : 'hover:bg-[#ffffff05]'}
              ${idx < playlist.tracks.length - 1 ? 'border-b border-[#ffffff08]' : ''}`}
          >
            <span className={`w-6 text-xs font-mono ${currentTrack === idx ? 'text-[#D4A017]' : 'text-[#C8A882]/30'}`}>
              {currentTrack === idx && isPlaying ? '\u25B6' : idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${currentTrack === idx ? 'text-[#D4A017]' : 'text-[#FFF8E1]'}`}>
                {t.title}
              </p>
              <p className="text-xs text-[#C8A882]/50 truncate">{t.artist}</p>
            </div>
          </button>
        ))}
      </div>

      <audio ref={audioRef} src={track.src} preload="metadata" />
    </div>
  );
}

export default function FeaturedPlaylists() {
  return (
    <section className="w-full py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-black text-[#D4A017] mb-2 tracking-wider uppercase">Featured Playlists</h2>
        <p className="text-sm text-[#C8A882]/60 mb-8">Stream now from the GPM catalog</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PLAYLISTS.map((playlist, idx) => (
            <PlaylistPlayer key={idx} playlist={playlist} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
