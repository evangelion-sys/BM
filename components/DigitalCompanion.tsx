
import React, { useState } from 'react';
import { Music } from 'lucide-react';

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
