'use client';
import { createClient } from '@supabase/supabase-js';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
// import FeaturedPlaylists from '@/components/FeaturedPlaylists';
import WeeklyRace from '@/components/WeeklyRace';
  // Supabase configuration
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

import { 
  ArrowRight, 
  Music, 
  Zap, 
  Moon, 
  Sun, 
  MessageSquare, 
  CloudRain, 
  Wind, 
  Activity,
  Volume2,
  Radio,
  Coffee,
  PartyPopper,
  Car,
  Target,
  Heart,
  Dumbbell,
  Users,
  Flame,
  Sparkles,
  Bot
} from 'lucide-react';

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
  const [activeVibe, setActiveVibe] = useState('dnd');
    const [loadingFeeling, setLoadingFeeling] = useState<string | null>(null);

  // THE FULL 12-VIBE GRID - BIC Level Sophistication
  const vibes = [
    { 
      id: 'dnd', 
      label: 'DND', 
      description: 'Do Not Disturb',
      icon: Volume2, 
      color: 'from-amber-600/60',
      roles: ['Deep Worker', 'Meditator', 'Late-Night Coder', 'Zen Seeker'],
      context: 'Focus sessions, meditation, creative flow states'
    },
    { 
      id: 'run', 
      label: 'RUN', 
      description: '100-120 BPM',
      icon: Activity, 
      color: 'from-amber-600/60',
      roles: ['Marathoner', 'Gym Warrior', 'Morning Jogger', 'CrossFit Athlete'],
      context: 'Cardio, HIIT, endurance training, outdoor runs'
    },
    { 
      id: 'hang', 
      label: 'HANG', 
      description: 'Coffee Shop Vibes',
      icon: Coffee, 
      color: 'from-amber-600/60',
      roles: ['Coffee Shop Regular', 'Friend Group Chiller', 'Patio Lounger'],
      context: 'Casual gatherings, background ambiance, relaxed socializing'
    },
    { 
      id: 'part', 
      label: 'PAR-T', 
      description: 'Party Mode',
      icon: PartyPopper, 
      color: 'from-amber-600/60',
      roles: ['DJ', 'Dance Floor Enthusiast', 'Party Host', 'Club Goer'],
      context: 'House parties, clubs, celebrations, high-energy social'
    },
    { 
      id: 'kruze', 
      label: 'KRUZE', 
      description: 'Road Trip',
      icon: Car, 
      color: 'from-amber-600/60',
      roles: ['Road Tripper', 'Sunday Driver', 'Commuter', 'Scenic Route Explorer'],
      context: 'Driving, road trips, commutes, scenic journeys'
    },
    { 
      id: 'paybk', 
      label: 'PAYBK', 
      description: 'Victory Anthems',
      icon: Target, 
      color: 'from-amber-600/60',
      roles: ['Empowered Survivor', 'Growth Mindset Individual', 'Self-Love Advocate'],
      context: 'Personal growth, moving on, winning through success'
    },
    { 
      id: 'hrt', 
      label: 'HRT', 
      description: 'Heartfelt',
      icon: Heart, 
      color: 'from-amber-600/60',
      roles: ['Romantic', 'Emotional Processor', 'Vulnerable Soul', 'Deep Feeler'],
      context: 'Reflection, relationships, emotional processing'
    },
    { 
      id: 'krshd', 
      label: 'KRSH-D', 
      description: 'Crushed It',
      icon: Dumbbell, 
      color: 'from-amber-600/60',
      roles: ['Rock Enthusiast', 'Heavy Lifter', 'Intensity Seeker'],
      context: 'Weightlifting, intense workouts, powerful moments'
    },
    { 
      id: 'human', 
      label: 'HUMAN', 
      description: 'Authentic',
      icon: Users, 
      color: 'from-amber-600/60',
      roles: ['Authentic Seeker', 'Organic Lover', 'Real Connection Advocate'],
      context: 'Genuine moments, real connections, authentic experiences'
    },
    { 
      id: 'sexy', 
      label: 'SEXY', 
      description: 'Sultry Grooves',
      icon: Flame, 
      color: 'from-amber-600/60',
      roles: ['Romantic Evening Curator', 'Intimate Moment Creator', 'Sultry Mood Setter'],
      context: 'Romantic evenings, intimate settings, sophisticated allure'
    },
    { 
      id: 'pstvt', 
      label: 'PSTVT', 
      description: 'Positive Vibes',
      icon: Sparkles, 
      color: 'from-amber-600/60',
      roles: ['Morning Person', 'Optimist', 'Motivational Seeker', 'Uplift Enthusiast'],
      context: 'Morning routines, motivation sessions, positive mindset building'
    },
    { 
      id: 'bot', 
      label: 'BOT', 
      description: 'MC BOT (Michael Clay)',
      icon: Bot, 
      color: 'from-amber-600/60',
      roles: ['AI Enthusiast', 'Tech Lover', 'Future Thinker', 'Bot Curious'],
      context: 'Tech exploration, AI curiosity, future thinking'
    },
    ];

  // Mapping from feeling IDs to database mood values
  const feelingToMood: Record<string, string> = {
    'dnd': 'Focus',      // Do Not Disturb -> Focus mood
    'run': 'Energy',     // Running -> Energy mood
      'hang': 'Chill',       // Hanging out -> Chill mood
      'part': 'Energy',      // Party -> Energy mood
      'kruze': 'Upbeat',     // Cruising -> Upbeat mood
    'paybk': 'Energy',   // Payback/Victory -> Energy mood
      'hrt': 'Romantic',     // Heartfelt -> Romantic mood
      'krshd': 'Energy',     // Crushed It -> Energy mood (intense workouts)
      'human': 'Reflective', // Authentic/Human -> Reflective mood
      'sexy': 'Romantic',    // Sultry/Romantic -> Romantic mood
      'pstvt': 'Upbeat',     // Positive Vibes -> Upbeat mood
    'bot': 'General',    // AI/Tech -> General mood
  };

    // Handle FEELING selection - fetch tracks and play audio
  const handleFeelingClick = async (feelingId: string) => {
    try {
      setLoadingFeeling(feelingId);
      console.log(`[FEELING] Selected: ${feelingId}`);

          // MSJ-BOT special case: route to Scherer TV Thoroughbreds
        // MSJ-BOT disabled: msj_tv_thoroughbreds table is empty, using standard gpm_tracks query
    if (false && feelingId === 'bot') {
      const { data: tracks, error } = await supabase
        .from('msj_tv_thoroughbreds')
        .select('*')
        .not('audio_url', 'is', null)
        .limit(10);

      if (error) {
        console.error('[MSJ-BOT] Supabase error:', error);
        setLoadingFeeling(null);
        return;
      }
      if (!tracks || tracks.length === 0) {
        console.warn('[MSJ-BOT] No Scherer TV tracks found');
        setLoadingFeeling(null);
        return;
      }

      const randomIndex = Math.floor(Math.random() * tracks.length);
      const track = tracks[randomIndex];

      const playEvent = new CustomEvent('play-track', {
        detail: {
          title: track.title || 'Unknown Track',
          artist: track.artist || 'Michael Scherer',
          url: track.audio_url,
          moodTheme: { primary: '#8B4513' },
          meta: {
            tv_network: track.tv_network,
            tv_show: track.tv_show,
            gpmcc_sfw: track.gpmcc_sfw,
            lemon_squeezy_url: track.lemon_squeezy_url,
            composition_story: track.composition_story,
            sync_tier: track.sync_tier,
          },
        },
      });

      window.dispatchEvent(playEvent);
      console.log('[MSJ-BOT] Dispatched Scherer TV play-track event');
      setLoadingFeeling(null);
      return;
    }


      // Fetch tracks for this feeling from Supabase
      const { data: tracks, error } = await supabase
      .from('gpm_tracks')
      .select('*')
      .not('audio_url', 'is', null)
                    .neq('audio_url', 'EMPTY')
      .neq('audio_url', '')
      .eq('mood', feelingToMood[feelingId] || 'General')
      .limit(10);
      if (error) {
        console.error('[FEELING] Supabase error:', error);
        setLoadingFeeling(null);
         return;
           }

      if (!tracks || tracks.length === 0) {
        console.warn('[FEELING] No tracks found for:', feelingId);
        setLoadingFeeling(null);
        return;
      }

      console.log(`[FEELING] Loaded ${tracks.length} tracks`);

      // Get first track and dispatch to GlobalPlayer
    // Select a RANDOM track instead of always first
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const firstTrack = tracks[randomIndex];      const playEvent = new CustomEvent('play-track', {
        detail: {
          title: firstTrack.title || 'Unknown Track',
          artist: firstTrack.artist || 'G Putnam Music',
          url: firstTrack.audio_url,          moodTheme: { primary: '#8B4513' }
        }
      });

      window.dispatchEvent(playEvent);
      console.log('[FEELING] Dispatched play-track event');
      setLoadingFeeling(null);
    } catch (err) {
      console.error('[FEELING] Error:', err);
      setLoadingFeeling(null);
    }
  };

  // 1. MUSIC: Points to public/assets/fly-again.mp3
  const normalizedAudioUrl = normalizeAudioUrl('/assets/fly-again.mp3');
  const audioSrc = normalizedAudioUrl ?? '';

  const scrollToMusic = () => {
    const section = document.getElementById('featured');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen flex flex-col text-white relative">
      
      {/* 2. BACKGROUND: Points to public/assets/hero.jpg 337
      
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
        <p className="text-xl text-neutral-200 max-w-2xl mb-4 drop-shadow-md">
          The One Stop Song Shop.
        </p>
        <p className="text-sm text-neutral-300 max-w-3xl mb-8 drop-shadow-md">
          Context-Aware, Role-Based, Sophisticated Music Intelligence<br />
          500+ GPMC catalog tracks • 12 Feeling Boxes • 2+ hours streaming without repeats
        </p>
                </section>
          {/* FEELING/VIBE SELECTOR Section - 12 Boxes */}
      <section className="relative z-10 bg-black/40 backdrop-blur-sm py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 drop-shadow-lg">
            Select Your Feeling
          </h2>
          <p className="text-center text-neutral-300 mb-8 text-sm">
            Sophisticated Music Intelligence • Role-Based Contexts • Smart Randomization
          </p>
          
          {/* 12-GRID LAYOUT */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vibes.map((vibe) => {
              const Icon = vibe.icon;
              return (
                <button
                  key={vibe.id}
            onClick={() => { setActiveVibe(vibe.id); handleFeelingClick(vibe.id); }}                  className={`group relative h-28 md:h-32 overflow-hidden rounded-xl border bg-neutral-900/40 backdrop-blur-sm transition-all duration-300 ${
                    activeVibe === vibe.id
                      ? 'border-white ring-2 ring-white/50 bg-neutral-800/60 scale-105'
                      : 'border-white/10 hover:border-white/30 hover:bg-neutral-800/40'
                  }`}
                  title={`${vibe.description} - ${vibe.context}`}
                >
                  {/* Hover Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${vibe.color} to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Icon & Label */}
                  <div className="relative h-full flex flex-col items-center justify-center gap-2 p-4">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    <span className="text-xs md:text-sm font-bold text-white">{vibe.label}</span>
                    <span className="text-[10px] text-neutral-300 text-center leading-tight">{vibe.description}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Vibe Info */}
          {activeVibe && (
            <div className="mt-8 p-6 bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-xl font-bold mb-2">
                {vibes.find(v => v.id === activeVibe)?.label} - {vibes.find(v => v.id === activeVibe)?.description}
              </h3>
              <p className="text-sm text-neutral-300 mb-3">
                <strong>Roles:</strong> {vibes.find(v => v.id === activeVibe)?.roles.join(', ')}
              </p>
              <p className="text-sm text-neutral-400">
                <strong>Context:</strong> {vibes.find(v => v.id === activeVibe)?.context}
              </p>
            </div>
          )}
        </div>
      </section>

        <WeeklyRace />

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
