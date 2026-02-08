
import React from 'react';
import { LofiWidget } from './DigitalCompanion';
import InstallPWA from './InstallPWA';
import { Wrench, Radio } from 'lucide-react';

const UtilitiesView: React.FC = () => {
  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <Wrench /> SYSTEM EXTENSIONS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-8">
        
        {/* Module: PWA Install */}
        <InstallPWA />

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
      </div>
    </div>
  );
};

export default UtilitiesView;
