import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';

export default function WhoPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B]">
      <Header />
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase text-[#8B4513] mb-8 tracking-tighter">
          Who Is <br/><span className="text-[#DAA520]">G Putnam Music?</span>
        </h1>
        <p className="text-xl font-serif italic text-[#5D4037]/80 mb-12 leading-relaxed">
          "Music is what feelings sound like."
        </p>
        <div className="prose prose-lg mx-auto text-[#2C241B]">
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
