'use client';
import { Bird } from 'lucide-react';

interface BraveTriggerProps {
  heroTrack?: string;
  mood?: string;
  label?: string;
}

export default function BraveTrigger({ 
  heroTrack = 'Believe It', 
  mood = 'Heroic',
  label = 'Summon Brave'
}: BraveTriggerProps) {
  
  const handleSummon = () => {
    // Trigger Brave to fly with specific hero track
    // This integrates with SnippetEagle system
    console.log(`Summoning Brave with track: ${heroTrack}, mood: ${mood}`);
    
    // Dispatch custom event for SnippetEagle to catch
    const event = new CustomEvent('summonBrave', {
      detail: { heroTrack, mood }
    });
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleSummon}
      className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold uppercase tracking-widest rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <Bird size={24} className="animate-pulse" />
      <span>{label}</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
    </button>
  );
}
