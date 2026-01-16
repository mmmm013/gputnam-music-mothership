'use client';
import { Play, Video, Music } from 'lucide-react';

export default function FeaturedPlaylists() {
  const playlists = [
    { 
      id: 1, 
      title: "Grandpa's Story (Okinawa)", 
      type: "VIDEO", 
      icon: <Video size={24} />,
      // Updated to point to your video bucket
      url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/videos/grandpa-story.mp4"
    },
    { 
      id: 2, 
      title: "The First Note", 
      type: "SNIPPET", 
      icon: <Music size={24} />,
      // Updated to point to your song bucket
      url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/songs/first-note.mp3"
    },
    { 
      id: 3, 
      title: "Studio Session A", 
      type: "GPMC TRACK", 
      icon: <Play size={24} />,
      url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/songs/038%20-%20kleigh%20-%20bought%20into%20your%20game.mp3"
    }
  ];

  const broadcastPlay = (url: string, title: string, type: string) => {
    const event = new CustomEvent('play-track', { detail: { url, title, type } });
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <h2 className="text-3xl font-black uppercase text-[#C04000] mb-8 border-b border-[#C04000]/20 pb-4">
        GPMC Featured Playlists
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {playlists.map((fp) => (
          <div key={fp.id} 
               onClick={() => broadcastPlay(fp.url, fp.title, fp.type)}
               className="group cursor-pointer bg-[#FFFDF5] rounded-2xl p-6 shadow-md border border-[#2C241B]/10 hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="bg-[#FBC02D] w-12 h-12 rounded-full flex items-center justify-center text-[#2C241B] mb-4 group-hover:bg-[#C04000] group-hover:text-white transition">
              {fp.icon}
            </div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-[#C04000] transition">{fp.title}</h3>
            <div className="text-xs font-black uppercase tracking-widest opacity-40">{fp.type}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition text-[#C04000]">
              <Play size={12} fill="currentColor" /> Play Now
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
