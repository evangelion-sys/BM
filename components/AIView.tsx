import React, { useState, useEffect, useRef } from 'react';
import { initializeGemini, generateResponse } from '../services/geminiService';
import { Cpu, Send, Key } from 'lucide-react';

const AIView: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'HEV Suit AI Online. Monitoring vitals... Awaiting input.' }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('BM_AI_KEY');
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
      initializeGemini(savedKey);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('BM_AI_KEY', apiKey);
      initializeGemini(apiKey);
      setIsKeySaved(true);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('BM_AI_KEY');
    setApiKey('');
    setIsKeySaved(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isKeySaved) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const history = messages.map(m => m.text);
    const responseText = await generateResponse(userText, history);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  if (!isKeySaved) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="border border-[#ff9900] p-8 bg-[#0a0a0a] max-w-md w-full shadow-[0_0_20px_rgba(255,153,0,0.1)]">
          <Cpu size={48} className="mx-auto mb-4 text-[#ff9900]" />
          <h2 className="text-2xl font-teko tracking-widest mb-4">HEV SUIT AI // CONFIGURATION</h2>
          <p className="text-sm opacity-70 mb-6 font-mono">
            Secure API Key required for neural link initialization.
            Keys are stored locally in your browser's encrypted storage.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="ENTER GEMINI API KEY"
              className="flex-1 bg-black border border-[#333] p-2 text-[#ff9900] outline-none focus:border-[#ff9900]"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button 
              onClick={saveKey}
              className="bg-[#ff9900] text-black px-4 font-bold hover:bg-white transition-colors"
            >
              CONNECT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
        <h2 className="text-xl font-teko tracking-widest flex items-center gap-2">
          <Cpu size={18} /> NEURAL LINK ESTABLISHED
        </h2>
        <button onClick={clearKey} className="text-xs text-red-500 hover:underline flex items-center gap-1">
          <Key size={10} /> REVOKE CREDENTIALS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 text-sm font-mono border ${
              msg.role === 'user' 
                ? 'bg-[#151515] border-gray-700 text-right' 
                : 'bg-[#0a0a0a] border-[#ff9900] text-left text-[#ff9900]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-[#0a0a0a] border border-[#ff9900] p-2 text-xs animate-pulse">
               PROCESSING...
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-[#333] pt-4">
        <input
          type="text"
          className="flex-1 bg-[#050505] border border-[#333] p-3 text-[#ff9900] outline-none focus:border-[#ff9900] font-mono"
          placeholder="QUERY THE AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#151515] border border-[#ff9900] text-[#ff9900] px-6 hover:bg-[#ff9900] hover:text-black transition-colors disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIView;
