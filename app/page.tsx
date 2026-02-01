'use client';
import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, Music } from 'lucide-react';
import { usePlayer } from './PlayerContext';
import BraveTrigger from '@/components/BraveTrigger';

const VIBES = [
  { id: 'melancholy', label: 'MELANCHOLY' },
  { id: 'dreamy', label: 'DREAMY' },
  { id: 'focus', label: 'FOCUS' },
  { id: 'uplifting', label: 'UPLIFTING' },
  { id: 'high-energy', label: 'HIGH ENERGY' },
  { id: 'late-night', label: 'LATE NIGHT' },
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
      {/* BACKGROUND IMAGE */}
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

      {/* HERO SECTION */}
      <section className="relative z-10 flex h-[75vh] flex-col items-center justify-center px-4">
        <h1 className="font-black text-center text-4xl md:text-7xl tracking-tight drop-shadow-2xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
          G PUTNAM MUSIC
        </h1>
        <p className="mt-4 text-center text-sm md:text-xl text-amber-400 uppercase tracking-[0.2em]">
          The Mothership · Official Stream · Live Rotation · {currentVibe.label}
        </p>

        <button
          onClick={() => togglePlay()}
          aria-pressed={isPlaying}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20 transition-all"
        >
          <Music size={20} />
          <span>{isPlaying ? 'Pause' : 'Listen Now'}</span>
          <ArrowRight size={20} />
        </button>
      </section>

      {/* VIBE SELECTOR */}
      <section className="relative z-10 mx-auto flex max-w-4xl flex-wrap justify-center gap-3 px-4 pb-16">
        {VIBES.map((v) => (
          <button
            key={v.id}
            onClick={() => handleVibeClick(v.id)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
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

      {/* HEROES SECTION */}
      <section id="heroes" className="relative z-10 w-full max-w-4xl mx-auto p-8 my-12 bg-slate-900/50 rounded-lg border-l-4 border-amber-600">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-white">HEROES</h2>
          <span className="text-amber-500 text-sm tracking-widest uppercase">/ Because They Could</span>
        </div>

        {/* STORY 1: CHAMPAIGN (GREG) */}
        <article className="mb-12">
          <h3 className="text-xl text-amber-400 font-serif italic mb-4">&quot;Heroism is a swarm.&quot;</h3>
          <p className="text-slate-300 leading-relaxed">
            Years ago, on I-57 near Champaign, Illinois, I learned the weight of a collective refusal to let a stranger die. 
            Trapped in a Camaro that had disintegrated against a bridge abutment at 72mph, I was saved not by one person, 
            but by an army...
            <span className="text-slate-500 text-sm ml-2">[Read Full Story]</span>
          </p>
        </article>

        {/* STORY 2: OKINAWA (LEE) */}
        <article className="border-t border-slate-800 pt-8">
          <h3 className="text-2xl font-bold text-white mb-2">OKINAWA: THE DISTANT GAZE</h3>
          <h4 className="text-sm text-slate-400 uppercase tracking-widest mb-4">The Medic from Bushnell</h4>
          
          <p className="text-slate-300 leading-relaxed mb-4">
            Great-Grandpa Lee was just 19—a kid from Bushnell, Illinois, hanging in the balance between high school and college. 
            But history has a way of interrupting plans. He stood in a line at Camp Lejeune and became a Medic, destined for 
            one of the fiercest engagements of the Pacific War: <strong>Okinawa</strong>.
          </p>
          <p className="text-slate-300 leading-relaxed mb-6">
            To us, he is remembered by three things: The Scar, The Look, and The Flag. 
            He didn&apos;t ask to be a hero. He was a kid who stood in a line and did a job that saved lives while the world burned around him.
          </p>
          
          {/* BRAVE TRIGGER */}
          <div className="flex justify-center">
            <BraveTrigger 
              heroTrack="Believe It" 
              mood="Heroic"
              label="Summon Brave"
            />
          </div>
        </article>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 w-full p-8 text-center text-slate-600 text-sm border-t border-slate-900 mt-12">
        <p>&copy; {new Date().getFullYear()} G PUTNAM MUSIC, LLC. All Rights Reserved.</p>
        <p className="text-xs mt-2">FEIN: 86-2542152 | THE MOTHERSHIP IS OPERATIONAL</p>
      </footer>
    </main>
  );
}
