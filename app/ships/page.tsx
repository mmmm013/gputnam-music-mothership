'use client';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';
import Footer from '@/components/Footer';

export default function Ships() {
  return (
    <main className="min-h-screen bg-[#FDF6E3] text-[#2C241B]">
      <Header />
      <div className="p-8 text-center">
        <h1 className="text-4xl font-black uppercase text-[#C04000]">SHIPS Engine</h1>
        <p className="opacity-60 mt-4">Sponsorship & Mood Matching Platform</p>
      </div>
      <AudioPlayer />
      <Footer />
    </main>
  );
}
