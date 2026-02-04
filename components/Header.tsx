import Link from 'next/link';
export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-[#1a100e]">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
        <div />
        <Link href="/" className="font-bold text-[#FFD54F]">GPM</Link>
        <div />
      </div>
    </nav>
  );
}
