'use client';

import { useState, useRef, FormEvent } from 'react';
import {
  Shield,
  Zap,
  Mic,
  Clock,
  Lock,
  Download,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
} from 'lucide-react';

type Mode = 'hub' | 'rckls' | 'clover';
type MixType = 'full' | 'inst';

interface Track {
  id: string;
  title: string;
  bpm?: number;
  url?: string;
  url2?: string;
  artist?: string;
  [key: string]: any;
}

export default function MipInner() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [mode, setMode] = useState<Mode>('hub');
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixType, setMixType] = useState<MixType>('full');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // AUTH
  const checkPass = (e: FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'gpmpro26') {
      setAccessGranted(true);
    } else {
      alert('Access Denied.');
    }
  };

  // FETCH – placeholder only, no Supabase
  const enterVault = async (targetMode: Mode) => {
    setMode(targetMode);
    // TODO: later you can setPlaylist(...) from Supabase or static data
  };

  // PLAY LOGIC (with Time Preservation for Mix Switch)
  const handlePlay = (track: Track) => {
    if (!audioRef.current) return;

    const wasSameTrack = activeTrack && activeTrack.id === track.id;
    const currentTime = audioRef.current.currentTime;

    // If different track, update src
    if (!wasSameTrack) {
      audioRef.current.src =
        mixType === 'full'
          ? track.url || ''
          : track.url2 || track.url || '';
    }

    // Preserve time when switching full/inst on same track
    if (wasSameTrack) {
      audioRef.current.currentTime = currentTime;
    } else {
      audioRef.current.currentTime = 0;
    }

    audioRef.current.play();
    setActiveTrack(track);
    setIsPlaying(true);
  };

  const toggleMixType = () => {
    if (!activeTrack || !audioRef.current) {
      setMixType((prev) => (prev === 'full' ? 'inst' : 'full'));
      return;
    }

    const currentTime = audioRef.current.currentTime;
    const newType = mixType === 'full' ? 'inst' : 'full';
    setMixType(newType);

    const newUrl =
      newType === 'full'
        ? activeTrack.url || ''
        : activeTrack.url2 || activeTrack.url || '';

    const isDifferent = audioRef.current.src !== newUrl;
    if (isDifferent) {
      audioRef.current.src = newUrl;
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {!accessGranted ? (
        <form
          onSubmit={checkPass}
          className="flex flex-col gap-4 max-w-sm w-full"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              MIP ACCESS
            </span>
          </div>

          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter vault passcode"
            className="w-full rounded border border-emerald-500 bg-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded bg-emerald-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-emerald-400"
          >
            <Lock className="w-4 h-4" />
            Enter
          </button>
        </form>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* MODE SWITCHER */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => enterVault('hub')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs uppercase tracking-[0.2em] ${
                  mode === 'hub'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-zinc-700 text-zinc-400'
                }`}
              >
                <Zap className="w-3 h-3" />
                Hub
              </button>
              <button
                onClick={() => enterVault('rckls')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs uppercase tracking-[0.2em] ${
                  mode === 'rckls'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-zinc-700 text-zinc-400'
                }`}
              >
                <Mic className="w-3 h-3" />
                RCKLS
              </button>
              <button
                onClick={() => enterVault('clover')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs uppercase tracking-[0.2em] ${
                  mode === 'clover'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-zinc-700 text-zinc-400'
                }`}
              >
                <CheckCircle className="w-3 h-3" />
                Clover
              </button>
            </div>

            {/* MIX TOGGLE */}
            <button
              onClick={toggleMixType}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-300"
            >
              {mixType === 'full' ? (
                <>
                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                  Full Mix
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-emerald-400" />
                  Instrumental
                </>
              )}
            </button>
          </div>

          {/* PLAYER AREA */}
          <div className="border border-zinc-800 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Now Playing
                </div>
                <div className="text-lg font-semibold">
                  {activeTrack ? activeTrack.title : 'Select a track'}
                </div>
                {activeTrack?.artist && (
                  <div className="text-xs text-zinc-400">
                    {activeTrack.artist}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-zinc-400" />
                <Download className="w-4 h-4 text-zinc-400" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button className="p-2 rounded-full border border-zinc-700 text-zinc-300">
                <SkipBack className="w-4 h-4" />
              </button>

              {isPlaying ? (
                <button
                  className="p-3 rounded-full bg-emerald-500 text-black"
                  onClick={handlePause}
                >
                  <Pause className="w-5 h-5" />
                </button>
              ) : (
                <button
                  className="p-3 rounded-full bg-emerald-500 text-black"
                  onClick={() => {
                    if (activeTrack) handlePlay(activeTrack);
                  }}
                >
                  <Play className="w-5 h-5" />
                </button>
              )}

              <button className="p-2 rounded-full border border-zinc-700 text-zinc-300">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HIDDEN AUDIO ELEMENT */}
          <audio ref={audioRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
