
import React, { useState, useEffect } from 'react';
import { Smile, Zap, Music, Coffee, AlertTriangle } from 'lucide-react';

export const Tamagotchi: React.FC = () => {
  const [stats, setStats] = useState({ hunger: 100, happiness: 100, level: 1 });
  const [mood, setMood] = useState('HAPPY');

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        const newHunger = Math.max(0, prev.hunger - 2);
        const newHappy = Math.max(0, prev.happiness - 1);
        return { ...prev, hunger: newHunger, happiness: newHappy };
      });
    }, 10000); // Degrade every 10s
    return () => clearInterval(timer);
  }, []);

  const feed = () => setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20) }));
  const play = () => setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 10) }));

  return (
    <div className="border theme-border bg-[#050505] p-4 text-center">
      <div className="text-[10px] font-bold tracking-widest mb-2 opacity-50">COMPANION UNIT</div>
      <div className="text-4xl mb-2 animate-bounce">
        {stats.hunger < 30 ? '😵' : stats.happiness > 70 ? '👾' : '😐'}
      </div>
      <div className="flex gap-1 mb-2">
        <div className="h-1 bg-gray-800 flex-1"><div className="h-full bg-green-500" style={{width: `${stats.hunger}%`}}></div></div>
        <div className="h-1 bg-gray-800 flex-1"><div className="h-full bg-blue-500" style={{width: `${stats.happiness}%`}}></div></div>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={feed} className="text-xs border border-gray-700 px-2 hover:bg-white hover:text-black"><Coffee size={12}/></button>
        <button onClick={play} className="text-xs border border-gray-700 px-2 hover:bg-white hover:text-black"><Zap size={12}/></button>
      </div>
    </div>
  );
};

export const LofiWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="border theme-border bg-[#050505] p-4 mt-4">
       <div className="flex justify-between items-center mb-2">
          <div className="text-[10px] font-bold tracking-widest opacity-50 flex items-center gap-2"><Music size={10}/> LOFI STUDY RADIO</div>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-900'}`}></button>
       </div>
       {isPlaying ? (
         <iframe 
           width="100%" height="80" 
           src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0" 
           title="Lofi Girl" 
           frameBorder="0" 
           allow="autoplay"
           className="opacity-50 hover:opacity-100 transition-opacity"
         ></iframe>
       ) : (
         <div className="h-20 flex items-center justify-center text-xs text-gray-600 bg-[#000]">
           RADIO OFF
         </div>
       )}
    </div>
  );
};

export const FocusGarden: React.FC = () => {
  const [growth, setGrowth] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    
    // Growth logic
    const interval = setInterval(() => {
       if (document.hidden) {
         setGrowth(g => Math.max(0, g - 5)); // Wither if away
       } else {
         setGrowth(g => Math.min(100, g + 1)); // Grow if focused
       }
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    }
  }, []);

  return (
    <div className="border theme-border bg-[#050505] p-4 mt-4 relative overflow-hidden">
       <div className="text-[10px] font-bold tracking-widest opacity-50 mb-2">FOCUS GARDEN</div>
       <div className="h-20 flex items-end justify-center gap-1 border-b border-[#333]">
          <div className={`w-2 transition-all duration-1000 bg-green-800`} style={{height: `${Math.min(30, growth)}%`}}></div>
          <div className={`w-2 transition-all duration-1000 bg-green-600`} style={{height: `${Math.min(60, growth)}%`}}></div>
          <div className={`w-2 transition-all duration-1000 bg-green-500`} style={{height: `${growth}%`}}></div>
          <div className={`w-2 transition-all duration-1000 bg-green-600`} style={{height: `${Math.min(50, growth)}%`}}></div>
          <div className={`w-2 transition-all duration-1000 bg-green-800`} style={{height: `${Math.min(20, growth)}%`}}></div>
       </div>
       {!isTabActive && (
         <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-red-500 text-xs font-bold animate-pulse">
           <AlertTriangle size={16} className="mr-2"/> SIGNAL LOST
         </div>
       )}
       <div className="text-[9px] text-center mt-1 text-gray-500">STAY FOCUSED TO GROW</div>
    </div>
  );
};
