import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';

export default function WhoPage() {
  return (
    <main className="min-h-screen bg-[#FFF0F5] text-[#2C2418]">
      <Header />
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase text-[#8B4513] mb-8 tracking-tighter">
          Who Is <br/><span className="text-[#D0A520]">G Putnam Music?</span>
        </h1>
        <p className="text-xl font-serif italic text-[#5D4037]/80 mb-12 leading-relaxed">
          "Music is what feelings sound like."
        </p>

        {/* Michael Scherer Studio Portrait */}
        <div className="relative w-full max-w-md mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/IMG_7429.JPG"
            alt="Michael Scherer in the studio"
            width={800}
            height={600}
            className="object-cover w-full h-auto"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a1206]/80 to-transparent p-4">
            <p className="text-[#C8A882] text-sm font-bold">Michael Scherer</p>
            <p className="text-[#f5e6c8]/70 text-xs">Producer & Jazz Artist — Eclipse Studio</p>
          </div>
        </div>

        <div className="prose prose-lg mx-auto text-[#2C2418]">
          <p>
            G Putnam Music (GPMC) is a multi-genre production house dedicated to the art of the stream.
            From the legacy vocals of Kleigh to the smooth jazz of Michael Scherer, we build soundscapes
            that match your moment.
          </p>
        </div>
      </section>
      <Footer />
      <GlobalPlayer />
    </main>
  );
}
