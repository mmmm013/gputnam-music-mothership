'use client';

import { useState, useEffect } from 'react';
import { Play, Music } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

/**
 * FP PIX BAR - Featured Playlist Quick-Pick Buttons
 * DEPENDABILITY: Dispatches stop-all-audio before play-track
 * QUALITY: Supabase fallback queries, silent fail in production
 * SATISFACTION: Touch-friendly 44px targets, scale feedback
 * SINGLE-SONG: Ensures only ONE audio source plays at a time
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

interface FeaturedPick {
  id: number;
  display_name: string;
  icon: string;
  mood_tag: string;
  theme_color: string;
}

export default function FPPixBar() {
  const [picks, setPicks] = useState<FeaturedPick[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchPicks() {
      if (!supabase) return;
      try {
        const { data: configs } = await supabase
          .from('featured_playlists_config')
          .select('id, display_name, icon, mood_tag, theme_color')
          .order('sort_order')
          .limit(5);
        if (configs && configs.length > 0) {
          setPicks(configs.filter((c: any) => c.display_name));
          setReady(true);
        }
      } catch {
        // Silent fail in production
      }
    }
    fetchPicks();
  }, []);

  const handlePickClick = async (pick: FeaturedPick) => {
    if (!supabase) return;
    try {
      const moodTag = pick.mood_tag || pick.display_name;
      const { data: tracks } = await supabase
        .from('gpm_tracks')
        .select('*')
        .not('audio_url', 'is', null)
        .neq('audio_url', 'EMPTY')
        .neq('audio_url', '')
        .not('audio_url', 'like', '%placeholder%')
        .ilike('mood', `%${moodTag}%`)
        .limit(10);

      let finalTracks = tracks || [];

      if (finalTracks.length === 0) {
        const { data: fallback } = await supabase
          .from('gpm_tracks')
          .select('*')
          .not('audio_url', 'is', null)
          .neq('audio_url', 'EMPTY')
          .neq('audio_url', '')
          .not('audio_url', 'like', '%placeholder%')
          .limit(10);
        finalTracks = fallback || [];
      }

      if (finalTracks.length > 0) {
        const randomIdx = Math.floor(Math.random() * finalTracks.length);
        const track = finalTracks[randomIdx];

        // SINGLE-SONG: Stop ALL other audio sources first
        window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { source: 'pix' } }));

        // Then tell GlobalPlayer to load and play this track
        window.dispatchEvent(new CustomEvent('play-track', {
          detail: {
            url: track.audio_url || track.mp3_url,
            title: track.title || 'Unknown Track',
            vocalist: track.artist || 'G Putnam Music',
            moodTheme: { primary: pick.theme_color || '#D4A017' }
          }
        }));
      }
    } catch {
      // Silent fail in production
    }
  };

  if (!ready || picks.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-2 overflow-x-auto" role="navigation" aria-label="Featured Playlist Picks">
      <div className="flex items-center gap-1 flex-shrink-0">
        <Music className="w-3.5 h-3.5 text-[#D4A017]" />
        <span className="text-[10px] font-bold text-[#D4A017] tracking-wider">FP PIX</span>
      </div>

      {/* MOBILE FIX: 44px min-h touch targets, active:scale-95 feedback */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {picks.slice(0, 5).map((pick) => (
          <button
            key={pick.id}
            onClick={() => handlePickClick(pick)}
            className="group flex items-center gap-1.5 px-3 min-h-[44px] rounded-full bg-[#2a1f0f] hover:bg-[#D4A017]/20 border border-[#D4A017]/10 hover:border-[#D4A017]/40 transition-all hover:scale-105 active:scale-95"
            title={pick.mood_tag || pick.display_name}
            aria-label={`Play ${pick.display_name} playlist`}
          >
            {pick.icon && (
              <span className="text-base">{pick.icon}</span>
            )}
            <span className="text-xs text-[#D4A017]/80 group-hover:text-[#D4A017] whitespace-nowrap font-medium">
              {pick.display_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
