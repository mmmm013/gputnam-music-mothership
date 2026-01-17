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

const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

export default function FeaturedPlaylists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [status, setStatus] = useState('INITIALIZING');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchPlaylists() {
      // 1. CHECK KEYS
      if (!supabase) {
        setStatus('CRITICAL FAILURE');
        setErrorMsg('MISSING API KEYS. Check Vercel Environment Variables.');
        return;
      }

      setStatus('CONNECTING TO DB...');
      
      // 2. FETCH DATA
      const { data, error } = await supabase
        .from('tracks')
        .select('playlist_name, artist, title, filename')
        .not('playlist_name', 'is', null)
        .order('playlist_name');

      // 3. HANDLE RESULTS
      if (error) {
        setStatus('DB ERROR');
        setErrorMsg(error.message);
      } else if (data && data.length > 0) {
        setStatus('SUCCESS');
        // Group tracks
        const grouped = data.reduce((acc: any, track: any) => {
          if (!acc[track.playlist_name]) {
            acc[track.playlist_name] = track;
          }
          return acc;
        }, {});
        setPlaylists(Object.values(grouped));
      } else {
        setStatus('EMPTY');
        setErrorMsg('Database connected, but returned 0 records. (Did SQL run?)');
      }
    }
    fetchPlaylists();
  }, []);

  const playTrack = (track: any) => {
    if (!track?.filename) return;
    const fullUrl = `${BUCKET_URL}/${track.filename}`;
    console.log(`[PLAYER] Loading BP: ${track.playlist_name} -> ${fullUrl}`);
    window.dispatchEvent(new CustomEvent('play-track', { 
        detail: { 
          url: fullUrl, 
          title: track.title, 
          artist: track.artist, 
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
          {/* DIAGNOSTIC BADGE */}
          <span className={`text-xs font-bold px-2 py-1 rounded ${status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            SYSTEM: {status}
          </span>
        </div>

        {/* ERROR DISPLAY */}
        {status !== 'SUCCESS' && status !== 'INITIALIZING' && (
             <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700">
                <div className="flex items-center gap-2 mb-2 font-bold"><AlertTriangle/> DIAGNOSTIC REPORT:</div>
                <p className="font-mono text-sm">{errorMsg}</p>
             </div>
        )}

        {/* SUCCESS GRID */}
        {status === 'SUCCESS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((bp, idx) => (
              <div 
                key={idx} 
                onClick={() => playTrack(bp)}
                className="group cursor-pointer bg-[#FFFDF5] rounded-sm p-6 shadow-sm border border-[#D2B48C]/40 hover:border-[#A0522D] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center transition-colors duration-300 bg-[#D2B48C] text-[#FFFDF5] group-hover:bg-[#A0522D]">
                  <Play size={20} fill="currentColor" className="ml-1" />
                </div>
                <h3 className="text-lg font-bold text-[#5D4037] group-hover:text-[#A0522D] transition-colors leading-tight mb-1">
                  {bp.playlist_name}
                </h3>
                <p className="text-xs font-serif italic text-[#D2B48C] group-hover:text-[#8B4513]">
                  {bp.artist}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
