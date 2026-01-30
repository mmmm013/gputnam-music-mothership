'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, Music } from 'lucide-react';
import { usePlayer } from './PlayerContext';

const VIBES = [
  { id: 'melancholy', label: 'Melancholy' },
  { id: 'dreamy', label: 'Dreamy' },
  { id: 'focus', label: 'Focus' },
  { id: 'uplifting', label: 'Uplifting' },
  { id: 'high-energy', label: 'High Energy' },
  { id: 'late-night', label: 'Late Night' },
];

export default function Page() {
  const { isPlaying, playTrack, togglePlay } = usePlayer();
  const [activeVibeId, setActiveVibeId] = useState<string>('focus');

  const currentVibe = useMemo(
    () => VIBES.find((v) => v.id === activeVibeId) ?? VIBES[0],
    [activeVibeId]
  );

  const handleVibeClick = useCallback(
    (id: string) => {
      setActiveVibeId(id);
      playTrack(id);
    },
    [playTrack]
  );

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero.jpg"
          alt="G Putnam Music hero"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      <section className="relative z-10 flex h-[75vh] flex-col items-center justify-center px-4">
        <h1 className="font-black text-center text-4xl md:text-7xl tracking-tight drop-shadow-2xl">
          G Putnam Music
        </h1>
        <p className="mt-4 text-center text-sm md:text-xl text-amber-400 uppercase tracking-[0.2em]">
          Official Stream · Live Rotation · {currentVibe.label}
        </p>

        <button
          onClick={() => togglePlay()}
          aria-pressed={isPlaying}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20"
        >
          <Music size={20} />
          <span>{isPlaying ? 'Pause' : 'Listen Now'}</span>
          <ArrowRight size={20} />
        </button>
      </section>

      <section className="relative z-10 mx-auto flex max-w-4xl flex-wrap justify-center gap-3 px-4 pb-16">
        {VIBES.map((v) => (
          <button
            key={v.id}
            onClick={() => handleVibeClick(v.id)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              v.id === activeVibeId
                ? 'bg-amber-400 text-black border-amber-400'
                : 'border-white/30 text-white/80 hover:bg-white/10'
            }`}
            aria-current={v.id === activeVibeId ? 'true' : 'false'}
          >
            {v.label}
          </button>
        ))}
      </section>
    </main>
  );
}