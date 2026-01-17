import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { BookOpen, User } from 'lucide-react';

export default function HeroesPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B]">
      <Header />
      
      {/* HEADER HERO */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-[#DAA520] to-[#B8860B] text-[#FFFDF5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FFFDF5]/10 backdrop-blur-md mb-6 border border-[#FFFDF5]/20">
            <User size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Heroes</h1>
          <p className="text-xl font-serif italic opacity-80">The Okinawa Legacy</p>
        </div>
      </section>

      {/* STORY CONTENT */}
      <section className="py-16 max-w-3xl mx-auto px-6 font-serif leading-loose text-lg text-[#5D4037]">
        <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-[#DAA520] first-letter:mr-2 float-left">
          It started with a single note in Okinawa. 
        </p>
        <p className="mb-6">
          The history of G Putnam Music isn't just about sound waves; it's about the people who carried the tune before us.
          This section is dedicated to the legends, the teachers, and the family members who built the foundation.
        </p>
        <div className="p-8 bg-[#FFF8E7] border-l-4 border-[#DAA520] italic text-[#8B4513]">
          "Music is the only thing that makes sense when the world doesn't."
        </div>
      </section>

      <Footer />
      <GlobalPlayer />
    </main>
  );
}
