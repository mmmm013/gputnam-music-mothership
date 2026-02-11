'use client';

import { useState } from 'react';
import { GIFT_TIERS, type TierConfig, type GiftTier, initiateCheckout} from '@/lib/gift-protocol';
import GiftTierCard from '@/components/GiftTierCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default function GiftPage() {
  const [selectedTier, setSelectedTier] = useState<TierConfig | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!selectedTier) return;
    setIsLoading(true);
    setError('');

    try {
      const { url } = await initiateCheckout({
        tier: selectedTier.tier as GiftTier,
        donorName: isAnonymous ? undefined : donorName,
        donorEmail,
        donorPhone,
        message,
        isAnonymous,
      });
      if (url) window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
            <Header />
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Heart-Tap
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-lg mx-auto">
          Tap to support. Get a Digital Mixed Bag of exclusive gifts.
        </p>
      </section>

      {/* Tier Grid */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GIFT_TIERS.map((tier) => (
            <GiftTierCard
              key={tier.tier}
              tier={tier}
              isSelected={selectedTier?.tier === tier.tier}
              onSelect={setSelectedTier}
            />
          ))}
        </div>
      </section>

      {/* Donor Form */}
      {selectedTier && (
        <section className="max-w-md mx-auto px-4 pb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-center">
              {selectedTier.emoji} {selectedTier.displayName} - {selectedTier.label}
            </h2>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-white/30"
              />
              Send anonymously
            </label>

            {!isAnonymous && (
              <input
                type="text"
                placeholder="Your Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
              />
            )}

            <input
              type="email"
              placeholder="Email (for receipt)"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
            />

            <input
              type="tel"
              placeholder="Phone (for SMS gift link)"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
            />

            <textarea
              placeholder="Leave a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none resize-none"
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-lg hover:from-amber-300 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : `Send ${selectedTier.label} Gift`}
            </button>

            <p className="text-xs text-white/40 text-center">
              Secure payment via Stripe. You will receive a Digital Mixed Bag after checkout.
            </p>
          </div>
        </section>
      )}

          <Footer />      
    </main>
  );
}
