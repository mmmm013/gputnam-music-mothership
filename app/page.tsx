<<<<<<< HEAD
'use client';
import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import('@/app/ClientPage'), {
  ssr: false,
});
=======
"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Music } from "lucide-react";
import { usePlayer } from "@/components/PlayerContext";

const vibes = [
  { id: "melancholy", label: "Melancholy" },
  { id: "dreamy", label: "Dreamy" },
  { id: "focus", label: "Focus" },
  { id: "uplifting", label: "Uplifting" },
  { id: "high-energy", label: "High Energy" },
  { id: "late-night", label: "Late Night" },
];

export default function Home() {
  const { state, playTrack, togglePlay } = usePlayer();
  const [activeVibeId, setActiveVibeId] = useState<string>("focus");

  const currentVibe = vibes.find((v) => v.id === activeVibeId) ?? vibes[0];
>>>>>>> 08d812d (Deploy mip page)

export default function Page() {
  return (
<<<<<<< HEAD
    <>
      <ClientPage />
    </>
=======
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero.jpg"
          alt="Kleigh Background"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex h-[75vh] flex-col items-center justify-center px-4">
        <h1 className="font-black text-center text-4xl md:text-7xl tracking-tight drop-shadow-2xl">
          G Putnam Music
        </h1>
        <p className="mt-4 text-center text-sm md:text-xl text-amber-400 uppercase tracking-[0.2em]">
          Official Stream · Live Rotation · {currentVibe.label}
        </p>

        <button
          onClick={() => togglePlay()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20"
        >
          <Music size={20} />
          <span>{state.isPlaying ? "Pause" : "Listen Now"}</span>
          <ArrowRight size={20} />
        </button>
      </section>

      {/* Vibes grid */}
      <section className="relative z-10 mx-auto flex max-w-4xl flex-wrap justify-center gap-3 px-4 pb-16">
        {vibes.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setActiveVibeId(v.id);
              playTrack(v.id);
            }}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              v.id === activeVibeId
                ? "bg-amber-400 text-black border-amber-400"
                : "border-white/30 text-white/80 hover:bg-white/10"
            }`}
          >
            {v.label}
          </button>
        ))}
      </section>
    </main>
>>>>>>> 08d812d (Deploy mip page)
  );
}
