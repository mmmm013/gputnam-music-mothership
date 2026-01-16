'use client';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';

export default function Artists() {
  return (
    <main className="min-h-screen bg-[#FDF6E3] text-[#2C241B]">
      <Header />
      <div className="p-8 text-center space-y-4">
        <h1 className="text-4xl font-black uppercase text-[#C04000]">GPM Artists</h1>
        <p className="opacity-60">The roster is loading...</p>
        <div className="grid gap-4 md:grid-cols-2 mt-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-[#2C241B]/10">
             <h2 className="font-bold text-xl">Michael Scherer</h2>
             <p className="text-xs uppercase opacity-50">Jazz Master</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-[#2C241B]/10">
             <h2 className="font-bold text-xl">Kleigh</h2>
             <p className="text-xs uppercase opacity-50">Pop / Avant-Garde</p>
           </div>
        </div>
      </div>
      <AudioPlayer />
    </main>
  );
}
