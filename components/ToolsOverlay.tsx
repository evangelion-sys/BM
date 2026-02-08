
import React, { useState } from 'react';
import { Book, Search, HardDrive, Send, X, ExternalLink, Upload, File, Wrench } from 'lucide-react';
import { DICTIONARY_DATA } from '../constants';

interface ToolsOverlayProps {
  onOpenTool: (toolId: string) => void;
}

export const ToolsOverlay: React.FC<ToolsOverlayProps> = ({ onOpenTool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('DICT');
  
  // Dictionary
  const [word, setWord] = useState('');
  const [def, setDef] = useState('');

  const lookupWord = () => {
    const d = DICTIONARY_DATA[word.toLowerCase()];
    setDef(d || "TERM NOT FOUND IN LOCAL DATABASE. TRY GOOGLE SCHOLAR.");
  };

  const handleExternalTool = (toolId: string) => {
    onOpenTool(toolId);
    setIsOpen(false); // Close overlay so user sees the split view
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
         <button 
           onClick={() => setIsOpen(true)} 
           className="w-14 h-14 bg-black border-2 theme-border theme-text flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.7)] transition-all transform hover:scale-110 hover:bg-[var(--theme-color)] hover:text-black rounded-sm group relative overflow-hidden"
           title="Open Quick Tools"
         >
           <Wrench size={24} className="group-hover:rotate-45 transition-transform duration-500"/>
           <span className="text-[8px] font-bold mt-1 tracking-widest">TOOLS</span>
           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 animate-pulse"></div>
         </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
       {/* Close Button Floating */}
       <button 
         onClick={() => setIsOpen(false)} 
         className="mb-2 bg-red-900/80 hover:bg-red-600 text-white p-2 rounded-full shadow-lg border border-red-500 backdrop-blur-sm transition-colors"
       >
         <X size={20}/>
       </button>

       {/* Main HUD Panel */}
       <div className="hud-panel w-[90vw] max-w-[350px] rounded-lg overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-black/90 p-3 border-b border-[#333] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wrench size={16} className="theme-text" />
              <span className="text-sm font-teko tracking-widest text-white">FIELD KIT v4.1</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-4 bg-[#111]">
             {[
               { id: 'DICT', icon: Book, label: 'DICT' },
               { id: 'SCHOLAR', icon: Search, label: 'SEARCH' },
               { id: 'DRIVE', icon: HardDrive, label: 'DRIVE' },
               { id: 'TG', icon: Send, label: 'COMM' }
             ].map((tool) => (
               <button 
                 key={tool.id}
                 onClick={() => setActiveTool(tool.id)}
                 className={`flex flex-col items-center justify-center p-3 border-r border-b border-[#222] transition-colors hover:bg-[#222] relative ${activeTool === tool.id ? 'theme-text bg-[#151515]' : 'text-gray-500'}`}
               >
                 <tool.icon size={18} />
                 <span className="text-[9px] font-bold mt-1">{tool.label}</span>
                 {activeTool === tool.id && <div className="absolute bottom-0 left-0 w-full h-0.5 theme-bg"></div>}
               </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="bg-black/80 h-72 p-4 overflow-y-auto relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

             {activeTool === 'DICT' && (
               <div className="relative z-10 flex flex-col h-full">
                 <h4 className="text-xs font-bold mb-3 theme-text border-b border-gray-800 pb-1">DATABASE LOOKUP</h4>
                 <div className="flex gap-2 mb-3">
                   <input 
                     className="w-full bg-[#111] border border-[#333] p-2 text-sm text-white outline-none focus:border-[var(--theme-color)]" 
                     value={word} 
                     onChange={e=>setWord(e.target.value)} 
                     placeholder="QUERY TERM..." 
                     onKeyDown={e => e.key === 'Enter' && lookupWord()}
                   />
                   <button onClick={lookupWord} className="theme-bg text-black px-3 font-bold hover:brightness-110">GO</button>
                 </div>
                 <div className="text-sm text-gray-300 font-serif leading-relaxed p-3 border border-[#222] bg-[#080808] flex-1 overflow-y-auto">
                   {def || <span className="text-gray-600 text-xs">// WAITING FOR INPUT...</span>}
                 </div>
               </div>
             )}

             {activeTool === 'SCHOLAR' && (
               <div className="relative z-10">
                 <h4 className="text-xs font-bold mb-3 theme-text border-b border-gray-800 pb-1">ACADEMIC SEARCH</h4>
                 <p className="text-[10px] text-gray-500 mb-4 font-mono">
                   ESTABLISHING SECURE TUNNEL TO GOOGLE SCHOLAR REPOSITORIES...
                 </p>
                 <form action="https://scholar.google.com/scholar" target="_blank" method="get" className="flex flex-col gap-3">
                    <input name="q" className="w-full bg-[#111] border border-[#333] p-3 text-sm text-white outline-none focus:border-[var(--theme-color)]" placeholder="KEYWORDS..." />
                    <button className="theme-bg text-black px-3 py-2 font-bold hover:brightness-110 flex items-center justify-center gap-2">
                       INITIATE SEARCH <ExternalLink size={14}/>
                    </button>
                 </form>
               </div>
             )}

             {activeTool === 'DRIVE' && (
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <h4 className="text-xs font-bold mb-3 theme-text border-b border-gray-800 pb-1">DRIVE ACCESS</h4>
                    <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
                        MOUNT GOOGLE DRIVE TO SPLIT-VIEW FOR FILE MANAGEMENT.
                    </p>
                 </div>
                 <button 
                    onClick={() => handleExternalTool('TOOL_DRIVE')}
                    className="w-full theme-bg text-black font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-white transition-colors"
                  >
                    <HardDrive size={16} /> MOUNT DRIVE
                  </button>
               </div>
             )}

             {activeTool === 'TG' && (
               <div className="relative z-10 text-center pt-6 flex flex-col h-full justify-between">
                 <div>
                    <div className="w-16 h-16 border-2 border-blue-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-blue-900/10">
                    <Send size={32} className="ml-[-2px] mt-[2px]" />
                    </div>
                    <h4 className="text-sm font-bold mb-2 text-white">SECURE COMMS</h4>
                    <p className="text-[10px] text-gray-500 mb-6 px-4 font-mono leading-tight">
                    OPEN TELEGRAM ENCRYPTED MESSAGING IN SPLIT-VIEW PANEL.
                    </p>
                 </div>
                 <button 
                   onClick={() => handleExternalTool('TOOL_TELEGRAM')}
                   className="w-full bg-blue-600 text-white font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors rounded-sm"
                 >
                   <Send size={16} /> LAUNCH TELEGRAM
                 </button>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};
