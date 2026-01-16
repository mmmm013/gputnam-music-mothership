'use client';
import { useState, useEffect } from 'react';
import { Play, BookOpen, Music, Users, Anchor, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- CONFIGURATION ---
const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

// --- GPMC INVENTORY (POOLS) ---
const KLEIGH_POOL = [
  { 
    filename: "038 - kleigh - bought into your game.mp3", 
    title: "Bought Into Your Game", 
    artist: "Kleigh", 
    type: "GPMC LEGACY",
    moodTheme: { primary: "#A0522D", secondary: "#FFBF00" } // Sienna/Amber
  }
];

const GPM_POOL = [
  { 
    filename: "first-note.mp3", 
    title: "The First Note (Theme)", 
    artist: "G Putnam Music", 
    type: "SONIC BRAND",
    moodTheme: { primary: "#FFC107", secondary: "#F5DEB3" } // Amber/Wheat
  }
];

// --- THE MAGIC POOL ---
const COLLAB_POOL = [
  { 
    filename: "scherer-feature.mp3", 
    // CLEVER USE: "Scherer Magic" becomes the Title Identity
    title: "Scherer Magic", 
    artist: "GPM & Michael Scherer", 
    type: "CO-COPYRIGHT",
    moodTheme: { primary: "#DAA520", secondary: "#F5DEB3" } // Goldenrod ("Magic" Gold)
  },
  { 
    filename: "nelson-feature.mp3", 
    title: "Signature Sound", 
    artist: "GPM & Erik W Nelson", 
    type: "CO-COPYRIGHT", 
    moodTheme: { primary: "#DAA520", secondary: "#F5DEB3" }
  }
];

export default function FeaturedPlaylists() {
  const router = useRouter();
  const [slot2, setSlot2] = useState<any>(null);
  const [slot4, setSlot4] = useState<any>(null);
  const [activeTheme, setActiveTheme] = useState({ primary: "#FFC107", secondary: "#F5DEB3" });

  useEffect(() => {
    // 1. Kleigh in Slot 2
    const randomKleigh = KLEIGH_POOL[Math.floor(Math.random() * KLEIGH_POOL.length)];
    setSlot2(randomKleigh);

    // 2. Mix (GPM or Scherer Magic) in Slot 4
    const mixPool = [...GPM_POOL, ...COLLAB_POOL];
    const randomMix = mixPool[Math.floor(Math.random() * mixPool.length)];
    setSlot4(randomMix);
  }, []);

  const handleInteract = (item: any) => {
    if (item.isLink) {
      router.push(item.url);
    } else {
      if (item.moodTheme) setActiveTheme(item.moodTheme);
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

  const currentSlot2 = slot2 || KLEIGH_POOL[0];
  const currentSlot4 = slot4 || GPM_POOL[0];

  const gridItems = [
    { id: 1, title: "Grandpa's Story", subtitle: "The Okinawa Legacy", type: "HERO LEGACY", action: "READ STORY", icon: <BookOpen size={24} />, isLink: true, url: "/heroes" },
    { id: 2, title: currentSlot2.title, subtitle: currentSlot2.artist, type: currentSlot2.type, filename: currentSlot2.filename, moodTheme: currentSlot2.moodTheme, action: "PLAY NOW", icon: <Music size={24} />, isLink: false },
    { id: 3, title: "Who is G Putnam Music", subtitle: "The Origin Story", type: "ARTIST BIO", action: "DISCOVER", icon: <Users size={24} />, isLink: true, url: "/who" },
    { id: 4, title: currentSlot4.title, subtitle: currentSlot4.artist, type: currentSlot4.type, filename: currentSlot4.filename, moodTheme: currentSlot4.moodTheme, action: "PLAY NOW", icon: <Play size={24} />, isLink: false },
    { id: 5, title: "The SHIPS Engine", subtitle: "Sponsorship Model", type: "BUSINESS", action: "LEARN MORE", icon: <Anchor size={24} />, isLink: true, url: "/ships" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 border-b pb-4 transition-colors duration-700" style={{ borderColor: `${activeTheme.primary}44` }}>
        <h2 className="text-3xl font-black uppercase transition-colors duration-700" style={{ color: activeTheme.primary }}>GPMC Universal Rotation</h2>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 transition-colors duration-700" style={{ color: activeTheme.primary }}><RefreshCw size={14} /> Live Mix</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {gridItems.map((item) => (
          <div key={item.id} onClick={() => handleInteract(item)} className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white transition-colors duration-500" style={{ backgroundColor: activeTheme.primary }}>{item.icon}</div>
              <h3 className="text-lg font-bold mb-1 transition leading-tight" style={{ color: activeTheme.primary }}>{item.title}</h3>
              <p className="text-xs opacity-60 mb-2" style={{ color: activeTheme.primary }}>{item.subtitle}</p>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.type}</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition" style={{ color: activeTheme.primary }}>{item.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
