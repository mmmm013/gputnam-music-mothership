"use client";

import React from "react";
import { usePlayer } from "./PlayerContext";
import GpmFooter from "@/components/Footer";

export default function ClientPage() {
  const { isPlaying, togglePlay } = usePlayer();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white flex flex-col">
      {/* HERO */}
      <section className="flex-1 relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-center">
          G Putnam Music
        </h1>
        <p className="mt-3 text-xs md:text-sm tracking-[0.35em] text-amber-400 uppercase text-center">
          Official Stream · Live Rotation · Focus
        </p>

        <button
          onClick={togglePlay}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-black/40"
        >
          <span>🎵</span>
          <span>{isPlaying ? "Pause" : "Listen Now"}</span>
        </button>

        {/* Mood buttons row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.25em]">
          <button className="rounded-full border border-neutral-600 px-4 py-1">
            Melancholy
          </button>
          <button className="rounded-full border border-neutral-600 px-4 py-1">
            Dreamy
          </button>
          <button className="rounded-full border border-amber-400 bg-amber-400/10 px-4 py-1 text-amber-300">
            Focus
          </button>
          <button className="rounded-full border border-neutral-600 px-4 py-1">
            Uplifting
          </button>
          <button className="rounded-full border border-neutral-600 px-4 py-1">
            High Energy
          </button>
          <button className="rounded-full border border-neutral-600 px-4 py-1">
            Late Night
          </button>
        </div>
      </section>

      {/* STANDARD GPM FOOTER */}
      <GpmFooter />
    </main>
  );
}
