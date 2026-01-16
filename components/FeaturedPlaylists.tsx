'use client';
import { useState, useEffect } from 'react';
import { Play, BookOpen, Music, Users, Anchor, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- CONFIGURATION: SINGLE SOURCE OF TRUTH ---
const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

// --- THE "FIRST NOTE" PLAYLIST INVENTORY ---
// These are the 5-6 tracks that will rotate through the "Listen" slots.
// YOU MUST ENSURE THESE EXACT FILENAMES EXIST IN YOUR 'tracks' BUCKET.
const firstNotePlaylist = [
  {
    artist: "Kleigh",
    title: "Bought Into Your Game",
    filename: "038 - kleigh - bought into your game.mp3",
    type: "GPMC LEGACY"
  },
  {
    artist: "GPM & Michael Scherer",
    title: "Featured Composition",
    filename: "scherer-feature.mp3", 
    type: "CO-COPYRIGHT"
  },
  {
    artist: "GPM & Erik W Nelson",
    title: "Signature Sound",
    filename: "nelson-feature.mp3",
    type: "CO-COPYRIGHT"
  },
  {
    artist: "G Putnam Music",
    title: "The First Note (Theme)",
    filename: "first-note.mp3",
    type: "SONIC BRAND"
  },
  // Add more tracks here as your catalog grows
];

export default function FeaturedPlaylists() {
  const router = useRouter();
  const [rotatedTracks, setRotatedTracks] = useState<any[]>([]);

  // --- THE ENGINE: SHUFFLE & DEAL ---
  useEffect(() => {
    // Six Sigma: Randomize the playlist on load to ensure equal exposure distribution
    const shuffled = [...firstNotePlaylist].sort(() => 0.5 - Math.random());
    setRotatedTracks(shuffled);
  }, []);

  // Hydration safety: Default to index 0 and 1 if client hasn't loaded yet
  const slot2_Track = rotatedTracks[0] || firstNotePlaylist[0];
  const slot4_Track = rotatedTracks[1] || firstNotePlaylist[1];

  const handleInteract = (item: any) => {
    if (item.isLink) {
      router.push(item.url);
    } else {
      // Fire the Global Audio Event
      const event = new CustomEvent('play-track', { 
        detail: { 
          url: `${BUCKET_URL}/${item.filename}`, 
          title: item.title, 
          artist: item.artist,
          type: item.type 
        } 
      });
      window.dispatchEvent(event);
    }
  };

  // --- THE UNIVERSAL ROTATION GRID (A-B-A-B-A) ---
  const gridItems = [
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
      // SLOT 2: DYNAMIC LISTENER (The Sonic Handshake)
      title: slot2_Track.title, 
      subtitle: slot2_Track.artist,
      type: slot2_Track.type, 
      filename: slot2_Track.filename,
      action: "PLAY NOW",
      icon: <Music size={24} />,
      isLink: false
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
      // SLOT 4: DYNAMIC LISTENER (The Deep Dive)
      title: slot4_Track.title, 
      subtitle: slot4_Track.artist,
      type: slot4_Track.type, 
      filename: slot4_Track.filename,
      action: "PLAY NOW",
      icon: <Play size={24} />,
      isLink: false
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
        {gridItems.map((item) => (
          <div key={item.id} 
               onClick={() => handleInteract(item)}
               className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full min-h-[220px]">
            
            <div>
              <div className="bg-[#FFD54F] w-12 h-12 rounded-full flex items-center justify-center text-[#2C241B] mb-4 group-hover:bg-[#8B4513] group-hover:text-white transition">
                {item.icon}
              </div>
              
              <h3 className="text-lg font-bold mb-1 group-hover:text-[#8B4513] transition leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-[#8B4513]/60 mb-2">{item.subtitle}</p>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.type}</div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition text-[#8B4513]">
               {item.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
