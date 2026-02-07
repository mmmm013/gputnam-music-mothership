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
  id: string;
  name: string;
  description: string;
  mood_category: string;
  image_url: string;
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
    async function fetchGPMPix() {
      if (!supabase) {
        setStatus('CRITICAL FAILURE');
        setErrorMsg('MISSING API KEYS.');
        return;
      }

      try {
        // Step 1: Pull featured playlists from playlists table
        const { data: featuredPlaylists, error: playlistError } = await supabase
          .from('playlists')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (playlistError) throw playlistError;

        if (!featuredPlaylists || featuredPlaylists.length === 0) {
          // Fallback: try featured_playlists_config table
          const { data: configs, error: configError } = await supabase
            .from('featured_playlists_config')
            .select('*')
            .not('display_name', 'is', null)
            .order('sort_order');

          if (configError || !configs || configs.length === 0) {
            setStatus('EMPTY');
            return;
          }

          // Hydrate config-based playlists with tracks
          const hydratedConfigs = await Promise.all(
            configs.map(async (config: any) => {
              const { data: playlistTracks } = await supabase
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

              const tracks = (playlistTracks || []).map((pt: any) => ({
                track_id: pt.track_id,
                title: pt.gpm_tracks?.title || config.display_name,
                artist: pt.gpm_tracks?.artist || 'G Putnam Music',
                mp3_url: pt.gpm_tracks?.mp3_url || `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/audio/${pt.track_id}.mp3`
              }));

              return {
                id: config.id,
                name: config.display_name,
                description: '',
                mood_category: '',
                image_url: '',
                tracks
              };
            })
          );

          const activeConfigs = hydratedConfigs.filter(p => p.tracks.length > 0);
          setPlaylists(activeConfigs);
          setStatus(activeConfigs.length > 0 ? 'SUCCESS' : 'EMPTY');
          return;
        }

        // Step 2: Hydrate playlists with track data from gpm_tracks
        const hydratedPlaylists = await Promise.all(
          featuredPlaylists.map(async (playlist: any) => {
            const trackIds = playlist.track_ids || [];

            if (trackIds.length === 0) {
              return { ...playlist, tracks: [] };
            }

            const { data: tracks, error: tracksError } = await supabase
              .from('gpm_tracks')
              .select('track_id, title, artist, mp3_url, audio_url')
              .in('track_id', trackIds);

            if (tracksError) {
              return { ...playlist, tracks: [] };
            }

            const hydratedTracks = (tracks || []).map((t: any) => ({
              track_id: t.track_id,
              title: t.title || playlist.name,
              artist: t.artist || 'G Putnam Music',
              mp3_url: t.mp3_url || t.audio_url || `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/audio/${t.track_id}.mp3`
            }));

            return { ...playlist, tracks: hydratedTracks };
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

    fetchGPMPix();
  }, []);

  const playTrack = (playlist: PlaylistWithTracks) => {
    const track = playlist.tracks[0];
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

      {status === 'EMPTY' && (
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
              {playlist.name}
            </span>
            {playlist.description && (
              <span className="text-xs text-[#f5e6c8]/50">
                {playlist.description}
              </span>
            )}
            <span className="text-[10px] text-[#f5e6c8]/30">
              {playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
