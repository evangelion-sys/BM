import React, { useState, useEffect, useRef } from 'react';
import { User, Save, HardDrive, Filter, BookOpen, Camera, Upload, Download } from 'lucide-react';
import { subscribeToPath } from '../services/firebaseService';
import { Sector } from '../types';

interface UserProfile {
  fullName: string;
  studentId: string;
  academicLevel: string; 
  group: string;
  speciality: string;
  avatar: string; // Base64 or ID
}

// Pre-defined sci-fi avatars
const PRESETS = [
  'https://cdn-icons-png.flaticon.com/512/4140/4140048.png', // Robot
  'https://cdn-icons-png.flaticon.com/512/4140/4140037.png', // Astronaut
  'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', // Alien
  'https://cdn-icons-png.flaticon.com/512/4140/4140051.png'  // Scientist
];

const ProfileView: React.FC = () => {
  // Identity State
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    studentId: '',
    academicLevel: Sector.LICENCE_L1,
    group: 'G1',
    speciality: '',
    avatar: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data State
  const [relevantFiles, setRelevantFiles] = useState<any[]>([]);
  const [localStats, setLocalStats] = useState({
      logs: 0,
      flashcards: 0,
      timetable: 0
  });

  useEffect(() => {
    // Load Profile
    const saved = localStorage.getItem('BM_STUDENT_PROFILE');
    if (saved) {
      setProfile(JSON.parse(saved));
    }

    // Load Local Stats
    const logs = JSON.parse(localStorage.getItem('BM_DB_logs') || '{}');
    const cards = JSON.parse(localStorage.getItem('BM_DB_flashcards') || '{}');
    setLocalStats({
        logs: Object.keys(logs).length,
        flashcards: Object.keys(cards).length,
        timetable: 1
    });
  }, []);

  // Fetch relevant files when level changes
  useEffect(() => {
    if (profile.academicLevel) {
       const sectorKey = profile.academicLevel.replace(/\s+/g, '_');
       const unsub = subscribeToPath(`resources/${sectorKey}`, (data) => {
         setRelevantFiles(data as any[]);
       });
       return () => unsub();
    }
  }, [profile.academicLevel]);

  const handleSave = () => {
    localStorage.setItem('BM_STUDENT_PROFILE', JSON.stringify(profile));
    // Also update global username if name changed
    if (profile.fullName) {
        localStorage.setItem('BM_USERNAME', profile.fullName);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <User /> IDENTITY CARD
        </h2>
        {isSaved && <span className="text-green-500 font-mono text-xs animate-pulse">PROFILE UPDATED</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: ID Card Form */}
        <div className="bg-[#0a0a0a] border theme-border p-6 relative overflow-hidden flex flex-col gap-6">
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <User size={150} />
           </div>
           
           <div className="flex gap-6 items-start relative z-10">
              {/* Avatar Section */}
              <div className="flex flex-col gap-2 items-center">
                 <div className="w-24 h-24 border-2 theme-border bg-black flex items-center justify-center overflow-hidden relative group">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-gray-600" />
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white cursor-pointer"
                    >
                      CHANGE
                    </button>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                 
                 {/* Presets */}
                 <div className="flex gap-1">
                   {PRESETS.map((src, i) => (
                     <button key={i} onClick={() => setProfile({...profile, avatar: src})} className="w-5 h-5 border border-gray-700 rounded-sm overflow-hidden hover:border-white">
                        <img src={src} className="w-full h-full object-cover"/>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Basic Info Inputs */}
              <div className="flex-1 space-y-4">
                  <div>
                     <label className="text-[10px] text-gray-500 font-mono block mb-1">FULL NAME</label>
                     <input 
                       className="w-full bg-black border border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)]"
                       value={profile.fullName}
                       onChange={e => setProfile({...profile, fullName: e.target.value})}
                       placeholder="e.g. Gordon Freeman"
                     />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-1">STUDENT ID</label>
                    <input 
                        className="w-full bg-black border border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)]"
                        value={profile.studentId}
                        onChange={e => setProfile({...profile, studentId: e.target.value})}
                        placeholder="2024..."
                    />
                  </div>
              </div>
           </div>
           
           <div className="border-t border-[#333] pt-4 space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-1">GROUP</label>
                    <select 
                        className="w-full bg-black border border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)]"
                        value={profile.group}
                        onChange={e => setProfile({...profile, group: e.target.value})}
                    >
                        <option>G1</option><option>G2</option><option>G3</option><option>G4</option>
                    </select>
                  </div>
                  <div>
                     <label className="text-[10px] text-gray-500 font-mono block mb-1">ACADEMIC LEVEL</label>
                     <select 
                       className="w-full bg-black border border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)]"
                       value={profile.academicLevel}
                       onChange={e => setProfile({...profile, academicLevel: e.target.value})}
                     >
                        <option value={Sector.LICENCE_L1}>Licence 1</option>
                        <option value={Sector.LICENCE_L2}>Licence 2</option>
                        <option value={Sector.LICENCE_L3}>Licence 3</option>
                        <option value={Sector.MASTER_S1}>Master 1</option>
                        <option value={Sector.MASTER_S2}>Master 2</option>
                     </select>
                  </div>
              </div>

              {profile.academicLevel.includes('Master') && (
                  <div>
                    <label className="text-[10px] text-gray-500 font-mono block mb-1">SPECIALITY</label>
                    <input 
                        className="w-full bg-black border border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)]"
                        value={profile.speciality}
                        onChange={e => setProfile({...profile, speciality: e.target.value})}
                        placeholder="e.g. Didactics, Literature..."
                    />
                  </div>
              )}

              <button 
                onClick={handleSave}
                className="w-full mt-4 theme-bg text-black font-bold py-3 flex items-center justify-center gap-2 hover:bg-white"
              >
                 <Save size={16} /> ENCODE ID CARD
              </button>
           </div>
        </div>

        {/* Right: Smart Panel */}
        <div className="flex flex-col gap-6">
            
            {/* Local Storage Stats */}
            <div className="bg-[#111] border border-[#333] p-4">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <HardDrive size={16} className="theme-text" /> LOCAL DEVICE STORAGE
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black p-2 border border-[#222]">
                        <div className="text-xl font-mono theme-text">{localStats.logs}</div>
                        <div className="text-[9px] text-gray-500">AUDIO LOGS</div>
                    </div>
                    <div className="bg-black p-2 border border-[#222]">
                        <div className="text-xl font-mono theme-text">{localStats.flashcards}</div>
                        <div className="text-[9px] text-gray-500">FLASHCARDS</div>
                    </div>
                    <div className="bg-black p-2 border border-[#222]">
                        <div className="text-xl font-mono theme-text">--</div>
                        <div className="text-[9px] text-gray-500">CACHE SIZE</div>
                    </div>
                </div>
            </div>

            {/* Recommended Files */}
            <div className="flex-1 bg-[#080808] border border-[#222] p-4 flex flex-col">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Filter size={16} className="theme-text" /> QUICK ACCESS: {profile.academicLevel}
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px]">
                    {relevantFiles.length === 0 ? (
                        <div className="text-center opacity-40 text-xs py-8 font-mono">
                            NO RESOURCES FOUND FOR THIS SECTOR.
                        </div>
                    ) : (
                        relevantFiles.map((file, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 border-b border-[#222] hover:bg-[#151515]">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <BookOpen size={14} className="text-gray-500 flex-shrink-0" />
                                    <span className="text-xs truncate text-gray-300">{file.name}</span>
                                </div>
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white">
                                    <Download size={14} />
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;