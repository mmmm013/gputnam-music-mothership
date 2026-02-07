'use client';
import { createClient } from '@supabase/supabase-js';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import WeeklyRace from '@/components/WeeklyRace';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

import {
  Volume2, Activity, Coffee, PartyPopper, Car, Target,
  Heart, Dumbbell, Users, Flame, Sparkles, Bot,
  BookOpen, Headphones, Moon, Baby, Palette, Utensils,
  Dog, Gamepad2, Briefcase, Code
} from 'lucide-react';

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

  // T20: THE TOP 20 ACTIVITIES LISTENERS STREAM TO MOST
  const t20 = [
    { id: 'focus', label: 'FOCUS', description: 'Deep Work & Study', icon: Volume2, mood: 'Focus', color: 'from-amber-500/50' },
    { id: 'run', label: 'RUN', description: 'Cardio & Jogging', icon: Activity, mood: 'Energy', color: 'from-orange-500/50' },
    { id: 'chill', label: 'CHILL', description: 'Coffee Shop Hangs', icon: Coffee, mood: 'Chill', color: 'from-stone-400/50' },
    { id: 'party', label: 'PAR-T', description: 'Party Mode', icon: PartyPopper, mood: 'Energy', color: 'from-amber-400/50' },
    { id: 'drive', label: 'KRUZE', description: 'Driving & Road Trips', icon: Car, mood: 'Upbeat', color: 'from-slate-400/50' },
    { id: 'lift', label: 'LIFT', description: 'Weights & Training', icon: Dumbbell, mood: 'Energy', color: 'from-orange-600/50' },
    { id: 'romance', label: 'HRT', description: 'Date Night', icon: Heart, mood: 'Romantic', color: 'from-rose-400/50' },
    { id: 'cook', label: 'COOK', description: 'Kitchen Sessions', icon: Utensils, mood: 'Chill', color: 'from-amber-600/50' },
    { id: 'create', label: 'CREATE', description: 'Art & Design', icon: Palette, mood: 'Focus', color: 'from-violet-400/50' },
    { id: 'read', label: 'READ', description: 'Books & Podcasts', icon: BookOpen, mood: 'Reflective', color: 'from-stone-500/50' },
    { id: 'commute', label: 'COMMUTE', description: 'Daily Transit', icon: Headphones, mood: 'Upbeat', color: 'from-slate-500/50' },
    { id: 'wind-down', label: 'WIND DN', description: 'Evening Unwind', icon: Moon, mood: 'Chill', color: 'from-indigo-400/50' },
    { id: 'family', label: 'FAMILY', description: 'Kids & Home', icon: Baby, mood: 'Upbeat', color: 'from-amber-300/50' },
    { id: 'social', label: 'SOCIAL', description: 'Friends & Gatherings', icon: Users, mood: 'Upbeat', color: 'from-stone-400/50' },
    { id: 'hustle', label: 'HUSTLE', description: 'Grind & Motivation', icon: Briefcase, mood: 'Energy', color: 'from-amber-700/50' },
    { id: 'game', label: 'GAME', description: 'Gaming Sessions', icon: Gamepad2, mood: 'Energy', color: 'from-slate-600/50' },
    { id: 'walkdog', label: 'WALK', description: 'Walking & Pets', icon: Dog, mood: 'Chill', color: 'from-green-500/50' },
    { id: 'intimate', label: 'INTMT', description: 'Intimate Moments', icon: Flame, mood: 'Romantic', color: 'from-rose-500/50' },
    { id: 'code', label: 'CODE', description: 'Dev & Build', icon: Code, mood: 'Focus', color: 'from-cyan-500/50' },
    { id: 'vibe', label: 'VIBE', description: 'Good Energy Only', icon: Sparkles, mood: 'Upbeat', color: 'from-yellow-400/50' },
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
      {/* HERO SECTION - TAN/WARM BACKGROUND */}
      <section className="relative bg-gradient-to-b from-[#C4A882] via-[#A8926E] to-[#8B7355]">
        <Header />
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
          {/* Brand Hero Image Area */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat opacity-30" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-[#2A1506] drop-shadow-lg">
              G Putnam Music
            </h1>
            <p className="text-2xl md:text-3xl text-[#3d2810] font-semibold max-w-2xl mb-3">
              The One Stop Song Shop
            </p>
            <p className="text-base text-[#4a3520] max-w-3xl mb-6">
              Activity-Based, Context-Aware Music Intelligence
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-[#5a4530]">
              <span className="bg-[#2A1506]/10 px-4 py-2 rounded-full">1,000+ GPMC Catalog Tracks</span>
              <span className="bg-[#2A1506]/10 px-4 py-2 rounded-full">T20 Activity Boxes</span>
              <span className="bg-[#2A1506]/10 px-4 py-2 rounded-full">2+ Hours No Repeats</span>
            </div>
          </div>
        </div>
      </section>

      {/* T20 ACTIVITY SELECTOR - DARK BROWN CONTRAST */}
      <section className="relative z-10 bg-[#2A1506] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-2 text-[#D4A017]">
            What Are You Doing?
          </h2>
          <p className="text-center text-[#C4A882] mb-10 text-base">
            T20 — Top 20 Activities Listeners Stream To Most
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {t20.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => { setActiveActivity(act.id); handleActivityClick(act.id); }}
                  className={`group relative h-28 md:h-32 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    activeActivity === act.id
                      ? 'border-[#D4A017] ring-2 ring-[#D4A017]/50 bg-[#D4A017]/15 scale-[1.03] shadow-lg shadow-[#D4A017]/20'
                      : 'border-[#4a3520]/60 hover:border-[#D4A017]/50 bg-[#1a1207]/80 hover:bg-[#2A1506]'
                  }`}
                  title={act.description}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${act.color} to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  <div className="relative h-full flex flex-col items-center justify-center gap-2 p-4">
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 ${
                      activeActivity === act.id ? 'text-[#D4A017]' : 'text-[#8a8078] group-hover:text-[#C4A882]'
                    }`} />
                    <span className={`text-sm md:text-base font-bold ${
                      activeActivity === act.id ? 'text-[#D4A017]' : 'text-[#C4A882]'
                    }`}>{act.label}</span>
                    <span className="text-[10px] md:text-xs text-[#8a8078] text-center leading-tight">{act.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {activeActivity && (
            <div className="mt-8 p-6 bg-[#1a1207]/90 rounded-xl border border-[#D4A017]/30">
              <h3 className="text-xl font-bold text-[#D4A017] mb-2">
                {t20.find(a => a.id === activeActivity)?.label} — {t20.find(a => a.id === activeActivity)?.description}
              </h3>
              <p className="text-base text-[#8a8078]">
                Streaming tracks matched to: <span className="text-[#C4A882] font-semibold">{t20.find(a => a.id === activeActivity)?.mood}</span> vibe
              </p>
            </div>
          )}
        </div>
      </section>

      {/* WEEKLY RACE - LIGHTER CONTRAST SECTION */}
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
