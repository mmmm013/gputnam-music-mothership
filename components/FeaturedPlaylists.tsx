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

  useEffect(() => {
    async function fetchGPMCNutrition() {
      if (!supabase) {
        setStatus('CRITICAL FAILURE');
        setErrorMsg('MISSING API KEYS.');
        return;
      }

      try {
        // Step 1: Pull the Fleet Config
        const { data: configs, error: configError } = await supabase
          .from('featured_playlists_config')
          .select('*')
          .not('display_name', 'is', null)
          .order('sort_order');

        if (configError) throw configError;

        // Step 2: Hydrate with Tracks
        const hydratedPlaylists = await Promise.all(
          configs.map(async (config) => {
            const { data: playlistTracks, error: tracksError } = await supabase
              .from('featured_playlist_tracks')
              .select(`
                track_id,
                gpm_tracks (
                  title,
                  artist,
                  mp3_url
                )
              `)
              .eq('playlist_id', config.id);

            if (tracksError) return { ...config, tracks: [] };

            const tracks = (playlistTracks || []).map((pt: any) => ({
              track_id: pt.track_id,
              title: pt.gpm_tracks?.title || config.display_name,
              artist: pt.gpm_tracks?.artist || 'G Putnam Music',
              mp3_url: pt.gpm_tracks?.mp3_url || `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/audio/${pt.track_id}.mp3`
            }));

            return { ...config, tracks };
          })
        );

        const activeFleet = hydratedPlaylists.filter(p => p.tracks.length > 0);
        setPlaylists(activeFleet);
        setStatus(activeFleet.length > 0 ? 'SUCCESS' : 'EMPTY');
      } catch (err: any) {
        setStatus('DB ERROR');
        setErrorMsg(err.message);
      }
    }
    
    fetchGPMCNutrition();
  }, []);

  const playTrack = (playlist: PlaylistWithTracks) => {
    const track = playlist.tracks[0];
    window.dispatchEvent(new CustomEvent('play-track', { 
      detail: { 
        url: track.mp3_url, 
        title: track.title, 
        artist: track.artist,
        moodTheme: { primary: "#8B4513" } // Sovereign Amber
      } 
    }));
  };

  const getFeelingColor = (name: string) => {
    if (name.includes('K-kUpId')) return '#FF0000'; // High Intensity Red
    return '#8B4513'; // Standard Sovereign Amber
  };

  return (
    <section id="featured" className="py-16 bg-[#F5DEB3]/10"> 
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 border-b border-[#D2B48C]/30 pb-4">
          <h2 className="text-3xl font-black uppercase text-[#8B4513] tracking-tight">
            GPMC Universal Rotation
          </h2>
          <span className="text-xs font-bold px-2 py-1 bg-[#8B4513] text-white rounded">
            {status}
          </span>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 mb-6 font-mono text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-wrap gap-6 justify-center">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => playTrack(playlist)}
              className="text-2xl font-black uppercase transition-all hover:scale-110"
              style={{ color: getFeelingColor(playlist.display_name) }}
            >
              {playlist.display_name === "K-kUpId" ? "K-kUpId" : playlist.display_name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}