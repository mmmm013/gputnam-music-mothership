'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import Link from 'next/link';

const KUPID_TIERS = [
  {
    id: 'genesis',
    name: 'K-kUpId Genesis Locket',
    price: '$333',
    description: 'Entry-level K-kUpId locket with curated music pairings. Discover the lock-and-key that unlocks your personal creative frequency.',
    features: [
      'Personal K-kUpId Genesis Locket',
      'Curated music frequency pairing',
      'Digital certificate of authenticity',
      'Access to GPM Locket holder community',
    ],
    stripeLink: 'https://buy.stripe.com/28EI4mgV08My4lC2p84ow04',
    color: 'from-amber-600 to-yellow-500',
    borderColor: 'border-amber-500/40',
    badge: 'GENESIS',
  },
  {
    id: 'sovereign',
    name: 'K-kUpId Sovereign Locket',
    price: '$1,100',
    description: 'The Sovereign-tier K-kUpId locket with expanded music library access and personal frequency calibration.',
    features: [
      'Sovereign K-kUpId Locket',
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
    name: 'K-kUpId Historic Locket',
    price: '$3,300',
    description: 'The Historic-tier K-kUpId locket with full creative archive access. A patented invention with legacy value.',
    features: [
      'Historic K-kUpId Locket',
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
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C2418]">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center bg-gradient-to-b from-[#2A1506] to-[#1a0d04]">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6">
            Patented Invention
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#D7CCC8] mb-4 tracking-tight leading-none">
            K-kUpId
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-bold">
              Sovereign Locket
            </span>
          </h1>
          <p className="text-lg text-[#C8AB82]/80 max-w-xl mx-auto mt-4">
            The lock-and-key frequency device that pairs music to your creative energy. Three tiers. One invention.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {KUPID_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 ${tier.borderColor} bg-white shadow-lg overflow-hidden transition-transform hover:scale-[1.02] ${
                tier.featured ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#FFFDF5]' : ''
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-lg tracking-widest">
                  MOST POPULAR
                </div>
              )}
              <div className={`bg-gradient-to-r ${tier.color} p-6 text-white`}>
                <span className="text-[10px] font-black tracking-[0.2em] opacity-80">{tier.badge}</span>
                <div className="text-4xl font-black mt-2">{tier.price}</div>
                <div className="text-sm opacity-80 mt-1">one-time</div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-lg mb-2">{tier.name}</h3>
                <p className="text-sm text-[#2C2418]/60 mb-4">{tier.description}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-500 mt-0.5">&#10003;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 rounded-xl font-bold text-white bg-gradient-to-r ${tier.color} hover:opacity-90 transition-opacity`}
                >
                  Get {tier.badge} Locket
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <h2 className="text-2xl font-black mb-4 text-[#2C2418]">What is K-kUpId?</h2>
        <p className="text-[#2C2418]/70 leading-relaxed mb-6">
          K-kUpId is a patented music-frequency locket technology by G Putnam Music. Each locket is electronically paired to curated music frequencies designed to amplify focus, creativity, and personal energy. The K-kUpId Sovereign Locket is the flagship product of GPM&apos;s hardware line.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/gift" className="text-sm text-amber-600 hover:text-amber-800 font-bold transition-colors">
            Heart-Tap Gifts &rarr;
          </Link>
          <Link href="/join" className="text-sm text-amber-600 hover:text-amber-800 font-bold transition-colors">
            Join the Fleet &rarr;
          </Link>
          <Link href="/" className="text-sm text-amber-600 hover:text-amber-800 font-bold transition-colors">
            Back to Home &rarr;
          </Link>
        </div>
      </section>

      <Footer />
      <GlobalPlayer />
    </main>
  );
}
