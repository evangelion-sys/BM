
import React, { useEffect, useState } from 'react';
import { Power, Radio } from 'lucide-react';
import { playClickSound } from '../services/audioService';

interface IntroProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isBreaching, setIsBreaching] = useState(false);
  const [terminalText, setTerminalText] = useState<string[]>([]);

  useEffect(() => {
    // Sequence timing
    const timers = [
      setTimeout(() => setStep(1), 500),  // Logo
      setTimeout(() => setStep(2), 3500), // G-Man 1
      setTimeout(() => setStep(3), 8000), // G-Man 2
      setTimeout(() => setStep(4), 11500),// Button
    ];
    
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnterVoid = () => {
    playClickSound(); // Mechanical click
    setIsBreaching(true);
    
    // Simulate high-speed terminal loading during the breach
    const logs = [
      "INITIALIZING RESONANCE CASCADE...",
      "BYPASSING SECURITY PROTOCOLS...",
      "LAMBDA CORE: ONLINE",
      "XEN RELAY: ESTABLISHED",
      "SUBJECT: FREEMAN - STATUS: ACTIVE",
      "SYSTEM BREACH DETECTED",
      "WELCOME TO BLACK MESA"
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalText(prev => [...prev, log]);
      }, index * 150);
    });

    // Animation duration matches CSS 'hyperspace-tunnel' (2.5s)
    setTimeout(() => {
      onComplete();
    }, 2400); 
  };

  if (step === 5 && !isBreaching) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center theme-text select-none overflow-hidden ${isBreaching ? 'breach-active' : ''}`}>
      
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 animate-pulse"></div>
      
      {/* Whiteout Flash Layer */}
      {isBreaching && <div className="absolute inset-0 z-[100] whiteout-active pointer-events-none"></div>}
      
      {/* Breach Overlay: Terminal Text */}
      {isBreaching && (
        <div className="absolute inset-0 flex items-center justify-center z-[60]">
           <div className="font-mono text-xs md:text-sm text-[var(--theme-color)] opacity-80 leading-tight">
             {terminalText.map((t, i) => (
               <div key={i} className="glitch-text">{`> ${t}`}</div>
             ))}
           </div>
        </div>
      )}

      {/* Step 1: Logo (Static) */}
      <div className={`transition-all duration-1000 flex flex-col items-center absolute ${step === 1 && !isBreaching ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="w-32 h-32 border-4 theme-border rounded-full flex items-center justify-center mb-8 relative shadow-[0_0_50px_var(--theme-color)]">
          <div className="text-6xl font-black font-teko translate-y-[-4px]">λ</div>
          {/* Static Rings */}
          <div className="absolute inset-0 border-t-2 border-transparent border-t-[var(--theme-color)] rounded-full rotate-45 opacity-50"></div>
          <div className="absolute inset-0 border-b-2 border-transparent border-b-[var(--theme-color)] rounded-full -rotate-12 opacity-50"></div>
        </div>
        <h1 className="text-6xl font-teko tracking-[0.2em] text-glow glitch-text">BLACK MESA</h1>
      </div>

      {/* Step 2: G-Man Message 1 */}
      <div className={`max-w-3xl text-center px-4 transition-all duration-1000 absolute ${step === 2 && !isBreaching ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}>
        <p className="font-serif text-2xl md:text-4xl leading-relaxed text-gray-300 italic tracking-wide">
          "Rise and shine, Mr. Freeman. Rise and... shine."
        </p>
      </div>

      {/* Step 3: G-Man Message 2 */}
      <div className={`max-w-3xl text-center px-4 transition-all duration-1000 absolute ${step === 3 && !isBreaching ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}>
        <p className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-300 italic">
          "The right man in the wrong place can make all the difference in the world."
        </p>
        <div className="theme-text not-italic font-teko text-5xl mt-8 block text-glow animate-pulse">
          CONTROL IS AN ILLUSION.
        </div>
      </div>

      {/* Step 4: Button */}
      <div className={`transition-all duration-1000 absolute ${step >= 4 && !isBreaching ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <button 
          onClick={handleEnterVoid}
          className="group relative px-16 py-6 bg-black border-2 theme-border overflow-hidden"
        >
          {/* Hover Fill Effect */}
          <div className="absolute inset-0 w-0 theme-bg transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
          
          <div className="relative z-10 flex items-center gap-4">
             <Power size={24} className="theme-text group-hover:animate-pulse" />
             <span className="font-teko text-4xl tracking-[0.2em] theme-text font-bold">INITIALIZE</span>
          </div>
          
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 theme-bg"></div>
          <div className="absolute top-0 right-0 w-2 h-2 theme-bg"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 theme-bg"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 theme-bg"></div>
        </button>
        
        <div className="mt-4 text-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
           Warning: High Energy Protocol
        </div>
      </div>

      <div className="absolute bottom-8 text-center opacity-40 hover:opacity-100 transition-opacity">
        <div className="text-[10px] text-gray-500 font-mono mb-1">SUBJECT: GORDON FREEMAN</div>
        <div className="text-[10px] text-gray-500 font-mono">STATUS: AWAITING ASSIGNMENT</div>
      </div>
    </div>
  );
};

export default IntroSequence;
