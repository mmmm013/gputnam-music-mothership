import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-black text-center border-t border-gray-800">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h3 className="text-xl font-bold tracking-widest text-white uppercase">G Putnam Music, LLC</h3>
        <p className="text-xs text-amber-500 tracking-wide">STREAM. SPONSOR. DREAM.</p>
        <p className="text-gray-600 text-xs mt-4">&copy; 2026 All Rights Reserved.</p>
      </div>
    </footer>
  );
}
