import React, { useState, useEffect } from 'react';
import { Snippet } from '../types';
import { pushData, subscribeToPath } from '../services/firebaseService';
import { Code, Terminal, Copy } from 'lucide-react';

interface DataCoreViewProps {
  username: string;
}

const DataCoreView: React.FC<DataCoreViewProps> = ({ username }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState<Snippet['language']>('TEXT');
  const [code, setCode] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToPath('datacore', (data) => {
      if (data) {
        setSnippets((data as Snippet[]).reverse()); // Newest first
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    await pushData('datacore', {
      title,
      language: lang,
      code,
      author: username,
      timestamp: Date.now()
    });
    
    setTitle('');
    setCode('');
    setShowForm(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('DATA COPIED TO CLIPBOARD');
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left List */}
      <div className="w-full md:w-1/3 border-r border-[#333] theme-border flex flex-col bg-[#080808]">
        <div className="p-4 border-b theme-border flex justify-between items-center bg-[#101010]">
          <h2 className="text-xl font-teko tracking-widest flex items-center gap-2">
            <Terminal size={18} /> DATA FRAGMENTS
          </h2>
          <button 
            onClick={() => { setShowForm(true); setSelectedSnippet(null); }}
            className="text-xs border theme-border px-2 py-1 hover:bg-[var(--theme-color)] hover:text-black"
          >
            + NEW DATA
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {snippets.map(snip => (
            <button
              key={snip.id}
              onClick={() => { setSelectedSnippet(snip); setShowForm(false); }}
              className={`w-full text-left p-4 border-b border-[#222] hover:bg-[#151515] transition-colors group ${selectedSnippet?.id === snip.id ? 'bg-[#151515] border-l-4 theme-border' : ''}`}
            >
              <div className="font-bold text-sm mb-1 group-hover:text-white">{snip.title}</div>
              <div className="flex justify-between items-center text-[10px] font-mono opacity-60">
                <span className="bg-[#222] px-1 rounded text-[var(--theme-color)]">{snip.language}</span>
                <span>{snip.author}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-[#050505] p-6 overflow-y-auto flex flex-col">
        {showForm ? (
          <form onSubmit={handleSave} className="flex flex-col h-full animate-in fade-in">
             <h3 className="text-xl font-teko mb-4 border-b theme-border pb-2">UPLOAD NEW DATA FRAGMENT</h3>
             <div className="flex gap-4 mb-4">
               <input 
                 className="flex-1 bg-[#101010] border border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)]"
                 placeholder="FRAGMENT TITLE"
                 value={title}
                 onChange={e => setTitle(e.target.value)}
               />
               <select 
                 className="bg-[#101010] border border-[#333] p-2 theme-text outline-none"
                 value={lang}
                 onChange={e => setLang(e.target.value as any)}
               >
                 <option value="TEXT">TEXT</option>
                 <option value="JS">JAVASCRIPT</option>
                 <option value="PYTHON">PYTHON</option>
                 <option value="HTML">HTML</option>
                 <option value="SQL">SQL</option>
               </select>
             </div>
             <textarea 
               className="flex-1 bg-[#0a0a0a] border border-[#333] p-4 font-mono text-sm theme-text outline-none focus:border-[var(--theme-color)] resize-none mb-4"
               placeholder="// PASTE RAW DATA HERE..."
               value={code}
               onChange={e => setCode(e.target.value)}
             />
             <div className="flex gap-2 justify-end">
               <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:text-white">CANCEL</button>
               <button type="submit" className="theme-bg text-black px-6 py-2 font-bold hover:bg-white">UPLOAD</button>
             </div>
          </form>
        ) : selectedSnippet ? (
          <div className="flex flex-col h-full animate-in fade-in">
            <div className="flex justify-between items-start mb-4 border-b theme-border pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-wider mb-1 text-white">{selectedSnippet.title}</h1>
                <div className="flex gap-4 text-xs font-mono opacity-60">
                  <span>AUTH: {selectedSnippet.author}</span>
                  <span>DATE: {new Date(selectedSnippet.timestamp).toLocaleDateString()}</span>
                  <span>TYPE: {selectedSnippet.language}</span>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(selectedSnippet.code)}
                className="flex items-center gap-2 border border-[#333] px-3 py-1 text-xs hover:border-[var(--theme-color)] transition-colors"
              >
                <Copy size={12} /> EXTRACT
              </button>
            </div>
            <div className="flex-1 bg-[#080808] border border-[#222] p-4 overflow-auto relative rounded-sm">
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                {selectedSnippet.code}
              </pre>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
            <Code size={64} className="mb-4" />
            <div className="text-xl font-teko tracking-widest">SELECT DATA FRAGMENT</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCoreView;
