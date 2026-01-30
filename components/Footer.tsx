"use client";

import Image from "next/image";
import Link from "next/link";
import gpmQr from "@/public/gpm_qr_code.jpg"; // put gpm_qr_code.jpg in /public

export default function GpmFooter() {
  return (
    <footer className="mt-16 border-t border-neutral-800 px-6 py-8 text-sm text-neutral-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* 985 help section */}
      <div>
        <p className="font-semibold uppercase tracking-[0.22em] text-amber-300">
          985 · Help & Support
        </p>
        <p className="mt-1 text-neutral-400">
          Questions about releases, rights, or usage? Email{" "}
          <a href="mailto:info@gputnammusic.com" className="underline">
            info@gputnammusic.com
          </a>
          .
        </p>
      </div>

      {/* WHO link with GPM bio */}
      <div>
        <Link href="/who" className="underline">
          WHO · G Putnam Music, LLC
        </Link>
        <p className="mt-1 text-neutral-500">
          Brief catalog + bio, same content as the WHO menu item.
        </p>
      </div>

      {/* QR code block */}
      <div className="flex flex-col items-center">
        <Image
          src={gpmQr}
          alt="G Putnam Music QR"
          className="h-24 w-24 rounded-md border border-neutral-700 bg-neutral-900"
        />
        <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-neutral-500">
          gputnammusic.com
        </p>
      </div>
    </footer>
  );
}
