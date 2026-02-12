'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Music, Users, Play, Anchor } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/**
 * FP MASTER PROTOCOL - 5-SLOT GRID (A-B-A-B-A)
 * Pattern: READ - LISTEN - READ - LISTEN - READ
 * Slots 1, 3, 5 = Static READ links
 * Slots 2, 4 = Dynamic LISTEN (shuffled from trackLibrary)
 */

interface TrackLibraryItem {
  title: string;
  artist: string;
  filename: string;
  label: string;
}

// IV. ASSET REQUIREMENTS - tracks that MUST exist in Supabase songs bucket
const trackLibrary: TrackLibraryItem[] = [
  { title: 'The First Note', artist: 'GPM', filename: 'first-note.mp3', label: 'SONIC BRAND' },
  { title: 'Bought Into Your Game', artist: 'Kleigh', filename: '038 - kleigh - bought into your game.mp3', label: 'GPMC LEGACY' },
  { title: 'Scherer Feature', artist: 'Michael Scherer', filename: 'scherer-feature.mp3', label: 'CO-COPYRIGHT' },
  { title: 'Nelson Feature', artist: 'Erik W. Nelson', filename: 'nelson-feature.mp3', label: 'CO-COPYRIGHT' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FeaturedPlaylists() {
  const [slot2Track, setSlot2Track] = useState<TrackLibraryItem | null>(null);
  const [slot4Track, setSlot4Track] = useState<TrackLibraryItem | null>(null);
  const [playingSlot, setPlayingSlot] = useState<number | null>(null);

  // II. DYNAMIC INJECTION ENGINE - shuffle trackLibrary on every page load
  useEffect(() => {
    const shuffled = shuffleArray(trackLibrary);
    setSlot2Track(shuffled[0]);
    setSlot4Track(shuffled[1] || shuffled[0]);
  }, []);

  const playAudio = async (track: TrackLibraryItem, slotNumber: number) => {
    if (!supabase) return;

    setPlayingSlot(slotNumber);

    try {
      // Get public URL from Supabase songs bucket
      const { data } = supabase.storage.from('songs').getPublicUrl(track.filename);

      if (data?.publicUrl) {
        window.dispatchEvent(new CustomEvent('play-track', {
          detail: {
            url: data.publicUrl,
            title: track.title,
            artist: track.artist,
            moodTheme: { primary: '#D4A017' }
          }
        }));
      }
    } catch (err) {
      console.error('[FP] Audio error:', err);
    }
  };

  // The 5-slot grid definition per FP_MASTER_PROTOCOL.md
  const slots = [
    {
      number: 1,
      type: 'READ' as const,
      title: "Grandpa's Story",
      subtitle: 'Hero Legacy',
      href: '/heroes',
      icon: BookOpen,
    },
    {
      number: 2,
      type: 'LISTEN' as const,
      title: slot2Track?.title || 'The First Note',
      subtitle: slot2Track ? `${slot2Track.artist} · ${slot2Track.label}` : 'Sonic Brand',
      track: slot2Track,
      icon: Music,
    },
    {
      number: 3,
      type: 'READ' as const,
      title: 'Who is G Putnam Music',
      subtitle: 'Artist Bio',
      href: '/who',
      icon: Users,
    },
    {
      number: 4,
      type: 'LISTEN' as const,
      title: slot4Track?.title || 'Studio Session A',
      subtitle: slot4Track ? `${slot4Track.artist} · ${slot4Track.label}` : 'GPMC Catalog',
      track: slot4Track,
      icon: Play,
    },
    {
      number: 5,
      type: 'READ' as const,
      title: 'The SHIPS Engine',
      subtitle: 'Business / Sponsorship',
      href: '/ships',
      icon: Anchor,
    },
  ];

  return (
    <section className="w-full py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-[#D4A017] mb-1 tracking-wider">FEATURED PLAYLISTS</h2>
        <p className="text-xs text-[#C8A882]/60 mb-6">5-Slot FP Grid · A-B-A-B-A · Legacy & Product</p>

        <div className="grid grid-cols-5 gap-3">
          {slots.map((slot) => {
            const IconComponent = slot.icon;
            const isPlaying = playingSlot === slot.number;

            if (slot.type === 'READ' && slot.href) {
              return (
                <Link
                  key={slot.number}
                  href={slot.href}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-xl 
                    bg-[#2a1f0f] hover:bg-[#3a2a15] border border-[#D4A017]/10 
                    hover:border-[#D4A017]/40 transition-all hover:scale-105`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center group-hover:bg-[#D4A017]/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-[#D4A017]" />
                  </div>
                  <span className="text-xs font-semibold text-[#FFF8E1] text-center leading-tight">{slot.title}</span>
                  <span className="text-[10px] text-[#C8A882]/50 uppercase tracking-wide">READ</span>
                </Link>
              );
            }

            if (slot.type === 'LISTEN' && slot.track) {
              return (
                <button
                  key={slot.number}
                  onClick={() => playAudio(slot.track!, slot.number)}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-xl 
                    border transition-all hover:scale-105
                    ${isPlaying 
                      ? 'bg-[#D4A017]/20 border-[#D4A017]/50 ring-1 ring-[#D4A017]/30' 
                      : 'bg-[#1a120a] hover:bg-[#2a1a0f] border-[#D4A017]/10 hover:border-[#D4A017]/40'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${isPlaying ? 'bg-[#D4A017]/30' : 'bg-[#D4A017]/10 group-hover:bg-[#D4A017]/20'}`}>
                    <IconComponent className="w-5 h-5 text-[#D4A017]" />
                  </div>
                  <span className="text-xs font-semibold text-[#FFF8E1] text-center leading-tight">{slot.title}</span>
                  <span className="text-[10px] text-[#C8A882]/50 text-center">{slot.subtitle}</span>
                  <span className="text-[10px] text-[#D4A017]/60 uppercase tracking-wide">{isPlaying ? 'PLAYING' : 'LISTEN'}</span>
                </button>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}
