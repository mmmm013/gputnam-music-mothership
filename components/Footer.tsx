import { Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2C241B] text-[#D2B48C] py-16 border-t border-[#8B4513]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* BRAND */}
        <div className="text-center md:text-left">
          <h4 className="text-2xl font-black uppercase text-[#FFE4B5] tracking-tight mb-2">G Putnam Music, LLC</h4>
          <p className="text-xs font-serif italic opacity-60">Est. 2024 • Normal, IL</p>
        </div>

        {/* QR CODE DISPLAY */}
        <div className="flex flex-col items-center gap-2">
            <div className="bg-white p-2 rounded-lg shadow-xl transform hover:scale-105 transition">
                <img src="/gpm_qr_code.png" alt="Scan to Connect" className="w-24 h-24 object-contain" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Scan to Connect</span>
        </div>

        {/* SOCIALS */}
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#DAA520] transition"><Instagram size={24} /></a>
          <a href="#" className="hover:text-[#DAA520] transition"><Youtube size={24} /></a>
          <a href="#" className="hover:text-[#DAA520] transition"><Mail size={24} /></a>
        </div>
      </div>
      <div className="text-center mt-12 text-[10px] uppercase tracking-widest opacity-30 border-t border-[#FFFDF5]/5 pt-8">
        © 2024 G Putnam Music. All Rights Reserved.
      </div>
    </footer>
  );
}
