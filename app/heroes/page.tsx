'use client';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';

export default function Heroes() {
  return (
    <main className="min-h-screen bg-[#FDF6E3] text-[#2C241B] font-serif">
      <Header />
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        
        {/* HERO HEADER */}
        <div className="text-center mb-12 border-b border-[#8B4513]/20 pb-8">
          <span className="text-xs font-black tracking-[0.2em] text-[#8B4513] uppercase mb-4 block">GPM Heroes Series</span>
          <h1 className="text-5xl md:text-6xl font-black text-[#2C241B] mb-6">
            The Okinawa Story
          </h1>
          <p className="text-xl italic opacity-70">
            "A legacy of duty: From the Navy to the Marines."
          </p>
        </div>

        {/* STORY CONTENT */}
        <div className="prose prose-lg text-[#3E2723] leading-relaxed mx-auto">
          <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#8B4513] first-letter:mr-2 float-left">
            T
          </p>
          <p>
            his is the personal account of a journey that defied standard military protocol. 
            It begins in the <strong>United States Navy</strong>, where a commitment to service 
            first took root. But duty called for a different kind of strength.
          </p>
          <p>
            Transitioning from the Navy to the <strong>Marines</strong>, he found himself 
            deployed to the Pacific Theater. The destination was <strong>Okinawa</strong>—the 
            site of the last and biggest of the Pacific island battles of World War II.
          </p>
          <p>
            [This space is reserved for the full personal account of your grandfather's 
            experience, honors, and memory. The "Grandpa's Story" feature ensures his 
            legacy remains a permanent pillar of the G Putnam Music platform.]
          </p>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-16 text-center">
          <a href="/" className="inline-block bg-[#8B4513] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#5E2C0B] transition shadow-lg">
            Return Home
          </a>
        </div>

      </div>
      <AudioPlayer />
    </main>
  );
}
