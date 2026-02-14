import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import MakeupTracks from './MakeupTracks';

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
    emoji: '\u2764\uFE0F',
    tag: 'Perfect starter',
  },
  {
    title: 'Double Tap',
    price: '$4.99',
    description: '2 items + 1 grand prize entry',
    href: '/gift',
    emoji: '\uD83D\uDC9C',
    tag: 'Most gifted',
  },
  {
    title: 'Long Press',
    price: '$9.99',
    description: '3 items + unreleased clip + 3 entries',
    href: '/gift',
    emoji: '\uD83D\uDC9C',
    tag: 'Fan favorite',
  },
  {
    title: 'Hold My Heart',
    price: '$24.99',
    description: '5 items + studio pass + merch code + 10 entries',
    href: '/gift',
    emoji: '\uD83D\uDC9C',
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
    <>
      <Header />
      <main className="min-h-screen bg-[#0d0800] text-white">

        {/* Hero */}
        <section className="text-center py-16 px-4">
          <div className="text-5xl mb-4">\u2764\uFE0F</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#D4A017] mb-4">Valentine's Day</h1>
          <p className="text-neutral-300 max-w-lg mx-auto">
            Give the gift of music. From $1.99 digital gifts to patented K-KUTs lockets.
          </p>
          <p className="text-sm text-[#D4A017]/60 mt-3">G Putnam Music \u2022 Limited Time</p>
        </section>

        {/* Heart-Tap Section */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-center mb-2">
            <span className="text-red-400">\u2764\uFE0F</span> Heart-Tap Gifts
          </h2>
          <p className="text-neutral-400 text-center text-sm mb-8">
            Digital mixed bags with exclusive stickers, ringtones, unreleased clips, and more.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GIFT_OPTIONS.map((gift) => (
              <Link
                key={gift.title}
                href={gift.href}
                className="bg-[#1a0f00] border border-[#8B4513]/20 rounded-xl p-4 hover:border-[#D4A017]/40 transition-all hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{gift.emoji}</span>
                  <span className="text-[10px] text-[#D4A017]/60">{gift.tag}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{gift.title}</h3>
                <p className="text-[#D4A017] font-bold text-lg">{gift.price}</p>
                <p className="text-neutral-500 text-xs mt-1">{gift.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/gift"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
            >
              Send a Heart-Tap \u2192
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#D4A017]/10 max-w-2xl mx-auto" />

        {/* K-KUTs Locket Section */}
        <section className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-lg">\uD83D\uDD12</span> K-KUTs Sovereign Locket
          </h2>
          <p className="text-neutral-400 text-sm mb-1">
            A patented music-frequency locket. The lock-and-key to creative energy.
          </p>
          <p className="text-xs text-[#D4A017]/50 mb-8">Patented Invention \u2022 One-Time Purchase</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LOCKET_OPTIONS.map((locket) => (
              <Link
                key={locket.title}
                href={locket.href}
                className={`bg-[#1a0f00] border rounded-xl p-6 text-left hover:scale-[1.02] active:scale-95 transition-all relative ${
                  locket.featured ? 'border-[#D4A017]/60' : 'border-[#8B4513]/20 hover:border-[#D4A017]/40'
                }`}
              >
                {locket.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#D4A017] text-black text-[10px] font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <p className="text-[10px] font-bold text-[#D4A017]/60 tracking-wider mb-1">{locket.badge}</p>
                <h3 className="font-bold text-white">{locket.title}</h3>
                <p className="text-[#D4A017] font-bold text-2xl my-1">{locket.price}</p>
                <p className="text-neutral-500 text-xs">{locket.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/kupid"
              className="inline-block px-6 py-3 rounded-full border border-[#D4A017]/40 text-[#D4A017] font-semibold hover:bg-[#D4A017]/10 transition-colors min-h-[44px]"
            >
              Explore K-KUTs \u2192
            </Link>
          </div>
        </section>

        {/* Makeup Tracks Section */}
        <div className="border-t border-[#D4A017]/10 max-w-2xl mx-auto" />
        <MakeupTracks />

        {/* CTA */}
        <section className="max-w-xl mx-auto px-4 py-12 text-center">
          <div className="bg-[#1a0f00] border border-[#8B4513]/20 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Not sure what to give?</h2>
            <p className="text-neutral-400 text-sm mb-6">
              Start with a Heart-Tap at $1.99. Every gift includes exclusive digital content and a personal message.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/gift"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
              >
                Heart-Tap from $1.99
              </Link>
              <Link
                href="/kupid"
                className="px-6 py-3 rounded-full border border-[#D4A017]/40 text-[#D4A017] font-semibold hover:bg-[#D4A017]/10 transition-colors min-h-[44px]"
              >
                K-KUTs Lockets from $333
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
