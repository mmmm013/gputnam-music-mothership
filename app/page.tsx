'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import MoodGrid from '@/components/FeaturedPlaimport MoodGrid from '@/components/MoodGrid';

/**
 * Helper to normalize audio URL.
 */
function normalizeAudioUrl(input?: string | null): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export default function Hero() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // 1. MUSIC: Points to public/assets/Fly Again.mp3
  const normalizedAudioUrl = normalizeAudioUrl('/assets/Fly Again.mp3');
  const audioSrc = normalizedAudioUrl ?? '';

  const scrollToMusic = () => {
    const section = document.getElementById('featured');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen flex flex-col text-white relative">
      
      {/* 2. BACKGROUND: Points to public/assets/hero.jpg */}
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="/assets/hero.jpg"
          alt="Background"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      <Header />

      {/* Hero Content Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter drop-shadow-2xl">
          G Putnam Music
        </h1>
        <p className="text-xl text-neutral-200 max-w-2xl mb-8 drop-shadow-md">
          The One Stop Song Shop.
        </p>
        
        <button 
          onClick={scrollToMusic}
          className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors shadow-lg"
        >
          <Music size={20} />
          <span>Listen Now</span>
          <ArrowRight size={20} />
        </button>
      </section>

      {/* Featured Playlists Section */}
      <div id="featured" className="py-12 relative z-10 bg-black/40 backdrop-blur-sm">
        <MoodGrid />
      </div>

      <GlobalPlayer />

      {/* Invisible Audio Logic */}
      <audio 
        ref={audioRef}
        src={audioSrc}
        onCanPlay={() => setAudioReady(true)}
        onError={() => setAudioError(true)}
        className="hidden"
      />

      <Footer />
    </main>
  );
}
