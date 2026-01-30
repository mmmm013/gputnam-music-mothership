"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type PlayerState = {
  currentTrackId: string | null;
  isPlaying: boolean;
};

type PlayerContextValue = {
  state: PlayerState;
  playTrack: (id: string) => void;
  togglePlay: () => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrackId: null,
    isPlaying: false,
  });

  const playTrack = useCallback((id: string) => {
    setState({ currentTrackId: id, isPlaying: true });
  }, []);

  const togglePlay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const stop = useCallback(() => {
    setState({ currentTrackId: null, isPlaying: false });
  }, []);

  const value: PlayerContextValue = {
    state,
    playTrack,
    togglePlay,
    stop,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}
