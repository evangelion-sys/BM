
import React from 'react';
import { Tamagotchi, LofiWidget, FocusGarden } from './DigitalCompanion';
import InstallPWA from './InstallPWA';
import { Wrench, Radio, Leaf, Gamepad2, Share2, Link as LinkIcon, Check } from 'lucide-react';

const UtilitiesView: React.FC = () => {
  
  const handleShare = async () => {
    const shareData = {
      title: 'Black Mesa Uplink',
      text: 'Access the collaborative academic research platform.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert('UPLINK COORDINATES COPIED TO CLIPBOARD');
    }
  };

  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <Wrench /> SYSTEM EXTENSIONS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-8">
        
        {/* Module: Share Uplink */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[var(--theme-color)] transition-all flex flex-col">
           <h3 className="text-xl font-teko mb-4 flex items-center gap-2 text-white">
             <Share2 size={18} className="text-[var(--theme-color)]"/> UPLINK TRANSMISSION
           </h3>
           <p className="text-xs text-gray-500 mb-4 flex-1">
             Generate a secure frequency link to share this platform with other research personnel.
           </p>
           <button 
             onClick={handleShare}
             className="w-full border theme-border theme-text font-bold py-2 px-4 flex items-center justify-center gap-2 hover:bg-[var(--theme-color)] hover:text-black transition-colors"
           >
             <LinkIcon size={16} /> TRANSMIT COORDINATES
           </button>
        </div>

        {/* Module: PWA Install */}
        <InstallPWA />

        {/* Module 1: Focus Garden */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[var(--theme-color)] transition-all">
           <h3 className="text-xl font-teko mb-4 flex items-center gap-2 text-white">
             <Leaf size={18} className="text-green-500"/> FOCUS PROTOCOL
           </h3>
           <p className="text-xs text-gray-500 mb-4 h-8">
             Visual feedback for attention maintenance. Don't switch tabs to keep the garden growing.
           </p>
           <FocusGarden />
        </div>

        {/* Module 2: Lofi Radio */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[var(--theme-color)] transition-all">
           <h3 className="text-xl font-teko mb-4 flex items-center gap-2 text-white">
             <Radio size={18} className="text-blue-500"/> AUDITORY STIMULATION
           </h3>
           <p className="text-xs text-gray-500 mb-4 h-8">
             Low-frequency audio stream for increased concentration during research tasks.
           </p>
           <LofiWidget />
        </div>

        {/* Module 3: Companion */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[var(--theme-color)] transition-all">
           <h3 className="text-xl font-teko mb-4 flex items-center gap-2 text-white">
             <Gamepad2 size={18} className="text-pink-500"/> COMPANION UNIT
           </h3>
           <p className="text-xs text-gray-500 mb-4 h-8">
             Digital entity requires periodic maintenance to maintain morale.
           </p>
           <Tamagotchi />
        </div>

        {/* Module 4: Quick Tools Guide */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[var(--theme-color)] transition-all relative overflow-hidden">
           <h3 className="text-xl font-teko mb-4 flex items-center gap-2 text-white">
             <Wrench size={18} className="text-yellow-500"/> QUICK TOOLS OVERLAY
           </h3>
           <p className="text-xs text-gray-500 mb-4">
             Access the Dictionary, Google Scholar, Drive, and Telegram via the floating button in the bottom-right corner.
           </p>
           <div className="p-4 bg-[#111] border border-[#222] text-center">
             <div className="text-[10px] font-mono mb-2">TOOL SHORTCUTS</div>
             <div className="grid grid-cols-2 gap-2 text-xs">
               <div className="border border-[#333] p-2 text-gray-400">DICTIONARY</div>
               <div className="border border-[#333] p-2 text-gray-400">SCHOLAR</div>
               <div className="border border-[#333] p-2 text-gray-400">DRIVE</div>
               <div className="border border-[#333] p-2 text-gray-400">TELEGRAM</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesView;
