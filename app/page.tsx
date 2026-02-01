'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '@/components/PlayerContext';
import { Zap, Moon, Sun, MessageSquare, Music, CloudRain, Wind, Activity } from 'lucide-react';

export default function Home() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [activeVibe, setActiveVibe] = useState<string>('all');

  const vibes = [
    { id: 'all', label: 'All Tracks', icon: Music, color: 'from-white/20' },
    { id: 'melancholy', label: 'Melancholy', icon: CloudRain, color: 'from-blue-900/50' },
    { id: 'dreamy', label: 'Dreamy', icon: Wind, color: 'from-purple-900/50' },
    { id: 'focus', label: 'Focus', icon: Music, color: 'from-emerald-900/50' },
    { id: 'uplifting', label: 'Uplifting', icon: Activity, color: 'from-orange-900/50' },
    { id: 'energy', label: 'High Energy', icon: Zap, color: 'from-yellow-900/50' },
    { id: 'night', label: 'Late Night', icon: Moon, color: 'from-indigo-900/50' },
    { id: 'sunrise', label: 'Sunrise', icon: Sun, color: 'from-rose-900/50' },
    { id: 'bot', label: 'Ask the Bot', icon: MessageSquare, color: 'from-cyan-900/50' },
  ];

  const tracks = [
    { id: 1, title: 'Ethereal Dreams', artist: 'G Putnam', vibe: 'dreamy', duration: '3:42', image: '/hero.jpg' },
    { id: 2, title: 'Focus Flow', artist: 'G Putnam', vibe: 'focus', duration: '4:15', image: '/hero.jpg' },
    { id: 3, title: 'Morning Rise', artist: 'G Putnam', vibe: 'sunrise', duration: '3:28', image: '/hero.jpg' },
  ];

  const filteredTracks = activeVibe === 'all' ? tracks : tracks.filter(t => t.vibe === activeVibe);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <Image src="/gpm_logo.svg" alt="GPM Logo" width={50} height={50} />
            <h1 className="text-2xl font-bold">G Putnam Music</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="/heroes" className="hover:text-cyan-400 transition">Heroes</Link>
            <Link href="/about" className="hover:text-cyan-400 transition">About</Link>
            <Link href="/catalog_pricing.html" className="hover:text-cyan-400 transition">Catalog</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Dream the Stream
          </h1>
          <p className="text-xl text-neutral-300 mb-8">
            Curated moods • Infinite vibes • Your soundtrack
          </p>
          <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-full transition">
            Listen Now
          </button>
        </div>

        {/* Mood Filter */}
        <div className="px-6 pb-8">
          <h2 className="text-2xl font-bold mb-4">Select Your Vibe</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vibes.map((vibe) => {
              const Icon = vibe.icon;
              return (
                <button
                  key={vibe.id}
                  onClick={() => setActiveVibe(vibe.id)}
                  className={`group relative h-24 overflow-hidden rounded-xl border transition-all duration-300 ${
                    activeVibe === vibe.id
                      ? 'border-white ring-2 ring-white/50 bg-neutral-800/60'
                      : 'border-white/20 hover:border-white/40 bg-neutral-900/40'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${vibe.color} to-transparent opacity-30 transition-opacity duration-500 group-hover:opacity-50`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{vibe.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Music Catalog */}
        <div className="px-6 pb-20">
          <h2 className="text-2xl font-bold mb-4">Tracks</h2>
          <div className="space-y-2">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack({ id: track.id.toString(), url: `/demo${track.id}.mp3`, title: track.title, artist: track.artist })}
                className="flex items-center gap-4 p-4 bg-neutral-900/50 hover:bg-neutral-800/50 rounded-lg cursor-pointer transition"
              >
                <Image src={track.image} alt={track.title} width={48} height={48} className="rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{track.title}</div>
                  <div className="text-sm text-neutral-400">{track.artist}</div>
                </div>
                <div className="text-sm text-neutral-500">{track.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
