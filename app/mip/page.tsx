'use client';

import { useState } from 'react';
import { Shield, Zap, Mic, Lock, Download, Play, Pause, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://eajxgrbxvkhfmmfiotpm.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function MipPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [mode, setMode] = useState<'hub' | 'rckls' | 'clover'>('hub');
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. THE LOCK (Authentication Function)
  const checkPass = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this checks a real DB or Environment Variable.
    // For now, we simulate the "Pro Code".
    if (passcode.toLowerCase() === 'gpmpro26') {
      setAccessGranted(true);
    } else {
      alert('Access Denied. Industry Professionals Only.');
    }
  };

  // 2. THE FORK (Segmentation Function)
  const enterVault = async (targetMode: 'rckls' | 'clover') => {
    setMode(targetMode);
    
    // FETCH LOGIC: RCKLS = High Energy/Rock | CLOVER = Acoustic/Vocal
    const tagFilter = targetMode === 'rckls' ? 'energy,rock,sync,sport' : 'acoustic,vocal,folk,piano';
    
    const { data } = await supabase
      .from('tracks')
      .select('*')
      .or(`tags.ilike.%${tagFilter.split(',').join('%,tags.ilike.%')}%`)
      .limit(20);
      
    if (data) setPlaylist(data);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  // --- VIEW 1: THE GATE ---
  if (!accessGranted) {
    return (
      <main className="min-h-screen w-full bg-[#212121] text-white flex flex-col items-center justify-center p-4">
        <Shield size={64} className="text-[#FFD54F] mb-6" />
        <h1 className="text-3xl font-black uppercase tracking-widest mb-2">MIP Portal</h1>
        <p className="text-xs font-mono text-gray-500 mb-8">Wholesale & Sync Licensing Division</p>
        
        <form onSubmit={checkPass} className="flex flex-col gap-4 w-full max-w-xs">
           <input 
             type="password" 
             value={passcode}
             onChange={(e) => setPasscode(e.target.value)}
             placeholder="Enter Pro Access Code"
             className="bg-black/50 border border-gray-700 p-4 rounded-lg text-center text-white font-mono tracking-[0.5em] focus:outline-none focus:border-[#FFD54F]"
           />
           <button type="submit" className="bg-[#FFD54F] text-black font-black py-3 rounded-lg hover:scale-105 transition uppercase">
             Unlock Vault
           </button>
        </form>
        <p className="mt-8 text-[9px] text-gray-700 uppercase">Restricted Access. G Putnam Music, LLC.</p>
      </main>
    );
  }

  // --- VIEW 2: THE DASHBOARD (The Split & Player) ---
  return (
    <main className={`min-h-screen w-full transition-colors duration-500 ${mode === 'rckls' ? 'bg-[#b71c1c]' : mode === 'clover' ? 'bg-[#2E7D32]' : 'bg-[#212121]'} text-white`}>
      
      {/* PRO NAV */}
      <nav className="p-4 bg-black/40 backdrop-blur-md flex justify-between items-center sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <span className="font-black text-xl tracking-tighter">GPM <span className="text-[#FFD54F]">MIP</span></span>
            {mode !== 'hub' && (
              <button onClick={() => setMode('hub')} className="text-[10px] font-bold uppercase bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition">
                 ← Return to Hub
              </button>
            )}
         </div>
         <div className="text-[10px] font-mono opacity-50">Valid Session: 24h</div>
      </nav>

      {/* HUB VIEW */}
      {mode === 'hub' && (
        <div className="container mx-auto px-4 h-[80vh] flex flex-col md:flex-row items-center justify-center gap-8">
           
           {/* DOOR 1: RCKLS */}
           <div 
             onClick={() => enterVault('rckls')}
             className="group w-full md:w-1/2 h-64 md:h-96 bg-black border border-red-900 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#b71c1c] transition duration-500 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
              <Zap size={64} className="text-red-500 group-hover:text-white mb-4 transition" />
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">RCKLS</h2>
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-2">Sync • Sports • Action</p>
           </div>

           {/* DOOR 2: VOICECLOVER */}
           <div 
             onClick={() => enterVault('clover')}
             className="group w-full md:w-1/2 h-64 md:h-96 bg-black border border-green-900 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#2E7D32] transition duration-500 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
              <Mic size={64} className="text-green-500 group-hover:text-white mb-4 transition" />
              <h2 className="text-4xl font-black font-serif uppercase tracking-widest">VoiceClover</h2>
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-2">Acoustic • Drama • Vocal</p>
           </div>

        </div>
      )}

      {/* VAULT VIEW (Playlist) */}
      {mode !== 'hub' && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
           <div className="text-center mb-12">
              <h1 className="text-6xl font-black opacity-20 uppercase">{mode === 'rckls' ? 'High Voltage' : 'Pure Organic'}</h1>
              <p className="font-bold tracking-widest uppercase -mt-4">Available for Licensing</p>
           </div>

           <div className="bg-black/40 rounded-3xl p-8 border border-white/10 backdrop-blur-lg">
              {playlist.length === 0 ? (
                 <div className="text-center opacity-50 py-10">Loading Pro Assets...</div>
              ) : (
                 <div className="space-y-2">
                    {playlist.map((track, idx) => (
                       <div key={track.id} className="flex items-center justify-between p-4 hover:bg-white/10 rounded-xl transition group">
                          <div className="flex items-center gap-4">
                             <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition">
                                <Play size={16} fill="black" className="ml-1" />
                             </button>
                             <div>
                                <div className="font-bold text-lg leading-none">{track.title}</div>
                                <div className="text-xs opacity-50 font-mono mt-1">ID: {track.id.split('-')[0]} | WAV AVAILABLE</div>
                             </div>
                          </div>
                          
                          {/* 4. THE ACQUISITION (Download/License) */}
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition">
                             <button className="bg-white/20 hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2">
                                <Download size={14} /> Stem
                             </button>
                             <button className="bg-[#FFD54F] text-black px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2">
                                <Lock size={14} /> License
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      )}

    </main>
  );
}
