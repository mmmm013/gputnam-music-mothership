'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[#D2B48C]/30 bg-[#4A2C2A] text-[#FFE4B5]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-[2fr,1.5fr,1.2fr] items-start">
        {/* BRAND / QR */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-[#DAA520]">
            G Putnam Music
          </h2>
          <p className="text-sm text-[#FFE4B5]/80 leading-relaxed">
            Music intelligence, pathways, and Featured Playlists designed for BIC‑level experiences.
          </p>

          <div className="mt-4 inline-flex items-center gap-4">
            <div className="relative h-24 w-24 rounded-md overflow-hidden bg-white">
              <Image
                src="/gpm_qr_code.jpg"
                alt="Scan to connect with G Putnam Music"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <p className="text-xs text-[#FFE4B5]/80 max-w-[14rem]">
              Scan the code to open GPM pathways and Featured Playlists on your device.
            </p>
          </div>
        </div>

        {/* FEATURED PLAYLISTS PLACEHOLDER */}
        <div>
          <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-[#DAA520] mb-4">
            Featured Playlists
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-[#FFE4B5]">Feeling Box: Happy</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFE4B5]/70">
                Free samples
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[#FFE4B5]">Feeling Box: Calm</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFE4B5]/70">
                Free samples
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[#FFE4B5]">Feeling Box: Brave</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFE4B5]/70">
                Free samples
              </span>
            </li>
          </ul>
          <p className="mt-3 text-[11px] text-[#FFE4B5]/70 leading-snug">
            Tracks in Featured Playlists play as free samples while they are featured. Outside Featured Playlists, normal access rules apply.
          </p>
        </div>

        {/* FOOTER NAV / LEGAL */}
        <div className="text-right text-[11px] space-y-2">
          <div className="space-x-3">
            <Link
              href="/who"
              className="hover:text-white underline decoration-[#DAA520] underline-offset-4"
            >
              Who Is GPM?
            </Link>
            <Link
              href="/ships"
              className="hover:text-white underline decoration-[#DAA520] underline-offset-4"
            >
              Ships
            </Link>
          </div>
          <p className="text-[#FFE4B5]/70">© {year} G Putnam Music. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
