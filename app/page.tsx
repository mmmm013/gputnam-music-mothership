'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Moon, Sun, MessageSquare, Music, CloudRain, Wind, Activity, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function Home() {
  // const { currentTrack, isPlaying, playTrack, togglePlay, audioRef } = usePlayer();  
  const [currentTrack, setCurrentTrack] = useState<any>(null);  
  const [isPlaying, setIsPlaying] = useState(false);  const [activeVibe, setActiveVibe] = useState<string>('all');

    const playTrack = (track: any) => {  
    setCurrentTrack(track);  
    setIsPlaying(true);  
  };  
    
  const togglePlay = () => {  
    setIsPlaying(!isPlaying);  
  };

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
    { id: 1, title: 'Ethereal Dreams', artist: 'G Putnam', vibe: 'dreamy', duration: '3:42', image: '/hero.jpg', url: '/audio/demo1.mp3' },
    { id: 2, title: 'Focus Flow', artist: 'G Putnam', vibe: 'focus', duration: '4:15', image: '/hero.jpg', url: '/audio/demo2.mp3' },
    { id: 3, title: 'Morning Rise', artist: 'G Putnam', vibe: 'sunrise', duration: '3:28', image: '/hero.jpg', url: '/audio/demo3.mp3' },
    { id: 4, title: 'Blue Horizon', artist: 'G Putnam', vibe: 'melancholy', duration: '4:02', image: '/hero.jpg', url: '/audio/demo1.mp3' },
    { id: 5, title: 'Energy Surge', artist: 'G Putnam', vibe: 'energy', duration: '3:15', image: '/hero.jpg', url: '/audio/demo2.mp3' },
    { id: 6, title: 'Midnight Thoughts', artist: 'G Putnam', vibe: 'night', duration: '5:20', image: '/hero.jpg', url: '/audio/demo3.mp3' },
    { id: 7, title: 'Lift Me Higher', artist: 'G Putnam', vibe: 'uplifting', duration: '3:55', image: '/hero.jpg', url: '/audio/demo1.mp3' },
    { id: 8, title: 'Rain Dance', artist: 'G Putnam', vibe: 'melancholy', duration: '4:30', image: '/hero.jpg', url: '/audio/demo2.mp3' },
    { id: 9, title: 'Deep Work', artist: 'G Putnam', vibe: 'focus', duration: '6:00', image: '/hero.jpg', url: '/audio/demo3.mp3' },
  ];

  const filteredTracks = activeVibe === 'all' ? tracks : tracks.filter(t => t.vibe === activeVibe);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white pb-32">
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
          <button 
            onClick={() => filteredTracks.length > 0 && playTrack({ 
              id: filteredTracks[0].id.toString(), 
              url: filteredTracks[0].url, 
              title: filteredTracks[0].title, 
              artist: filteredTracks[0].artist 
            })}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-full transition"
          >
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
          {filteredTracks.length === 0 ? (
            <p className="text-neutral-400 text-center py-8">No tracks in this vibe yet. Try selecting a different mood!</p>
          ) : (
            <div className="space-y-2">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => playTrack({ id: track.id.toString(), url: track.url, title: track.title, artist: track.artist })}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition ${
                    currentTrack?.id === track.id.toString()
                      ? 'bg-cyan-900/30 border border-cyan-500/50'
                      : 'bg-neutral-900/50 hover:bg-neutral-800/50'
                  }`}
                >
                  <Image src={track.image} alt={track.title} width={48} height={48} className="rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{track.title}</div>
                    <div className="text-sm text-neutral-400">{track.artist}</div>
                  </div>
                  {currentTrack?.id === track.id.toString() && (
                    <div className="text-cyan-400">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </div>
                  )}
                  <div className="text-sm text-neutral-500">{track.duration}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-neutral-900 to-neutral-900/95 border-t border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Image src="/hero.jpg" alt={currentTrack.title} width={56} height={56} className="rounded" />
            <div className="flex-1">
              <div className="font-semibold">{currentTrack.title}</div>
              <div className="text-sm text-neutral-400">{currentTrack.artist}</div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={togglePlay}
                className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full transition"
              >
                {isPlaying ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black" />}
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
