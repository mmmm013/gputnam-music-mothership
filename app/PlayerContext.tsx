"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export type Track = {
  id: string;
  title: string;
  artist?: string;
  src?: string; // url to audio file
  [k: string]: any;
};

type PlayerContextValue = {
  queue: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (id: string) => void;
  setPlaylist: (tracks: Track[], startId?: string) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentTrack = currentIndex >= 0 && queue[currentIndex] ? queue[currentIndex] : null;

  // sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.src) {
      if (audio.src !== currentTrack.src) {
        audio.src = currentTrack.src;
      }
    } else {
      audio.removeAttribute("src");
      audio.load();
    }
    if (isPlaying) {
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  // When audio naturally ends, advance
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      setIsPlaying(false);
      // advance to next if available
      setCurrentIndex((idx) => {
        const next = idx + 1;
        if (next < queue.length) {
          setIsPlaying(true);
          return next;
        }
        return idx;
      });
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [queue.length]);

  const setPlaylist = useCallback((tracks: Track[], startId?: string) => {
    setQueue(tracks);
    if (startId) {
      const idx = tracks.findIndex((t) => t.id === startId);
      setCurrentIndex(idx >= 0 ? idx : 0);
      setIsPlaying(true);
    } else {
      setCurrentIndex(tracks.length > 0 ? 0 : -1);
      setIsPlaying(false);
    }
  }, []);

  const playTrack = useCallback((id: string) => {
    setQueue((q) => {
      const idx = q.findIndex((t) => t.id === id);
      if (idx >= 0) {
        setCurrentIndex(idx);
        setIsPlaying(true);
      }
      return q;
    });
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((v) => !v);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentIndex((idx) => {
      const next = Math.min(idx + 1, queue.length - 1);
      if (next !== idx) setIsPlaying(true);
      return next;
    });
  }, [queue.length]);

  const prevTrack = useCallback(() => {
    setCurrentIndex((idx) => {
      const prev = Math.max(idx - 1, 0);
      if (prev !== idx) setIsPlaying(true);
      return prev;
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, v));
  }, []);

  const value: PlayerContextValue = {
    queue,
    currentTrack,
    isPlaying,
    playTrack,
    setPlaylist,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        style={{ display: "none" }}
        preload="metadata"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}