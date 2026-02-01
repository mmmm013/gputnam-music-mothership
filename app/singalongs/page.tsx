'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Heart, Star, BookOpen, Sun, Moon, Music } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// SAFETY CHECK: Are the keys even here?
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

export default function Singalongs() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // THE LOGIC: Fetch from SHARED CATALOG, but Filter for THIS BRAND
  async function playMood(moodTag: string) {
    if (activeMood === moodTag && isPlaying) {
      // Pause if clicking same mood
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setLoading(true);
    setActiveMood(moodTag);

    // FETCH FROM MASTER GPM VAULT
    let supaData = null;
    if (supabase) {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .ilike('tags', `%${moodTag}%`) // Filter by the mood
        .limit(1); // Grab one to start (Radio Mode)
      supaData = data;
    } else {
      console.error('Supabase not initialized - missing environment variables');
    }

    // ALSO MERGE IN LOCAL AWESOME SQUAD TRACKS (public/handoff/awesome-squad.json)
    let localData: any[] = []
    try {
      const res = await fetch('/handoff/awesome-squad.json')
      if (res.ok) localData = await res.json()
    } catch (e) {
      console.warn('No local Awesome Squad data', e)
    }

    const merged = [] as any[]
    if (supaData && supaData.length > 0) merged.push(...supaData)
    // append all local items (dedupe by public_url/name)
    for (const it of localData) {
      // normalize to match supabase track shape used elsewhere
      const t = {
        id: it.id,
        name: it.title,
        artist: it.artist,
        public_url: it.public_url,
        tags: (it.tags || []).join(','),
        _local: true
      }
      // avoid duplicates by public_url
      if (!merged.find(m => m.public_url === t.public_url)) merged.push(t)
    }

    if (merged.length > 0) {
      const track = merged[0]
      setCurrentTrack(track)
      setIsPlaying(true)
      setLoading(false)
    } else {
      console.log('No tracks found for this mood in GPM Catalog or local Awesome Squad list');
      setLoading(false);
    }
  }

  // CLEANER FOR DISPLAY
  const cleanTitle = (text: string) => {
    if (!text) return 'Select a Vibe...';
    return text.replace(/^\d+\s*-\s*/, '')
      .replace(/g\s*putnam\s*music\s*-\s*/i, '')
      .replace(/\.mp3|\.wav/gi, '')
      .replace(/_/g, ' ');
  };

  return (
    // BRANDING: BLUE IDENTITY (#F0F8FF)
    <main className="min-h-screen bg-[#F0F8FF] text-[#3E2723] font-sans selection:bg-[#FF7043] selection:text-white px-8 pb-32">
      <h1 className="pt-12 text-5xl font-bold mb-2">
        <span className="text-3xl font-bold text-white mb-2">HEROES</span>
      </h1>
      <span className="text-amber-500 text-sm tracking-widest uppercase">/ Because They Could</span>

      {/* SHARED AUDIO ENGINE */}
      <audio
        ref={audioRef}
        src={currentTrack?.public_url}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* NOW PLAYING CARD */}
      {currentTrack && (
        <div className="mt-8 p-6 border-l-4 border-blue-400 bg-white shadow-md rounded">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl">{cleanTitle(currentTrack.name)}</h2>
              <p className="text-sm text-slate-600">{currentTrack.artist || 'G Putnam Music'}</p>
            </div>
            <button
              onClick={() => (isPlaying ? audioRef.current?.pause() : audioRef.current?.play())}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>
      )}

      {/* MOOD GRID */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
        {['melancholy', 'dreamy', 'focus', 'uplifting', 'high-energy', 'late-night'].map(mood => (
          <button
            key={mood}
            onClick={() => playMood(mood)}
            className={`p-6 rounded border-2 transition-all ${
              activeMood === mood
                ? 'bg-blue-400 text-white border-blue-400'
                : 'border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Music size={28} />
            <p className="mt-2 text-xs uppercase tracking-[0.2em]">{mood}</p>
          </button>
        ))}
      </div>

      {loading && <p className="mt-4 text-center text-sm text-slate-500">Loading...</p>}
    </main>
  );
}
