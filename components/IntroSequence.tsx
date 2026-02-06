import React, { useEffect, useState } from 'react';
import { TEAM_CREDITS } from '../types';

interface IntroProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence timing
    const timers = [
      setTimeout(() => setStep(1), 1000), // Show Logo
      setTimeout(() => setStep(2), 3000), // Show Credits
      setTimeout(() => setStep(3), 6000), // Show Button
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (step === 4) return null; // Unmounted in parent

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center text-[#ff9900] select-none">
      
      {/* Step 1: Logo */}
      <div className={`transition-opacity duration-1000 flex flex-col items-center ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-32 h-32 border-4 border-[#ff9900] rounded-full flex items-center justify-center mb-8 relative animate-pulse shadow-[0_0_20px_#ff9900]">
          <div className="text-6xl font-black font-teko translate-y-[-4px]">λ</div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#ff9900] rounded-tr-full"></div>
        </div>
        <h1 className="text-4xl md:text-6xl font-teko tracking-[0.2em] text-glow">BLACK MESA</h1>
        <p className="text-sm md:text-xl tracking-widest mt-2 opacity-80">RESEARCH FACILITY</p>
      </div>

      {/* Step 2: Credits */}
      <div className={`mt-16 text-center transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="border-b border-[#ff9900] inline-block px-4 pb-1 mb-4 text-xs tracking-widest uppercase">Personnel Identified</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-left">
          {TEAM_CREDITS.map((member, idx) => (
            <div key={idx} className="flex justify-between w-64 md:w-80 font-mono text-sm">
              <span className="opacity-70">{member.name}</span>
              <span className="font-bold">{member.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Button */}
      <div className={`mt-16 transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={onComplete}
          className="px-8 py-3 border border-[#ff9900] hover:bg-[#ff9900] hover:text-black transition-all duration-300 font-teko text-2xl tracking-widest uppercase group relative overflow-hidden"
        >
          <span className="relative z-10">Enter Uplink</span>
          <div className="absolute inset-0 bg-[#ff9900] opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] text-gray-600 font-mono">
        v.45.1.a // SECURE CONNECTION ESTABLISHED
      </div>
    </div>
  );
};

export default IntroSequence;
