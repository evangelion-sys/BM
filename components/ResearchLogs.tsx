import React, { useState, useEffect } from 'react';
import { subscribeToPath, pushData, removeData } from '../services/firebaseService';
import { LogEntry } from '../types';
import { Mic, Play, Square, Trash2, Save, Volume2 } from 'lucide-react';

const ResearchLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPath('logs', (data) => {
      setLogs((data as LogEntry[]).reverse());
    });
    return () => unsubscribe();
  }, []);

  const handleSaveLog = async () => {
    if (!inputText.trim()) return;
    await pushData('logs', {
      title: `LOG ENTRY ${new Date().toLocaleTimeString()}`,
      content: inputText,
      timestamp: Date.now()
    });
    setInputText('');
    setIsRecording(false);
  };

  const playLog = (log: LogEntry) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current
      
      const utterance = new SpeechSynthesisUtterance(log.content);
      utterance.pitch = 0.8; // Lower pitch for sci-fi feel
      utterance.rate = 0.9;  // Slower
      
      // Try to find a robotic or deep voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('David'));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsPlayingId(log.id);
      utterance.onend = () => setIsPlayingId(null);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("AUDIO SUBSYSTEM NOT COMPATIBLE");
    }
  };

  const stopPlayback = () => {
    window.speechSynthesis.cancel();
    setIsPlayingId(null);
  };

  const handleDelete = async (id: string) => {
    if(confirm('DELETE AUDIO RECORD?')) {
        stopPlayback();
        await removeData('logs', id);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <Mic /> RESEARCH AUDIO LOGS
        </h2>
      </div>

      {/* Input Area (Simulating Voice Recorder) */}
      <div className="bg-[#101010] p-4 border theme-border mb-8 relative overflow-hidden">
        {isRecording && <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>}
        
        <textarea 
          className="w-full h-24 bg-black border border-[#333] p-2 theme-text font-mono text-sm outline-none resize-none focus:border-[var(--theme-color)]"
          placeholder="INITIATE VOICE TRANSCRIPTION..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onFocus={() => setIsRecording(true)}
          onBlur={() => !inputText && setIsRecording(false)}
        />
        <div className="flex justify-end mt-2">
          <button onClick={handleSaveLog} className="flex items-center gap-2 theme-bg text-black px-4 py-1 font-bold hover:bg-white transition-colors">
            <Save size={16} /> SAVE TO TAPE
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {logs.map(log => (
          <div key={log.id} className={`p-4 border border-[#222] bg-[#050505] hover:border-[var(--theme-color)] transition-colors group ${isPlayingId === log.id ? 'border-[var(--theme-color)] bg-[#101000]' : ''}`}>
            <div className="flex justify-between items-start mb-2">
               <div>
                 <div className="font-bold text-[var(--theme-color)] text-sm tracking-wider">{log.title}</div>
                 <div className="text-[10px] text-gray-500 font-mono">{new Date(log.timestamp).toDateString()}</div>
               </div>
               <div className="flex gap-2">
                 {isPlayingId === log.id ? (
                   <button onClick={stopPlayback} className="text-red-500 hover:text-white"><Square size={20} fill="currentColor" /></button>
                 ) : (
                   <button onClick={() => playLog(log)} className="theme-text hover:text-white"><Play size={20} /></button>
                 )}
               </div>
            </div>
            
            {/* Visualizing Audio Waves if playing */}
            {isPlayingId === log.id && (
              <div className="flex items-center gap-1 h-4 mb-2 opacity-80">
                 {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 bg-[var(--theme-color)] animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.5 + 0.2}s` }}></div>
                 ))}
              </div>
            )}

            <div className="text-sm text-gray-400 font-mono italic">"{log.content}"</div>
            
            <button onClick={() => handleDelete(log.id)} className="mt-2 text-xs text-red-900 hover:text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <Trash2 size={12} /> ERASE TAPE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchLogs;
