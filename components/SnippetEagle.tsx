'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Send, X, Bird } from 'lucide-react';

export default function SnippetEagle() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCaught, setIsCaught] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(-100); // Starts off-screen left

  // ANIMATION LOOP: Brave flies every 45 seconds
  useEffect(() => {
    const flightInterval = setInterval(() => {
      flyBrave();
    }, 45000); // 45 seconds

    // Initial flight after 5 seconds
    setTimeout(flyBrave, 5000);

    return () => clearInterval(flightInterval);
  }, []);

  const flyBrave = () => {
    if (isCaught) return;
    setIsVisible(true);
    setPosition(-100);
    
    // Animate across screen (10 seconds to cross)
    let pos = -100;
    const fly = setInterval(() => {
      pos += 1; // Speed
      setPosition(pos);
      if (pos > 110) { // Off screen right
        clearInterval(fly);
        setIsVisible(false);
      }
    }, 50);
  };

  const catchEagle = () => {
    setIsVisible(false); // Stop flying
    setIsCaught(true);   // Open Modal
  };

  const closeEagle = () => {
    setIsCaught(false);
    setIsPlaying(false);
  };

  return (
    <>
      {/* 1. THE FLYING EAGLE (Click to Catch) */}
      {isVisible && (
        <div 
          onClick={catchEagle}
          className="fixed z-40 cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
          style={{ 
            left: `${position}%`, 
            top: '20%', 
            transition: 'left 0.05s linear' 
          }}
        >
          {/* VISUAL: Natural Eagle Icon (Stoic) */}
          <div className="relative">
             <div className="text-[#3E2723] w-24 h-24">
                {/* We use an SVG or Icon here to represent Brave */}
                <Bird size={80} strokeWidth={1.5} fill="#795548" />
             </div>
             {/* THE SNIPPET IN CLAWS */}
             <div className="absolute -bottom-4 left-6 bg-[#FFD54F] w-8 h-6 rounded border border-[#3E2723] flex items-center justify-center animate-bounce">
                <span className="text-[8px] font-black">MP3</span>
             </div>
          </div>
          <div className="bg-white/80 px-2 py-1 rounded-full text-[10px] font-bold text-[#3E2723] mt-2 whitespace-nowrap">
             CATCH BRAVE!
          </div>
        </div>
      )}

      {/* 2. THE "CAUGHT" MODAL (Preview & Send) */}
      {isCaught && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeEagle}></div>
          
          <div className="relative bg-[#FFF8E1] border-4 border-[#3E2723] p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
             <button onClick={closeEagle} className="absolute top-2 right-2 text-[#3E2723]/50 hover:text-[#3E2723]"><X size={20}/></button>
             
             <div className="mx-auto bg-[#3E2723] text-[#FFD54F] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Bird size={40} />
             </div>

             <h2 className="text-2xl font-black text-[#3E2723] uppercase mb-1">Good Eye!</h2>
             <p className="text-xs font-bold text-[#E65100] uppercase tracking-widest mb-6">You caught a Mystery Snippet</p>

             {/* PREVIEW PLAYER */}
             <div className="bg-white border border-[#3E2723]/20 p-4 rounded-xl mb-6 flex items-center gap-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-[#FFD54F] rounded-full flex items-center justify-center border border-[#3E2723] shadow-sm hover:scale-105 transition"
                >
                   {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
                </button>
                <div className="text-left">
                   <div className="font-bold text-[#3E2723] text-sm">Mystery Clip #402</div>
                   <div className="text-[10px] opacity-50 font-mono">0:08s Preview</div>
                </div>
             </div>

             {/* THE 13 CENT SELL */}
             <div className="space-y-3">
                <a 
                   href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
                   target="_blank"
                   className="block w-full bg-[#3E2723] text-[#FFD54F] py-3 rounded-xl font-black uppercase tracking-wider hover:scale-105 transition shadow-lg flex items-center justify-center gap-2"
                >
                   <Send size={16} /> Send to Friend ($0.13)
                </a>
                <button onClick={closeEagle} className="text-xs font-bold text-[#3E2723]/50 hover:text-[#3E2723] underline">
                   Release Brave (Pass)
                </button>
             </div>
             
             <p className="mt-4 text-[9px] font-bold text-[#3E2723]/30 uppercase">
                Air Mail Fee covers delivery & royalties.
             </p>

          </div>
        </div>
      )}
    </>
  );
}
