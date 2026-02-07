import React from 'react';
import { Book, Cpu, Users, Calendar, Terminal } from 'lucide-react';

const UserGuide: React.FC = () => {
  return (
    <div className="h-full p-8 overflow-y-auto">
      <h2 className="text-4xl font-teko tracking-widest text-glow mb-8 border-b theme-border pb-4">
        SYSTEM MANUAL & PROTOCOLS
      </h2>

      <div className="space-y-8 max-w-4xl">
        <section>
          <h3 className="text-2xl font-bold flex items-center gap-2 mb-3 text-white">
            <Calendar className="text-[var(--theme-color)]" /> SCHEDULING (CHRONOS)
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 theme-border pl-4 bg-[#0a0a0a] p-4">
            Navigate to <strong>SCHEDULE GRID</strong> via the sidebar. Select your semester (Licence/Master) from the top dropdown.
            Click any cell in the grid to input the Module Name and Room Number. Changes are saved automatically to the central server
            and are visible to all students in that sector.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold flex items-center gap-2 mb-3 text-white">
            <Users className="text-[var(--theme-color)]" /> PERSONNEL DIRECTORY
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 theme-border pl-4 bg-[#0a0a0a] p-4">
            The <strong>FACULTY DIR</strong> lists all academic staff. 
            <br/>- Use the <strong>Search Bar</strong> to find professors by name or module.
            <br/>- Click <strong>ADD PERSONNEL</strong> (Admin) to input new records.
            <br/>- Click the <strong>Copy Icon</strong> next to an email to copy it to your clipboard.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold flex items-center gap-2 mb-3 text-white">
            <Terminal className="text-[var(--theme-color)]" /> DATA CORE & LAB
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 theme-border pl-4 bg-[#0a0a0a] p-4">
            <strong>DATA CORE:</strong> Use this for sharing raw code snippets (Python, C++, HTML). Click "+ NEW DATA" to paste code.
            <br/><strong>BM LAB:</strong> A repository for external links, PDFs, and video resources.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold flex items-center gap-2 mb-3 text-white">
            <Cpu className="text-[var(--theme-color)]" /> AI ASSISTANCE
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 theme-border pl-4 bg-[#0a0a0a] p-4">
            The <strong>HEV AI LINK</strong> connects to the Gemini Neural Net. You must provide a valid API Key to use this feature.
            The key is stored locally on your device for security.
          </p>
        </section>

        <div className="mt-12 p-4 border border-red-900 bg-red-900/10 text-center text-red-500 font-mono text-xs">
          WARNING: UNAUTHORIZED MODIFICATION OF GRADES (LMD SIMULATOR) IS A VIOLATION OF BLACK MESA PROTOCOLS.
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
