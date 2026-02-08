
import React, { useState, useEffect, useRef } from 'react';
import IntroSequence from './components/IntroSequence';
import FeedView from './components/FeedView';
import LabView from './components/LabView';
import AIView from './components/AIView';
import MissionView from './components/MissionView';
import FocusTimer from './components/FocusTimer';
import DataCoreView from './components/DataCoreView';
import GradeCalculator from './components/GradeCalculator';
import FacultyDirectory from './components/FacultyDirectory';
import NeuralTrainingView from './components/NeuralTrainingView';
import TimetableView from './components/TimetableView';
import ExamSchedule from './components/ExamSchedule';
import ResearchLogs from './components/ResearchLogs';
import AboutUs from './components/AboutUs';
import UserGuide from './components/UserGuide';
import AcademicView from './components/AcademicView';
import PeerReviewView from './components/PeerReviewView';
import EntertainmentView from './components/EntertainmentView';
import UtilitiesView from './components/UtilitiesView';
import ProfileView from './components/ProfileView'; 
import { ToolsOverlay } from './components/ToolsOverlay';

import { Sector, ChatMessage } from './types';
import { NAV_ITEMS, ADMIN_PASSWORD, TRANSLATIONS } from './constants';
import { 
  isFirebaseOnline, 
  pushData, 
  subscribeToPath, 
  removeData, 
  saveConnectionConfig, 
  resetConnection, 
  generateInviteLink 
} from './services/firebaseService';
import { playHoverSound, playClickSound, playMessageSound, startAmbience, toggleMute } from './services/audioService';
import { Eye, Radio, Send, Trash2, Volume2, VolumeX, MessageSquare, X, User, Settings, Link as LinkIcon, Columns, Paintbrush, MoveDiagonal, Shield, ChevronRight, Menu, GraduationCap, MapPin, Globe, Smartphone, Download, HardDrive, ExternalLink, Lock, Copy, Upload, Cloud, Github, Award, GitBranch, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSector, setActiveSector] = useState<string>(Sector.LICENCE_L1);
  const [secondarySector, setSecondarySector] = useState<string | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  // Responsive States
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // Info Modal
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Settings & Themes
  const [themeStyle, setThemeStyle] = useState<'CYBERPUNK' | 'GIRLY' | 'MINIMALIST' | 'RETRO_SCIFI'>('CYBERPUNK');
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['CYBERPUNK', 'GIRLY']);
  const [lang, setLang] = useState<'EN' | 'FR' | 'AR'>('EN');
  const [fontSize, setFontSize] = useState<'NORMAL' | 'LARGE'>('NORMAL');
  const [isPwaMode, setIsPwaMode] = useState(false);
  const [showPwaToast, setShowPwaToast] = useState(false);

  // Connection Config
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configInput, setConfigInput] = useState('');
  
  // Sharing State
  const [shareMode, setShareMode] = useState<'PUBLIC' | 'SECURE'>('PUBLIC');
  const [shareLinkText, setShareLinkText] = useState('');

  // Identity & Gamification
  const [username, setUsername] = useState('Guest');
  const [isEditingName, setIsEditingName] = useState(false);
  const [credits, setCredits] = useState(0);
  
  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const firebaseStatus = isFirebaseOnline();

  // Initialization
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    const savedTheme = localStorage.getItem('BM_THEME');
    if (savedTheme) setThemeStyle(savedTheme as any);

    const savedLang = localStorage.getItem('BM_LANG');
    if (savedLang) setLang(savedLang as any);
    
    const savedPwa = localStorage.getItem('BM_PWA_MODE');
    if (savedPwa === 'true') setIsPwaMode(true);

    const savedCredits = localStorage.getItem('BM_CREDITS');
    if (savedCredits) setCredits(parseInt(savedCredits) || 0);

    const savedUnlocks = localStorage.getItem('BM_UNLOCKED_THEMES');
    if (savedUnlocks) {
      try {
        setUnlockedThemes(JSON.parse(savedUnlocks));
      } catch (e) {
        setUnlockedThemes(['CYBERPUNK', 'GIRLY']);
      }
    }
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('BM_USERNAME');
    if (savedName) setUsername(savedName);
  }, []);

  // Update Share Link
  useEffect(() => {
    if (showConfigModal) {
      let publicLink = window.location.href.split('#')[0];
      const secureLink = generateInviteLink();
      const target = (shareMode === 'SECURE' && secureLink) ? secureLink : publicLink;
      setShareLinkText(target);
    }
  }, [showConfigModal, shareMode]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLinkText);
    alert("LINK COPIED TO CLIPBOARD");
  };

  const saveUsername = (name: string) => {
    const finalName = name.trim() || 'Guest';
    setUsername(finalName);
    localStorage.setItem('BM_USERNAME', finalName);
    setIsEditingName(false);
  };

  const updateLang = (newLang: 'EN' | 'FR' | 'AR') => {
    setLang(newLang);
    localStorage.setItem('BM_LANG', newLang);
  };

  const togglePwaMode = (enabled: boolean) => {
    setIsPwaMode(enabled);
    localStorage.setItem('BM_PWA_MODE', String(enabled));
    if (enabled) {
      setShowPwaToast(true);
      setTimeout(() => setShowPwaToast(false), 5000);
    }
  };

  // --- GAMIFICATION LOGIC ---
  const handleEarnCredits = (amount: number) => {
    const safeCurrent = isNaN(credits) ? 0 : credits;
    const newTotal = safeCurrent + amount;
    setCredits(newTotal);
    localStorage.setItem('BM_CREDITS', newTotal.toString());
    playMessageSound();
  };

  const unlockTheme = (theme: string, cost: number) => {
    if (credits >= cost) {
      const newCredits = credits - cost;
      const newUnlocks = [...unlockedThemes, theme];
      
      setCredits(newCredits);
      setUnlockedThemes(newUnlocks);
      localStorage.setItem('BM_CREDITS', newCredits.toString());
      localStorage.setItem('BM_UNLOCKED_THEMES', JSON.stringify(newUnlocks));
      
      playMessageSound();
      alert(`THEME '${theme}' UNLOCKED!`);
    } else {
      alert(`INSUFFICIENT CREDITS. REQUIRED: ${cost} CR.`);
    }
  };

  // --- THEME ENGINE ---
  useEffect(() => {
    const root = document.documentElement;
    const scanlines = document.querySelector('.scanlines');
    
    // Default Reset
    if (scanlines) scanlines.classList.remove('hidden');

    switch (themeStyle) {
      case 'CYBERPUNK':
        root.style.setProperty('--theme-color', isAdmin ? '#ff0000' : '#ff9900');
        root.style.setProperty('--theme-dim', isAdmin ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 153, 0, 0.1)');
        root.style.setProperty('--bg-color', '#050505');
        // UPGRADED FONT to Rajdhani
        root.style.setProperty('--font-main', "'Rajdhani', sans-serif");
        document.body.style.fontFamily = "'Rajdhani', sans-serif";
        break;
      case 'GIRLY':
        root.style.setProperty('--theme-color', '#ff80bf');
        root.style.setProperty('--theme-dim', 'rgba(255, 128, 191, 0.15)');
        root.style.setProperty('--bg-color', '#1f0a14');
        root.style.setProperty('--font-main', "'Quicksand', sans-serif");
        document.body.style.fontFamily = "'Quicksand', sans-serif";
        break;
      case 'MINIMALIST':
        root.style.setProperty('--theme-color', '#000000');
        root.style.setProperty('--theme-dim', 'rgba(0, 0, 0, 0.05)');
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--font-main', "'Inter', sans-serif");
        document.body.style.fontFamily = "'Inter', sans-serif";
        if (scanlines) scanlines.classList.add('hidden');
        break;
      case 'RETRO_SCIFI':
        root.style.setProperty('--theme-color', '#33ff00');
        root.style.setProperty('--theme-dim', 'rgba(51, 255, 0, 0.15)');
        root.style.setProperty('--bg-color', '#051a00');
        root.style.setProperty('--font-main', "'VT323', monospace");
        document.body.style.fontFamily = "'VT323', monospace";
        break;
    }
    localStorage.setItem('BM_THEME', themeStyle);
  }, [isAdmin, themeStyle]);

  // Chat Subscription
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

  const handleToolOpen = (toolId: string) => {
    if (toolId === 'TOOL_TELEGRAM') {
      setSecondarySector('TOOL_TELEGRAM');
    } else if (toolId === 'TOOL_DRIVE') {
      setSecondarySector('TOOL_DRIVE');
    } else {
      setActiveSector(Sector.UTILITIES);
    }
  };

  const t = (key: string) => TRANSLATIONS[lang][key] || key;

  const getNavLabel = (key: string) => {
    const labelKey = key.replace(/\s+/g, '_');
    return TRANSLATIONS[lang][labelKey] || TRANSLATIONS['EN'][labelKey] || key;
  };

  const renderComponent = (sector: string) => {
    // Component Router
    if (sector === 'TOOL_TELEGRAM') {
      return (
        <div className="h-full flex flex-col bg-[var(--bg-color)] p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-blue-900/50 bg-blue-900/5 p-8">
            <Send size={40} className="text-blue-500 mb-6" />
            <h2 className="text-2xl font-teko text-blue-400 mb-2 tracking-widest">SECURE COMMS GATEWAY</h2>
            <a href="https://web.telegram.org/k/" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-blue-600 text-white font-bold text-sm">
               ESTABLISH UPLINK <ExternalLink size={14} className="inline"/>
            </a>
          </div>
        </div>
      );
    }
    if (sector === 'TOOL_DRIVE') {
       return (
        <div className="h-full flex flex-col bg-[var(--bg-color)] p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-green-900/50 bg-green-900/5 p-8">
            <HardDrive size={40} className="text-green-500 mb-6" />
            <h2 className="text-2xl font-teko text-green-400 mb-2 tracking-widest">DATA STORAGE VAULT</h2>
            <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-green-600 text-white font-bold text-sm">
               MOUNT DRIVE <ExternalLink size={14} className="inline"/>
            </a>
          </div>
        </div>
      );
    }
    if (sector.includes('Licence') || sector.includes('Master')) return <AcademicView level={sector} isAdmin={isAdmin} username={username} />;
    
    switch (sector) {
      case Sector.PROFILE: return <ProfileView />;
      case Sector.LAB: return <LabView />;
      case Sector.AI: return <AIView />;
      case Sector.MISSIONS: return <MissionView username={username} />;
      case Sector.DATA: return <DataCoreView username={username} />;
      case Sector.CALCULATOR: return <GradeCalculator />;
      case Sector.FACULTY: return <FacultyDirectory />;
      case Sector.TIMETABLE: return <TimetableView />;
      case Sector.EXAMS: return <ExamSchedule />;
      case Sector.TRAINING: return <NeuralTrainingView />;
      case Sector.LOGS: return <ResearchLogs />;
      case Sector.ABOUT: return <AboutUs />;
      case Sector.GUIDE: return <UserGuide />;
      case Sector.PEER_REVIEW: return <PeerReviewView username={username} onEarnCredits={handleEarnCredits} />;
      case Sector.ENTERTAINMENT: return <EntertainmentView />;
      case Sector.UTILITIES: return <UtilitiesView />;
      default: return <FeedView isAdmin={isAdmin} />;
    }
  };

  return (
    <>
      {showIntro && <IntroSequence onComplete={handleEnterSystem} />}
      
      <div className={`h-[100dvh] w-screen flex flex-col md:flex-row overflow-hidden transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'} ${fontSize === 'LARGE' ? 'text-lg' : ''}`} style={{ fontFamily: 'var(--font-main)' }}>
        
        {/* Mobile Nav */}
        <div className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-md transition-transform duration-300 md:hidden flex flex-col ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-4 border-b theme-border flex justify-between items-center">
             <h2 className="font-teko text-2xl theme-text">SECTOR NAVIGATION</h2>
             <button onClick={() => setIsMobileNavOpen(false)}><X className="theme-text" /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_ITEMS.map((item, idx) => (
                 item.id === 'divider' ? 
                 <div key={idx} className="text-gray-500 text-[10px] font-bold tracking-[0.2em] pt-6 pb-2 border-b border-gray-800 uppercase">{getNavLabel(item.label)}</div> :
                 <button key={item.id} onClick={() => { setActiveSector(item.id); setIsMobileNavOpen(false); }} className={`w-full text-left py-3 px-2 border-l-2 ${activeSector === item.id ? 'theme-border theme-text bg-[#111]' : 'border-transparent text-gray-400'}`}>
                   {getNavLabel(item.label)}
                 </button>
              ))}
           </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-[var(--bg-color)] border-r border-[#333] flex-col z-20 theme-border relative overflow-hidden shrink-0 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
          <div className="relative z-10 p-6 border-b border-[#333] theme-border">
             <button onClick={() => { playClickSound(); setShowInfoModal(true); }} className="flex items-center gap-3 mb-2 w-full text-left group hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 border-2 theme-border rounded-full flex items-center justify-center bg-[var(--theme-dim)] relative overflow-hidden group-hover:scale-105 transition-transform">
                   <div className="absolute inset-0 bg-[var(--theme-color)] opacity-0 group-hover:opacity-20 transition-opacity animate-pulse"></div>
                   <span className="font-teko text-2xl translate-y-[-1px] font-bold theme-text">λ</span>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono leading-none tracking-widest mb-1">UNIV. EL BACHIR</div>
                  <div className="text-xl font-teko leading-none tracking-[0.1em] theme-text">BLACK MESA</div>
                </div>
             </button>
             <div className="text-[9px] text-gray-600 font-mono tracking-widest text-center border-t border-[#222] pt-2 mt-2">
                FACULTY OF ARTS & LANGUAGES
             </div>
          </div>

          <div className="relative z-10 flex flex-col h-full bg-[var(--theme-dim)] backdrop-blur-sm">
            <div className="px-6 py-3 border-b border-[#333] flex flex-col gap-2 bg-[var(--bg-color)]">
               <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                     <User size={12} className={isAdmin ? 'text-red-500' : ''}/>
                     {isEditingName ? (
                       <form onSubmit={(e) => {e.preventDefault(); saveUsername(username);}}>
                         <input autoFocus className="w-24 bg-[#111] border theme-border px-1 py-0 text-xs theme-text outline-none" value={username} onChange={(e) => setUsername(e.target.value)} onBlur={() => saveUsername(username)} />
                       </form>
                     ) : (
                       <span onClick={() => setIsEditingName(true)} className="cursor-pointer hover:text-white font-bold tracking-wider">{username}</span>
                     )}
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold theme-text bg-[var(--theme-dim)] px-2 py-0.5 rounded-full border theme-border">
                      <Award size={10} /> {credits} CR
                   </div>
               </div>
               <div className="flex justify-end gap-2">
                 <button onClick={toggleSound} className="opacity-50 hover:opacity-100 theme-text">{isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}</button>
                 <button onClick={() => { playClickSound(); isAdmin ? setIsAdmin(false) : setShowAdminLogin(true); }} className="opacity-50 hover:opacity-100 theme-text">{isAdmin ? <Shield size={12} /> : <Eye size={12} />}</button>
                 <button onClick={() => setSecondarySector(secondarySector ? null : Sector.LAB)} title="Toggle Split View" className={`opacity-50 hover:opacity-100 theme-text ${secondarySector ? 'opacity-100' : ''}`}><Columns size={12}/></button>
               </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
              {NAV_ITEMS.map((item, idx) => {
                if (item.id === 'divider') return <div key={idx} className="text-[10px] text-gray-600 px-6 py-1 mt-4 font-bold tracking-[0.2em] border-b border-[#151515] mb-2 uppercase flex items-center gap-2">
                   <div className="w-1 h-1 bg-gray-600"></div> {getNavLabel(item.label)}
                </div>;
                const isActive = activeSector === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSector(item.id); playClickSound(); setIsMobileChatOpen(false); }}
                    onMouseEnter={playHoverSound}
                    className={`w-full text-left px-6 py-2 text-xs font-mono tracking-wider hover:bg-[#151515] transition-all relative group flex items-center justify-between ${isActive ? 'theme-text bg-[var(--theme-dim)] border-r-2 theme-border' : 'text-gray-500'}`}
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{isActive ? `[ ${getNavLabel(item.label)} ]` : getNavLabel(item.label)}</span>
                    {isActive && <ChevronRight size={10} className="animate-pulse"/>}
                  </button>
                );
              })}
            </nav>
            <FocusTimer />
            <div className="p-3 border-t border-[#333] text-[10px] font-mono text-gray-500 theme-border cursor-pointer hover:bg-[#111] transition-colors flex justify-between items-center bg-[var(--bg-color)]" onClick={() => setShowConfigModal(true)}>
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${firebaseStatus ? 'bg-green-500 shadow-[0_0_5px_lime]' : 'bg-red-500'}`}></div>
                 {firebaseStatus ? t('online') : t('offline')}
               </div>
               <Settings size={12} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[var(--bg-color)] relative overflow-hidden flex flex-col min-w-0 bg-grid">
          <header className="h-14 border-b border-[#222] theme-border flex items-center justify-between px-4 bg-[var(--bg-color)]/90 backdrop-blur z-20 shrink-0 md:px-6">
             <div className="flex items-center gap-3">
               <button className="md:hidden theme-text" onClick={() => setIsMobileNavOpen(true)}><Menu /></button>
               <h2 className="text-xl font-teko theme-text tracking-[0.2em] text-glow truncate flex items-center gap-2">
                 <span className="opacity-50 hidden sm:inline">SECTOR // </span> {activeSector.toUpperCase()}
               </h2>
             </div>
             <div className="flex items-center gap-2">
               <button className="lg:hidden theme-text border theme-border px-3 py-1 flex items-center gap-2 hover:bg-[#151515] text-xs" onClick={() => setIsMobileChatOpen(!isMobileChatOpen)}>
                 <MessageSquare size={14} /> <span className="hidden sm:inline">COMMS</span>
               </button>
               <button className="md:hidden theme-text p-2" onClick={() => setShowConfigModal(true)}><Settings size={16}/></button>
             </div>
          </header>

          <div className="flex-1 flex overflow-hidden relative">
             <div className={`flex-1 relative border-r border-[#222] flex flex-col min-w-0 transition-all duration-300 ${secondarySector && 'hidden lg:flex'}`}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                   <span className="text-[20rem] font-teko text-[var(--theme-color)] select-none">λ</span>
                </div>
                <div className="relative z-10 h-full w-full overflow-hidden">
                  {renderComponent(activeSector)}
                </div>
             </div>
             
             {secondarySector && (
               <div className="flex-1 relative border-l-4 border-black bg-[var(--bg-color)] shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)] flex flex-col">
                  <div className="flex justify-between items-center p-2 bg-black border-b theme-border z-20">
                     <span className="text-xs font-bold theme-text pl-2">{secondarySector}</span>
                     <div className="flex gap-1">
                        <button onClick={() => setSecondarySector(null)} className="bg-red-900 text-white px-2 text-xs py-1 hover:bg-red-700 border border-red-800">CLOSE</button>
                     </div>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                     {renderComponent(secondarySector)}
                  </div>
               </div>
             )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-[var(--bg-color)] border-l border-[#333] theme-border flex flex-col z-30 transition-transform duration-300 ${isMobileChatOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} shrink-0 lg:relative shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
          <div className="p-3 border-b border-[#333] bg-[var(--bg-color)] theme-border flex justify-between items-center h-14">
            <h3 className="text-xs font-bold tracking-widest theme-text flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-color)] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 theme-bg"></span>
              </span>
              SECTOR COMMS LOG
            </h3>
            <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setIsMobileChatOpen(false)}><X size={18} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-color)] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
            {chatHistory.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-30 theme-text">
                  <Radio size={40} className="mb-2 animate-pulse"/>
                  <div className="text-xs font-mono">-- WAITING FOR SIGNAL --</div>
               </div>
            ) : (
              chatHistory.map((msg) => {
                 const isMe = msg.sender === (isAdmin ? 'ADMIN' : username);
                 return (
                  <div key={msg.id} className={`group flex flex-col ${isMe ? 'items-end' : 'items-start'} relative z-10`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-[10px] font-bold tracking-wider ${msg.isAdmin ? 'text-red-500' : 'theme-text'}`}>{msg.sender.toUpperCase()}</span>
                      <span className="text-[9px] text-gray-700">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`relative max-w-[90%] text-xs p-3 shadow-lg backdrop-blur-sm border ${isMe ? 'bg-[#151515]/90 border-gray-700 text-gray-200 rounded-tl-lg rounded-bl-lg rounded-br-lg' : 'bg-[var(--theme-dim)] theme-border theme-text rounded-tr-lg rounded-bl-lg rounded-br-lg'}`}>
                      {msg.text}
                      {isAdmin && <button onClick={() => deleteMessage(msg.id)} className="absolute -right-5 top-1 opacity-0 group-hover:opacity-100 text-red-900 hover:text-red-500 transition-opacity"><Trash2 size={12} /></button>}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={chatEndRef}></div>
          </div>
          <form onSubmit={handleChatSend} className="p-3 border-t border-[#333] bg-[var(--bg-color)] theme-border relative z-20">
            <div className="flex gap-2">
              <input className="w-full bg-[#151515] border border-[#333] theme-border px-3 py-2 text-xs theme-text outline-none focus:bg-black transition-colors rounded-sm" placeholder="TRANSMIT MESSAGE..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
              <button type="submit" className="theme-bg text-black px-3 hover:bg-white transition-colors rounded-sm flex items-center justify-center"><Send size={14} /></button>
            </div>
          </form>
        </aside>

        <ToolsOverlay onOpenTool={handleToolOpen} />
        {showPwaToast && (
          <div className="fixed bottom-6 left-6 z-[60] bg-[#111] border-l-4 theme-border p-4 shadow-2xl animate-in slide-in-from-left duration-500 max-w-sm">
             <div className="flex items-start gap-3">
               <Download className="theme-text animate-bounce" size={20} />
               <div>
                 <h4 className="font-bold theme-text text-sm mb-1">{t('pwa_toast')}</h4>
                 <p className="text-xs text-gray-500">Check your browser menu to "Install App" or "Add to Home Screen".</p>
               </div>
               <button onClick={() => setShowPwaToast(false)} className="text-gray-600 hover:text-white"><X size={14}/></button>
             </div>
          </div>
        )}

        {/* Config / Store Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border-2 theme-border p-8 w-full max-w-4xl relative shadow-[0_0_50px_rgba(255,153,0,0.1)] overflow-y-auto max-h-[90vh]">
               <button onClick={() => setShowConfigModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24}/></button>
               <h3 className="text-4xl font-teko theme-text mb-6 tracking-widest flex items-center gap-3 border-b border-[#333] pb-4"><Settings size={32} /> {t('settings')}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 
                 {/* Left Column: Store */}
                 <div className="space-y-8">
                    <div>
                       <h4 className="font-bold text-white mb-3 flex items-center justify-between text-sm uppercase tracking-wider">
                         <span className="flex items-center gap-2"><Paintbrush size={16} className="theme-text"/> {t('interface_style')}</span>
                         <span className="text-xs theme-text border theme-border px-2 py-0.5 rounded-full flex items-center gap-1"><Award size={10}/> {credits} CREDITS</span>
                       </h4>
                       <div className="grid grid-cols-2 gap-3">
                         <button onClick={() => setThemeStyle('CYBERPUNK')} className={`p-4 border text-left transition-all ${themeStyle === 'CYBERPUNK' ? 'bg-[#ff9900] text-black border-[#ff9900]' : 'border-gray-700 text-gray-500 hover:border-white'}`}>
                           <div className="font-bold text-sm mb-1">CYBERPUNK</div>
                           <div className="text-[10px] opacity-70">Standard Issue</div>
                         </button>
                         <button onClick={() => setThemeStyle('GIRLY')} className={`p-4 border text-left transition-all ${themeStyle === 'GIRLY' ? 'bg-[#ff80bf] text-black border-[#ff80bf]' : 'border-gray-700 text-gray-500 hover:border-white'}`}>
                           <div className="font-bold text-sm mb-1">SOFT/GIRLY</div>
                           <div className="text-[10px] opacity-70">Rounder UI</div>
                         </button>
                         
                         {unlockedThemes.includes('MINIMALIST') ? (
                           <button onClick={() => setThemeStyle('MINIMALIST')} className={`p-4 border text-left transition-all ${themeStyle === 'MINIMALIST' ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-500 hover:border-white'}`}>
                             <div className="font-bold text-sm mb-1">MINIMALIST</div>
                             <div className="text-[10px] opacity-70">High Contrast</div>
                           </button>
                         ) : (
                           <button onClick={() => unlockTheme('MINIMALIST', 50)} className="p-4 border border-dashed border-gray-800 text-left hover:bg-gray-900 group">
                             <div className="font-bold text-sm mb-1 text-gray-400 flex justify-between items-center">LOCKED <Lock size={12}/></div>
                             <div className="text-[10px] text-[var(--theme-color)] group-hover:underline">UNLOCK (50 CR)</div>
                           </button>
                         )}

                         {unlockedThemes.includes('RETRO_SCIFI') ? (
                           <button onClick={() => setThemeStyle('RETRO_SCIFI')} className={`p-4 border text-left transition-all ${themeStyle === 'RETRO_SCIFI' ? 'bg-[#00ff00] text-black border-[#00ff00]' : 'border-gray-700 text-gray-500 hover:border-white'}`}>
                             <div className="font-bold text-sm mb-1">RETRO TERM</div>
                             <div className="text-[10px] opacity-70">VT323 / Scanlines</div>
                           </button>
                         ) : (
                           <button onClick={() => unlockTheme('RETRO_SCIFI', 100)} className="p-4 border border-dashed border-gray-800 text-left hover:bg-gray-900 group">
                             <div className="font-bold text-sm mb-1 text-gray-400 flex justify-between items-center">LOCKED <Lock size={12}/></div>
                             <div className="text-[10px] text-[var(--theme-color)] group-hover:underline">UNLOCK (100 CR)</div>
                           </button>
                         )}
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><Globe size={16} className="theme-text"/> {t('language')}</h4>
                       <div className="flex gap-2">
                         {['EN', 'FR', 'AR'].map((l) => (
                           <button key={l} onClick={() => updateLang(l as any)} className={`flex-1 py-3 px-4 text-xs font-bold border ${lang === l ? 'theme-bg text-black scale-105' : 'border-gray-700 text-gray-400'}`}>{l}</button>
                         ))}
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Deployment */}
                 <div className="space-y-8">
                   <div>
                     <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><Radio size={16} className="theme-text"/> {t('conn_status')}</h4>
                     <div className={`p-6 border ${firebaseStatus ? 'border-green-900 bg-green-900/10' : 'border-red-900 bg-red-900/10'} mb-4 relative overflow-hidden`}>
                        {firebaseStatus && <div className="absolute -right-10 -top-10 w-24 h-24 bg-green-500 blur-3xl opacity-20"></div>}
                        <div className={`text-2xl font-bold mb-2 ${firebaseStatus ? 'text-green-500' : 'text-red-500'}`}>{firebaseStatus ? 'CONNECTED' : 'OFFLINE / SIM'}</div>
                        <p className="text-xs text-gray-400 font-mono leading-relaxed">{firebaseStatus ? "Uplink established. Data sync active." : "Running in local simulation mode."}</p>
                     </div>
                   </div>

                    <div className="pt-6 border-t border-[#333]">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><GitBranch size={16} className="theme-text"/> SOURCE CONTROL & DEPLOYMENT</h4>
                        <div className="bg-black border border-[#333] p-4 relative group hover:border-[var(--theme-color)] transition-all">
                            
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center">
                                     <Github size={20} />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-white">GITHUB REPOSITORY</div>
                                    <div className="text-[10px] text-green-500 flex items-center gap-1"><CheckCircle size={10}/> SYNCED (v2.0.0)</div>
                                  </div>
                               </div>
                               <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-[10px] border border-gray-700 hover:border-white px-3 py-1 text-gray-300">OPEN REPO</a>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <input readOnly className="flex-1 bg-[#111] border border-[#333] p-2 text-xs text-gray-300 font-mono truncate" value={shareLinkText} />
                                <button onClick={copyShareLink} className="theme-bg text-black p-2 hover:bg-white" title="Copy Link"><Copy size={14} /></button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 border border-[#333] hover:border-white hover:bg-[#111] transition-all group">
                                    <div className="text-white font-bold text-xs mb-1 group-hover:text-[var(--theme-color)] flex items-center gap-2"><Upload size={12} /> DEPLOY VERCEL</div>
                                </a>
                                <a href="https://app.netlify.com/start/deploy" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 border border-[#333] hover:border-white hover:bg-[#111] transition-all group">
                                    <div className="text-blue-400 font-bold text-xs mb-1 group-hover:text-white flex items-center gap-2"><Cloud size={12} /> DEPLOY NETLIFY</div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                      <div className="mt-6 pt-6 border-t border-[#333]">
                        <h4 className="font-bold text-red-500 mb-3 text-sm uppercase tracking-wider flex items-center gap-2"><Lock size={14}/> NETWORK ADMIN</h4>
                        <textarea className="w-full h-24 bg-black border border-[#333] p-3 text-[10px] font-mono theme-text outline-none resize-none focus:border-[var(--theme-color)] mb-4" placeholder='{ "apiKey": "...", "authDomain": "..." }' value={configInput} onChange={(e) => setConfigInput(e.target.value)} />
                        <div className="flex gap-4">
                          <button onClick={() => saveConnectionConfig(configInput)} className="flex-1 theme-bg text-black py-2 font-bold text-xs">SAVE</button>
                          <button onClick={resetConnection} className="flex-1 bg-red-900/10 border border-red-900 text-red-500 py-2 text-xs">RESET</button>
                        </div>
                     </div>
                    )}
                 </div>
               </div>
            </div>
          </div>
        )}
        
        {/* Modals: Info & Admin */}
        {showInfoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowInfoModal(false)}>
             <div className="bg-[#0a0a0a] border-2 theme-border p-10 max-w-lg w-full text-center relative shadow-[0_0_100px_rgba(255,153,0,0.2)]" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowInfoModal(false)} className="absolute top-4 right-4 text-gray-600 hover:text-white"><X/></button>
                <div className="w-24 h-24 rounded-full border-4 theme-border flex items-center justify-center mx-auto mb-6 bg-black relative shadow-[0_0_30px_var(--theme-color)] animate-[pulse_3s_infinite]">
                   <span className="font-teko text-7xl font-bold translate-y-[-4px] text-glow theme-text">λ</span>
                </div>
                <h1 className="text-5xl font-teko theme-text mb-2 tracking-widest text-glow">UNIV. MOHAMED EL BACHIR</h1>
                <div className="h-px w-32 theme-bg mx-auto mb-4"></div>
                <div className="flex items-center justify-center gap-2 text-xl font-mono text-white mb-8 tracking-wider"><GraduationCap size={24} className="theme-text" /> FACULTY OF ARTS & LANGUAGES</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent"></div>
             </div>
          </div>
        )}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border-2 border-red-900 p-8 w-full max-w-sm text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
               <h3 className="text-2xl font-teko text-red-500 mb-6 tracking-widest">RESTRICTED ACCESS</h3>
               <form onSubmit={handleAdminLogin}>
                 <input type="password" className="w-full bg-black border border-red-900 p-3 text-red-500 text-center outline-none focus:border-red-500 mb-4 font-mono tracking-widest" placeholder="ENTER PASSCODE" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} autoFocus />
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
