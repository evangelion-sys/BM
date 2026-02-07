import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Trash2, RefreshCw, BarChart3, X } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  coef: number;
  exam: number;
  td: number;
  hasTp: boolean;
  tp: number;
  prerequisiteName: string; // New: Name of prerequisite module
  prereqMet: boolean;       // New: Is prerequisite met?
}

const GradeCalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [showChart, setShowChart] = useState(false);

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem('BM_LMD_DATA_V2'); // V2 for schema update
    if (saved) {
      setSubjects(JSON.parse(saved));
    } else {
      addSubject();
    }
  }, []);

  // Auto-save
  useEffect(() => {
    localStorage.setItem('BM_LMD_DATA_V2', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    setSubjects([...subjects, {
      id: Date.now().toString(),
      name: '',
      coef: 1,
      exam: 0,
      td: 0,
      hasTp: false,
      tp: 0,
      prerequisiteName: '',
      prereqMet: true
    }]);
    setAverage(null);
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
    setAverage(null);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setAverage(null);
  };

  const calculate = () => {
    let totalPoints = 0;
    let totalCoef = 0;

    subjects.forEach(sub => {
      const isEligible = !sub.prerequisiteName || sub.prereqMet;

      if (isEligible) {
        const continuous = sub.hasTp ? (Number(sub.td) + Number(sub.tp)) / 2 : Number(sub.td);
        const moduleAvg = (Number(sub.exam) * 0.6) + (continuous * 0.4);
        
        totalPoints += moduleAvg * Number(sub.coef);
        totalCoef += Number(sub.coef);
      }
    });

    if (totalCoef > 0) {
      setAverage(totalPoints / totalCoef);
    } else {
        setAverage(0);
    }
  };

  const getModuleAvg = (sub: Subject) => {
    const continuous = sub.hasTp ? (Number(sub.td) + Number(sub.tp)) / 2 : Number(sub.td);
    return (Number(sub.exam) * 0.6) + (continuous * 0.4);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto relative">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
          <Calculator /> LMD SIMULATOR
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setShowChart(!showChart)} className="text-xs border theme-border theme-text px-3 py-1 hover:bg-[var(--theme-color)] hover:text-black flex items-center gap-1">
             <BarChart3 size={12} /> {showChart ? 'HIDE CHART' : 'VISUALIZE PROGRESS'}
          </button>
          <button onClick={() => { setSubjects([]); addSubject(); setAverage(null); }} className="text-xs border theme-border px-3 py-1 hover:bg-red-900/50">RESET</button>
          <button onClick={addSubject} className="text-xs theme-bg text-black px-3 py-1 font-bold hover:bg-white flex items-center gap-1">
            <Plus size={12} /> ADD MODULE
          </button>
        </div>
      </div>

      {showChart && (
        <div className="mb-8 p-6 bg-[#0a0a0a] border theme-border animate-in slide-in-from-top-4 relative">
            <h3 className="text-lg font-teko tracking-widest mb-4 text-white">PERFORMANCE ANALYSIS (MODULE AVERAGES)</h3>
            <div className="flex items-end gap-2 h-40 border-l border-b border-gray-700 p-2">
               {subjects.map((sub, idx) => {
                 const avg = getModuleAvg(sub);
                 const height = Math.min(100, (avg / 20) * 100);
                 const isPass = avg >= 10;
                 return (
                   <div key={sub.id} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                      <div className="absolute bottom-full mb-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black p-1 border border-[#333]">
                         {sub.name || `MOD ${idx+1}`}: {avg.toFixed(2)}
                      </div>
                      <div 
                        className={`w-full max-w-[40px] transition-all duration-1000 ${isPass ? 'bg-green-600' : 'bg-red-600'} hover:brightness-125`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="mt-1 text-[9px] text-gray-500 truncate w-full text-center rotate-45 origin-left translate-x-2">
                        {sub.name.substring(0,6) || idx+1}
                      </div>
                   </div>
                 );
               })}
            </div>
            <div className="absolute top-2 right-2 text-xs text-gray-500 font-mono">TARGET: 10.0</div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b theme-border text-xs text-gray-500 font-mono tracking-wider">
              <th className="p-2 w-48">MODULE NAME</th>
              <th className="p-2 w-16">COEF</th>
              <th className="p-2 w-20">EXAM(60%)</th>
              <th className="p-2 w-20">TD(40%)</th>
              <th className="p-2 w-12 text-center">TP?</th>
              <th className="p-2 w-20">TP</th>
              <th className="p-2 w-40">PREREQUISITE</th>
              <th className="p-2 w-16 text-center">MET?</th>
              <th className="p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => {
                const excluded = sub.prerequisiteName && !sub.prereqMet;
                return (
                  <tr key={sub.id} className={`border-b border-[#222] transition-colors group ${excluded ? 'opacity-40 bg-red-900/10' : 'hover:bg-[#111]'}`}>
                    <td className="p-2">
                      <input 
                        className="w-full bg-transparent outline-none theme-text placeholder-gray-800 font-bold text-sm"
                        placeholder="Module Name..."
                        value={sub.name}
                        onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" className="w-full bg-[#0a0a0a] border border-[#333] p-1 text-center outline-none focus:border-[var(--theme-color)]"
                        value={sub.coef} onChange={(e) => updateSubject(sub.id, 'coef', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" max="20" className="w-full bg-[#0a0a0a] border border-[#333] p-1 text-center outline-none focus:border-[var(--theme-color)]"
                        value={sub.exam} onChange={(e) => updateSubject(sub.id, 'exam', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" max="20" className="w-full bg-[#0a0a0a] border border-[#333] p-1 text-center outline-none focus:border-[var(--theme-color)]"
                        value={sub.td} onChange={(e) => updateSubject(sub.id, 'td', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input 
                        type="checkbox" className="accent-[var(--theme-color)] cursor-pointer"
                        checked={sub.hasTp} onChange={(e) => updateSubject(sub.id, 'hasTp', e.target.checked)}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" max="20" disabled={!sub.hasTp} className={`w-full border border-[#333] p-1 text-center outline-none focus:border-[var(--theme-color)] ${sub.hasTp ? 'bg-[#0a0a0a]' : 'bg-[#111] text-gray-700'}`}
                        value={sub.tp} onChange={(e) => updateSubject(sub.id, 'tp', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        className="w-full bg-[#0a0a0a] border border-[#333] p-1 text-xs text-gray-400 outline-none focus:border-[var(--theme-color)]"
                        placeholder="Prereq (Optional)..."
                        value={sub.prerequisiteName}
                        onChange={(e) => updateSubject(sub.id, 'prerequisiteName', e.target.value)}
                      />
                    </td>
                    <td className="p-2 text-center">
                      {sub.prerequisiteName && (
                          <input 
                            type="checkbox" className="accent-green-500 cursor-pointer"
                            checked={sub.prereqMet} onChange={(e) => updateSubject(sub.id, 'prereqMet', e.target.checked)}
                            title="Prerequisite Met?"
                          />
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <button onClick={() => removeSubject(sub.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end items-center gap-6">
        <div className="text-xs text-gray-500 max-w-xs text-right">
            * MODULES WITH UNMET PREREQUISITES ARE EXCLUDED FROM THE AVERAGE CALCULATION.
        </div>
        <button 
          onClick={calculate}
          className="px-8 py-3 border theme-border font-teko text-xl tracking-widest hover:bg-[var(--theme-color)] hover:text-black transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} /> RUN SIMULATION
        </button>
        
        <div className="bg-[#101010] border-2 theme-border p-4 min-w-[200px] text-center relative overflow-hidden">
          <div className="text-xs text-gray-500 font-mono mb-1">SEMESTER AVERAGE</div>
          <div className={`text-4xl font-bold font-mono ${average !== null ? (average >= 10 ? 'text-green-500' : 'text-red-500') : 'text-gray-700'}`}>
            {average !== null ? average.toFixed(2) : '--.--'}
          </div>
          {average !== null && (
            <div className={`text-xs tracking-widest mt-1 ${average >= 10 ? 'text-green-500' : 'text-red-500'}`}>
              STATUS: {average >= 10 ? 'PASSED' : 'CRITICAL'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;
