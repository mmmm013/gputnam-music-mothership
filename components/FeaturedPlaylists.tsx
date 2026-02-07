'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// Supabase storage base for audio files
const AUDIO_STORAGE_BASE = 'https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/audio';

interface FeaturedPick {
  id: number;
  display_name: string;
  title: string;
  artist: string;
  filename: string;
  icon: string;
  mood_tag: string;
  theme_color: string;
}

export default function FeaturedPlaylists() {
  const [picks, setPicks] = useState<FeaturedPick[]>([]);
  const [status, setStatus] = useState('INITIALIZING');
  const [errorMsg, setErrorMsg] = useState('');
  const [activePick, setActivePick] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGPMPix() {
      if (!supabase) {
        setStatus('CRITICAL FAILURE');
        setErrorMsg('MISSING API KEYS.');
        return;
      }

      try {
        const { data: configs, error: configError } = await supabase
          .from('featured_playlists_config')
          .select('*')
          .order('sort_order');

        if (configError) throw configError;

        if (!configs || configs.length === 0) {
          setStatus('EMPTY');
          return;
        }

        // Each config IS a featured pick with its own audio
        const validPicks = configs.filter((c: any) => c.display_name && c.filename);
        setPicks(validPicks);
        setStatus(validPicks.length > 0 ? 'SUCCESS' : 'EMPTY');
      } catch (err: any) {
        setStatus('DB ERROR');
        setErrorMsg(err.message);
      }
    }

    fetchGPMPix();
  }, []);

  const playPick = (pick: FeaturedPick) => {
    setActivePick(pick.id);
    const audioUrl = `${AUDIO_STORAGE_BASE}/${pick.filename}`;
    window.dispatchEvent(new CustomEvent('play-track', {
      detail: {
        url: audioUrl,
        title: pick.title || pick.display_name,
        artist: pick.artist || 'G Putnam Music',
        moodTheme: { primary: pick.theme_color || '#D4A017' }
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-[#D4A017] uppercase tracking-wide">
          GPM PIX
        </h2>
        <span className={`text-xs font-mono px-2 py-1 rounded ${
          status === 'SUCCESS' ? 'bg-green-900/50 text-green-400' :
          status === 'EMPTY' ? 'bg-yellow-900/50 text-yellow-400' :
          status === 'INITIALIZING' ? 'bg-blue-900/50 text-blue-400' :
          'bg-red-900/50 text-red-400'
        }`}>
          {status}
        </span>
      </div>

      <hr className="border-[#D4A017]/30 mb-6" />

      {errorMsg && (
        <div className="flex items-center gap-2 text-red-400 mb-4">
          <AlertTriangle size={16} />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      {status === 'EMPTY' && (
        <p className="text-[#f5e6c8]/50 text-sm text-center py-4">
          Featured playlists loading soon...
        </p>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        {picks.map((pick) => (
          <button
            key={pick.id}
            onClick={() => playPick(pick)}
            className={`group flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:scale-105 ${
              activePick === pick.id
                ? 'bg-[#D4A017]/20 ring-1 ring-[#D4A017]/50'
                : 'bg-[#2a1f0f] hover:bg-[#3a2a15]'
            }`}
          >
            {pick.icon && (
              <span className="text-2xl">{pick.icon}</span>
            )}
            <span className={`text-sm font-black uppercase transition-colors ${
              activePick === pick.id
                ? 'text-[#D4A017]'
                : 'text-[#f5e6c8]/80 group-hover:text-[#D4A017]'
            }`}>
              {pick.display_name}
            </span>
            {pick.mood_tag && (
              <span className="text-[10px] text-[#f5e6c8]/30">
                {pick.mood_tag}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
