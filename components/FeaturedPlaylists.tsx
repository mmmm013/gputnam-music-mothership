'use client';
import { useState, useEffect } from 'react';
import { Play, BookOpen, Music, Users, Anchor, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- CONFIGURATION ---
const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

// --- THE AUDIO & MOOD REGISTRY ---
// Each track now carries a 'moodColor' property.
const audioRegistry = [
  { 
    filename: "kleigh.mp3", 
    title: "Bought Into Your Game", 
    artist: "Kleigh", 
    type: "GPMC LEGACY",
    moodColor: "#DAA520" // Goldenrod (Legacy Mood)
  },
  { 
    filename: "scherer.mp3", 
    title: "Featured Composition", 
    artist: "GPM & Michael Scherer", 
    type: "CO-COPYRIGHT",
    moodColor: "#CD853F" // Peru (Collaborator Mood)
  },
  { 
    filename: "nelson.mp3", 
    title: "Signature Sound", 
    artist: "GPM & Erik W Nelson", 
    type: "CO-COPYRIGHT",
    moodColor: "#A0522D" // Sienna (Collaborator Mood)
  },
  { 
    filename: "first-note.mp3", 
    title: "The First Note (Theme)", 
    artist: "G Putnam Music", 
    type: "SONIC BRAND",
    moodColor: "#8B4513" // Saddle Brown (Brand Mood)
  }
];

export default function FeaturedPlaylists() {
  const router = useRouter();
  const [rotatedTracks, setRotatedTracks] = useState<any[]>([]);
  const [activeMood, setActiveMood] = useState("#8B4513"); // Default Brand Color

  // --- THE ENGINE: SHUFFLE & DEAL ---
  useEffect(() => {
    // Randomize the tracks on load
    const shuffled = [...audioRegistry].sort(() => 0.5 - Math.random());
    setRotatedTracks(shuffled);
    
    // Set initial mood based on the first track in the slot
    if (shuffled[0]) {
      setActiveMood(shuffled[0].moodColor);
    }
  }, []);

  const slot2_Track = rotatedTracks[0] || audioRegistry[3];
  const slot4_Track = rotatedTracks[1] || audioRegistry[0];

  const handleInteract = (item: any) => {
    if (item.isLink) {
      router.push(item.url);
    } else {
      // 1. UPDATE MOOD INSTANTLY
      if (item.moodColor) setActiveMood(item.moodColor);

      // 2. PLAY AUDIO
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

  // --- THE GRID (Dynamic Colors) ---
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
      // SLOT 2: DYNAMIC AUDIO
      title: slot2_Track.title, 
      subtitle: slot2_Track.artist,
      type: slot2_Track.type, 
      filename: slot2_Track.filename,
      moodColor: slot2_Track.moodColor,
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
      // SLOT 4: DYNAMIC AUDIO
      title: slot4_Track.title, 
      subtitle: slot4_Track.artist,
      type: slot4_Track.type, 
      filename: slot4_Track.filename,
      moodColor: slot4_Track.moodColor,
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
      {/* HEADER: Reacts to Active Mood */}
      <div className="flex items-center justify-between mb-8 border-b pb-4 transition-colors duration-700" 
           style={{ borderColor: `${activeMood}33` }}>
        <h2 className="text-3xl font-black uppercase transition-colors duration-700" 
            style={{ color: activeMood }}>
          GPMC Universal Rotation
        </h2>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 transition-colors duration-700"
             style={{ color: activeMood }}>
           <RefreshCw size={14} /> Live Moods
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {gridItems.map((item) => (
          <div key={item.id} 
               onClick={() => handleInteract(item)}
               className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full min-h-[220px]">
            
            <div>
              {/* ICON: Reacts to Individual Mood if active, or Active Mood */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white transition-colors duration-500"
                   style={{ backgroundColor: activeMood }}>
                {item.icon}
              </div>
              
              <h3 className="text-lg font-bold mb-1 group-hover:opacity-80 transition leading-tight"
                  style={{ color: activeMood }}>
                {item.title}
              </h3>
              <p className="text-xs opacity-60 mb-2" style={{ color: activeMood }}>
                {item.subtitle}
              </p>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {item.type}
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition duration-300"
                 style={{ color: activeMood }}>
               {item.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
