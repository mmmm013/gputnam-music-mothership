'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Trophy, Timer, Users } from 'lucide-react';

// KLEIGH Brand Color
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
  // Core racers (always available)
  { id: 'gdp', name: 'GDP', icon: '🐴', color: '#8B4513', description: 'Black/Brown/White Stallion', frequency: 'always', speed: 1.0 },
  { id: 'msj', name: 'MSJ', icon: '🎹', color: '#000000', description: 'Piano BOT', frequency: 'always', speed: 0.95 },
  // Sometimes racers (from Racer Hotel)
  { id: 'burt', name: 'BURT', icon: '🌿', color: '#228B22', description: 'Female, Country, Plant-based', frequency: 'sometimes', speed: 1.05 },
  { id: 'brc', name: 'BRC', icon: '🔢', color: '#4169E1', description: 'Male, Math Guy', frequency: 'sometimes', speed: 0.98 },
  // Rare racer
  { id: 'lee', name: 'LEE', icon: '🍎', color: '#DC143C', description: 'School Teacher', frequency: 'rare', speed: 0.9 },
];

// Optimal race time: Saturday 7 PM CST (most user engagement)
const RACE_DAY = 6; // Saturday
const RACE_HOUR = 19; // 7 PM
const REPLAY_INTERVAL = 30 * 60 * 1000; // 30 minutes in ms

interface RaceState {
  isLive: boolean;
  isReplay: boolean;
  positions: { [key: string]: number };
  winner: string | null;
  raceTime: Date | null;
  participants: Racer[];
}

export default function WeeklyRace() {
  const [raceState, setRaceState] = useState<RaceState>({
    isLive: false,
    isReplay: false,
    positions: {},
    winner: null,
    raceTime: null,
    participants: [],
  });
  const [isUserActive, setIsUserActive] = useState(false);
  const [showReplayLink, setShowReplayLink] = useState(false);

  // Select participants based on frequency
  const selectParticipants = useCallback(() => {
    const always = RACERS.filter(r => r.frequency === 'always');
    const sometimes = RACERS.filter(r => r.frequency === 'sometimes');
    const rare = RACERS.filter(r => r.frequency === 'rare');
    
    // Always include core racers
    const selected = [...always];
    
    // 70% chance to include each 'sometimes' racer
    sometimes.forEach(racer => {
      if (Math.random() < 0.7) selected.push(racer);
    });
    
    // 20% chance for rare racer (LEE runs fewest races)
    rare.forEach(racer => {
      if (Math.random() < 0.2) selected.push(racer);
    });
    
    return selected;
  }, []);

  // Check if it's race time
  const isRaceTime = useCallback(() => {
    const now = new Date();
    return now.getDay() === RACE_DAY && now.getHours() === RACE_HOUR;
  }, []);

  // Run the race animation
  const runRace = useCallback((participants: Racer[], isReplay = false) => {
    const initialPositions: { [key: string]: number } = {};
    participants.forEach(r => { initialPositions[r.id] = 0; });
    
    setRaceState(prev => ({
      ...prev,
      isLive: !isReplay,
      isReplay,
      positions: initialPositions,
      winner: null,
      participants,
    }));

    // Animate race over 30 seconds
    const raceInterval = setInterval(() => {
      setRaceState(prev => {
        const newPositions = { ...prev.positions };
        let hasWinner = false;
        let winnerId = '';
        
        participants.forEach(racer => {
          if (!hasWinner && newPositions[racer.id] < 100) {
            // Random progress based on racer speed
            const progress = (Math.random() * 3 + 1) * racer.speed;
            newPositions[racer.id] = Math.min(100, newPositions[racer.id] + progress);
            
            if (newPositions[racer.id] >= 100 && !hasWinner) {
              hasWinner = true;
              winnerId = racer.id;
            }
          }
        });
        
        if (hasWinner) {
          clearInterval(raceInterval);
          return {
            ...prev,
            positions: newPositions,
            winner: winnerId,
            isLive: false,
            isReplay: false,
          };
        }
        
        return { ...prev, positions: newPositions };
      });
    }, 500);

    return () => clearInterval(raceInterval);
  }, []);

  // Track user activity to not interrupt
  useEffect(() => {
    const handleActivity = () => {
      setIsUserActive(true);
      // Reset after 5 seconds of inactivity
      setTimeout(() => setIsUserActive(false), 5000);
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  // Main race scheduler
  useEffect(() => {
    // Check for live race time
    const liveCheck = setInterval(() => {
      if (isRaceTime() && !raceState.isLive && !raceState.isReplay) {
        const participants = selectParticipants();
        runRace(participants, false);
        setShowReplayLink(true);
      }
    }, 60000); // Check every minute

    // Replay scheduler (every 30 min, only if user not active)
    const replayCheck = setInterval(() => {
      if (showReplayLink && !isUserActive && !raceState.isLive && !raceState.isReplay) {
        // Fail gracefully if conditions not met
        try {
          const participants = selectParticipants();
          runRace(participants, true);
        } catch (e) {
          console.log('[RACE] Replay skipped due to error');
        }
      }
    }, REPLAY_INTERVAL);

    return () => {
      clearInterval(liveCheck);
      clearInterval(replayCheck);
    };
  }, [isRaceTime, raceState, isUserActive, showReplayLink, selectParticipants, runRace]);

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
            Weekly Race
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
                  <span className="font-bold" style={{ color: racer.color }}>{racer.name}</span>
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

        {/* Schedule Info */}
        {!raceState.isLive && !raceState.isReplay && !raceState.winner && (
          <div className="text-center text-gray-400 py-8">
            <Users size={32} className="mx-auto mb-2" />
            <p>Next race: Saturday 7 PM CST</p>
            <p className="text-sm mt-1">Replays every 30 minutes</p>
          </div>
        )}
      </div>
    </section>
  );
}
