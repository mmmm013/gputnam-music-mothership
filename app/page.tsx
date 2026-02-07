'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
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

export default function Hero() {
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

  return (
    <main className="min-h-screen bg-[#1a100e]">

      {/* HEADER - DARK BROWN */}
      <Header />

      {/* HERO SECTION - TAN/WARM + ROTATING BRAND IMAGE */}
      <section className="relative w-full h-[75vh] overflow-hidden">
        {HERO_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="G Putnam Music"
            fill
            className={`object-cover transition-opacity duration-1000 ${
              i === heroIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={i === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C4A882]/40 via-[#C4A882]/20 to-[#2A1506]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-[#D4A017] drop-shadow-lg mb-2">
            G Putnam Music
          </h1>
          <p className="text-xl md:text-2xl text-[#C4A882] font-medium tracking-wide mb-1">
            The One Stop Song Shop
          </p>
          <p className="text-sm text-[#C4A882]/70 tracking-wider mb-8">
            Activity-Based, Context-Aware Music Intelligence
          </p>

          {/* Featured Playlist - NO RECTANGLE */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/assets/hero.jpg"
                alt="Featured Playlist"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#D4A017] uppercase tracking-widest">Featured Playlist</p>
              <p className="text-lg font-bold text-[#FFD54F]">Love Renews</p>
              <p className="text-sm text-[#C4A882]/70">G Putnam Music Collection</p>
            </div>
          </div>

          {/* Stats - NO BORDERS, clean text */}
          <p className="text-sm text-[#C4A882]/60 tracking-wide">
            1,000+ GPMC Catalog Tracks &nbsp;&middot;&nbsp; T20 Activity Boxes &nbsp;&middot;&nbsp; 2+ Hours No Repeats
          </p>
        </div>
      </section>

      {/* T20 ACTIVITY SELECTOR */}
      <section className="relative z-10 bg-[#2A1506] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-2 text-[#D4A017]">
            What Are You Doing?
          </h2>
          <p className="text-center text-[#C4A882] mb-10 text-base">
            T20 — Top 20 Activities Listeners Stream To Most
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

          {/* Active activity - NO RECTANGLE */}
          {activeActivity && (
            <div className="mt-10 text-center">
              <h3 className="text-xl font-bold text-[#D4A017] mb-1">
                {t20.find(a => a.id === activeActivity)?.label} — {t20.find(a => a.id === activeActivity)?.description}
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

      <Footer />
    </main>
  );
}
