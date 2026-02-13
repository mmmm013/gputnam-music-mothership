'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
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
const HERO_IMAGES = [
  '/assets/hero.jpg',          // 0: marble/gold abstract - center
  '/k-hero.jpg',               // 1: portrait - top 20%
  '/k-hero-alternate.JPG',     // 2: sunlight outdoor - center
  '/IMG_7429.JPG',             // 3: studio front - center
  '/IMG_7624.JPG',             // 4: studio side working - center
  '/IMG_7720.JPG',             // 5: red blazer portrait - top 20%
    '/assets/MC Agnst Stone Wall Knee Bent.jpg',  // 8: MC stone wall portrait
  '/assets/MC by Tree Looking Left.jpg',        // 9: MC by tree
  '/assets/Front Pose.jpg',                     // 10: vocalist front pose
  '/assets/Smoking 1.jpg',                      // 12: smoking portrait
  '/assets/MOON-1[32199].jpg',                  // 13: moon shot
  '/assets/Blonde Fan.png',                     // 14: blonde fan
  '/hero-Music is Feeling.jpg',                 // 16: hero music is feeling
    '/assets/Grabbong Sunlasses.jpg',             // 16: grabbong sunlasses
  '/assets/Heather Heyer Grvesite.jpg',           // 17: Heather Heyer tribute
  


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
  };

  return (
    <div className="min-h-screen bg-[#1a1206] text-[#f5e6c8]">
      {/* HEADER - DARK BROWN */}
      <Header />

      {/* HERO SECTION - TAN/WARM + ROTATING BRAND IMAGE */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        {HERO_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="G Putnam Music"
            fill
              className={`object-cover ${i === 11 ? 'object-[center_20%]' : (i === 1 || i === 5) ? 'object-[center_35%]' : 'object-center'} transition-opacity duration-1000 ${heroIndex === i ? 'opacity-100' : 'opacity-0'}`} priority={i === 0}
          />
        ))}
        <div className="absolute inset-0 bg-[#1a1206]/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-5xl md:text-7xl font-black text-[#C8A882]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6), 0 0 40px rgba(26,18,6,0.5)' }}>
            G Putnam Music
          </h1>
          <p className="text-xl md:text-2xl text-[#f5e6c8] mt-2 font-medium" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            The One Stop Song Shop
          </p>
          <p className="text-sm text-[#f5e6c8]/70 mt-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
            Activity-Based, Context-Aware Music Intelligence
          </p>
        </div>
      </section>

              {/* FEATURED PLAYLISTS - 5-SLOT FP GRID */}
        <FeaturedPlaylists />

      {/* T20 ACTIVITY SELECTOR */}
            <section className="py-8 px-4 max-w-6xl mx-auto">
                  
        <h2 className="text-2xl font-bold text-center text-[#C8A882] mb-2">
          What Are You Doing?
        </h2>
              <p className="text-center text-[#f5e6c8]/60 text-sm mb-6">
          T20 — Top 20 Activities Listeners Stream To Most
        </p>
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
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
              <span className={`text-[10px] font-bold ${
                activeActivity === act.id ? 'text-[#C8A882]' : 'text-[#f5e6c8]/70'
              }`}>
                {act.label}
              </span>
            </button>
          ))}
        </div>

        {/* Active activity - NO RECTANGLE */}
        {activeActivity && (
          <div className="text-center mt-6">
            <h3 className="text-lg font-bold text-[#C8A882]">
              {t20.find(a => a.id === activeActivity)?.label} — {t20.find(a => a.id === activeActivity)?.description}
            </h3>
            <p className="text-sm text-[#f5e6c8]/60 mt-1">
              Streaming tracks matched to: <span className="text-[#C8A882]">{t20.find(a => a.id === activeActivity)?.mood}</span> vibe
            </p>
          </div>
        )}
      </section>

      {/* Stats - NO BORDERS, clean text */}
      <div className="text-center py-4 text-[#f5e6c8]/60 text-sm">
        1,000+ GPMC Catalog Tracks&nbsp; · &nbsp;T20 Activity Boxes&nbsp; · &nbsp;2+ Hours No Repeats
      </div>

      {/* WEEKLY RACE */}
      <WeeklyRace />

      {/* FOOTER */}
      <Footer />

      {/* GLOBAL PLAYER */}
      <GlobalPlayer />
    </div>
  );
}
