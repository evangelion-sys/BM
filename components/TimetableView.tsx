import React, { useState, useEffect } from 'react';
import { subscribeToPath, pushData } from '../services/firebaseService';
import { Calendar, Edit, Clock } from 'lucide-react';
import { Sector } from '../types';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];
const SLOTS = ['08:00 - 09:30', '09:40 - 11:10', '11:20 - 12:50', '13:00 - 14:30', '14:40 - 16:10'];

const TimetableView: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<Record<string, {subject: string, room: string}>>({});
  const [selectedSector, setSelectedSector] = useState(Sector.LICENCE_L1);
  const [editCell, setEditCell] = useState<{day: string, slot: string} | null>(null);
  
  const [tempSubject, setTempSubject] = useState('');
  const [tempRoom, setTempRoom] = useState('');

  // 0 = Sunday, 1 = Monday ... 5 = Friday, 6 = Saturday
  const todayIndex = new Date().getDay();
  // Map JS getDay() to our DAYS array index. 
  // JS: Sun(0), Mon(1)... Thu(4), Fri(5), Sat(6).
  // Our Array: Sun(0), Mon(1)... Thu(4).
  // If today is Fri(5) or Sat(6), it's weekend.
  const isWeekend = todayIndex === 5 || todayIndex === 6;
  const currentDayName = !isWeekend ? DAYS[todayIndex] : 'WEEKEND';

  const dbPath = `timetable/${selectedSector.replace(/\s+/g, '_')}`;

  useEffect(() => {
    const unsubscribe = subscribeToPath(dbPath, (data) => {
      const sorted = (data as any[]).sort((a, b) => a.timestamp - b.timestamp);
      const map: Record<string, {subject: string, room: string}> = {};
      sorted.forEach(item => {
        if (item.slotKey) {
            map[item.slotKey] = { subject: item.subject, room: item.room };
        }
      });
      setScheduleData(map);
    });
    return () => unsubscribe();
  }, [selectedSector]);

  const handleCellClick = (day: string, slotIndex: number) => {
    const key = `${day}_${slotIndex}`;
    const current = scheduleData[key] || { subject: '', room: '' };
    setEditCell({ day, slot: key });
    setTempSubject(current.subject);
    setTempRoom(current.room);
  };

  const saveCell = async () => {
    if (!editCell) return;
    await pushData(dbPath, {
      slotKey: editCell.slot,
      subject: tempSubject,
      room: tempRoom,
      timestamp: Date.now()
    });
    setEditCell(null);
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <Calendar /> CHRONOS SCHEDULE
        </h2>
        <div className="flex gap-4 items-center">
            {isWeekend ? (
                <div className="text-xs font-mono text-gray-500 animate-pulse">STATUS: WEEKEND PROTOCOL ACTIVE</div>
            ) : (
                <div className="text-xs font-mono theme-text flex items-center gap-1">
                    <Clock size={12}/> CURRENT: {currentDayName}
                </div>
            )}
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
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#080808] border border-[#222] p-2">
        <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-1 min-w-[800px]">
          {/* Header Row */}
          <div className="bg-[#151515] p-2 text-xs font-bold text-center text-gray-500">TIME / DAY</div>
          {DAYS.map((day, idx) => {
             const isToday = !isWeekend && idx === todayIndex;
             return (
                <div key={day} className={`p-2 text-xs font-bold text-center border-b-2 transition-colors ${
                    isToday ? 'bg-[var(--theme-dim)] theme-text border-[var(--theme-color)]' : 'bg-[#151515] text-gray-400 border-[#333]'
                }`}>
                    {day} {isToday && <span className="animate-pulse ml-1">●</span>}
                </div>
             );
          })}

          {/* Slots */}
          {SLOTS.map((time, slotIdx) => (
            <React.Fragment key={slotIdx}>
              {/* Time Column */}
              <div className="bg-[#111] p-2 text-[10px] flex items-center justify-center font-mono border-r border-[#333] text-gray-400">
                {time}
              </div>
              
              {/* Day Columns */}
              {DAYS.map((day, dayIdx) => {
                const slotKey = `${day}_${slotIdx}`;
                const entry = scheduleData[slotKey];
                const isEditing = editCell?.slot === slotKey;
                const isToday = !isWeekend && dayIdx === todayIndex;

                return (
                  <div 
                    key={slotKey} 
                    onClick={() => !isEditing && handleCellClick(day, slotIdx)}
                    className={`relative min-h-[80px] border p-2 cursor-pointer transition-colors group flex flex-col justify-center items-center text-center
                      ${isEditing ? 'bg-[#1a1a1a] border-[var(--theme-color)]' : 'border-[#222]'}
                      ${isToday ? 'bg-[#0f0f0f] shadow-[inset_0_0_10px_rgba(255,153,0,0.05)]' : 'hover:bg-[#111]'}
                    `}
                  >
                    {isEditing ? (
                      <div className="flex flex-col gap-1 w-full z-10 animate-in zoom-in-95">
                        <input 
                          autoFocus
                          className="w-full bg-black border border-gray-600 text-xs p-1 text-center text-white"
                          placeholder="Module"
                          value={tempSubject}
                          onChange={e => setTempSubject(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveCell()}
                        />
                        <input 
                          className="w-full bg-black border border-gray-600 text-[10px] p-1 text-center text-gray-400"
                          placeholder="Room"
                          value={tempRoom}
                          onChange={e => setTempRoom(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveCell()}
                        />
                        <div className="flex gap-1 justify-center mt-1">
                          <button onClick={(e) => { e.stopPropagation(); saveCell(); }} className="bg-green-900 text-green-100 text-[10px] px-2 py-1 rounded hover:bg-green-700">OK</button>
                          <button onClick={(e) => { e.stopPropagation(); setEditCell(null); }} className="bg-red-900 text-red-100 text-[10px] px-2 py-1 rounded hover:bg-red-700">X</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {entry?.subject ? (
                          <>
                            <div className={`font-bold text-sm ${isToday ? 'theme-text' : 'text-gray-200'}`}>{entry.subject}</div>
                            <div className="text-[10px] text-gray-500 mt-1 bg-[#101010] px-1 rounded">{entry.room}</div>
                          </>
                        ) : (
                          <div className="opacity-0 group-hover:opacity-20 text-2xl text-gray-600">+</div>
                        )}
                        <Edit size={10} className="absolute top-1 right-1 opacity-0 group-hover:opacity-50 text-gray-500" />
                      </>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-gray-500 font-mono flex justify-between">
        <span>* CLICK ANY CELL TO EDIT. DATA PERSISTS PER SECTOR.</span>
        <span>SYSTEM DATE: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TimetableView;
