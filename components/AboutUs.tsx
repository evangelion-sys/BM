import React from 'react';
import { OWNERS } from '../types';
import { ShieldCheck, User, Fingerprint } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <ShieldCheck /> PERSONNEL CLEARANCE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {OWNERS.map((member, idx) => (
           <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-6 relative overflow-hidden group hover:border-[var(--theme-color)] transition-all">
             {/* Holographic ID Effect */}
             <div className="absolute top-2 right-2 border border-[#333] p-1 rounded-sm opacity-50">
               <User size={24} className="text-gray-600" />
             </div>
             
             <div className="text-xs text-gray-500 font-mono mb-1">ID CARD // {2024000 + idx}</div>
             <h3 className="text-2xl font-teko text-white tracking-widest mb-1 group-hover:text-glow">{member.name.toUpperCase()}</h3>
             
             {/* Funny ID Name */}
             <div className="flex items-center gap-1 text-xs text-[var(--theme-color)] opacity-80 font-mono mb-3">
               <Fingerprint size={12} /> ALIAS: "{member.idName}"
             </div>

             <div className="text-gray-300 font-bold text-sm mb-4 border-b border-[#333] pb-2 inline-block">
               {member.role.toUpperCase()}
             </div>
             
             <div className="flex justify-between items-end mt-4">
               <div className="text-xs font-mono text-gray-600">
                 CLEARANCE:<br/>
                 <span className="text-white font-bold">{member.clearance}</span>
               </div>
               <div className="w-8 h-8 rounded-full border-2 theme-border flex items-center justify-center opacity-20 group-hover:opacity-100 animate-pulse">
                 <span className="font-teko text-xl">λ</span>
               </div>
             </div>

             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
           </div>
         ))}
      </div>

      <div className="mt-12 text-center text-gray-600 font-mono text-xs max-w-2xl mx-auto border-t border-[#222] pt-4">
        "This collaborative uplink was engineered to facilitate optimal knowledge transfer between biological units. 
        Unauthorized access will result in immediate termination of employment and/or life functions."
        <br/><br/>
        © BLACK MESA RESEARCH FACILITY // SECTOR C
      </div>
    </div>
  );
};

export default AboutUs;
