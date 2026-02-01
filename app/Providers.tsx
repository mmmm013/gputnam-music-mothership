'use client';

import { PlayerProvider } from './PlayerContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <PlayerProvider>{children}</PlayerProvider>;
}
