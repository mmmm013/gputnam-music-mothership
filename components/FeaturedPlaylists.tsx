'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Play, Music, Disc3 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

interface FeaturedPick {
  id: number;
  display_name: string;
  view_name: string;
  gpmc_link_view_name: string;
  title: string;
  artist: string;
  filename: string;
  icon: string;
  mood_tag: string;
  theme_color: string;
  site_id: string;
  brand_key: string;
}

interface TrackItem {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  mp3_url?: string;
  mood?: string;
}

export default function FeaturedPlaylists() {
  const [picks, setPicks] = useState<FeaturedPick[]>([]);
  const [status, setStatus] = useState('INITIALIZING');
  const [errorMsg, setErrorMsg] = useState('');
  const [activePick, setActivePick] = useState<FeaturedPick | null>(null);
  const [trackList, setTrackList] = useState<TrackItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<TrackItem | null>(null);
  const [loadingTracks, setLoadingTracks] = useState(false);

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

        const validPicks = configs.filter((c: any) => c.display_name);
        setPicks(validPicks);
        setStatus(validPicks.length > 0 ? 'SUCCESS' : 'EMPTY');
      } catch (err: any) {
        setStatus('DB ERROR');
        setErrorMsg(err.message);
      }
    }
    fetchGPMPix();
  }, []);

  const loadAndPlayPick = async (pick: FeaturedPick) => {
    if (!supabase) return;
    setActivePick(pick);
    setLoadingTracks(true);
    setTrackList([]);
    setNowPlaying(null);

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
        .limit(20);

      let finalTracks = tracks || [];

      if (finalTracks.length === 0) {
        const { data: fallbackTracks } = await supabase
          .from('gpm_tracks')
          .select('*')
          .not('audio_url', 'is', null)
          .neq('audio_url', 'EMPTY')
          .neq('audio_url', '')
          .not('audio_url', 'like', '%placeholder%')
          .limit(20);
        finalTracks = fallbackTracks || [];
      }

      setTrackList(finalTracks);
      setLoadingTracks(false);

      if (finalTracks.length > 0) {
        const randomIdx = Math.floor(Math.random() * finalTracks.length);
        const track = finalTracks[randomIdx];
        playTrack(track, pick);
      }
    } catch (err) {
      console.error('[GPM PIX] Error:', err);
      setLoadingTracks(false);
    }
  };

  const playTrack = (track: TrackItem, pick?: FeaturedPick) => {
    setNowPlaying(track);
    const activeMood = pick || activePick;
    window.dispatchEvent(new CustomEvent('play-track', {
      detail: {
        url: track.audio_url || track.mp3_url,
        title: track.title || 'Unknown Track',
        artist: track.artist || 'G Putnam Music',
        moodTheme: { primary: activeMood?.theme_color || '#D4A017' }
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

      {/* PICK SELECTOR ROW */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {picks.map((pick) => (
          <button
            key={pick.id}
            onClick={() => loadAndPlayPick(pick)}
            className={`group flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:scale-105 ${
              activePick?.id === pick.id
                ? 'bg-[#D4A017]/20 ring-1 ring-[#D4A017]/50'
                : 'bg-[#2a1f0f] hover:bg-[#3a2a15]'
            }`}
          >
            {pick.icon && (
              <span className="text-2xl">{pick.icon}</span>
            )}
            <span className={`text-sm font-black uppercase transition-colors ${
              activePick?.id === pick.id
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

      {/* FP DISPLAY PANEL */}
      {activePick && (
        <div className="bg-[#2a1f0f]/80 rounded-xl p-6 border border-[#D4A017]/20">
          {/* Active Pick Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-[#D4A017]/10 flex items-center justify-center">
              {activePick.icon ? (
                <span className="text-3xl">{activePick.icon}</span>
              ) : (
                <Music className="w-8 h-8 text-[#D4A017]" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-[#D4A017] uppercase">
                {activePick.display_name}
              </h3>
              <p className="text-sm text-[#f5e6c8]/50">
                {activePick.mood_tag ? `${activePick.mood_tag} vibes` : 'Featured playlist'}
                {trackList.length > 0 && ` · ${trackList.length} tracks`}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loadingTracks && (
            <div className="flex items-center justify-center py-8">
              <Disc3 className="w-6 h-6 text-[#D4A017] animate-spin" />
              <span className="ml-2 text-[#f5e6c8]/50 text-sm">Loading tracks...</span>
            </div>
          )}

          {/* Track List */}
          {!loadingTracks && trackList.length > 0 && (
            <div className="space-y-1">
              {trackList.map((track, idx) => (
                <button
                  key={track.id || idx}
                  onClick={() => playTrack(track)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left hover:bg-[#D4A017]/10 ${
                    nowPlaying?.id === track.id
                      ? 'bg-[#D4A017]/15 ring-1 ring-[#D4A017]/30'
                      : ''
                  }`}
                >
                  <span className="text-xs text-[#f5e6c8]/30 w-6 text-right font-mono">
                    {nowPlaying?.id === track.id ? (
                      <Disc3 className="w-4 h-4 text-[#D4A017] animate-spin inline" />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <Play className={`w-4 h-4 flex-shrink-0 ${
                    nowPlaying?.id === track.id ? 'text-[#D4A017]' : 'text-[#f5e6c8]/30'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      nowPlaying?.id === track.id ? 'text-[#D4A017]' : 'text-[#f5e6c8]/90'
                    }`}>
                      {track.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-[#f5e6c8]/40 truncate">
                      {track.artist || 'G Putnam Music'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Tracks State */}
          {!loadingTracks && trackList.length === 0 && (
            <p className="text-center text-[#f5e6c8]/40 text-sm py-6">
              No tracks found for this mood. Check back soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
