import React, { useState } from 'react';
import { Battery, Zap, Activity } from 'lucide-react';

const SystemMonitor: React.FC = () => {
  // Gamified "Vital Signs" for students
  const [energy, setEnergy] = useState(80); // Caffeine/Sleep
  const [stress, setStress] = useState(20); // Radiation metaphor
  const [focus, setFocus] = useState(50);   // Suit Power metaphor

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, val: number) => {
    setter(prev => Math.max(0, Math.min(100, prev + val)));
  };

  const renderBar = (val: number, colorClass: string) => (
    <div className="h-1.5 w-full bg-[#111] mt-1 overflow-hidden border border-[#222]">
      <div 
        className={`h-full ${colorClass} transition-all duration-500`} 
        style={{ width: `${val}%` }}
      ></div>
    </div>
  );

  return (
    <div className="px-6 py-4 border-t border-[#333] theme-border">
      <h4 className="text-[10px] font-bold tracking-widest opacity-50 mb-3 flex items-center gap-2">
        <Activity size={10} /> HEV VITAL SIGNS
      </h4>
      
      {/* Energy / Caffeine */}
      <div className="mb-3 group select-none">
        <div className="flex justify-between text-[10px] font-mono mb-1 items-center">
          <span className="flex items-center gap-1"><Battery size={10}/> ENERGY</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => adjust(setEnergy, -10)} className="hover:text-red-500 px-1">-</button>
            <button onClick={() => adjust(setEnergy, 10)} className="hover:text-green-500 px-1">+</button>
          </div>
        </div>
        {renderBar(energy, energy < 30 ? "bg-red-500" : "bg-green-500")}
      </div>

      {/* Stress / Radiation */}
      <div className="mb-3 group select-none">
        <div className="flex justify-between text-[10px] font-mono mb-1 items-center">
          <span className="flex items-center gap-1 text-orange-400">STRESS LVL</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => adjust(setStress, -10)} className="hover:text-green-500 px-1">-</button>
            <button onClick={() => adjust(setStress, 10)} className="hover:text-red-500 px-1">+</button>
          </div>
        </div>
        {renderBar(stress, stress > 70 ? "bg-red-500 animate-pulse" : "bg-orange-500")}
      </div>

      {/* Focus / Suit Power */}
      <div className="group select-none">
        <div className="flex justify-between text-[10px] font-mono mb-1 items-center">
          <span className="flex items-center gap-1 theme-text"><Zap size={10}/> SUIT POWER</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => adjust(setFocus, -10)} className="hover:text-red-500 px-1">-</button>
            <button onClick={() => adjust(setFocus, 10)} className="hover:text-green-500 px-1">+</button>
          </div>
        </div>
        {renderBar(focus, "theme-bg")}
      </div>
      
      <div className="mt-2 text-[9px] text-gray-600 text-center font-mono">
        MONITORING BIOLOGICAL CONSTANTS...
      </div>
    </div>
  );
};

export default SystemMonitor;
