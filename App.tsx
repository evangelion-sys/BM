import React, { useState, useEffect, useRef } from 'react';
import IntroSequence from './components/IntroSequence';
import FeedView from './components/FeedView';
import LabView from './components/LabView';
import AIView from './components/AIView';
import MissionView from './components/MissionView';
import SystemMonitor from './components/SystemMonitor';
import FocusTimer from './components/FocusTimer';
import DataCoreView from './components/DataCoreView';
import PersonalLog from './components/PersonalLog';
import GradeCalculator from './components/GradeCalculator';
import FacultyDirectory from './components/FacultyDirectory';
import NeuralTrainingView from './components/NeuralTrainingView';
import TimetableView from './components/TimetableView';
import ExamSchedule from './components/ExamSchedule';
import ResearchLogs from './components/ResearchLogs';
import AboutUs from './components/AboutUs';
import UserGuide from './components/UserGuide';
import { Sector, ChatMessage } from './types';
import { NAV_ITEMS, ADMIN_PASSWORD } from './constants';
import { isFirebaseOnline, pushData, subscribeToPath, removeData } from './services/firebaseService';
import { playHoverSound, playClickSound, playMessageSound, startAmbience, toggleMute } from './services/audioService';
import { Eye, EyeOff, Radio, Circle, Send, Trash2, Volume2, VolumeX, MessageSquare, X, User } from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSector, setActiveSector] = useState<string>(Sector.LICENCE_L1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // Identity
  const [username, setUsername] = useState('Guest');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const firebaseStatus = isFirebaseOnline();

  useEffect(() => {
    // Load username
    const savedName = localStorage.getItem('BM_USERNAME');
    if (savedName) setUsername(savedName);
  }, []);

  const saveUsername = (name: string) => {
    const finalName = name.trim() || 'Guest';
    setUsername(finalName);
    localStorage.setItem('BM_USERNAME', finalName);
    setIsEditingName(false);
  };

  // THEME MANAGEMENT
  useEffect(() => {
    const root = document.documentElement;
    if (isAdmin) {
      root.style.setProperty('--theme-color', '#ff0000');
      root.style.setProperty('--theme-dim', 'rgba(255, 0, 0, 0.1)');
    } else {
      root.style.setProperty('--theme-color', '#ff9900');
      root.style.setProperty('--theme-dim', 'rgba(255, 153, 0, 0.1)');
    }
  }, [isAdmin]);

  // Chat subscription
  useEffect(() => {
    const cleanSectorId = activeSector.replace(/\s+/g, '_');
    const unsubscribe = subscribeToPath(`chat/${cleanSectorId}`, (data) => {
      if (data) {
        setChatHistory((prev) => {
          if (data.length > prev.length && !showIntro) {
             const lastMsg = data[data.length -1] as ChatMessage;
             if (lastMsg.sender !== (isAdmin ? 'ADMIN' : username)) {
               playMessageSound();
             }
          }
          return data as ChatMessage[];
        });
      } else {
        setChatHistory([]);
      }
    });
    return () => unsubscribe();
  }, [activeSector, isAdmin, showIntro, username]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isMobileChatOpen]);

  const handleEnterSystem = () => {
    setShowIntro(false);
    startAmbience();
    playClickSound();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
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
    playClickSound();

    const cleanSectorId = activeSector.replace(/\s+/g, '_');
    const msg: Omit<ChatMessage, 'id'> = {
      text: chatMessage,
      sender: isAdmin ? 'ADMIN' : username,
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

  const toggleSound = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    playClickSound();
  };

  const renderMainContent = () => {
    switch (activeSector) {
      case Sector.LAB:
        return <LabView />;
      case Sector.AI:
        return <AIView />;
      case Sector.MISSIONS:
        return <MissionView username={username} />;
      case Sector.DATA:
        return <DataCoreView username={username} />;
      case Sector.CALCULATOR:
        return <GradeCalculator />;
      case Sector.FACULTY:
        return <FacultyDirectory />;
      case Sector.TIMETABLE:
        return <TimetableView />;
      case Sector.EXAMS:
        return <ExamSchedule />;
      case Sector.TRAINING:
        return <NeuralTrainingView />;
      case Sector.LOGS:
        return <ResearchLogs />;
      case Sector.ABOUT:
        return <AboutUs />;
      case Sector.GUIDE:
        return <UserGuide />;
      default:
        // Handles FeedView for LICENCE_L1, LICENCE_L2, etc.
        return <FeedView isAdmin={isAdmin} />;
    }
  };

  return (
    <>
      {showIntro && <IntroSequence onComplete={handleEnterSystem} />}
      
      {/* Main Layout */}
      <div className={`h-screen w-screen flex flex-col md:flex-row overflow-hidden transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Left Sidebar: Navigation */}
        <aside className="w-full md:w-64 bg-[#080808] border-r border-[#333] flex flex-col z-20 theme-border relative overflow-hidden">
          
          {/* SIDEBAR BACKGROUND LAMBDA LOGO */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
             <span className="text-[20rem] font-teko text-[var(--theme-color)] select-none">λ</span>
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="p-6 border-b border-[#333] theme-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 theme-bg rounded-full animate-pulse shadow-[0_0_10px_var(--theme-color)]"></div>
                <h1 className="text-xl font-teko tracking-widest theme-text">BLACK MESA</h1>
              </div>
              {/* Admin & Sound Toggles */}
              <div className="flex gap-2">
                <button onClick={toggleSound} className="opacity-50 hover:opacity-100 theme-text" title="Toggle Audio">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button onClick={() => { playClickSound(); isAdmin ? setIsAdmin(false) : setShowAdminLogin(true); }} className="opacity-50 hover:opacity-100 theme-text" title="Admin Access">
                  {isAdmin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* User Identity Module */}
            <div className="px-6 py-4 border-b border-[#333] theme-border">
               <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-1">
                 <User size={12} /> IDENTITY //
               </div>
               {isEditingName ? (
                 <form onSubmit={(e) => {e.preventDefault(); saveUsername(username);}}>
                   <input 
                     autoFocus
                     className="w-full bg-[#111] border theme-border px-2 py-1 text-sm theme-text outline-none"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     onBlur={() => saveUsername(username)}
                   />
                 </form>
               ) : (
                 <div 
                   className="text-lg font-bold tracking-widest cursor-pointer hover:bg-[#111] px-1 -ml-1 theme-text"
                   onClick={() => setIsEditingName(true)}
                   title="Click to change Callsign"
                 >
                   {username}
                 </div>
               )}
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              {NAV_ITEMS.map((item, idx) => {
                if (item.id === 'divider') return <div key={idx} className="text-xs text-gray-600 px-6 py-2 mt-4 font-bold tracking-wider">{item.label}</div>;
                
                const isActive = activeSector === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSector(item.id); playClickSound(); setIsMobileChatOpen(false); }}
                    onMouseEnter={playHoverSound}
                    className={`w-full text-left px-6 py-3 text-sm font-mono tracking-wider hover:bg-[#151515] transition-colors relative
                      ${isActive ? 'theme-text bg-[#101010]' : 'text-gray-400'}
                    `}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 theme-bg"></div>}
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            <FocusTimer />
            <SystemMonitor />
            <PersonalLog />

            <div className="p-4 border-t border-[#333] text-xs font-mono text-gray-500 theme-border">
               <div className="flex items-center gap-2 mb-1">
                 <Radio size={12} className={firebaseStatus ? "text-green-500" : "text-red-500"} />
                 STATUS: {firebaseStatus ? 'ONLINE' : 'OFFLINE'}
               </div>
               <div>SECURE CHANNEL: {activeSector.split(' ')[0]}</div>
            </div>
          </div>
        </aside>

        {/* Center: Content */}
        <main className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
          {/* Header Bar */}
          <header className="h-16 border-b border-[#222] theme-border flex items-center justify-between px-8 bg-[#0a0a0a]/90 backdrop-blur z-10">
             <h2 className="text-2xl font-teko theme-text tracking-[0.2em] text-glow">{activeSector.toUpperCase()}</h2>
             
             {/* Mobile Chat Toggle */}
             <button 
               className="lg:hidden theme-text border theme-border px-3 py-1 flex items-center gap-2 hover:bg-[#151515]"
               onClick={() => { setIsMobileChatOpen(!isMobileChatOpen); playClickSound(); }}
             >
               <MessageSquare size={16} /> COMM LINK
             </button>
          </header>

          <div className="flex-1 overflow-hidden relative">
             {/* MAIN CONTENT BACKGROUND LAMBDA LOGO */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                <span className="text-[20rem] md:text-[35rem] font-teko text-[var(--theme-color)] select-none">λ</span>
             </div>
             
             {/* Content Wrapper */}
             <div className="relative z-10 h-full w-full">
               {renderMainContent()}
             </div>
          </div>
        </main>

        {/* Right Sidebar: Chat (Responsive Drawer) */}
        <aside className={`
          fixed lg:static inset-y-0 right-0 w-80 bg-[#080808] border-l border-[#333] theme-border flex flex-col z-30 transition-transform duration-300
          ${isMobileChatOpen ? 'translate-x-0 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 border-b border-[#333] bg-[#0a0a0a] theme-border flex justify-between items-center">
            <h3 className="text-sm font-bold tracking-widest theme-text flex items-center gap-2">
              <Circle size={10} className="theme-fill" style={{fill: 'var(--theme-color)'}} /> SECTOR COMM LINK
            </h3>
            <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setIsMobileChatOpen(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 ? (
               <div className="text-xs text-gray-600 text-center mt-10">... CHANNEL SILENT ...</div>
            ) : (
              chatHistory.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className={`text-xs font-bold ${msg.isAdmin ? 'text-red-500' : 'theme-text'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="text-sm text-gray-300 bg-[#111] p-2 border-l-2 theme-border relative">
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

          <form onSubmit={handleChatSend} className="p-3 border-t border-[#333] bg-[#0a0a0a] theme-border">
            <div className="flex gap-2">
              <input 
                className="w-full bg-[#151515] border border-[#333] theme-border px-3 py-2 text-sm theme-text outline-none focus:ring-1 focus:ring-[var(--theme-color)]"
                placeholder="Transmit..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button type="submit" className="theme-bg text-black px-3 hover:bg-white transition-colors">
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
                   <button type="button" onClick={() => { playClickSound(); setShowAdminLogin(false); }} className="flex-1 border border-gray-700 text-gray-500 py-2 hover:bg-gray-900">ABORT</button>
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