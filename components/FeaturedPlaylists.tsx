'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

/**
 * FEATURED PLAYLISTS - REAL Audio Media Players
 * Each FP is a self-contained streaming audio player widget
 * Owner: "FPs MUST BE FUCKING Media players. Playlists. Audio players."
 * "We're a fucking MOBILE MUSIC-STREAMING PLATFORM! Music is OUR REASON!"
 * 
 * ROTATION: Show only 1-2 FPs at a time, rotate through all playlists
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

function PlaylistPlayer({ playlist, index }: { playlist: Playlist; index: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const track = playlist.tracks[currentTrack];

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

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
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
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const selectTrack = useCallback((idx: number) => {
    setCurrentTrack(idx);
    setIsPlaying(true);
  }, []);

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
    <div className="border-4 border-[#DA8917]/30 rounded-lg p-6 bg-black/40 backdrop-blur hover:border-[#DA8917] transition">
      <SkipBack size={20} />
      <button onClick={togglePlay} className="p-2 text-[#DA8917]/80 hover:text-[#DA8917] transition">
        {isPlaying ? <Pause size={24} fill="currentColor" className="text-[#DA8917]" /> : <Play size={24} />}
      </button>
      <button onClick={skipNext} className="p-2 text-[#DA8917]/80 hover:text-[#DA8917] transition">
        <SkipForward size={20} />
      </button>

      {/* Volume */}
      <div className="flex items-center gap-3 mt-4">
        <Volume2 size={16} className="text-[#DA8917]/60" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 accent-[#DA8917] bg-[#FFFFFF]/10 rounded-full cursor-pointer"
        />
      </div>

      {/* Track List */}
      <div className="border-t border-[#DA8917]/30 mt-4 pt-3">
        <div className="space-y-1">
          {playlist.tracks.map((t, idx) => (
            <button
              key={idx}
              onClick={() => selectTrack(idx)}
              className={`w-full flex flex-row justify-between items-center gap-3 px-4 py-3 text-left transition ${
                currentTrack === idx ? 'bg-[#DA8917]/30' : '' 
              } hover:bg-[#FFFFFF]/10`}
            >
              <div className="flex-1 truncate">
                <p className="text-sm font-semibold truncate text-white">{t.title}</p>
              </div>
              <span className="text-xs font-mono text-white">
                {currentTrack === idx && isPlaying ? '▶' : idx + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Seeker */}
      <div className="mt-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 accent-[#DA8917] bg-[#FFFFFF]/10 rounded-full cursor-pointer"
        />
        <div className="flex justify-between items-center text-xs text-[#DA8917]/70 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span className="text-sm font-semibold truncate">{track.vocalist}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio ref={audioRef} src={track.src} preload="metadata" />
    </div>
  );
}

export default function FeaturedPlaylists() {
  // Shuffle and rotate playlists - show only 2 at a time
  const [visibleIndices, setVisibleIndices] = useState<number[]>([0, 1]);

  useEffect(() => {
    // Create shuffled indices array
    const indices = Array.from({ length: PLAYLISTS.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let pos = 0;
    setVisibleIndices([indices[pos], indices[(pos + 1) % indices.length]]);

    const interval = setInterval(() => {
      pos = (pos + 2) % indices.length;
      setVisibleIndices([indices[pos], indices[(pos + 1) % indices.length]]);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-12 px-4">
      <h2 className="text-2xl font-bold text-[#DA8917] mb-6 tracking-wider uppercase">Featured Playlists</h2>
      <p className="text-sm text-[#DA8917]/60 mb-6">
        Stream the freshest tracks from the GPM catalog.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleIndices.map((playlistIdx) => (
          <PlaylistPlayer key={playlistIdx} playlist={PLAYLISTS[playlistIdx]} index={playlistIdx} />
        ))}
      </div>
    </section>
  );
}
