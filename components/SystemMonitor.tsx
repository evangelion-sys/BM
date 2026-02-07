
import React, { useState, useEffect } from 'react';
import { Activity, Signal, Cpu } from 'lucide-react';

const SystemMonitor: React.FC = () => {
  // Purely aesthetic system monitoring (no gamification)
  const [cpu, setCpu] = useState(12);
  const [net, setNet] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(100, Math.max(5, prev + (Math.random() * 20 - 10))));
      setNet(prev => Math.min(100, Math.max(20, prev + (Math.random() * 30 - 15))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderBar = (val: number) => (
    <div className="h-1 w-full bg-[#111] mt-1 overflow-hidden border border-[#222]">
      <div 
        className="h-full theme-bg transition-all duration-1000" 
        style={{ width: `${val}%`, opacity: val > 80 ? 1 : 0.6 }}
      ></div>
    </div>
  );

  return (
    <div className="px-6 py-4 border-t border-[#333] theme-border">
      <h4 className="text-[10px] font-bold tracking-widest opacity-50 mb-3 flex items-center gap-2">
        <Activity size={10} /> SYSTEM DIAGNOSTICS
      </h4>
      
      <div className="mb-2">
        <div className="flex justify-between text-[9px] font-mono mb-1 items-center opacity-70">
          <span className="flex items-center gap-1"><Cpu size={10}/> UPLINK CPU</span>
          <span>{Math.round(cpu)}%</span>
        </div>
        {renderBar(cpu)}
      </div>

      <div>
        <div className="flex justify-between text-[9px] font-mono mb-1 items-center opacity-70">
          <span className="flex items-center gap-1"><Signal size={10}/> NET LATENCY</span>
          <span>{Math.round(net)}ms</span>
        </div>
        {renderBar(net)}
      </div>
      
      <div className="mt-2 text-[8px] text-gray-700 text-center font-mono">
        SERVER CONNECTIVITY: STABLE
      </div>
    </div>
  );
};

export default SystemMonitor;
