import AdminUpload from '@/components/AdminUpload';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#2d1b18] p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center py-6 border-b border-white/10 mb-8">
          <h1 className="text-xl font-bold text-white tracking-widest">GPM <span className="text-[#FFD54F]">COMMAND</span></h1>
          <Link href="/" className="text-xs text-[#FFD54F] hover:underline opacity-50 hover:opacity-100">← Back to Flagship</Link>
        </div>
        
        <AdminUpload />
        
        <div className="mt-8 text-center text-white/20 text-xs font-mono">
          System Authority: G. Putnam & M. Clay<br/>
          Six Sigma Control Active
        </div>
      </div>
    </main>
  );
}
