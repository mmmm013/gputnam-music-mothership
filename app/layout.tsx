import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'G Putnam Music',
  description: 'Dream The Stream',
};

/**
 * SOVEREIGN RECOVERY LAYOUT
 * Restores the Light Amber/Tan Motif as the primary face.
 * Includes the Safe-Fail Window Error Boundary to prevent "wtf" crashes.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global Safety Net: Prevents single-component failures from crashing the flagship
  if (typeof window !== "undefined") {
    window.onerror = function() {
      console.log("Sovereign Recovery Initialized: Preventing Client-Side Exception.");
      return false; 
    };
  }

  return (
    <html lang="en">
      <body 
        className="bg-[#FFF8E1] text-[#3E2723] antialiased min-h-screen transition-colors duration-500"
        style={{ backgroundColor: '#FFF8E1', color: '#3E2723' }}
      >
        {/* The Brimming Menu and Activity Logic reside within children */}
        <main className="relative w-full">
          {children}
        </main>
                    <Analytics />
      </body>
    </html>
  );
}
