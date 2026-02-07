import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a100e] border-t border-[#5C3A1E]/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Footer Links Row */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <Link href="/who" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">Who</Link>
          <Link href="/heroes" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">Heroes</Link>
          <Link href="/artists" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">Artists</Link>
          <Link href="/jazz" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">Jazz</Link>
          <Link href="/uru" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">URU</Link>
          <Link href="/ships" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">Ships</Link>
          <Link href="/gift" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">Gift</Link>
          <Link href="/join" className="text-sm text-[#C4A882]/70 hover:text-[#D4A017] transition-colors">Join</Link>
        </div>
        {/* Copyright */}
        <p className="text-center text-xs text-[#C4A882]/40">
          G Putnam Music, LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
