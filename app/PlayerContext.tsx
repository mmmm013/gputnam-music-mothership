"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaylist: (tracks: Track[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchMusic = async () => {
      console.log("🎵 Connecting to G Putnam Archives (gpmc_tracks)...");

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("gpmc_tracks")
        .select("id, title, artist, url")
        .order("title", { ascending: true });

      if (error) {
        console.error("❌ Error loading music:", error.message);
        return;
      }

      if (data && data.length > 0) {
        console.log(`✅ Loaded ${data.length} tracks from gpmc_tracks`);
        const tracks = data as Track[];
        setQueue(tracks);
        setCurrentTrack(tracks[0]);
      } else {
        console.warn("⚠️ Connected to gpmc_tracks, but found 0 rows.");
      }
    };

    fetchMusic();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;

    if (isPlaying) {
      audio.play().catch((err) => console.error("Audio play error:", err));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (newQueue) {
      setQueue(newQueue);
    } else if (queue.length === 0) {
      setQueue([track]);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying((prev) => !prev);
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const nextIndex =
      currentIndex === -1 || currentIndex === queue.length - 1
        ? 0
        : currentIndex + 1;
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  const setPlaylist = (tracks: Track[]) => {
    setQueue(tracks);
    setCurrentTrack(tracks.length > 0 ? tracks[0] : null);
    setIsPlaying(false);
  };

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      queue,
      playTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      setPlaylist,
    }),
    [currentTrack, isPlaying, queue]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
