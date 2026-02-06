import React, { useState, useEffect, useRef } from 'react';
import IntroSequence from './components/IntroSequence';
import FeedView from './components/FeedView';
import LabView from './components/LabView';
import AIView from './components/AIView';
import { Sector, ChatMessage } from './types';
import { NAV_ITEMS, ADMIN_PASSWORD } from './constants';
import { isFirebaseOnline, pushData, subscribeToPath, removeData } from './services/firebaseService';
import { Eye, EyeOff, Radio, Circle, Send, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSector, setActiveSector] = useState<string>(Sector.LICENCE_S1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  
  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const firebaseStatus = isFirebaseOnline();

  // Chat subscription based on sector
  useEffect(() => {
    // Only subscribe to chat if not in a special tool view (like AI)
    // Though requirements say context aware chat always on sidebar.
    // We filter chat by sector in the UI or fetch specific path.
    // Let's fetch specific path: chat/{sectorId}
    const cleanSectorId = activeSector.replace(/\s+/g, '_');
    const unsubscribe = subscribeToPath(`chat/${cleanSectorId}`, (data) => {
      if (data) {
        setChatHistory(data as ChatMessage[]);
      } else {
        setChatHistory([]);
      }
    });
    return () => unsubscribe();
  }, [activeSector]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
    } else {
      alert('ACCESS DENIED: UNAUTHORIZED PERSONNEL');
    }
    setAdminPass('');
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const cleanSectorId = activeSector.replace(/\s+/g, '_');
    const msg: Omit<ChatMessage, 'id'> = {
      text: chatMessage,
      sender: isAdmin ? 'ADMIN' : 'User',
      timestamp: Date.now(),
      sector: activeSector,
      isAdmin: isAdmin
    };

    await pushData(`chat/${cleanSectorId}`, msg);
    setChatMessage('');
  };

  const deleteMessage = async (id: string) => {
    if (!isAdmin) return;
    const cleanSectorId = activeSector.replace(/\s+/g, '_');
    await removeData(`chat/${cleanSectorId}`, id);
  };

  const renderMainContent = () => {
    switch (activeSector) {
      case Sector.LAB:
        return <LabView />;
      case Sector.AI:
        return <AIView />;
      default:
        return <FeedView isAdmin={isAdmin} />;
    }
  };

  return (
    <>
      {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
      
      {/* Main Layout */}
      <div className={`h-screen w-screen flex flex-col md:flex-row overflow-hidden transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Left Sidebar: Navigation */}
        <aside className="w-full md:w-64 bg-[#080808] border-r border-[#333] flex flex-col z-20">
          <div className="p-6 border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff9900] rounded-full animate-pulse shadow-[0_0_10px_#ff9900]"></div>
              <h1 className="text-xl font-teko tracking-widest text-[#ff9900]">BLACK MESA</h1>
            </div>
            {/* Admin Toggle */}
            <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)} className="opacity-50 hover:opacity-100">
               {isAdmin ? <EyeOff size={16} className="text-red-500" /> : <Eye size={16} />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {NAV_ITEMS.map((item, idx) => {
              if (item.id === 'divider') return <div key={idx} className="text-xs text-gray-600 px-6 py-2 mt-4 font-bold">{item.label}</div>;
              
              const isActive = activeSector === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSector(item.id)}
                  className={`w-full text-left px-6 py-3 text-sm font-mono tracking-wider hover:bg-[#151515] transition-colors relative
                    ${isActive ? 'text-[#ff9900] bg-[#101010]' : 'text-gray-400'}
                  `}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff9900]"></div>}
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#333] text-xs font-mono text-gray-500">
             <div className="flex items-center gap-2 mb-1">
               <Radio size={12} className={firebaseStatus ? "text-green-500" : "text-red-500"} />
               STATUS: {firebaseStatus ? 'ONLINE' : 'OFFLINE'}
             </div>
             <div>SECURE CHANNEL: {activeSector}</div>
          </div>
        </aside>

        {/* Center: Content */}
        <main className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
          {/* Header Bar */}
          <header className="h-16 border-b border-[#222] flex items-center px-8 bg-[#0a0a0a]/90 backdrop-blur">
             <h2 className="text-2xl font-teko text-[#ff9900] tracking-[0.2em]">{activeSector.toUpperCase()}</h2>
          </header>

          <div className="flex-1 overflow-hidden relative">
             {renderMainContent()}
          </div>
        </main>

        {/* Right Sidebar: Chat */}
        <aside className="hidden lg:flex w-80 bg-[#080808] border-l border-[#333] flex-col z-20">
          <div className="p-4 border-b border-[#333] bg-[#0a0a0a]">
            <h3 className="text-sm font-bold tracking-widest text-[#ff9900] flex items-center gap-2">
              <Circle size={10} className="fill-[#ff9900]" /> SECTOR COMM LINK
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 ? (
               <div className="text-xs text-gray-600 text-center mt-10">... CHANNEL SILENT ...</div>
            ) : (
              chatHistory.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className={`text-xs font-bold ${msg.isAdmin ? 'text-red-500' : 'text-[#ff9900]'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="text-sm text-gray-300 bg-[#111] p-2 border-l-2 border-[#333] relative">
                    {msg.text}
                    {isAdmin && (
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef}></div>
          </div>

          <form onSubmit={handleChatSend} className="p-3 border-t border-[#333] bg-[#0a0a0a]">
            <div className="flex gap-2">
              <input 
                className="w-full bg-[#151515] border border-[#333] px-3 py-2 text-sm text-[#ff9900] outline-none focus:border-[#ff9900]"
                placeholder="Transmit..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button type="submit" className="bg-[#ff9900] text-black px-3 hover:bg-white transition-colors">
                <Send size={16} />
              </button>
            </div>
          </form>
        </aside>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border-2 border-red-900 p-8 w-full max-w-sm text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
               <h3 className="text-2xl font-teko text-red-500 mb-6 tracking-widest">RESTRICTED ACCESS</h3>
               <form onSubmit={handleAdminLogin}>
                 <input
                   type="password"
                   className="w-full bg-black border border-red-900 p-3 text-red-500 text-center outline-none focus:border-red-500 mb-4 font-mono tracking-widest"
                   placeholder="ENTER PASSCODE"
                   value={adminPass}
                   onChange={(e) => setAdminPass(e.target.value)}
                   autoFocus
                 />
                 <div className="flex gap-2">
                   <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 border border-gray-700 text-gray-500 py-2 hover:bg-gray-900">ABORT</button>
                   <button type="submit" className="flex-1 bg-red-900 text-black font-bold py-2 hover:bg-red-600">VERIFY</button>
                 </div>
               </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
