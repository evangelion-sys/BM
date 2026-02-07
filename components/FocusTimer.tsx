import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { playClickSound, playMessageSound } from '../services/audioService';

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playMessageSound(); // Alarm
      if (mode === 'FOCUS') {
        setMode('BREAK');
        setTimeLeft(5 * 60);
      } else {
        setMode('FOCUS');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    playClickSound();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    playClickSound();
    setIsActive(false);
    setMode('FOCUS');
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-6 py-4 border-t border-[#333] theme-border">
      <h4 className="text-[10px] font-bold tracking-widest opacity-50 mb-2 flex justify-between items-center">
        <span>FOCUS PROTOCOL</span>
        <span className={mode === 'FOCUS' ? 'theme-text' : 'text-blue-400'}>{mode}</span>
      </h4>
      
      <div className="bg-[#050505] border theme-border p-2 text-center mb-2 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 bottom-0 bg-[var(--theme-dim)] transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / (mode === 'FOCUS' ? 1500 : 300)) * 100}%` }}
        ></div>
        <span className="text-2xl font-mono font-bold relative z-10">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={toggleTimer} className="p-1 hover:text-white transition-colors theme-text">
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={resetTimer} className="p-1 hover:text-white transition-colors text-gray-500">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
