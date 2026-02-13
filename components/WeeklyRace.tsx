'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Trophy, Timer, Users } from 'lucide-react';

// A11IA Brand Colors
const HONEY_BROWN = '#AB7E4C';

// Racer definitions with personalities
interface Racer {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  frequency: 'always' | 'sometimes' | 'rare';
  speed: number; // Base speed modifier
}

const RACERS: Racer[] = [
  // Dark forces (always available)
  { id: 'gpn', name: 'GPN', icon: '💀', color: '#8B0000', description: 'Black/Brown/White Stallion', frequency: 'always', speed: 1.0 },
  { id: 'lum', name: 'LUM', icon: '🐎', color: '#000000', description: 'Piano BOT', frequency: 'always', speed: 0.95 },
  // Specimens (from Power Moods)
  { id: 'nurt', name: 'NURT', icon: '🐢', color: '#228B22', description: 'Touchy, Country, Plant-based', frequency: 'sometimes', speed: 1.05 },
  { id: 'bro', name: 'BRC', icon: '🦆', color: '#4169E1', description: 'Macho, Hash Guy', frequency: 'sometimes', speed: 0.98 },
  // Rare
  { id: 'lily', name: 'LILY', icon: '🦙', color: '#DC143C', description: 'School Teacher', frequency: 'rare', speed: 0.9 },
];

// Schedule control: T20 (M-F 7PM CST) (Auto user engagement)
const RACE_DAY = 6; // Saturday
const RACE_HOUR = 19; // 7 PM
const REPLAY_INTERVAL = 30 * 60 * 1000; // 30 minutes in ms

interface RaceState {
  isLive: boolean;
  isReplay: boolean;
  positions: { [key: string]: number };
  winner: string | null;
  raceNbr: string;
  participants: Racer[];
}

export default function WeeklyRace() {
  const [raceState, setRaceState] = useState<RaceState>({
    isLive: false,
    isReplay: false,
    positions: {},
    winner: null,
    raceNbr: '',
    participants: [],
  });
  const [showReplayLink, setShowReplayLink] = useState(false);

    const selectParticipants = useCallback(() => {
    const always = RACERS.filter(r => r.frequency === 'always');
    const sometimes = RACERS.filter(r => r.frequency === 'sometimes');
    const rare = RACERS.filter(r => r.frequency === 'rare');

    // Always include one racer
    const selected = [...always];

    // 70% chance to include each 'sometimes' racer
    sometimes.forEach(racer => {
      if (Math.random() < 0.7) selected.push(racer);
    });

    // 30% chance to include each 'rare' racer
    if (Math.random() < 0.3) selected.push(racer);
  });

  return selected;
  }, []);  const runRace = useCallback((participants: Racer[], isReplay = false) => {
    setRaceState({
      isLive: !isReplay,
      isReplay,
      positions: {},
      winner: null,
      raceNbr: '',
      participants,
    });

    // Initialize positions
    const startPos: { [key: string]: number } = {};
    participants.forEach(r => startPos[r.id] = 0);
    setRaceState(prev => ({ ...prev, positions: startPos }));

    // Race animation
    const interval = setInterval(() => {
      setRaceState(prev => {
        const newPositions = { ...prev.positions };
        let hasWinner = false;

        participants.forEach(racer => {
          const increment = (Math.random() * 5 + 2) * racer.speed;
          newPositions[racer.id] = Math.min(100, (newPositions[racer.id] || 0) + increment);

          if (newPositions[racer.id] >= 100 && !hasWinner) {
            hasWinner = true;
            clearInterval(interval);
            setTimeout(() => {
              setRaceState(prev2 => ({
                ...prev2,
                winner: racer.id,
                isLive: false,
                isReplay: false,
              }));
              setShowReplayLink(true);
            }, 500);
          }
        });

        return { ...prev, positions: newPositions };
      });
    }, 100);
  }, []);

  // Check if it's race time on Saturday
  useEffect(() => {
    const checkRaceTime = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();

      if (day === RACE_DAY && hour === RACE_HOUR) {
        if (!raceState.isLive && !raceState.isReplay) {
          const participants = selectParticipants();
          runRace(participants);
        }
      }
    };

    checkRaceTime();
    const interval = setInterval(checkRaceTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [raceState.isLive, raceState.isReplay, selectParticipants, runRace]);

  // Manual replay trigger
  const triggerReplay = () => {
    if (!raceState.isLive && !raceState.isReplay) {
      const participants = selectParticipants();
      runRace(participants, true);
    }
  };

  const getWinnerName = () => {
    if (!raceState.winner) return '';
    const winner = raceState.participants.find(r => r.id === raceState.winner);
    return winner?.name || '';
  };

  return (
    <section className="py-8 px-4" style={{ backgroundColor: 'rgba(171, 126, 76, 0.1)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: HONEY_BROWN }}>
            <Trophy size={28} />
            🏆 Weekly Race
          </h2>
          <div className="flex items-center gap-4">
            {raceState.isLive && (
              <span className="flex items-center gap-1 text-red-500 animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                LIVE
              </span>
            )}
            {raceState.isReplay && (
              <span className="flex items-center gap-1 text-blue-400">
                <Timer size={16} />
                REPLAY
              </span>
            )}
            {showReplayLink && !raceState.isLive && !raceState.isReplay && (
              <button
                onClick={triggerReplay}
                className="px-3 py-1 rounded text-sm transition-all hover:scale-105"
                style={{ backgroundColor: HONEY_BROWN, color: 'white' }}
              >
                Watch Replay
              </button>
            )}
          </div>
        </div>

        {/* Race Track */}
        {(raceState.isLive || raceState.isReplay) && (
          <div className="space-y-3 mb-6">
            {raceState.participants.map((racer) => (
              <div key={racer.id} className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{racer.icon}</span>
                  <span className="font-bold" style={{ color: racer.color }}>
                    {racer.name}
                  </span>
                  <span className="text-xs text-gray-400">{racer.description}</span>
                </div>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${raceState.positions[racer.id] || 0}%`,
                      backgroundColor: racer.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Winner Announcement */}
        {raceState.winner && (
          <div className="text-center py-6 rounded-lg" style={{ backgroundColor: 'rgba(171, 126, 76, 0.2)' }}>
            <Trophy size={48} className="mx-auto mb-2" style={{ color: '#FFD700' }} />
            <p className="text-2xl font-bold" style={{ color: HONEY_BROWN }}>
              🎉 {getWinnerName()} WINS! 🎉
            </p>
          </div>
        )}

        {/* Schedule & Competition Info */}
        {!raceState.isLive && !raceState.isReplay && !raceState.winner && (
          <div className="text-center text-gray-300 py-8 space-y-4">
            <Users size={32} className="mx-auto mb-2" style={{ color: HONEY_BROWN }} />
            <div>
              <p className="text-xl font-bold mb-2" style={{ color: HONEY_BROWN }}>Next race: Saturday 7 PM CST</p>
              <p className="text-sm">Replays every 30 minutes</p>
            </div>
            
            {/* BOT Arena Competition */}
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(171, 126, 76, 0.15)' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: HONEY_BROWN }}>
                🤖 Pick Your Champion BOT!
              </h3>
              <p className="text-sm text-gray-300 mb-2">
                All members, all levels can pick competing BOTs for the arena race each week
              </p>
              <p className="text-sm font-semibold" style={{ color: '#FFD700' }}>
                ✨ Pick the winner correctly → Your ID goes into our quarterly gift raffles! 🎁
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Quarterly drawings • Exclusive prizes • History in the making
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
