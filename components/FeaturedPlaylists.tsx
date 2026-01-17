'use client';
import { useState, useEffect } from 'react';
import { Play, BookOpen, Music, Users, Anchor, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BUCKET_URL = "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/tracks";
const BRAND_GPM = "#FFC107";
const BRAND_KLEIGH = "#A0522D";
const BRAND_SCHERER = "#DAA520";

const SCHERER_FILENAMES = [
  "Breakfast!.mp3", "Dance Party.mp3", "Going Outside.mp3", "Imaginary Zoo.mp3", 
  "Jump.mp3", "Like a Bunny.mp3", "Nighttime.mp3", "Perfect Day.mp3", 
  "Rhythm Play.mp3", "Silly Song.mp3", "Stomp and Clap.mp3", "When I Grow Up.mp3"
];

const KLEIGH_POOL = [{ 
  filename: "038 - kleigh - bought into your game.mp3", 
  title: "Bought Into Your Game", artist: "Kleigh", type: "GPMC LEGACY",
  moodTheme: { primary: BRAND_KLEIGH, secondary: "#FFBF00" } 
}];

export default function FeaturedPlaylists() {
  const router = useRouter();
  const [slot2, setSlot2] = useState<any>(null);
  const [slot4, setSlot4] = useState<any>(null);
  const [activeTheme, setActiveTheme] = useState({ primary: BRAND_GPM });

  useEffect(() => {
    setSlot2(KLEIGH_POOL[0]);
    setSlot4({
      filename: SCHERER_FILENAMES[Math.floor(Math.random() * SCHERER_FILENAMES.length)],
      title: "Scherer Magic", artist: "GPM & Michael Scherer", type: "CO-COPYRIGHT",
      moodTheme: { primary: BRAND_SCHERER, secondary: "#F5DEB3" }
    });
  }, []);

  const handleInteract = (item: any) => {
    if (item.moodTheme?.primary) setActiveTheme(item.moodTheme);
    if (item.isLink) {
      router.push(item.url);
    } else {
      window.dispatchEvent(new CustomEvent('play-track', { 
        detail: { 
          url: `${BUCKET_URL}/${item.filename}`, title: item.title, 
          artist: item.artist, moodTheme: item.moodTheme 
        } 
      }));
    }
  };

  const getIcon = (name: string) => {
    if (name === 'BookOpen') return <BookOpen size={24} />;
    if (name === 'Users') return <Users size={24} />;
    if (name === 'Anchor') return <Anchor size={24} />;
    if (name === 'Music') return <Music size={24} />;
    return <Play size={24} />;
  };

  const gridItems = [
    { id: 1, title: "Grandpa's Story", subtitle: "The Okinawa Legacy", type: "HERO LEGACY", action: "READ STORY", icon: "BookOpen", isLink: true, url: "/heroes", moodTheme: { primary: BRAND_GPM } },
    { ...(slot2 || KLEIGH_POOL[0]), id: 2, action: "PLAY NOW", icon: "Music", isLink: false },
    // SLOT 3 UPDATED TITLE
    { id: 3, title: "GPM Is?", subtitle: "The Origin Story", type: "ARTIST BIO", action: "DISCOVER", icon: "Users", isLink: true, url: "/who", moodTheme: { primary: BRAND_GPM } },
    { ...(slot4 || { title: "Loading..." }), id: 4, action: "PLAY NOW", icon: "Play", isLink: false },
    { id: 5, title: "The SHIPS Engine", subtitle: "Sponsorship Model", type: "BUSINESS", action: "LEARN MORE", icon: "Anchor", isLink: true, url: "/ships", moodTheme: { primary: BRAND_GPM } }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 border-b pb-4 transition-colors duration-500" style={{ borderColor: `${activeTheme.primary}44` }}>
        <h2 className="text-3xl font-black uppercase transition-colors duration-500" style={{ color: activeTheme.primary }}>GPMC Universal Rotation</h2>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 transition-colors duration-500" style={{ color: activeTheme.primary }}><RefreshCw size={14} /> Live Mix</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {gridItems.map((item) => (
          <div key={item.id} onClick={() => handleInteract(item)} className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white transition-colors duration-500" style={{ backgroundColor: item.moodTheme?.primary || activeTheme.primary }}>{getIcon(item.icon)}</div>
              <h3 className="text-lg font-bold mb-1 transition leading-tight" style={{ color: item.moodTheme?.primary || activeTheme.primary }}>{item.title}</h3>
              <p className="text-xs opacity-60 mb-2" style={{ color: item.moodTheme?.primary || activeTheme.primary }}>{item.subtitle || item.artist}</p>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.type}</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition" style={{ color: item.moodTheme?.primary || activeTheme.primary }}>{item.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
