'use client';
import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import MarketingDashboard from '@/components/MarketingDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'gpmboss26') setIsAuthenticated(true);
    else alert('ACCESS DENIED');
  };

  if (isAuthenticated) return <MarketingDashboard />;

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-[#FFD54F]">
      <div className="bg-[#263238] p-8 rounded-3xl border border-[#FFD54F]/20 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-[#FFD54F] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1a1a1a]">
          <Lock size={40} />
        </div>
        <h1 className="text-2xl font-black uppercase mb-8">GPMOD LOCKED</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER KEY"
            className="w-full bg-black/30 border border-[#FFD54F]/30 rounded-lg px-4 py-3 text-center text-[#FFD54F]"
            autoFocus
          />
          <button type="submit" className="w-full bg-[#FFD54F] text-[#1a1a1a] font-black py-3 rounded-lg">
            UNLOCK
          </button>
        </form>
      </div>
    </main>
  );
}
