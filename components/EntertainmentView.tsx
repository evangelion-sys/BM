
import React from 'react';
import { ENTERTAINMENT_LINKS } from '../constants';
import { Book, Video, Music, ExternalLink, PenTool } from 'lucide-react';

const EntertainmentView: React.FC = () => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'BOOK': return <Book size={20}/>;
      case 'VIDEO': return <Video size={20}/>;
      case 'AUDIO': return <Music size={20}/>;
      default: return <PenTool size={20}/>;
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto">
      <h2 className="text-3xl font-teko tracking-widest text-glow mb-6">BREAK ROOM / RESOURCES</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-2xl">
        Approved entertainment and supplementary material for research personnel.
        Listening to music or reading non-essential data during shifts is permitted within designated parameters.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ENTERTAINMENT_LINKS.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] border theme-border p-4 flex items-center justify-between hover:bg-[#111] group">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-[#151515] flex items-center justify-center rounded-full theme-text group-hover:scale-110 transition-transform">
                 {getIcon(link.type)}
               </div>
               <div>
                 <div className="font-bold text-white">{link.title}</div>
                 <div className="text-xs text-gray-500">{link.category}</div>
               </div>
             </div>
             <ExternalLink size={16} className="opacity-0 group-hover:opacity-50"/>
          </a>
        ))}
      </div>
      
      <div className="mt-8 border-t border-[#333] pt-4">
        <h3 className="text-xl font-bold mb-4 text-white">DAILY QUOTE</h3>
        <blockquote className="font-serif italic text-gray-400 border-l-4 theme-border pl-4">
          "The limits of my language mean the limits of my world." <br/>
          <span className="text-xs not-italic font-sans text-[var(--theme-color)]">- Ludwig Wittgenstein</span>
        </blockquote>
      </div>
    </div>
  );
};

export default EntertainmentView;
