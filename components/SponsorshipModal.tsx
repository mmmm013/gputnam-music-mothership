'use client';

import { useState, useEffect } from 'react';

export default function SponsorshipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) setIsRendered(true);
    else setTimeout(() => setIsRendered(false), 300);
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      ></div>

      {/* Modal Content */}
      <div className={`relative bg-stone-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-2xl">
            💎
          </div>
          
          <h2 className="text-2xl font-bold text-white">Sponsor G Putnam Music</h2>
          
          <p className="text-stone-300 text-sm leading-relaxed">
            I operate on a <strong>Sponsorship Model</strong>. 
            If you value this stream, your direct support keeps the "One Stop Song Shop" alive.
          </p>

          <a 
            href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg rounded-xl transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
          >
            Sponsor Now ($5)
          </a>
          
          <p className="text-xs text-stone-500 pt-2">
            Secure payment via Stripe. No recurring fees unless you choose to.
          </p>
        </div>
      </div>
    </div>
  );
}