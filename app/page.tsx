'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
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
const HERO_IMAGES = [
  '/assets/hero.jpg',                          // 0: marble/gold abstract - center
  '/k-hero.jpg',                               // 1: portrait - top 20%
  '/k-hero-alternate.JPG',                     // 2: sunlight outdoor - center
  '/IMG_7429.JPG',                             // 3: studio front - center
  '/IMG_7624.JPG',                             // 4: studio side working - center
  '/IMG_7720.JPG',                             // 5: red blazer portrait - top 20%
  '/assets/MC Agnst Stone Wall Knee Bent.jpg', // 8: MC stone wall portrait
  '/assets/MC by Tree Looking Left.jpg',       // 9: MC by tree
  '/assets/Front Pose.jpg',                    // 10: vocalist front pose
  '/assets/Smoking 1.jpg',                     // 12: smoking portrait
  '/hero-Music is Feeling.jpg',                // 16: hero music is feeling
];

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
  // MOBILE FIX: Track fade state (only 1 image in DOM at once)
  const [heroFading, setHeroFading] = useState(false);

  // Shuffle-based hero rotation: random order each page load
  // MOBILE FIX: Only 1 image rendered at a time, not all 11
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
      setTimeout(() => {
        pos = (pos + 1) % indices.length;
        setHeroIndex(indices[pos]);
        setHeroFading(false);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Memoize the active activity details to avoid repeated .find() calls
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
          vocalist: track.artist || 'G Putnam Music',
          url: track.audio_url,
          moodTheme: { primary: '#C8A882' }
        }
      });
      window.dispatchEvent(playEvent);
      setLoadingActivity(null);
    } catch (err) {
      console.error('[T20] Error:', err);
      setLoadingActivity(null);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a100e]">
      {/* HEADER - DARK BROWN */}
      <Header />

      {/* HERO SECTION - MOBILE FIX: Only render current image, not all 11 */}
      <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Only render the current hero image */}
        <Image
          key={`hero-${heroIndex}`}
          src={HERO_IMAGES[heroIndex]}
          alt="G Putnam Music"
          fill
          className={`object-cover transition-opacity duration-500 ${
            heroFading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={heroIndex === 0}
          sizes="100vw"
          quality={75}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-[#C8A882] drop-shadow-lg tracking-wide">
            G Putnam Music
          </h1>
          <p className="text-lg md:text-xl text-[#C8A882]/80 mt-2 tracking-widest">
            The One Stop Song Shop
          </p>
          <p className="text-xs md:text-sm text-[#C8A882]/60 mt-1 tracking-wider">
            Activity-Based, Context-Aware Music Intelligence
          </p>
        </div>
      </section>

      {/* FEATURED PLAYLISTS - 5-SLOT FP GRID */}
      <FeaturedPlaylists />

      {/* T20 ACTIVITY SELECTOR */}
      <section className="w-full max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center text-[#C8A882] mb-1">
          What Are You Doing?
        </h2>
        <p className="text-center text-sm text-[#C4A882]/60 mb-6">
          T20 — Top 20 Activities Listeners Stream To Most
        </p>

        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3 justify-items-center">
          {t20.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                setActiveActivity(act.id);
                handleActivityClick(act.id);
              }}
              className={`flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 ${
                activeActivity === act.id ? 'scale-105' : ''
              }`}
              title={act.description}
            >
              <span className="text-2xl">{act.emoji}</span>
              <span className="text-[10px] text-[#C4A882]/70 tracking-widest font-medium">
                {act.label}
              </span>
            </button>
          ))}
        </div>

        {/* Active activity info */}
        {activeAct && (
          <div className="mt-6 text-center">
            <h3 className="text-sm font-semibold text-[#C8A882]">
              {activeAct.label} — {activeAct.description}
            </h3>
            <p className="text-xs text-[#C4A882]/50 mt-1">
              Streaming tracks matched to: <span className="text-[#DA8917]">{activeAct.mood}</span> vibe
            </p>
          </div>
        )}

        {/* Stats - clean text */}
        <div className="mt-8 text-center text-xs text-[#C4A882]/40 tracking-widest">
          1,000+ GPMC Catalog Tracks &nbsp;&middot;&nbsp; T20 Activity Boxes &nbsp;&middot;&nbsp; 2+ Hours No Repeats
        </div>
      </section>

      {/* WEEKLY RACE */}
      <WeeklyRace />

      {/* FOOTER */}
      <Footer />

      {/* Bottom padding for sticky GlobalPlayer */}
      <div className="h-24" />

      {/* GLOBAL PLAYER */}
      <GlobalPlayer />
    </div>
  );
}
