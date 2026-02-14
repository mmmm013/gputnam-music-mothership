'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import WeeklyRace from '@/components/WeeklyRace';
import FeaturedPlaylists from '@/components/FeaturedPlaylists';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Brand hero images for rotation
// MOBILE FIX: Only render the ACTIVE image, not all 11 stacked
// Each image has its own objectPosition for perfect framing
const HERO_IMAGES: { src: string; objectPosition: string }[] = [
  { src: '/assets/hero.jpg', objectPosition: 'center center' },
  { src: '/k-hero.jpg', objectPosition: 'center center' },
  { src: '/k-hero-alternate.JPG', objectPosition: 'center center' },
  { src: '/IMG_7429.JPG', objectPosition: '30% center' },
  { src: '/IMG_7624.JPG', objectPosition: '30% center' },
  { src: '/IMG_7720.JPG', objectPosition: '30% center' },
  { src: '/assets/MC Agnst Stone Wall Knee Bent.jpg', objectPosition: 'center center' },
  { src: '/assets/MC by Tree Looking Left.jpg', objectPosition: 'center center' },
  { src: '/assets/Front Pose.jpg', objectPosition: 'center center' },
  { src: '/assets/Smoking 1.jpg', objectPosition: 'center center' },
];

// V-DAY PROMO: Auto-expires after Feb 15, 2026
function isValentinesPromo(): boolean {
  const now = new Date();
  const cutoff = new Date('2026-02-15T23:59:59-06:00');
  return now <= cutoff;
}

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
  { id: 'commute', label: 'COMMUTE', description: 'Daily Transit', emoji: '🚌', mood: 'Upbeat' },
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

export default function Hero() {
  const [activeActivity, setActiveActivity] = useState<string>('focus');
  const [loadingActivity, setLoadingActivity] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroFading, setHeroFading] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showVDay, setShowVDay] = useState(false);

  // Check V-Day promo on mount (client-side only)
  useEffect(() => {
    setShowVDay(isValentinesPromo());
  }, []);

  // Shuffle-based hero rotation
  useEffect(() => {
    const indices = Array.from({ length: HERO_IMAGES.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    let pos = 0;
    setHeroIndex(indices[0]);
    const interval = setInterval(() => {
      setHeroFading(true);
      fadeTimeoutRef.current = setTimeout(() => {
        pos = (pos + 1) % indices.length;
        setHeroIndex(indices[pos]);
        setHeroFading(false);
      }, 300);
    }, 8000);
    return () => {
      clearInterval(interval);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  const activeAct = useMemo(
    () => t20.find(a => a.id === activeActivity),
    [activeActivity]
  );

  const handleActivityClick = useCallback(async (activityId: string) => {
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
      if (error) { setLoadingActivity(null); return; }
      if (!tracks || tracks.length === 0) { setLoadingActivity(null); return; }
      const randomIndex = Math.floor(Math.random() * tracks.length);
      const track = tracks[randomIndex];
      const playEvent = new CustomEvent('play-track', {
        detail: {
          title: track.title || 'Unknown Track',
          vocalist: track.artist || 'G Putnam Music',
          url: track.audio_url,
          moodTheme: { primary: '#C8A882' }
        }
      });
      window.dispatchEvent(playEvent);
      setLoadingActivity(null);
    } catch {
      setLoadingActivity(null);
    }
  }, []);

  const heroImage = HERO_IMAGES[heroIndex];

  return (
    <div className="min-h-screen bg-[#1a1207] text-[#C8A882]">
      <Header />

      {/* V-DAY PROMO BANNER - auto-expires after Feb 15 */}
      {showVDay && (
        <div className="bg-gradient-to-r from-[#8B0000] via-[#C8102E] to-[#8B0000] py-3 px-4 text-center">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-white text-sm sm:text-base font-semibold animate-pulse">
              Last-Minute Valentine&apos;s — A Gift to Remember Forever
            </span>
            <span className="flex gap-2">
              <Link
                href="/gift"
                className="inline-block bg-white text-[#8B0000] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full hover:bg-[#C8A882] hover:text-[#1a1207] transition-all min-h-[44px] flex items-center"
              >
                Gifts from $1.99
              </Link>
              <Link
                href="/kupid"
                className="inline-block bg-[#C8A882] text-[#1a1207] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full hover:bg-white transition-all min-h-[44px] flex items-center"
              >
                K-KUTs Locket
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <Image
          key={heroImage.src}
          src={heroImage.src}
          alt="G Putnam Music"
          fill
          priority
          className={`object-cover transition-opacity duration-300 ${
            heroFading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ objectPosition: heroImage.objectPosition }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wider" style={{ color: '#5C3A1E' }}>
            G Putnam Music
          </h1>
          <p className="text-lg md:text-xl mt-2 text-[#C8A882]/80 tracking-widest">
            The One Stop Song Shop
          </p>
          <p className="text-sm mt-1 text-[#C8A882]/60">
            Activity-Based, Context-Aware Music Intelligence
          </p>
        </div>
      </section>

      <FeaturedPlaylists />

      {/* T20 ACTIVITY SELECTOR */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          What Are You Doing?
        </h2>
        <p className="text-center text-[#C8A882]/60 text-sm mb-8">
          T20 — Top 20 Activities Listeners Stream To Most
        </p>
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3 md:gap-4">
          {t20.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                setActiveActivity(act.id);
                handleActivityClick(act.id);
              }}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                activeActivity === act.id ? 'scale-105 bg-[#C8A882]/10' : ''
              } ${
                loadingActivity === act.id ? 'animate-pulse' : ''
              }`}
              title={act.description}
              aria-label={`${act.label} - ${act.description}`}
            >
              <span className="text-2xl">{act.emoji}</span>
              <span className="text-[10px] mt-1 tracking-wider">{act.label}</span>
            </button>
          ))}
        </div>

        {activeAct && (
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold">
              {activeAct.label} — {activeAct.description}
            </h3>
            <p className="text-sm text-[#C8A882]/60 mt-1">
              Streaming tracks matched to: <span className="text-[#C8A882]">{activeAct.mood}</span> vibe
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-[#C8A882]/40 tracking-wider">
          1,000+ GPMC Catalog Tracks &middot; T20 Activity Boxes &middot; 2+ Hours No Repeats
        </div>
      </section>

      <WeeklyRace />
      <Footer />
      <div className="h-24" />
      <GlobalPlayer />
    </div>
  );
}
