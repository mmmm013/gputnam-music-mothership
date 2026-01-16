'use client';
import { Play, BookOpen, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FeaturedPlaylists() {
  const router = useRouter();

  const playlists = [
    { 
      id: 1, 
      title: "Grandpa's Story (Okinawa)", 
      type: "HERO LEGACY", 
      action: "READ STORY",
      icon: <BookOpen size={24} />,
      isLink: true,
      url: "/heroes" // This now links to a page, not a file
    },
    { 
      id: 2, 
      title: "The First Note", 
      type: "SNIPPET", 
      action: "PLAY NOW",
      icon: <Music size={24} />,
      isLink: false,
      url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/songs/first-note.mp3"
    },
    { 
      id: 3, 
      title: "Studio Session A", 
      type: "GPMC TRACK", 
      action: "PLAY NOW",
      icon: <Play size={24} />,
      isLink: false,
      url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/songs/038%20-%20kleigh%20-%20bought%20into%20your%20game.mp3"
    }
  ];

  const handleInteract = (item: any) => {
    if (item.isLink) {
      // If it's a story, go to the page
      router.push(item.url);
    } else {
      // If it's audio, play it
      const event = new CustomEvent('play-track', { 
        detail: { url: item.url, title: item.title, type: item.type } 
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <h2 className="text-3xl font-black uppercase text-[#8B4513] mb-8 border-b border-[#8B4513]/20 pb-4">
        GPMC Featured Content
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {playlists.map((fp) => (
          <div key={fp.id} 
               onClick={() => handleInteract(fp)}
               className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300">
            
            <div className="bg-[#FFD54F] w-12 h-12 rounded-full flex items-center justify-center text-[#2C241B] mb-4 group-hover:bg-[#8B4513] group-hover:text-white transition">
              {fp.icon}
            </div>
            
            <h3 className="text-xl font-bold mb-1 group-hover:text-[#8B4513] transition">{fp.title}</h3>
            <div className="text-xs font-black uppercase tracking-widest opacity-40">{fp.type}</div>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition text-[#8B4513]">
               {fp.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
