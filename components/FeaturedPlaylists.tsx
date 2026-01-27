'use client';
import { useState, useEffect } from 'react';
import { Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// SAFETY CHECK: Are the keys even here?
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const BUCKET_URL = "https://eajwgr0vvkhfmwfiotpm.supabase.co/storage/v1/object/public/tracks";

export default function FeaturedPlaylists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [status, setStatus] = useState('INITIALIZING');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchPlaylists();
  }, []);

  async function fetchPlaylists() {
    // 1. CHECK KEYS
    if (!supabase) {
      setStatus('CRITICAL FAILURE');
      setErrorMsg('MISSING API KEYS. Check Vercel Environment Variables.');
      return;
    }

    setStatus('CONNECTING TO DB...');

    try {
      // 2. FETCH MOOD CONFIGS
      const { data: configs, error: configError } = await supabase
        .from('featured_playlists_config')
        .select('*')
        .not('display_name', 'is', null)
        .order('sort_order');

      if (configError) {
        setStatus('DB ERROR');
        setErrorMsg(configError.message);
        return;
      }

      if (!configs || configs.length === 0) {
        setStatus('EMPTY');
        setErrorMsg('No mood playlists configured.');
        return;
      }

      // 3. FOR EACH MOOD CONFIG, FETCH TRACKS
      const playlistsWithTracks = [];
      
      for (const config of configs) {
        const moodName = config.display_name;
        
        // Fetch tracks that have this mood in their moods array
        const { data: tracks, error: tracksError } = await supabase
          .from('tracks')
          .select('filename, title, artist')
          .contains('moods', [moodName])
          .limit(6);

        if (!tracksError && tracks && tracks.length > 0) {
          playlistsWithTracks.push({
            display_name: config.display_name,
            icon: config.icon,
            tracks: tracks
          });
        }
      }

      if (playlistsWithTracks.length === 0) {
        setStatus('EMPTY');
        setErrorMsg('No tracks found for any mood playlists.');
        return;
      }

      setPlaylists(playlistsWithTracks);
      setStatus('SUCCESS');
    } catch (error: any) {
      setStatus('ERROR');
      setErrorMsg(error.message || 'Unknown error');
    }
  }

  const playTrack = (track: any) => {
    if (!track?.filename) return;
    const fullUrl = `${BUCKET_URL}/${track.filename}`;
    console.log(`[PLAYER] Loading track: ${track.title || track.filename} => ${fullUrl}`);
    window.dispatchEvent(new CustomEvent('play-track', {
      detail: {
        url: fullUrl,
        title: track.title,
        artist: track.artist,
        moodTheme: { primary: "#AMS220" }
      }
    }));
  };

  return (
    <section id="featured" className="py-16 bg-[#F5D0B3]/20 min-h-[400px]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#D2B48C]/30 pb-4">
          <h2 className="text-3xl font-black uppercase text-[#8B4513] tracking-tight">
            GPMC Universal Rotation
          </h2>
          <span className={`text-xs font-bold px-2 py-1 rounded ${status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            SYSTEM: {status}
          </span>
        </div>

        {/* ERROR DISPLAY */}
        {status !== 'SUCCESS' && status !== 'INITIALIZING' && (
          <div className="p-6 mt-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex items-center gap-2 mb-2 font-bold"><AlertTriangle/> DIAGNOSTIC REPORT</div>
            <p className="font-mono text-sm">{errorMsg}</p>
          </div>
        )}

        {/* SUCCESS GRID */}
        {status === 'SUCCESS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((bp, idx) => (
              <div
                key={idx}
                onClick={() => bp.tracks && bp.tracks.length > 0 && playTrack(bp.tracks[0])}
                className="group cursor-pointer bg-[#FFF5F0] rounded-sm p-6 shadow-sm border border-[#D2B48C]/40 hover:border-[#AAS220] hover:shadow-xl hover:scale-105 transition-colors duration-300 bg-[#D2B48C] text-[#FFF5F0] group"
              >
                <Play size={20} fill="currentColor" className="ml-1" />
                <h3 className="text-lg font-bold text-[#3D4037] group-hover:text-[#AA5220] transition-colors leading-tight mb-1">
                  {bp.display_name}
                </h3>
                <p className="text-xs font-serif italic text-[#D2B48C] group-hover:text-[#8B4513]">
                  {bp.tracks?.length || 0} tracks
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    );;
}
