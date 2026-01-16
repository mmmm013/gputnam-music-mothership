'use client';
import { useState, useEffect } from 'react';
import { Play, BookOpen, Music, Users, Anchor, RefreshCw, Cpu, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- CONFIGURATION ---
const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";

// --- AUDIO REGISTRY (MC BOT DATA) ---
const audioRegistry = [
  { filename: "kleigh.mp3", title: "Bought Into Your Game", artist: "Kleigh", type: "GPMC LEGACY" },
  { filename: "scherer.mp3", title: "Featured Composition", artist: "GPM & Michael Scherer", type: "CO-COPYRIGHT" },
  { filename: "nelson.mp3", title: "Signature Sound", artist: "GPM & Erik W Nelson", type: "CO-COPYRIGHT" },
  { filename: "first-note.mp3", title: "The First Note (Theme)", artist: "G Putnam Music", type: "SONIC BRAND" }
];

// --- LEGACY REGISTRY (LF BOT DATA) ---
const legacyQuotes = [
  { title: "Okinawa 1945", subtitle: "Grandpa's Journal", type: "HERO ARCHIVE", action: "READ LOG" },
  { title: "The Wheat Fields", subtitle: "L Cole Farms", type: "ROOTS", action: "VIEW FARM" },
  { title: "Family Lineage", subtitle: "The Putnam History", type: "HERO ARCHIVE", action: "EXPLORE" }
];

export default function FeaturedPlaylists() {
  const router = useRouter();
  const [activeBot, setActiveBot] = useState<'MC' | 'LF'>('MC'); // Default to Music Curator
  const [rotatedTracks, setRotatedTracks] = useState<any[]>([]);
  const [rotatedLegacy, setRotatedLegacy] = useState<any[]>([]);

  // --- THE ENGINE ---
  useEffect(() => {
    // 1. MC BOT: Shuffle Audio
    setRotatedTracks([...audioRegistry].sort(() => 0.5 - Math.random()));
    // 2. LF BOT: Shuffle Quotes
    setRotatedLegacy([...legacyQuotes].sort(() => 0.5 - Math.random()));
  }, [activeBot]); // Re-run when Bot changes

  const slot2_Track = rotatedTracks[0] || audioRegistry[3];
  const slot4_Track = rotatedTracks[1] || audioRegistry[0];
  const slot2_Legacy = rotatedLegacy[0] || legacyQuotes[0];

  const handleInteract = (item: any) => {
    if (item.isLink) {
      router.push(item.url);
    } else {
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

  // --- DYNAMIC GRID GENERATOR ---
  const getGridItems = () => {
    const commonSlots = [
      { id: 1, title: "Grandpa's Story", subtitle: "The Okinawa Legacy", type: "HERO LEGACY", icon: <BookOpen size={24} />, isLink: true, url: "/heroes", action: "READ STORY" },
      { id: 3, title: "Who is G Putnam Music", subtitle: "The Origin Story", type: "ARTIST BIO", icon: <Users size={24} />, isLink: true, url: "/who", action: "DISCOVER" },
      { id: 5, title: "The SHIPS Engine", subtitle: "Sponsorship Model", type: "BUSINESS", icon: <Anchor size={24} />, isLink: true, url: "/ships", action: "LEARN MORE" }
    ];

    if (activeBot === 'MC') {
      // MC MODE: Insert Music into Slots 2 & 4
      return [
        commonSlots[0],
        { id: 2, title: slot2_Track.title, subtitle: slot2_Track.artist, type: slot2_Track.type, filename: slot2_Track.filename, icon: <Music size={24} />, isLink: false, action: "PLAY NOW" },
        commonSlots[1],
        { id: 4, title: slot4_Track.title, subtitle: slot4_Track.artist, type: slot4_Track.type, filename: slot4_Track.filename, icon: <Play size={24} />, isLink: false, action: "PLAY NOW" },
        commonSlots[2]
      ];
    } else {
      // LF MODE: Insert Legacy Content into Slot 2, Keep Slot 4 Music
      return [
        commonSlots[0],
        { id: 2, title: slot2_Legacy.title, subtitle: slot2_Legacy.subtitle, type: slot2_Legacy.type, icon: <BookOpen size={24} />, isLink: true, url: "/heroes", action: slot2_Legacy.action }, // SWAPPED FOR TEXT
        commonSlots[1],
        { id: 4, title: slot4_Track.title, subtitle: slot4_Track.artist, type: slot4_Track.type, filename: slot4_Track.filename, icon: <Play size={24} />, isLink: false, action: "PLAY NOW" },
        commonSlots[2]
      ];
    }
  };

  const gridItems = getGridItems();
  const themeColor = activeBot === 'MC' ? '#8B4513' : '#CD853F'; // Sienna vs Peru (Wheat-ish)

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      
      {/* SYSTEM CONTROL BAR */}
      <div className="flex items-center justify-between mb-8 border-b pb-4" style={{ borderColor: `${themeColor}33` }}>
        <h2 className="text-3xl font-black uppercase transition-colors duration-500" style={{ color: themeColor }}>
          {activeBot === 'MC' ? 'Universal Rotation' : 'Legacy Archives'}
        </h2>
        
        {/* BOT TOGGLE SWITCH */}
        <div className="flex gap-2 bg-[#EEE8D6] p-1 rounded-lg">
           <button 
             onClick={() => setActiveBot('MC')}
             className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-black tracking-widest transition-all ${activeBot === 'MC' ? 'bg-[#8B4513] text-white shadow-md' : 'text-[#8B4513] opacity-50 hover:opacity-100'}`}
           >
             <Terminal size={12} /> MC.EXE
           </button>
           <button 
             onClick={() => setActiveBot('LF')}
             className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-black tracking-widest transition-all ${activeBot === 'LF' ? 'bg-[#CD853F] text-white shadow-md' : 'text-[#8B4513] opacity-50 hover:opacity-100'}`}
           >
             <Cpu size={12} /> LF.EXE
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {gridItems.map((item) => (
          <div key={item.id} 
               onClick={() => handleInteract(item)}
               className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full min-h-[220px]">
            
            <div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[#2C241B] mb-4 text-white transition duration-500`}
                   style={{ backgroundColor: activeBot === 'MC' ? '#FFD54F' : '#E6C288' }}>
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
