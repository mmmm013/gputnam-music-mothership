'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

interface PlaylistWithTracks {
  id: number;
  display_name: string;
  tracks: Array<{
    track_id: string;
    title: string;
    artist: string;
    mp3_url: string;
  }>;
}

export default function FeaturedPlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([]);
  const [status, setStatus] = useState('INITIALIZING');
  const [errorMsg, setErrorMsg] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    async function fetchGPMPix() {
      if (!supabase) {
        setStatus('CRITICAL FAILURE');
        setErrorMsg('MISSING API KEYS.');
        return;
      }

      try {
        // Pull all configs from featured_playlists_config
        const { data: configs, error: configError } = await supabase
          .from('featured_playlists_config')
          .select('*')
          .order('sort_order');

        if (configError) {
          setDebugInfo(`Config error: ${configError.message}`);
          throw configError;
        }

        if (!configs || configs.length === 0) {
          setDebugInfo('featured_playlists_config returned 0 rows');
          setStatus('EMPTY');
          return;
        }

        // Log the columns available on first config for debugging
        const colNames = Object.keys(configs[0]).join(', ');
        setDebugInfo(`Found ${configs.length} config(s). Columns: [${colNames}]`);

        // Hydrate with tracks using track_ids array from config
        const hydratedPlaylists = await Promise.all(
          configs.map(async (config: any) => {
            const trackIds = config.track_ids || [];
            const displayName = config.display_name || config.name || `Playlist ${config.id}`;

            if (!Array.isArray(trackIds) || trackIds.length === 0) {
              return { ...config, display_name: displayName, tracks: [] };
            }

            const { data: tracks, error: tracksError } = await supabase
              .from('gpm_tracks')
              .select('track_id, title, artist, mp3_url, audio_url')
              .in('track_id', trackIds);

            if (tracksError) {
              setDebugInfo(prev => prev + ` | gpm_tracks error: ${tracksError.message}`);
              return { ...config, display_name: displayName, tracks: [] };
            }

            const hydratedTracks = (tracks || []).map((t: any) => ({
              track_id: t.track_id,
              title: t.title || displayName,
              artist: t.artist || 'G Putnam Music',
              mp3_url: t.mp3_url || t.audio_url || `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/audio/${t.track_id}.mp3`
            }));

            return { ...config, display_name: displayName, tracks: hydratedTracks };
          })
        );

        const activeFleet = hydratedPlaylists.filter(p => p.tracks.length > 0);
        setPlaylists(activeFleet);
        setStatus(activeFleet.length > 0 ? 'SUCCESS' : 'EMPTY');

        if (activeFleet.length === 0) {
          setDebugInfo(prev => prev + ` | All ${hydratedPlaylists.length} playlists had 0 hydrated tracks`);
        }
      } catch (err: any) {
        setStatus('DB ERROR');
        setErrorMsg(err.message);
      }
    }

    fetchGPMPix();
  }, []);

  const playTrack = (playlist: PlaylistWithTracks) => {
    if (playlist.tracks.length === 0) return;
    const randomIdx = Math.floor(Math.random() * playlist.tracks.length);
    const track = playlist.tracks[randomIdx];
    window.dispatchEvent(new CustomEvent('play-track', {
      detail: {
        url: track.mp3_url,
        title: track.title,
        artist: track.artist,
        moodTheme: { primary: "#D4A017" }
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

      {debugInfo && (
        <p className="text-[#f5e6c8]/30 text-xs mb-4 font-mono break-all">
          {debugInfo}
        </p>
      )}

      {status === 'EMPTY' && !debugInfo.includes('Columns:') && (
        <p className="text-[#f5e6c8]/50 text-sm text-center py-4">
          Featured playlists loading soon...
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => playTrack(playlist)}
            className="group flex flex-col items-center gap-2 p-4 rounded-lg bg-[#2a1f0f] hover:bg-[#3a2a15] transition-all hover:scale-105"
          >
            <span className="text-lg font-black uppercase text-[#D4A017] group-hover:text-[#f5e6c8] transition-colors">
              {playlist.display_name}
            </span>
            <span className="text-[10px] text-[#f5e6c8]/30">
              {playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
