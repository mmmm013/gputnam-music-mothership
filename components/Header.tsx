import Link from 'next/link';
export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-[#5C3A1E]/40 h-16 bg-[#2A1506] shadow-lg">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <div />
        <Link href="/" className="font-bold text-[#D4A017] text-lg tracking-wide">GPM</Link>
        <div />
      </div>
    </nav>
  );
}
