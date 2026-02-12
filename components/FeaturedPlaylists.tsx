'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

/**
 * FEATURED PLAYLISTS - 3-Song Media Players
 * Each FP is a mini playlist player with 3 stacked tracks
 * Tracks served from /pix/ (high-fidelity 320kbps MP3s)
 * Owner requirement: "An FP is a Media player with 3 songs stacked"
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
      { title: 'Bought Into Your Game', artist: 'Kleigh', src: '/pix/bought-into-your-game.mp3' },
      { title: 'I Need an Angel', artist: 'G Putnam Music', src: '/pix/i-need-an-angel.mp3' },
      { title: 'Memories', artist: 'G Putnam Music', src: '/pix/here-in-the-night.mp3' },
    ],
  },
  {
    name: 'Kleigh Spotlight',
    tracks: [
      { title: 'Breathing Serenity', artist: 'Kleigh', src: '/pix/kleigh--breathing-serenity.mp3' },
      { title: 'Nightfall', artist: 'Kleigh', src: '/pix/kleigh--nightfall.mp3' },
      { title: 'A Calm Evening', artist: 'Kleigh', src: '/pix/kleigh--a-calm-evening.mp3' },
    ],
  },
  {
    name: 'Who is G Putnam Music',
    tracks: [
      { title: 'I Was Made to Be Awesome', artist: 'G Putnam Music', src: '/pix/i-was-made-to-be-awesome.mp3' },
      { title: 'Perfect Day', artist: 'G Putnam Music', src: '/pix/perfect-day.mp3' },
      { title: 'Going Outside', artist: 'G Putnam Music', src: '/pix/going-outside.mp3' },
    ],
  },
  {
    name: 'The First Note',
    tracks: [
      { title: 'Rhythm Play', artist: 'G Putnam Music', src: '/pix/rhythm-play.mp3' },
      { title: 'Dance Party', artist: 'G Putnam Music', src: '/pix/dance-party.mp3' },
      { title: 'Jump', artist: 'G Putnam Music', src: '/pix/jump.mp3' },
    ],
  },
  {
    name: 'The SHIPS Engine',
    tracks: [
      { title: 'I Live Free', artist: 'G Putnam Music', src: '/pix/i-live-free--instro.mp3' },
      { title: 'Reflections', artist: 'Kleigh', src: '/pix/kleigh--reflections.mp3' },
      { title: 'Wanna Know You', artist: 'G Putnam Music', src: '/pix/wanna-know-you.mp3' },
    ],
  },
];

export default function FeaturedPlaylists() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<{ playlist: number; track: number } | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (playlistIdx: number, trackIdx: number, src: string, title: string, artist: string) => {
    // If same track is playing, pause it
    if (playing?.playlist === playlistIdx && playing?.track === trackIdx) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlaying(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Dispatch play-track event for the global player bar
    window.dispatchEvent(new CustomEvent('play-track', {
      detail: {
        url: src,
        title,
        artist,
        moodTheme: { primary: '#D4A017' }
      }
    }));

    setPlaying({ playlist: playlistIdx, track: trackIdx });
  };

  // Listen for audio ending to reset state
  useEffect(() => {
    const handleEnded = () => setPlaying(null);
    const handlePause = () => setPlaying(null);
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleEnded);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [playing]);

  return (
    <section className="w-full py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-[#D4A017] mb-1 tracking-wider">FEATURED PLAYLISTS</h2>
        <p className="text-xs text-[#C8A882]/60 mb-6">5-Slot FP Grid · A-B-A-B-A · Legacy & Product</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PLAYLISTS.map((playlist, pIdx) => (
            <div
              key={pIdx}
              className="bg-[#1a120a] border border-[#D4A017]/15 rounded-xl p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#D4A017]/15 flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#D4A017]" />
                </div>
                <span className="text-sm font-bold text-[#FFF8E1] leading-tight">{playlist.name}</span>
              </div>

              {playlist.tracks.map((track, tIdx) => {
                const isActive = playing?.playlist === pIdx && playing?.track === tIdx;
                return (
                  <button
                    key={tIdx}
                    onClick={() => handlePlay(pIdx, tIdx, track.src, track.title, track.artist)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all text-left w-full
                      ${isActive
                        ? 'bg-[#D4A017]/20 border border-[#D4A017]/40'
                        : 'hover:bg-[#2a1f0f] border border-transparent'
                      }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                      ${isActive ? 'bg-[#D4A017]/40' : 'bg-[#D4A017]/10'}`}>
                      {isActive
                        ? <Pause className="w-3.5 h-3.5 text-[#D4A017]" />
                        : <Play className="w-3.5 h-3.5 text-[#D4A017] ml-0.5" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#FFF8E1] truncate">{track.title}</p>
                      <p className="text-[10px] text-[#C8A882]/50 truncate">{track.artist}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
