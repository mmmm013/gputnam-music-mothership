'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import Link from 'next/link';

const KUPID_TIERS = [
  {
    id: 'genesis',
    name: 'K-KUTs Genesis Locket',
    price: '$333',
    description: 'Entry-level K-KUTs locket with curated music pairings. Discover the lock-and-key that unlocks your personal creative frequency.',
    features: [
      'Personal K-KUTs Genesis Locket',
      'Curated music frequency pairing',
      'Digital certificate of authenticity',
      'Access to GPM Locket holder community',
    ],
    stripeLink: 'https://buy.stripe.com/28E14mgV08My41C2p84ow04',
    color: 'from-amber-600 to-yellow-500',
    borderColor: 'border-amber-500/40',
    badge: 'GENESIS',
  },
  {
    id: 'sovereign',
    name: 'K-KUTs Sovereign Locket',
    price: '$1,100',
    description: 'The Sovereign-tier K-KUTs locket with expanded music library access and personal frequency calibration.',
    features: [
      'Sovereign K-KUTs Locket',
      'Expanded frequency library',
      'Personal calibration session',
      'Priority access to new releases',
      'Sovereign holder events',
    ],
    stripeLink: 'https://buy.stripe.com/eVq14mgV06Eq1Tu9RA4ow05',
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-orange-400/40',
    badge: 'SOVEREIGN',
    featured: true,
  },
  {
    id: 'historic',
    name: 'K-KUTs Historic Locket',
    price: '$3,300',
    description: 'The Historic-tier K-KUTs locket with full creative archive access. A patented invention with legacy value.',
    features: [
      'Historic K-KUTs Locket',
      'Full creative archive access',
      'Lifetime frequency updates',
      'VIP studio sessions',
      'Historic holder inner circle',
      'Locket delivery on/by March 31, 2026',
    ],
    stripeLink: 'https://buy.stripe.com/9B6aEW48ebYK0PqbZI4ow06',
    color: 'from-yellow-300 to-amber-400',
    borderColor: 'border-yellow-400/40',
    badge: 'HISTORIC',
  },
];

export default function KupidPage() {
  const [isVDay, setIsVDay] = useState(false);

  useEffect(() => {
    const now = new Date();
    const m = now.getMonth();
    const d = now.getDate();
    setIsVDay(m === 0 && d >= 20 || m === 1 && d <= 16);
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C2418]">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center bg-gradient-to-b from-[#2A1506] to-[#1a0d04]">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6">
            Patented Invention
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            K-KUTs
          </h1>
          <p className="text-2xl md:text-3xl font-light bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent mb-6">
            Sovereign Locket
          </p>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            The lock-and-key frequency device that pairs music to your creative energy. Three tiers. One invention.
          </p>
        </div>
      </section>

      {/* V-Day Banner */}
      {isVDay && (
        <section className="px-4 -mt-8 mb-8 relative z-10">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-red-900/90 via-pink-900/80 to-red-900/90 border border-red-500/30 rounded-2xl p-6 text-center shadow-2xl">
            <p className="text-3xl mb-2">❤️</p>
            <h2 className="text-xl font-bold text-red-300 mb-2">The Valentine&apos;s Day Locket</h2>
            <p className="text-white/70 text-sm mb-3">
              Gift a K-KUTs Locket this Valentine&apos;s Day. A patented invention paired to your frequency. The ultimate gift of creative energy.
            </p>
            <Link
              href="/valentines"
              className="inline-block px-5 py-2 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-sm font-medium hover:bg-red-500/30 transition-all"
            >
              Valentine&apos;s Gift Guide →
            </Link>
          </div>
        </section>
      )}

      {/* Pricing Grid */}
      <section className={`px-4 ${isVDay ? 'py-8' : 'py-16'}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {KUPID_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border ${tier.borderColor} bg-white p-6 flex flex-col ${
                tier.featured ? 'ring-2 ring-orange-400 shadow-xl scale-105' : 'shadow-md'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-xs font-bold mb-4 self-start`}>
                {tier.badge}
              </div>

              <p className={`text-4xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                {tier.price}
              </p>
              <p className="text-sm text-gray-500 mb-4">one-time</p>

              <h3 className="text-lg font-bold text-[#2C2418] mb-2">{tier.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{tier.description}</p>

              <ul className="space-y-2 mb-6 flex-grow">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.stripeLink}
                className={`block text-center py-3 rounded-xl bg-gradient-to-r ${tier.color} text-white font-bold hover:opacity-90 transition-opacity`}
              >
                Get {tier.badge} Locket
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4 py-16 bg-[#2C2418] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">What is K-KUTs?</h2>
          <p className="text-white/70 leading-relaxed mb-8">
            K-KUTs is a patented music-frequency locket technology by G Putnam Music. Each locket is electronically paired to curated music frequencies designed to amplify focus, creativity, and personal energy. The K-KUTs Sovereign Locket is the flagship product of GPM&apos;s hardware line.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gift" className="text-amber-400 hover:text-amber-300 transition-colors">
              Heart-Tap Gifts →
            </Link>
            <Link href="/join" className="text-amber-400 hover:text-amber-300 transition-colors">
              Join the Fleet →
            </Link>
            <Link href="/" className="text-amber-400 hover:text-amber-300 transition-colors">
              Back to Home →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <GlobalPlayer />
    </main>
  );
}
