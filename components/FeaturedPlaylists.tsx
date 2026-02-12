'use client';
import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

/**
 * FEATURED PLAYLISTS - BIG Visual Playlist Cards
 * Each FP looks like a REAL playlist (DISCO / Spotify style)
 * Large cover art + bold title + numbered track rows
 * Owner: "a playlist LOOKS LIKE A PLAYLIST! BE BIG!"
 *
 * CURATION: Each trio from distinct inner groups, 2 similar vibe + 1 edgier
 */

interface Track {
  title: string;
  artist: string;
  src: string;
}

interface Playlist {
  name: string;
  subtitle: string;
  cover: string;
  tracks: Track[];
}

const PLAYLISTS: Playlist[] = [
  {
    name: "Grandpa's Story",
    subtitle: 'Legacy Collection',
    cover: '/assets/hero.jpg',
    tracks: [
      { title: 'Reflections', artist: 'Kleigh', src: '/pix/kleigh--reflections.mp3' },
      { title: 'I Need an Angel', artist: 'G Putnam Music', src: '/pix/i-need-an-angel.mp3' },
      { title: 'Bought Into Your Game', artist: 'Kleigh', src: '/pix/bought-into-your-game.mp3' },
    ],
  },
  {
    name: 'Kleigh Spotlight',
    subtitle: 'Chill & Atmospheric',
    cover: '/assets/MOON-1[32199].jpg',
    tracks: [
      { title: 'Breathing Serenity', artist: 'Kleigh', src: '/pix/kleigh--breathing-serenity.mp3' },
      { title: 'Nighttime', artist: 'G Putnam Music', src: '/pix/nighttime.mp3' },
      { title: 'Down (Stripped)', artist: 'Kleigh', src: '/pix/kleigh--down-(stripped)-with-reverb--69bpm-fmaj.mp3' },
    ],
  },
  {
    name: 'Who is G Putnam Music',
    subtitle: 'Uplifting & Positive',
    cover: '/assets/MC by Tree Looking Left.jpg',
    tracks: [
      { title: 'I Was Made to Be Awesome', artist: 'G Putnam Music', src: '/pix/i-was-made-to-be-awesome.mp3' },
      { title: 'Perfect Day', artist: 'G Putnam Music', src: '/pix/perfect-day.mp3' },
      { title: 'Why Does Life Gotta Be This Hard', artist: 'G Putnam Music', src: '/pix/why-does-life-gotta-be-this-hard.mp3' },
    ],
  },
  {
    name: 'The First Note',
    subtitle: 'Energy & Fun',
    cover: '/assets/Front Pose.jpg',
    tracks: [
      { title: 'Dance Party', artist: 'G Putnam Music', src: '/pix/dance-party.mp3' },
      { title: 'Going Outside', artist: 'G Putnam Music', src: '/pix/going-outside.mp3' },
      { title: 'I Am a Fighter', artist: 'G Putnam Music', src: '/pix/i-am-a-fighter--el-mix-instro.mp3' },
    ],
  },
  {
    name: 'The SHIPS Engine',
    subtitle: 'Freedom & Aspiration',
    cover: '/assets/Smoking 1.jpg',
    tracks: [
      { title: 'I Live Free', artist: 'G Putnam Music', src: '/pix/i-live-free--instro.mp3' },
      { title: "We'll Be Free", artist: 'G Putnam Music', src: "/pix/we'll-be-free.mp3" },
      { title: "Fool's Game", artist: 'G Putnam Music', src: '/pix/fools-game-(master-2).mp3' },
    ],
  },
];

export default function FeaturedPlaylists() {
  const [playing, setPlaying] = useState<{ playlist: number; track: number } | null>(null);

  const handlePlay = (pIdx: number, tIdx: number, track: Track) => {
    if (playing?.playlist === pIdx && playing?.track === tIdx) {
      setPlaying(null);
      window.dispatchEvent(new CustomEvent('pause-track'));
      return;
    }
    setPlaying({ playlist: pIdx, track: tIdx });
    window.dispatchEvent(new CustomEvent('play-track', {
      detail: { url: track.src, title: track.title, artist: track.artist, moodTheme: { primary: '#D4A017' } }
    }));
  };

  return (
    <section className="w-full py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-black text-[#D4A017] mb-2 tracking-wider uppercase">Featured Playlists</h2>
        <p className="text-sm text-[#C8A882]/60 mb-8">Curated collections from the GPM catalog</p>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          {PLAYLISTS.map((playlist, pIdx) => (
            <div
              key={pIdx}
              className="flex-shrink-0 w-[280px] sm:w-[300px] bg-gradient-to-b from-[#1e150b] to-[#120c06] border border-[#D4A017]/10 rounded-2xl overflow-hidden snap-start hover:border-[#D4A017]/30 transition-all group"
            >
              {/* COVER ART - BIG */}
              <div className="relative w-full aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120c06] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-black text-white drop-shadow-lg leading-tight">{playlist.name}</h3>
                  <p className="text-xs text-[#D4A017]/80 font-semibold uppercase tracking-wider mt-1">{playlist.subtitle}</p>
                </div>
              </div>

              {/* TRACK LIST */}
              <div className="px-3 py-3">
                {playlist.tracks.map((track, tIdx) => {
                  const isActive = playing?.playlist === pIdx && playing?.track === tIdx;
                  return (
                    <button
                      key={tIdx}
                      onClick={() => handlePlay(pIdx, tIdx, track)}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all text-left
                        ${isActive
                          ? 'bg-[#D4A017]/15 border border-[#D4A017]/30'
                          : 'hover:bg-[#ffffff08] border border-transparent'
                        }`}
                    >
                      {/* Play Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                        ${isActive ? 'bg-[#D4A017]' : 'bg-[#D4A017]/10'}`}>
                        {isActive
                          ? <Pause className="w-4 h-4 text-[#120c06]" fill="currentColor" />
                          : <Play className="w-4 h-4 text-[#D4A017] ml-0.5" fill="currentColor" />
                        }
                      </div>

                      {/* Track Info */}
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-[#D4A017]' : 'text-[#FFF8E1]'}`}>{track.title}</p>
                        <p className="text-xs text-[#C8A882]/50 truncate">{track.artist}</p>
                      </div>

                      {/* Track Number */}
                      <span className="text-xs text-[#C8A882]/30 font-mono flex-shrink-0">{tIdx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
