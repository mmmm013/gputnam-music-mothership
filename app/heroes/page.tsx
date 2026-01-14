'use client';

import { useState, useEffect } from 'react';
import { Heart, Shield, CheckCircle, Star, Video, Award, Lock } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HeroesPage() {
  const [step, setStep] = useState<'intro' | 'verifying' | 'approved'>('intro');
  const [scanProgress, setScanProgress] = useState(0);

  const startVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verifying');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setStep('approved');
      }
      setScanProgress(progress);
    }, 200);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Header />
      
      {/* TRIBUTE SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-20 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-yellow-600/30 bg-yellow-900/10 px-4 py-1 rounded-full mb-6">
            <Star size={14} className="text-yellow-500 fill-current" />
            <span className="text-xs font-bold text-yellow-500 tracking-[0.2em] uppercase">Honoring The 1st Wave</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            HONOR. SERVICE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">SACRIFICE.</span>
          </h1>
          
          <p className="text-lg text-neutral-300 leading-relaxed mb-8">
            Dedicated to the Founder's Grandfather, a Navy Medic who served in the 1st Wave at Hacksaw Ridge. 
            Like many, he carried the weight of silence. We honor that silence with music—a place to heal, reflect, and feel.
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
        </div>
      </section>

      {/* SECURITY FORM SECTION */}
      <div className="container mx-auto px-4 pb-20 relative z-20 -mt-12">
        <div className="max-w-2xl mx-auto bg-neutral-900 border border-white/10 rounded-3xl p-1 shadow-2xl">
          <div className="bg-neutral-950 rounded-t-[1.3rem] p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-500" />
              <span className="text-xs font-mono text-green-500 uppercase">GPM CYBER-OPS: ACTIVE</span>
            </div>
            <Lock size={14} className="text-neutral-600" />
          </div>

          <div className="p-8 md:p-12">
            {step === 'intro' && (
              <form onSubmit={startVerification} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Claim Your Heroes Access</h3>
                  <p className="text-sm text-neutral-400">
                    Nurses, Teachers, Military, First Responders. <br/>
                    Enter your professional email for <span className="text-green-400">Instant Security Clearance</span>.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Full Name</label>
                    <input type="text" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Business / Mil Email</label>
                    <input type="email" required placeholder="name@army.mil / @hospital.org" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none transition" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-200 transition flex items-center justify-center gap-2">
                  <Shield size={18} /> Initiate Security Check
                </button>
                <p className="text-[10px] text-center text-neutral-600">*Protected by GPM Cybersecurity Protocols. NPI Safe.</p>
              </form>
            )}

            {step === 'verifying' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-white animate-pulse">Running Security Protocols...</h3>
                <p className="text-xs text-green-400 font-mono mt-2">Checking Encryption: {scanProgress > 100 ? 100 : scanProgress}%</p>
                <div className="w-full h-1 bg-neutral-800 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-200" style={{ width: `${scanProgress}%` }}></div>
                </div>
              </div>
            )}

            {step === 'approved' && (
              <div className="animate-fade-in">
                <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl mb-8 flex items-center gap-4">
                  <div className="bg-green-500 rounded-full p-2"><CheckCircle size={32} className="text-black" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Certificate of Online Security</h4>
                    <p className="text-xs text-green-400 font-mono">ISSUED: {new Date().toLocaleDateString()} | ID: GPM-SEC-{Math.floor(Math.random()*10000)}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Welcome, Hero. Select Your Gift:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button className="p-4 bg-black border border-white/10 rounded-xl hover:border-pink-500 text-left transition group">
                    <div className="flex items-center gap-2 mb-2"><Star size={16} className="text-pink-500" /><span className="font-bold text-sm text-white">New Track Reviewer</span></div>
                    <p className="text-xs text-neutral-400 group-hover:text-white transition">Be the first to hear and rate new drops before the public.</p>
                  </button>
                  <button className="p-4 bg-black border border-white/10 rounded-xl hover:border-blue-500 text-left transition group">
                    <div className="flex items-center gap-2 mb-2"><Video size={16} className="text-blue-500" /><span className="font-bold text-sm text-white">5-Min Artist Zoom</span></div>
                    <p className="text-xs text-neutral-400 group-hover:text-white transition">Exclusive face-to-face chat with the creators on request.</p>
                  </button>
                  <button className="p-4 bg-black border border-white/10 rounded-xl hover:border-yellow-500 text-left transition group">
                    <div className="flex items-center gap-2 mb-2"><Award size={16} className="text-yellow-500" /><span className="font-bold text-sm text-white">3 Free K-Messages</span></div>
                    <p className="text-xs text-neutral-400 group-hover:text-white transition">Send 3 premium musical messages to loved ones for free.</p>
                  </button>
                  <button className="p-4 bg-black border border-white/10 rounded-xl hover:border-purple-500 text-left transition group">
                    <div className="flex items-center gap-2 mb-2"><Video size={16} className="text-purple-500" /><span className="font-bold text-sm text-white">Session Vault Access</span></div>
                    <p className="text-xs text-neutral-400 group-hover:text-white transition">Watch raw recording sessions & singer stories.</p>
                  </button>
                </div>
                <Link href="/" className="block w-full bg-white text-black text-center font-bold py-4 rounded-xl hover:scale-[1.02] transition uppercase tracking-widest">Enter The Music</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

