'use client';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';
import { Play } from 'lucide-react';

export default function HeroesPage() {
  // Explicitly pointing to potential video files in your storage
  const heroes = [
    { name: "Grandpa's Story", type: "Video", url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/videos/grandpa-story.mp4" },
    { name: "The First Note", type: "Audio", url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/songs/first-note.mp3" },
    { name: "Studio Sessions", type: "Clip", url: "https://eajxgrbxvkhfmmfiotpm.supabase.co/storage/v1/object/public/videos/studio-session.mp4" }
  ];

  return (
    <main className="min-h-screen bg-[#FDF6E3] text-[#2C241B]">
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-5xl font-black uppercase mb-12 text-[#C04000]">Heroes & Origins</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {heroes.map((hero, i) => (
            <div key={i} className="bg-[#FFFDF5] p-6 rounded-2xl shadow-lg border border-[#2C241B]/10">
              <div className="aspect-video bg-black/10 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group">
                <div className="w-16 h-16 bg-[#C04000] rounded-full flex items-center justify-center text-white shadow-xl z-10">
                  <Play fill="currentColor" />
                </div>
                {/* Try to load video, fallback to cover if missing */}
                <video src={hero.url} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition" />
              </div>
              <h3 className="text-xl font-bold">{hero.name}</h3>
              <span className="text-xs font-black uppercase tracking-widest opacity-50">{hero.type}</span>
            </div>
          ))}
        </div>
      </div>
      <AudioPlayer />
    </main>
  );
}
