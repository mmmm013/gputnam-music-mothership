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
  const [activeActivity, setActiveActivity] = useState('focus');
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
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#1a1207] via-[#0f0d0a] to-[#0a0908]" />
      <Header />

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-[#D4A017] drop-shadow-2xl">
          G Putnam Music
        </h1>
        <p className="text-xl text-[#C4A882] max-w-2xl mb-3">
          The One Stop Song Shop.
        </p>
        <p className="text-sm text-[#8a8078] max-w-3xl mb-8">
          Activity-Based, Context-Aware Music Intelligence<br />
          1,000+ GPMC catalog tracks &bull; T20 Activity Boxes &bull; 2+ hours streaming without repeats
        </p>
      </section>

      {/* T20 ACTIVITY SELECTOR */}
      <section className="relative z-10 bg-[#1a1207]/80 backdrop-blur-sm py-12 px-4 border-t border-[#D4A017]/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#D4A017]">
            What Are You Doing?
          </h2>
          <p className="text-center text-[#8a8078] mb-8 text-sm">
            T20 &mdash; Top 20 Activities Listeners Stream To Most
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {t20.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => { setActiveActivity(act.id); handleActivityClick(act.id); }}
                  className={`group relative h-24 md:h-28 overflow-hidden rounded-lg border transition-all duration-300 ${
                    activeActivity === act.id
                      ? 'border-[#D4A017] ring-2 ring-[#D4A017]/40 bg-[#D4A017]/10 scale-[1.03]'
                      : 'border-[#3d3529]/60 hover:border-[#D4A017]/40 bg-[#1a1207]/60 hover:bg-[#1a1207]/90'
                  }`}
                  title={act.description}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${act.color} to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                  <div className="relative h-full flex flex-col items-center justify-center gap-1.5 p-3">
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${
                      activeActivity === act.id ? 'text-[#D4A017]' : 'text-[#8a8078] group-hover:text-[#C4A882]'
                    }`} />
                    <span className={`text-xs md:text-sm font-bold ${
                      activeActivity === act.id ? 'text-[#D4A017]' : 'text-[#C4A882]'
                    }`}>{act.label}</span>
                    <span className="text-[9px] md:text-[10px] text-[#6b6158] text-center leading-tight">{act.description}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {activeActivity && (
            <div className="mt-6 p-5 bg-[#1a1207]/70 rounded-lg border border-[#3d3529]/40">
              <h3 className="text-lg font-bold text-[#D4A017] mb-1">
                {t20.find(a => a.id === activeActivity)?.label} &mdash; {t20.find(a => a.id === activeActivity)?.description}
              </h3>
              <p className="text-sm text-[#8a8078]">
                Streaming tracks matched to: <span className="text-[#C4A882]">{t20.find(a => a.id === activeActivity)?.mood}</span> mood
              </p>
            </div>
          )}
        </div>
      </section>

      <WeeklyRace />
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
