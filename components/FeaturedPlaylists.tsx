'use client';
import { useState, useEffect } from 'react';
import { Play, Music, Radio, Mic2, Guitar } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// SUPABASE CLIENT (Client-Side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

export default function FeaturedPlaylists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaylists() {
      // FETCH DISTINCT PLAYLISTS (The 12 BPs)
      // We group by playlist_name to get the headers
      const { data, error } = await supabase
        .from('tracks')
        .select('playlist_name, artist, title, filename')
        .not('playlist_name', 'is', null)
        .order('playlist_name');

      if (data) {
        // Group tracks by playlist name to create "Cards"
        const grouped = data.reduce((acc: any, track: any) => {
          if (!acc[track.playlist_name]) {
            acc[track.playlist_name] = track; // Keep one representative track per playlist
          }
          return acc;
        }, {});
        setPlaylists(Object.values(grouped));
      }
      setLoading(false);
    }
    fetchPlaylists();
  }, []);

  const playTrack = (track: any) => {
    if (!track?.filename) return;
    // SIX SIGMA LINK CONSTRUCTION
    const fullUrl = `${BUCKET_URL}/${track.filename}`;
    
    console.log(`[PLAYER] Loading BP: ${track.playlist_name} -> ${fullUrl}`);
    
    window.dispatchEvent(new CustomEvent('play-track', { 
        detail: { 
          url: fullUrl, 
          title: track.title, 
          artist: track.artist, 
          moodTheme: { primary: "#A0522D" } // SIENNA BROWN
        } 
    }));
  };

  return (
    <section id="featured" className="py-16 bg-[#F5DEB3]/20"> 
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 border-b border-[#D2B48C]/30 pb-4">
          <h2 className="text-3xl font-black uppercase text-[#8B4513] tracking-tight">
            GPMC Universal Rotation
          </h2>
          <span className="text-xs font-bold uppercase text-[#A0522D] tracking-widest animate-pulse">
            ● Live Mix
          </span>
        </div>

        {loading ? (
          <div className="text-center p-12 text-[#D2B48C]">Loading GPM Catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((bp, idx) => (
              <div 
                key={idx} 
                onClick={() => playTrack(bp)}
                className="group cursor-pointer bg-[#FFFDF5] rounded-sm p-6 shadow-sm border border-[#D2B48C]/40 hover:border-[#A0522D] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* ICON CONTAINER: Light Tan (Static) -> Sienna (Hover) */}
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center transition-colors duration-300 bg-[#D2B48C] text-[#FFFDF5] group-hover:bg-[#A0522D]">
                  <Play size={20} fill="currentColor" className="ml-1" />
                </div>

                <h3 className="text-lg font-bold text-[#5D4037] group-hover:text-[#A0522D] transition-colors leading-tight mb-1">
                  {bp.playlist_name}
                </h3>
                <p className="text-xs font-serif italic text-[#D2B48C] group-hover:text-[#8B4513]">
                  {bp.artist}
                </p>
                
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D2B48C]/60 group-hover:text-[#A0522D]">
                  <span>Stream BP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
