// components/CubButton.tsx
import { useState } from 'react';
import CubModal from './CubModal';

export default function CubButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-primary text-background font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all border-2 border-primary"
      >
        JOIN THE CUBs
      </button>

      {isOpen && <CubModal onClose={() => setIsOpen(false)} />}
    </>
  );
}