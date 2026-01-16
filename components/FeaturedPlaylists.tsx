'use client';
import { useState, useEffect } from 'react';
import { Play, BookOpen, Music, Users, Anchor, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 1. SINGLE SOURCE OF TRUTH: The 'tracks' Bucket
// We have updated all paths to point to /tracks/ instead of /songs/
const BASE_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

const trackLibrary = [
  {
    artist: "Kleigh",
    title: "Bought Into Your Game",
    url: `${BASE_URL}/038 - kleigh - bought into your game.mp3`,
    type: "GPMC LEGACY"
  },
  {
    artist: "GPM & Michael Scherer",
    title: "Featured Composition",
    url: `${BASE_URL}/scherer-feature.mp3`,
    type: "CO-COPYRIGHT"
  },
  {
    artist: "GPM & Erik W Nelson",
    title: "Signature Sound",
    url: `${BASE_URL}/nelson-feature.mp3`,
    type: "CO-COPYRIGHT"
  },
  {
    artist: "G Putnam Music",
    title: "The First Note",
    url: `${BASE_URL}/first-note.mp3`,
    type: "SONIC BRAND"
  }
];

export default function FeaturedPlaylists() {
  const router = useRouter();
  const [rotatedTracks, setRotatedTracks] = useState<any[]>([]);

  // 2. THE ROTATION ENGINE
  useEffect(() => {
    // Shuffle the library on load
    const shuffled = [...trackLibrary].sort(() => 0.5 - Math.random());
    setRotatedTracks(shuffled);
  }, []);

  // Default fallbacks
  const slot2 = rotatedTracks[0] || trackLibrary[3];
  const slot4 = rotatedTracks[1] || trackLibrary[0];

  const handleInteract = (item: any) => {
    if (item.isLink) {
      router.push(item.url);
    } else {
      const event = new CustomEvent('play-track', { 
        detail: { url: item.url, title: item.title, type: item.type } 
      });
      window.dispatchEvent(event);
    }
  };

  // 3. THE 5-SLOT UNIVERSAL GRID
  const playlists = [
    { 
      id: 1, 
      title: "Grandpa's Story", 
      subtitle: "The Okinawa Legacy",
      type: "HERO LEGACY", 
      action: "READ STORY",
      icon: <BookOpen size={24} />,
      isLink: true,
      url: "/heroes" 
    },
    { 
      id: 2, 
      title: slot2.title, 
      subtitle: slot2.artist,
      type: slot2.type, 
      action: "PLAY NOW",
      icon: <Music size={24} />,
      isLink: false,
      url: slot2.url
    },
    { 
      id: 3, 
      title: "Who is G Putnam Music", 
      subtitle: "The Origin Story",
      type: "ARTIST BIO", 
      action: "DISCOVER",
      icon: <Users size={24} />,
      isLink: true,
      url: "/who"
    },
    { 
      id: 4, 
      title: slot4.title, 
      subtitle: slot4.artist,
      type: slot4.type, 
      action: "PLAY NOW",
      icon: <Play size={24} />,
      isLink: false,
      url: slot4.url
    },
    { 
      id: 5, 
      title: "The SHIPS Engine", 
      subtitle: "Sponsorship Model",
      type: "BUSINESS", 
      action: "LEARN MORE",
      icon: <Anchor size={24} />,
      isLink: true,
      url: "/ships" 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 border-b border-[#8B4513]/20 pb-4">
        <h2 className="text-3xl font-black uppercase text-[#8B4513]">
          GPMC Universal Rotation
        </h2>
        <div className="flex items-center gap-2 text-[#8B4513] text-xs font-bold uppercase tracking-widest opacity-60">
           <RefreshCw size={14} /> Live Mix
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {playlists.map((fp) => (
          <div key={fp.id} 
               onClick={() => handleInteract(fp)}
               className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full min-h-[220px]">
            
            <div>
              <div className="bg-[#FFD54F] w-12 h-12 rounded-full flex items-center justify-center text-[#2C241B] mb-4 group-hover:bg-[#8B4513] group-hover:text-white transition">
                {fp.icon}
              </div>
              
              <h3 className="text-lg font-bold mb-1 group-hover:text-[#8B4513] transition leading-tight">
                {fp.title}
              </h3>
              <p className="text-xs text-[#8B4513]/60 mb-2">{fp.subtitle}</p>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{fp.type}</div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition text-[#8B4513]">
               {fp.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
