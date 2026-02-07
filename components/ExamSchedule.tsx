import React, { useState, useEffect } from 'react';
import { subscribeToPath, pushData, removeData } from '../services/firebaseService';
import { ExamEntry, Sector } from '../types';
import { Timer, Trash2, Plus, CalendarClock, Filter, ArrowUpDown } from 'lucide-react';

const ExamSchedule: React.FC = () => {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sector Selection
  const [selectedSector, setSelectedSector] = useState(Sector.LICENCE_L1);

  // Filters
  const [filterModule, setFilterModule] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sort
  const [sortConfig, setSortConfig] = useState<{key: 'date' | 'module', direction: 'asc' | 'desc'}>({key: 'date', direction: 'asc'});

  // New Exam Form
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [module, setModule] = useState('');
  const [room, setRoom] = useState('');
  const [seat, setSeat] = useState('');

  const dbPath = `exams/${selectedSector.replace(/\s+/g, '_')}`;

  useEffect(() => {
    const unsubscribe = subscribeToPath(dbPath, (data) => {
      setExams(data as ExamEntry[]);
    });
    return () => unsubscribe();
  }, [selectedSector]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!module || !date) return;
    
    await pushData(dbPath, { date, time, module, room, seat });
    setModule(''); setRoom(''); setSeat('');
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if(confirm('REMOVE EXAM ENTRY?')) await removeData(dbPath, id);
  };

  const toggleSort = (key: 'date' | 'module') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter & Sort Logic
  const processedExams = exams.filter(ex => {
    const matchMod = ex.module.toLowerCase().includes(filterModule.toLowerCase());
    const matchRoom = ex.room.toLowerCase().includes(filterRoom.toLowerCase());
    const matchStart = startDate ? ex.date >= startDate : true;
    const matchEnd = endDate ? ex.date <= endDate : true;
    return matchMod && matchRoom && matchStart && matchEnd;
  }).sort((a, b) => {
    let valA = a[sortConfig.key].toLowerCase();
    let valB = b[sortConfig.key].toLowerCase();
    
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <CalendarClock /> EXAM PROTOCOL
        </h2>
        <div className="flex gap-4 items-center">
            <select 
              value={selectedSector} 
              onChange={(e) => setSelectedSector(e.target.value as any)}
              className="bg-[#101010] border theme-border px-4 py-1 text-sm outline-none theme-text"
            >
              <option value={Sector.LICENCE_L1}>Licence Year 1</option>
              <option value={Sector.LICENCE_L2}>Licence Year 2</option>
              <option value={Sector.LICENCE_L3}>Licence Year 3</option>
              <option value={Sector.MASTER_S1}>Master S1</option>
              <option value={Sector.MASTER_S2}>Master S2</option>
            </select>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 text-xs border theme-border px-3 py-1 hover:bg-[var(--theme-color)] hover:text-black transition-colors"
            >
              {isEditing ? 'CANCEL' : <><Plus size={14} /> ADD EXAM</>}
            </button>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleAdd} className="bg-[#101010] p-4 border theme-border mb-6 grid grid-cols-2 md:grid-cols-5 gap-2 animate-in fade-in">
          <input type="date" className="bg-black border border-[#333] p-2 text-xs theme-text" value={date} onChange={e=>setDate(e.target.value)} required />
          <input type="time" className="bg-black border border-[#333] p-2 text-xs theme-text" value={time} onChange={e=>setTime(e.target.value)} required />
          <input placeholder="Module Name" className="bg-black border border-[#333] p-2 text-xs theme-text" value={module} onChange={e=>setModule(e.target.value)} required />
          <input placeholder="Room / Amphitheater" className="bg-black border border-[#333] p-2 text-xs theme-text" value={room} onChange={e=>setRoom(e.target.value)} />
          <div className="flex gap-2">
             <input placeholder="Seat" className="bg-black border border-[#333] p-2 text-xs theme-text w-full" value={seat} onChange={e=>setSeat(e.target.value)} />
             <button type="submit" className="theme-bg text-black px-2"><Plus size={16}/></button>
          </div>
        </form>
      )}

      {/* Advanced Filters */}
      <div className="mb-4 bg-[#0a0a0a] border border-[#333] p-3 flex flex-wrap gap-3 items-end">
         <div className="flex items-center gap-1 text-[var(--theme-color)] text-xs font-bold mr-2">
            <Filter size={14}/> FILTERS:
         </div>
         <div className="flex-1 min-w-[150px]">
           <label className="text-[10px] text-gray-500 block mb-1">MODULE</label>
           <input className="w-full bg-[#151515] border border-[#333] p-1 text-xs theme-text outline-none focus:border-[var(--theme-color)]" 
             placeholder="Search Module..." value={filterModule} onChange={e => setFilterModule(e.target.value)} />
         </div>
         <div className="flex-1 min-w-[150px]">
           <label className="text-[10px] text-gray-500 block mb-1">ROOM</label>
           <input className="w-full bg-[#151515] border border-[#333] p-1 text-xs theme-text outline-none focus:border-[var(--theme-color)]" 
             placeholder="Search Room..." value={filterRoom} onChange={e => setFilterRoom(e.target.value)} />
         </div>
         <div className="flex-1 min-w-[150px]">
           <label className="text-[10px] text-gray-500 block mb-1">DATE FROM</label>
           <input type="date" className="w-full bg-[#151515] border border-[#333] p-1 text-xs theme-text outline-none focus:border-[var(--theme-color)]" 
             value={startDate} onChange={e => setStartDate(e.target.value)} />
         </div>
         <div className="flex-1 min-w-[150px]">
           <label className="text-[10px] text-gray-500 block mb-1">DATE TO</label>
           <input type="date" className="w-full bg-[#151515] border border-[#333] p-1 text-xs theme-text outline-none focus:border-[var(--theme-color)]" 
             value={endDate} onChange={e => setEndDate(e.target.value)} />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="w-full text-left border-collapse">
            <div className="grid grid-cols-12 gap-4 border-b border-[#333] pb-2 text-xs font-mono text-gray-500 mb-2 px-2">
               <div className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('date')}>
                 DATE {sortConfig.key === 'date' && <ArrowUpDown size={10} />}
               </div>
               <div className="col-span-2">TIME</div>
               <div className="col-span-4 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => toggleSort('module')}>
                 MODULE {sortConfig.key === 'module' && <ArrowUpDown size={10} />}
               </div>
               <div className="col-span-2">LOC</div>
               <div className="col-span-1">SEAT</div>
               <div className="col-span-1"></div>
            </div>
            
            {processedExams.length === 0 ? (
                <div className="text-center opacity-40 py-8 font-mono">NO EXAMS FOUND MATCHING PARAMETERS.</div>
            ) : (
                processedExams.map((ex) => (
                    <div key={ex.id} className="grid grid-cols-12 gap-4 border-b border-[#222] py-4 px-2 hover:bg-[#111] items-center group">
                        <div className="col-span-2 font-bold text-[var(--theme-color)]">{ex.date}</div>
                        <div className="col-span-2 text-gray-400 flex items-center gap-1"><Timer size={12}/> {ex.time}</div>
                        <div className="col-span-4 font-bold text-white text-lg tracking-wide">{ex.module}</div>
                        <div className="col-span-2 text-xs font-mono bg-[#222] text-center py-1 rounded">{ex.room}</div>
                        <div className="col-span-1 text-xs text-gray-500">{ex.seat || '-'}</div>
                        <div className="col-span-1 text-right">
                           <button onClick={() => handleDelete(ex.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-white transition-opacity">
                              <Trash2 size={14} />
                           </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default ExamSchedule;
