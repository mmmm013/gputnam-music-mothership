'use client';
import { useState, useEffect } from 'react';
import { Play, AlertTriangle, Music } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

interface PlaylistWithTracks {
  id: number;
  view_name: string;
  display_name: string;
  icon: string;
  mood_tag: string;
  tracks: Array<{
    track_id: string;
    title: string;
    artist: string;
    filename?: string;
        mp3_url?: string;
  }>;
}

export default function FeaturedPlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([]);
  const [status, setStatus] = useState('INITIALIZING');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchPlaylists() {
      if (!supabase) {
        setStatus('CRITICAL FAILURE');
        setErrorMsg('MISSING API KEYS. Check environment variables.');
        return;
      }

      setStatus('CONNECTING TO DB...');
      
      try {
        // Step 1: Get playlist configs
        const { data: configs, error: configError } = await supabase
          .from('featured_playlists_config')
          .select('*')
          .not('display_name', 'is', null)
          .order('sort_order');

        if (configError) throw configError;
        if (!configs || configs.length === 0) {
          setStatus('EMPTY');
          setErrorMsg('No featured playlists configured.');
          return;
        }

        // Step 2: For each config, get the actual playlist and its tracks
        const playlistsWithTracks = await Promise.all(
      const playlistsWithTracks = await Promise.all(
      configs.map(async (config) => {
        // Directly get tracks using config.id (which matches playlist_id in featured_playlist_tracks)
        const { data: playlistTracks, error: tracksError } = await supabase
          .from('featured_playlist_tracks')
          .select('uuid, storage_path, sort_order')
          .eq('playlist_id', config.id)
          .order('sort_order');

        if (tracksError) {
          console.error(`[FeaturedPlaylists] Error fetching tracks for ${config.display_name}:`, tracksError);
          return { ...config, tracks: [] };
        }

        // Map tracks to expected format with full audio URLs
        const tracks = (playlistTracks || []).map((pt: any) => ({
          track_id: pt.uuid,
          title: config.display_name, // Use playlist name as track title for now
          artist: 'G Putnam Music',
          mp3_url: `https://enjqymuvxtisamlotpm.supabase.co/storage/v1/object/public/audio/${pt.storage_path}`
        }));

        console.log(`[FeaturedPlaylists] Loaded ${tracks.length} tracks for ${config.display_name}`);

        return {
          ...config,
          tracks: tracks
        };
      })
    );              ...config,
                tracks: directTracks?.map((t: any) => ({
                  track_id: t.tracks?.track_id || t.track_id,
                  title: t.tracks?.title || 'Unknown',
                  artist: t.tracks?.artist || 'G Putnam Music',
                })) || []
              };
            }

            // Get tracks for this playlist
const { data: playlistTracks } = await supabase
        .from('featured_playlist_tracks')
        .select(`
          track_id,
          gpm_tracks (
            track_id,
            title,
            artist,
            mp3_url
          )
        `)
        .eq('playlist_id', playlist.id)        .limit(20);              return {
          ...config,
tracks: playlistTracks?.map((pt: any) => ({
        track_id: pt.gpm_tracks?.track_id || pt.track_id,
        title: pt.gpm_tracks?.title || 'Unknown',
        artist: pt.gpm_tracks?.artist || 'G Putnam Music',
        mp3_url: pt.gpm_tracks?.mp3_url,
      })) || []              })) || []
            };
          })
        );

        setPlaylists(playlistsWithTracks.filter(p => p.tracks.length > 0));
        setStatus(playlistsWithTracks.filter(p => p.tracks.length > 0).length > 0 ? 'SUCCESS' : 'NO_TRACKS');
        
        if (playlistsWithTracks.filter(p => p.tracks.length > 0).length === 0) {
          setErrorMsg('Playlists found but no tracks available.');
        }
      } catch (err: any) {
        setStatus('DB ERROR');
        setErrorMsg(err.message || 'Unknown database error');
        console.error('[FeaturedPlaylists] Error:', err);
      }
    }
    
    fetchPlaylists();
  }, []);

  const playTrack = (playlist: PlaylistWithTracks) => {
    if (!playlist.tracks || playlist.tracks.length === 0) {
      console.error('[PLAYER] No tracks in playlist:', playlist.display_name);
      return;
    }

    const track = playlist.tracks[0]; // Play first track
    
    // Try multiple audio URL strategies
    // 1. Local public assets (for development)
    const localUrl = `/assets/${track.title}.mp3`.replace(/\s+/g, ' ');
    
    // 2. Supabase storage
    const storageUrl = `https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/audio/${track.track_id}.mp3`; 
    const audioUrl = track.mp3_url || storageUrl
    console.log(`[PLAYER] Playing: ${track.title} by ${track.artist}`);
    console.log(`[PLAYER] Audio URL: ${audioUrl}`);
    
    window.dispatchEvent(new CustomEvent('play-track', { 
      detail: { 
        url: audioUrl, 
        title: track.title, 
        artist: track.artist || 'G Putnam Music',
        moodTheme: { primary: "#A0522D" }
      } 
    }));
  };

  return (
    <section id="featured" className="py-16 bg-[#F5DEB3]/20 min-h-[400px]"> 
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 border-b border-[#D2B48C]/30 pb-4">
          <h2 className="text-3xl font-black uppercase text-[#8B4513] tracking-tight">
            GPMC Universal Rotation
          </h2>
          <span className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
            status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
            status === 'INITIALIZING' ? 'bg-blue-100 text-blue-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        </div>

        {/* Error Display */}
        {errorMsg && status !== 'SUCCESS' && (
          <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 mb-6">
            <div className="flex items-center gap-2 mb-2 font-bold">
              <AlertTriangle size={20} /> DIAGNOSTIC:
            </div>
            <p className="font-mono text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Playlist Grid */}
        {status === 'SUCCESS' && playlists.length > 0 && (
      <div className="flex flex-wrap gap-4 justify-center items-center pc-4 py-8">        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => playTrack(playlist)}
            className="px-4 py-2 text-lg font-bold transition-all duration-300 hover:scale-110 hover:underline cursor-pointer rounded"
            style={{ color: getFeelingColor(playlist.display_name) }}
          >
            {playlist.display_name}
          </button>
        ))}
      </div>          </div>
        )}

        {/* Loading State */}
        {status === 'INITIALIZING' && (
          <div className="text-center py-12 text-[#8B4513] opacity-60">
            Loading playlists...
          </div>
        )}
      </div>
    </section>
  );
}
