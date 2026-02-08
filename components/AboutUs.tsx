
import React from 'react';
import { OWNERS } from '../types';
import { ShieldCheck } from 'lucide-react';

// Unified Minimal Sci-Fi Icon (Rank Insignia)
const RankIcon: React.FC<any> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
    {/* Outer Tech Ring */}
    <circle cx="50" cy="50" r="46" strokeOpacity="0.3" strokeDasharray="10 5" />
    <circle cx="50" cy="50" r="38" strokeWidth="1" strokeOpacity="0.5" />
    
    {/* Inner Chevrons (Rank) */}
    <path d="M30 60 L50 40 L70 60" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    <path d="M30 75 L50 55 L70 75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    
    {/* Top Indicator */}
    <path d="M50 15 L50 25" strokeWidth="4" />
    <circle cx="50" cy="20" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const AboutUs: React.FC = () => {
  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <ShieldCheck /> PERSONNEL CLEARANCE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {OWNERS.map((member, idx) => {
           return (
             <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-6 relative overflow-hidden group hover:border-[var(--theme-color)] transition-all flex flex-col items-center text-center">
               
               {/* Team Member Logo Container */}
               <div className="w-24 h-24 mb-4 rounded-full border border-[#333] flex items-center justify-center bg-[#080808] shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 relative z-10 group-hover:border-[var(--theme-color)] group-hover:shadow-[0_0_30px_rgba(255,153,0,0.2)]">
                  {/* Unified Rank Icon */}
                  <RankIcon className="w-14 h-14 theme-text opacity-70 group-hover:opacity-100 transition-opacity" />
               </div>
               
               <div className="text-[10px] text-gray-600 font-mono mb-1 tracking-widest">ID CARD // {2024000 + idx}</div>
               <h3 className="text-3xl font-teko text-white tracking-widest mb-1 group-hover:text-[var(--theme-color)] transition-colors">{member.name.toUpperCase()}</h3>
               
               <div className="text-gray-400 font-bold text-xs mb-4 border-b border-[#333] pb-2 inline-block tracking-wider">
                 {member.role.toUpperCase()}
               </div>
               
               <div className="text-xs font-mono text-gray-500 bg-[#050505] px-3 py-1 rounded border border-[#222] group-hover:border-[var(--theme-dim)]">
                   CLEARANCE: <span className="text-white font-bold ml-1">{member.clearance}</span>
               </div>

               {/* Decorative Background Elements */}
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
               <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck size={24} />
               </div>
               
               {/* Tech Lines */}
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l theme-border opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r theme-border opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
           );
         })}
      </div>

      <div className="mt-12 text-center text-gray-600 font-mono text-xs max-w-2xl mx-auto border-t border-[#222] pt-4 opacity-50 hover:opacity-100 transition-opacity">
        "This collaborative uplink was engineered to facilitate optimal knowledge transfer between biological units. 
        Unauthorized access will result in immediate termination of employment and/or life functions."
        <br/><br/>
        © UNIV. MOHAMED EL BACHIR EL IBRAHIMI // FACULTY OF ARTS & LANGUAGES
      </div>
    </div>
  );
};

export default AboutUs;
