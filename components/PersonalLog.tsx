import React, { useState, useEffect } from 'react';
import { Save, Lock } from 'lucide-react';

const PersonalLog: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('BM_PERSONAL_LOG');
    if (saved) setNotes(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem('BM_PERSONAL_LOG', notes);
    setStatus('SAVED TO LOCAL DRIVE');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="mt-auto border-t border-[#333] p-4 theme-border bg-[#080808]">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-[10px] font-bold tracking-widest flex items-center gap-1 opacity-70">
          <Lock size={8} /> PERSONAL LOG (ENCRYPTED)
        </h4>
        <button onClick={handleSave} className="text-xs hover:text-white">
          <Save size={12} />
        </button>
      </div>
      <textarea 
        className="w-full h-24 bg-[#050505] border border-[#222] p-2 text-xs font-mono text-gray-400 outline-none resize-none focus:border-[var(--theme-color)]"
        placeholder="> Private entries..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
        onBlur={handleSave}
      />
      {status && <div className="text-[8px] text-right mt-1 text-[var(--theme-color)]">{status}</div>}
    </div>
  );
};

export default PersonalLog;
