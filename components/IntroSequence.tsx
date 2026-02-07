import React, { useEffect, useState } from 'react';

interface IntroProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Sequence timing
    const timers = [
      setTimeout(() => setStep(1), 1000), // Logo
      setTimeout(() => setStep(2), 4000), // G-Man Message 1
      setTimeout(() => setStep(3), 8000), // G-Man Message 2
      setTimeout(() => setStep(4), 11000), // Button
    ];
    
    // Random glitch effect
    const glitchInterval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100);
    }, 2000);

    return () => {
        timers.forEach(clearTimeout);
        clearInterval(glitchInterval);
    };
  }, []);

  const handleEnterVoid = () => {
    setIsEntering(true);
    // Duration of portal animation defined in CSS (2s)
    setTimeout(() => {
      onComplete();
    }, 1800); 
  };

  // If we are done with the sequence/animation, component unmounts via parent state
  if (step === 5 && !isEntering) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-[#000] flex flex-col items-center justify-center theme-text select-none overflow-hidden ${isEntering ? 'shake-active' : ''}`}>
      
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>

      {/* Portal Overlay */}
      {isEntering && (
        <>
           <div className="fixed inset-0 z-[60] void-flash-active pointer-events-none"></div>
           <div className="fixed top-1/2 left-1/2 w-[100px] h-[100px] -ml-[50px] -mt-[50px] rounded-full border-[10px] theme-border z-[70] portal-active bg-[var(--theme-color)] shadow-[0_0_100px_var(--theme-color)]"></div>
        </>
      )}

      {/* Step 1: Logo */}
      <div className={`transition-opacity duration-1000 flex flex-col items-center absolute ${step === 1 && !isEntering ? 'opacity-100' : 'opacity-0'} ${glitch ? 'translate-x-1' : ''}`}>
        <div className="w-32 h-32 border-4 theme-border rounded-full flex items-center justify-center mb-8 relative shadow-[0_0_50px_var(--theme-color)]">
          <div className="text-6xl font-black font-teko translate-y-[-4px]">λ</div>
        </div>
        <h1 className="text-6xl font-teko tracking-[0.2em] text-glow">BLACK MESA</h1>
        <p className="text-xl tracking-widest mt-2 opacity-80 font-mono">RESEARCH FACILITY</p>
      </div>

      {/* Step 2: G-Man Message 1 */}
      <div className={`max-w-2xl text-center px-4 transition-opacity duration-1000 absolute ${step === 2 && !isEntering ? 'opacity-100' : 'opacity-0'}`}>
        <p className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-300 italic">
          "Rise and shine, Mr. Freeman. Rise and... shine."
        </p>
      </div>

      {/* Step 3: G-Man Message 2 */}
      <div className={`max-w-2xl text-center px-4 transition-opacity duration-1000 absolute ${step === 3 && !isEntering ? 'opacity-100' : 'opacity-0'}`}>
        <p className="font-serif text-2xl md:text-3xl leading-relaxed text-gray-300 italic">
          "The right man in the wrong place can make all the difference in the world. 
          <br/><span className="theme-text not-italic font-teko text-4xl mt-4 block">CONTROL IS AN ILLUSION.</span>"
        </p>
      </div>

      {/* Step 4: Button */}
      <div className={`transition-opacity duration-1000 absolute ${step >= 4 && !isEntering ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={handleEnterVoid}
          className="px-12 py-4 border-2 theme-border bg-black hover:bg-[var(--theme-color)] hover:text-black transition-all duration-300 font-teko text-3xl tracking-widest uppercase group relative overflow-hidden"
        >
          <span className="relative z-10">ENTER THE VOID</span>
          <div className="absolute inset-0 theme-bg opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>

      <div className="absolute bottom-8 text-center opacity-80">
        <div className="text-[10px] text-gray-600 font-mono mb-1">SUBJECT: GORDON FREEMAN</div>
        <div className="text-[10px] text-gray-600 font-mono">STATUS: HIRED / DETAINED</div>
      </div>
    </div>
  );
};

export default IntroSequence;