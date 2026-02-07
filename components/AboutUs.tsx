
import React from 'react';
import { OWNERS, TeamMember } from '../types';
import { ShieldCheck, User, Fingerprint } from 'lucide-react';

// Custom SVG Icons
const Icons: Record<string, React.FC<any>> = {
  KNULL: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /> 
      <path d="M7 12l5 5 5-5" /> 
      {/* Abstract spider-ish shape */}
      <path d="M12 2L15 8H9L12 2Z" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  BUTTERFLY: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
       <path d="M12 2C12 2 14 6 18 6C22 6 22 12 18 12C14 12 12 8 12 8" />
       <path d="M12 2C12 2 10 6 6 6C2 6 2 12 6 12C10 12 12 8 12 8" />
       <path d="M12 8V22" />
       <path d="M12 14C12 14 14 16 16 16C18 16 18 20 16 20C14 20 12 18 12 18" />
       <path d="M12 14C12 14 10 16 8 16C6 16 6 20 8 20C10 20 12 18 12 18" />
    </svg>
  ),
  ATOM: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" opacity="0.5"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
    </svg>
  ),
  DNA: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12z" opacity="0.1"/>
      <path d="M9 3c-1.1 2.5-1.1 5.5 0 8 1.1 2.5 4.9 2.5 6 0 1.1-2.5 1.1-5.5 0-8-1.1-2.5-4.9-2.5-6 0z" />
      <path d="M9 13c-1.1 2.5-1.1 5.5 0 8 1.1 2.5 4.9 2.5 6 0 1.1-2.5 1.1-5.5 0-8-1.1-2.5-4.9-2.5-6 0z" />
    </svg>
  ),
  BOOK: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

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
           const Icon = Icons[member.iconType] || Icons.ATOM;
           return (
             <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-6 relative overflow-hidden group hover:border-[var(--theme-color)] transition-all">
               {/* Holographic ID Effect */}
               <div className="absolute top-2 right-2 border border-[#333] p-1 rounded-sm opacity-50 group-hover:scale-110 transition-transform">
                 <Icon size={32} className="text-gray-500 group-hover:text-[var(--theme-color)]" />
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
           );
         })}
      </div>

      <div className="mt-12 text-center text-gray-600 font-mono text-xs max-w-2xl mx-auto border-t border-[#222] pt-4">
        "This collaborative uplink was engineered to facilitate optimal knowledge transfer between biological units. 
        Unauthorized access will result in immediate termination of employment and/or life functions."
        <br/><br/>
        © UNIV. MOHAMED EL BACHIR EL IBRAHIMI // FACULTY OF ARTS & LANGUAGES
      </div>
    </div>
  );
};

export default AboutUs;
