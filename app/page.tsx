'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import { ArrowRight, Music, Zap, Moon, Sun, MessageSquare, CloudRain, Wind, Activity } from 'lucide-react';

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
  const [activeVibe, setActiveVibe] = useState('focus');

  // THE FULL 8-VIBE GRID
  const vibes = [
    { id: 'melancholy', label: 'Melancholy', icon: CloudRain, color: 'from-blue-900/50' },
    { id: 'dreamy', label: 'Dreamy', icon: Wind, color: 'from-purple-900/50' },
    { id: 'focus', label: 'Focus', icon: Music, color: 'from-emerald-900/50' },
    { id: 'uplifting', label: 'Uplifting', icon: Activity, color: 'from-orange-900/50' },
    { id: 'energy', label: 'High Energy', icon: Zap, color: 'from-yellow-900/50' },
    { id: 'night', label: 'Late Night', icon: Moon, color: 'from-indigo-900/50' },
    { id: 'sunrise', label: 'Sunrise', icon: Sun, color: 'from-rose-900/50' },
    { id: 'bot', label: 'Ask the Bot', icon: MessageSquare, color: 'from-cyan-900/50' },
  ];

  // 1. MUSIC: Points to public/assets/fly-again.mp3
  const normalizedAudioUrl = normalizeAudioUrl('/assets/fly-again.mp3');
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

      {/* FEELING/VIBE SELECTOR Section */}
      <section className="relative z-10 bg-black/40 backdrop-blur-sm py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 drop-shadow-lg">
            Select Your Vibe
          </h2>
          
          {/* 8-GRID LAYOUT */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vibes.map((vibe) => {
              const Icon = vibe.icon;
              return (
                <button
                  key={vibe.id}
                  onClick={() => setActiveVibe(vibe.id)}
                  className={`group relative h-24 md:h-32 overflow-hidden rounded-xl border bg-neutral-900/40 backdrop-blur-sm transition-all duration-300 ${
                    activeVibe === vibe.id
                      ? 'border-white ring-1 ring-white/50 bg-neutral-800/60'
                      : 'border-white/10 hover:border-white/30 hover:bg-neutral-800/40'
                  }`}
                >
                  {/* Hover Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${vibe.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Icon & Label */}
                  <div className="relative h-full flex flex-col items-center justify-center gap-2 p-4">
                    <Icon className="w-8 h-8 text-white" />
                    <span className="text-sm font-semibold text-white">{vibe.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Playlists Section */}
      <div id="featured" className="py-12 relative z-10 bg-black/40 backdrop-blur-sm">
        <FeaturedPlaylists />
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
