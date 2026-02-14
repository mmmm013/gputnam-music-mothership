import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Valentine's Day Gifts | G Putnam Music",
  description: 'Send the gift of music this Valentine\'s Day. Heart-Tap digital gifts and K-KUTs Sovereign Lockets from G Putnam Music.',
};

const GIFT_OPTIONS = [
  {
    title: 'Quick Tap',
    price: '$1.99',
    description: '1 digital sticker or ringtone',
    href: '/gift',
    emoji: '\u2764\ufe0f',
    tag: 'Perfect starter',
  },
  {
    title: 'Double Tap',
    price: '$4.99',
    description: '2 items + 1 grand prize entry',
    href: '/gift',
    emoji: '\ud83d\udc9c',
    tag: 'Most gifted',
  },
  {
    title: 'Long Press',
    price: '$9.99',
    description: '3 items + unreleased clip + 3 entries',
    href: '/gift',
    emoji: '\ud83d\udc9c',
    tag: 'Fan favorite',
  },
  {
    title: 'Hold My Heart',
    price: '$24.99',
    description: '5 items + studio pass + merch code + 10 entries',
    href: '/gift',
    emoji: '\ud83d\udc9c',
    tag: 'Ultimate V-Day gift',
  },
];

const LOCKET_OPTIONS = [
  {
    title: 'Genesis Locket',
    price: '$333',
    description: 'Entry-level K-KUTs locket with curated music pairings.',
    href: '/kupid',
    badge: 'GENESIS',
  },
  {
    title: 'Sovereign Locket',
    price: '$1,100',
    description: 'Expanded library access + personal frequency calibration.',
    href: '/kupid',
    badge: 'SOVEREIGN',
    featured: true,
  },
  {
    title: 'Historic Locket',
    price: '$3,300',
    description: 'Full creative archive. A patented invention with legacy value.',
    href: '/kupid',
    badge: 'HISTORIC',
  },
];

export default function ValentinesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0508] via-[#0d0d0d] to-black text-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 text-center">
        <p className="text-5xl mb-4">\u2764\ufe0f</p>
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          <span className="bg-gradient-to-r from-red-400 via-pink-400 to-red-500 bg-clip-text text-transparent">
            Valentine&apos;s Day
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-lg mx-auto mb-2">
          Give the gift of music. From $1.99 digital gifts to patented K-KUTs lockets.
        </p>
        <p className="text-sm text-red-400/60">
          G Putnam Music &bull; Limited Time
        </p>
      </section>

      {/* Heart-Tap Section */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">
            \u2764\ufe0f Heart-Tap Gifts
          </h2>
          <p className="text-center text-white/50 text-sm mb-8">
            Digital mixed bags with exclusive stickers, ringtones, unreleased clips, and more.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GIFT_OPTIONS.map((gift) => (
              <Link
                key={gift.title}
                href={gift.href}
                className="group block bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-red-500/40 hover:bg-red-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{gift.emoji}</span>
                  <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">{gift.tag}</span>
                </div>
                <h3 className="text-lg font-bold mb-1">{gift.title}</h3>
                <p className="text-2xl font-black text-amber-400 mb-2">{gift.price}</p>
                <p className="text-sm text-white/50">{gift.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/gift"
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:from-red-400 hover:to-pink-400 transition-all"
            >
              Send a Heart-Tap \u2192
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-xs mx-auto border-t border-white/10 mb-16" />

      {/* K-KUTs Locket Section */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">
            \ud83d\udd12 K-KUTs Sovereign Locket
          </h2>
          <p className="text-center text-white/50 text-sm mb-2">
            A patented music-frequency locket. The lock-and-key to creative energy.
          </p>
          <p className="text-center text-xs text-amber-400/60 mb-8">
            Patented Invention &bull; One-Time Purchase
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOCKET_OPTIONS.map((locket) => (
              <Link
                key={locket.title}
                href={locket.href}
                className={`group block rounded-2xl p-6 transition-all ${
                  locket.featured
                    ? 'bg-gradient-to-b from-amber-900/30 to-orange-900/20 border-2 border-orange-400/40 shadow-xl'
                    : 'bg-white/5 border border-white/10 hover:border-amber-500/30'
                }`}
              >
                {locket.featured && (
                  <p className="text-xs text-orange-400 font-bold mb-2 text-center">MOST POPULAR</p>
                )}
                <p className="text-xs font-bold text-amber-400 mb-2">{locket.badge}</p>
                <h3 className="text-lg font-bold mb-1">{locket.title}</h3>
                <p className="text-3xl font-black text-white mb-2">{locket.price}</p>
                <p className="text-sm text-white/50">{locket.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/kupid"
              className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              Explore K-KUTs \u2192
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-xl mx-auto bg-gradient-to-r from-red-900/30 via-pink-900/20 to-red-900/30 border border-red-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Not sure what to give?</h2>
          <p className="text-white/60 text-sm mb-4">
            Start with a Heart-Tap at $1.99. Every gift includes exclusive digital content and a personal message.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/gift"
              className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400 transition-colors"
            >
              Heart-Tap from $1.99
            </Link>
            <Link
              href="/kupid"
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
            >
              K-KUTs Lockets from $333
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
