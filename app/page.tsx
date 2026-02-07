'use client';
import { createClient } from '@supabase/supabase-js';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import WeeklyRace from '@/components/WeeklyRace';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Brand hero images for rotation
const HERO_IMAGES = [
  '/assets/hero.jpg',
  '/k-hero.jpg',
  '/k-hero-alternate.JPG',
];

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
  const [activeActivity, setActiveActivity] = useState<string>('focus');
  const [loadingActivity, setLoadingActivity] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // T20: THE TOP 20 ACTIVITIES LISTENERS STREAM TO MOST
  const t20 = [
    { id: 'focus', label: 'FOCUS', description: 'Deep Work & Study', emoji: '🎧', mood: 'Focus' },
    { id: 'run', label: 'RUN', description: 'Cardio & Jogging', emoji: '🏃', mood: 'Energy' },
    { id: 'chill', label: 'CHILL', description: 'Coffee Shop Hangs', emoji: '☕', mood: 'Chill' },
    { id: 'party', label: 'PAR-T', description: 'Party Mode', emoji: '🎉', mood: 'Energy' },
    { id: 'drive', label: 'KRUZE', description: 'Driving & Road Trips', emoji: '🚗', mood: 'Upbeat' },
    { id: 'lift', label: 'LIFT', description: 'Weights & Training', emoji: '🏋️', mood: 'Energy' },
    { id: 'romance', label: 'HRT', description: 'Date Night', emoji: '❤️', mood: 'Romantic' },
    { id: 'cook', label: 'COOK', description: 'Kitchen Sessions', emoji: '🍳', mood: 'Chill' },
    { id: 'create', label: 'CREATE', description: 'Art & Design', emoji: '🎨', mood: 'Focus' },
    { id: 'read', label: 'READ', description: 'Books & Podcasts', emoji: '📖', mood: 'Reflective' },
    { id: 'commute', label: 'COMMUTE', description: 'Daily Transit', emoji: '🚇', mood: 'Upbeat' },
    { id: 'wind-down', label: 'WIND DN', description: 'Evening Unwind', emoji: '🌙', mood: 'Chill' },
    { id: 'family', label: 'FAMILY', description: 'Kids & Home', emoji: '👨‍👩‍👧', mood: 'Upbeat' },
    { id: 'social', label: 'SOCIAL', description: 'Friends & Gatherings', emoji: '👥', mood: 'Upbeat' },
    { id: 'hustle', label: 'HUSTLE', description: 'Grind & Motivation', emoji: '💼', mood: 'Energy' },
    { id: 'game', label: 'GAME', description: 'Gaming Sessions', emoji: '🎮', mood: 'Energy' },
    { id: 'walkdog', label: 'WALK', description: 'Walking & Pets', emoji: '🐕', mood: 'Chill' },
    { id: 'intimate', label: 'INTMT', description: 'Intimate Moments', emoji: '🔥', mood: 'Romantic' },
    { id: 'code', label: 'CODE', description: 'Dev & Build', emoji: '💻', mood: 'Focus' },
    { id: 'vibe', label: 'VIBE', description: 'Good Energy Only', emoji: '✨', mood: 'Upbeat' },
  ];

  const handleActivityClick = async (activityId: string) => {
    try {
      setLoadingActivity(activityId);
      const activity = t20.find(a => a.id === activityId);
      if (!activity) return;

      const { data: tracks, error } = await supabase
        .from('gpm_tracks')
        .select('*')
        .not('audio_url', 'is', null)
        .neq('audio_url', 'EMPTY')
        .neq('audio_url', '')
        .not('audio_url', 'like', '%placeholder%')
        .eq('mood', activity.mood)
        .limit(10);

      if (error) {
        console.error('[T20] Supabase error:', error);
        setLoadingActivity(null);
        return;
      }
      if (!tracks || tracks.length === 0) {
        console.warn('[T20] No tracks for:', activityId);
        setLoadingActivity(null);
        return;
      }

      const randomIndex = Math.floor(Math.random() * tracks.length);
      const track = tracks[randomIndex];

      const playEvent = new CustomEvent('play-track', {
        detail: {
          title: track.title || 'Unknown Track',
          artist: track.artist || 'G Putnam Music',
          url: track.audio_url,
          moodTheme: { primary: '#D4A017' }
        }
      });
      window.dispatchEvent(playEvent);
      setLoadingActivity(null);
    } catch (err) {
      console.error('[T20] Error:', err);
      setLoadingActivity(null);
    }
  };

  const normalizedAudioUrl = normalizeAudioUrl('/assets/fly-again.mp3');
  const audioSrc = normalizedAudioUrl ?? '';

  return (
    <main className="min-h-screen flex flex-col text-white relative">
      {/* HEADER - DARK BROWN */}
      <Header />

      {/* HERO SECTION - TAN/WARM + ROTATING BRAND IMAGE */}
      <section className="relative overflow-hidden">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ${
              i === heroIndex ? 'opacity-40' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt="G Putnam Music"
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C4A882]/85 via-[#A8926E]/80 to-[#8B7355]/90" />

        <div className="relative min-h-[65vh] flex flex-col items-center justify-center text-center px-6 py-16 z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-[#2A1506] drop-shadow-lg">
            G Putnam Music
          </h1>
          <p className="text-2xl md:text-3xl text-[#3d2810] font-semibold max-w-2xl mb-3">
            The One Stop Song Shop
          </p>
          <p className="text-base text-[#4a3520] max-w-3xl mb-8">
            Activity-Based, Context-Aware Music Intelligence
          </p>

          {/* Featured Playlist Card */}
          <div className="bg-[#2A1506]/80 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full border border-[#D4A017]/30 shadow-2xl mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/cover_love_renews.jpg"
                  alt="Featured Playlist"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-[#D4A017] font-bold mb-1">Featured Playlist</p>
                <p className="text-lg font-bold text-[#F5E6D0]">Love Renews</p>
                <p className="text-sm text-[#C4A882]">G Putnam Music Collection</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#5a4530]">
            <span className="bg-[#2A1506]/15 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2A1506]/20">1,000+ GPMC Catalog Tracks</span>
            <span className="bg-[#2A1506]/15 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2A1506]/20">T20 Activity Boxes</span>
            <span className="bg-[#2A1506]/15 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2A1506]/20">2+ Hours No Repeats</span>
          </div>
        </div>
      </section>

      {/* T20 ACTIVITY SELECTOR - NO BOXES, CLEAN LABELS */}
      <section className="relative z-10 bg-[#2A1506] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-2 text-[#D4A017]">
            What Are You Doing?
          </h2>
          <p className="text-center text-[#C4A882] mb-10 text-base">
            T20 &mdash; Top 20 Activities Listeners Stream To Most
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-y-8 gap-x-2">
            {t20.map((act) => (
              <button
                key={act.id}
                onClick={() => { setActiveActivity(act.id); handleActivityClick(act.id); }}
                className={`flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 ${
                  activeActivity === act.id ? 'scale-105' : ''
                }`}
                title={act.description}
              >
                <span className="text-2xl md:text-3xl">{act.emoji}</span>
                <span className={`text-xs md:text-sm font-bold tracking-wide ${
                  activeActivity === act.id ? 'text-[#D4A017]' : 'text-[#C4A882] hover:text-[#D4A017]'
                }`}>{act.label}</span>
              </button>
            ))}
          </div>

          {activeActivity && (
            <div className="mt-8 p-6 bg-[#1a1207]/90 rounded-xl border border-[#D4A017]/30">
              <h3 className="text-xl font-bold text-[#D4A017] mb-2">
                {t20.find(a => a.id === activeActivity)?.label} &mdash; {t20.find(a => a.id === activeActivity)?.description}
              </h3>
              <p className="text-base text-[#8a8078]">
                Streaming tracks matched to: <span className="text-[#C4A882] font-semibold">{t20.find(a => a.id === activeActivity)?.mood}</span> vibe
              </p>
            </div>
          )}
        </div>
      </section>

      {/* WEEKLY RACE */}
      <section className="bg-gradient-to-b from-[#3d2810] to-[#2A1506]">
        <WeeklyRace />
      </section>

      {/* GLOBAL PLAYER */}
      <GlobalPlayer />

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
