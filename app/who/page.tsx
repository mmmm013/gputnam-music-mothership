'use client';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';

export default function Who() {
  return (
    <main className="min-h-screen bg-[#FDF6E3] text-[#2C241B]">
      <Header />
      <div className="p-8 text-center">
        <h1 className="text-4xl font-black uppercase text-[#C04000]">Who is mmmm-?</h1>
        <p className="opacity-60 mt-4">The story behind the music.</p>
      </div>
      <AudioPlayer />
    </main>
  );
}
