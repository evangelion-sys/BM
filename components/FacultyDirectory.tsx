import React, { useState, useEffect } from 'react';
import { FacultyMember } from '../types';
import { subscribeToPath, pushData, removeData } from '../services/firebaseService';
import { Search, Copy, Mail, Users, Plus, Trash2, Save, Filter } from 'lucide-react';

const FacultyDirectory: React.FC = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Filters
  const [searchName, setSearchName] = useState('');
  const [searchModule, setSearchModule] = useState('');
  const [searchStatus, setSearchStatus] = useState('ALL');

  // Form State
  const [newName, setNewName] = useState('');
  const [newModule, setNewModule] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState<FacultyMember['status']>('OFFICE');

  useEffect(() => {
    const unsubscribe = subscribeToPath('faculty', (data) => {
      if (data) setFaculty(data as FacultyMember[]);
    });
    return () => unsubscribe();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newModule) return;

    await pushData('faculty', {
      name: newName,
      module: newModule,
      email: newEmail || 'N/A',
      status: newStatus
    });

    setNewName('');
    setNewModule('');
    setNewEmail('');
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('TERMINATE EMPLOYMENT RECORD?')) {
      await removeData('faculty', id);
    }
  };

  const filteredFaculty = faculty.filter(f => {
    const matchName = f.name.toLowerCase().includes(searchName.toLowerCase());
    const matchModule = f.module.toLowerCase().includes(searchModule.toLowerCase());
    const matchStatus = searchStatus === 'ALL' || f.status === searchStatus;
    return matchName && matchModule && matchStatus;
  });

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    alert('SECURE LINK COPIED');
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
          <Users /> PERSONNEL DATABASE
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 text-xs border theme-border px-3 py-1 hover:bg-[var(--theme-color)] hover:text-black transition-colors"
        >
          {isEditing ? 'CANCEL EDIT' : <><Plus size={14} /> ADD PERSONNEL</>}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleAddMember} className="mb-8 bg-[#101010] p-4 border theme-border grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          <input 
            className="bg-black border border-[#333] p-2 theme-text outline-none" 
            placeholder="Professor Name" value={newName} onChange={e => setNewName(e.target.value)} required 
          />
          <input 
            className="bg-black border border-[#333] p-2 theme-text outline-none" 
            placeholder="Module / Subject" value={newModule} onChange={e => setNewModule(e.target.value)} required 
          />
          <input 
            className="bg-black border border-[#333] p-2 theme-text outline-none" 
            placeholder="Email Address" value={newEmail} onChange={e => setNewEmail(e.target.value)} 
          />
          <select 
            className="bg-black border border-[#333] p-2 theme-text outline-none"
            value={newStatus} onChange={e => setNewStatus(e.target.value as any)}
          >
            <option value="OFFICE">IN OFFICE</option>
            <option value="LECTURE">IN LECTURE</option>
            <option value="OFF-SITE">OFF SITE</option>
          </select>
          <button type="submit" className="md:col-span-2 theme-bg text-black font-bold py-2 hover:bg-white flex justify-center items-center gap-2">
            <Save size={16} /> SAVE RECORD
          </button>
        </form>
      )}

      {/* Advanced Filter Bar */}
      <div className="mb-6 bg-[#0a0a0a] p-3 border border-[#333] flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
           <Search className="absolute left-2 top-2.5 text-gray-500" size={14} />
           <input 
             className="w-full bg-[#151515] border border-[#333] p-2 pl-8 text-sm theme-text outline-none focus:border-[var(--theme-color)]"
             placeholder="Search by Name..."
             value={searchName}
             onChange={(e) => setSearchName(e.target.value)}
           />
        </div>
        <div className="flex-1">
           <input 
             className="w-full bg-[#151515] border border-[#333] p-2 text-sm theme-text outline-none focus:border-[var(--theme-color)]"
             placeholder="Filter by Module..."
             value={searchModule}
             onChange={(e) => setSearchModule(e.target.value)}
           />
        </div>
        <div className="w-full md:w-40 relative">
           <Filter className="absolute left-2 top-2.5 text-gray-500" size={14} />
           <select 
             className="w-full bg-[#151515] border border-[#333] p-2 pl-8 text-sm theme-text outline-none focus:border-[var(--theme-color)] appearance-none"
             value={searchStatus}
             onChange={(e) => setSearchStatus(e.target.value)}
           >
             <option value="ALL">ALL STATUS</option>
             <option value="OFFICE">IN OFFICE</option>
             <option value="LECTURE">IN LECTURE</option>
             <option value="OFF-SITE">OFF SITE</option>
           </select>
        </div>
      </div>

      {filteredFaculty.length === 0 ? (
        <div className="text-center opacity-50 py-10 border border-dashed border-[#333]">
          NO MATCHING RECORDS FOUND.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-4">
          {filteredFaculty.map(member => (
            <div key={member.id} className="bg-[#080808] border border-[#222] p-4 hover:border-[var(--theme-color)] transition-all group relative overflow-hidden">
              <div className={`absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold ${
                member.status === 'OFFICE' ? 'bg-green-900 text-green-300' : 
                member.status === 'LECTURE' ? 'bg-orange-900 text-orange-300' : 'bg-red-900 text-red-300'
              }`}>
                {member.status}
              </div>

              <div className="mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[var(--theme-color)] transition-colors">{member.name}</h3>
                <p className="text-sm text-gray-500 font-mono border-b border-[#222] pb-2 mb-2 inline-block">MODULE: {member.module}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between bg-[#111] p-2 rounded border border-transparent group-hover:border-[#333]">
                  <div className="flex items-center gap-2 text-gray-400 overflow-hidden">
                    <Mail size={14} />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <button onClick={() => copyEmail(member.email)} className="text-gray-600 hover:text-white" title="Copy Email">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(member.id)}
                className="absolute bottom-2 right-2 text-gray-800 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="absolute bottom-0 left-0 w-0 h-0.5 theme-bg group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDirectory;
