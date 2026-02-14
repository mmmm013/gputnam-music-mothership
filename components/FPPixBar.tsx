'use client';
import { useState, useEffect } from 'react';
import { Play, Music } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

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
    <div className="w-full pb-24 bg-[#1a1206]/90 border-t border-[#D4A017]/20 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-[#D4A017]/60 uppercase tracking-widest shrink-0">
            FP PIX
          </span>
          {/* MOBILE FIX: 44px min-h touch targets, active:scale-95 feedback */}
          <div className="flex flex-wrap gap-2 justify-center flex-1">
            {picks.slice(0, 5).map((pick) => (
              <button
                key={pick.id}
                onClick={() => handlePickClick(pick)}
                className="group flex items-center gap-1.5 px-3 min-h-[44px] rounded-full bg-[#2a1f0f] hover:bg-[#D4A017]/20 border border-[#D4A017]/10 hover:border-[#D4A017]/40 transition-all hover:scale-105 active:scale-95"
                title={pick.mood_tag || pick.display_name}
                aria-label={`Play ${pick.display_name} playlist`}
              >
                {pick.icon && (
                  <span className="text-sm">{pick.icon}</span>
                )}
                <span className="text-xs font-bold text-[#f5e6c8]/80 group-hover:text-[#D4A017] uppercase">
                  {pick.display_name}
                </span>
                <Play className="w-3 h-3 text-[#f5e6c8]/30 group-hover:text-[#D4A017] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
