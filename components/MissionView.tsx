import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { pushData, removeData, subscribeToPath } from '../services/firebaseService';
import { playClickSound, playHoverSound } from '../services/audioService';
import { Plus, CheckCircle, Clock, AlertTriangle, Trash2, ArrowRight } from 'lucide-react';

interface MissionViewProps {
  username: string;
}

const MissionView: React.FC<MissionViewProps> = ({ username }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('MED');

  useEffect(() => {
    const unsubscribe = subscribeToPath('missions', (data) => {
      if (data) setTasks(data as Task[]);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    playClickSound();

    const task: Omit<Task, 'id'> = {
      title: newTaskTitle,
      assignee: username,
      status: 'PENDING',
      priority,
      timestamp: Date.now()
    };

    await pushData('missions', task);
    setNewTaskTitle('');
  };

  const advanceTask = async (task: Task) => {
    playClickSound();
    // Simulate update by removing old and adding new (simple RTDB pattern)
    // In a real app we'd use 'update'. For this generic service:
    await removeData('missions', task.id);
    const nextStatus = task.status === 'PENDING' ? 'ACTIVE' : 'RESOLVED';
    await pushData('missions', { ...task, status: nextStatus });
  };

  const deleteTask = async (id: string) => {
    if (confirm('ABORT MISSION OBJECTIVE?')) {
      await removeData('missions', id);
    }
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'CRITICAL': return 'text-red-500 border-red-500';
      case 'HIGH': return 'text-orange-500 border-orange-500';
      case 'LOW': return 'text-blue-400 border-blue-400';
      default: return 'theme-text theme-border';
    }
  };

  const renderColumn = (title: string, status: Task['status'], icon: React.ReactNode) => {
    const columnTasks = tasks.filter(t => t.status === status);

    return (
      <div className="flex-1 min-w-[300px] bg-[#080808] border theme-border flex flex-col h-full">
        <div className="p-3 border-b theme-border flex items-center gap-2 bg-[#101010]">
          {icon}
          <h3 className="font-teko text-xl tracking-widest">{title}</h3>
          <span className="ml-auto text-xs font-mono opacity-50">[{columnTasks.length}]</span>
        </div>
        <div className="p-2 overflow-y-auto flex-1 space-y-2">
          {columnTasks.map(task => (
            <div 
              key={task.id} 
              className={`p-3 border border-l-4 bg-[#050505] relative group hover:bg-[#111] transition-colors ${getPriorityColor(task.priority)}`}
              onMouseEnter={playHoverSound}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold border px-1 opacity-70">{task.priority}</span>
                <span className="text-[10px] font-mono opacity-50">{new Date(task.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="font-bold mb-2 text-sm text-gray-200">{task.title}</p>
              <div className="flex justify-between items-center text-xs opacity-70 font-mono">
                <span>// {task.assignee}</span>
                <div className="flex gap-1">
                  <button onClick={() => deleteTask(task.id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                  {status !== 'RESOLVED' && (
                    <button onClick={() => advanceTask(task)} className="p-1 hover:text-white transition-colors"><ArrowRight size={12}/></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-teko tracking-widest text-glow">CURRENT OBJECTIVES</h2>
      </div>

      {/* Add Task Bar */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6 bg-[#101010] p-2 border theme-border">
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value as any)}
          className="bg-black border border-[#333] px-2 theme-text font-mono text-xs outline-none"
        >
          <option value="LOW">LOW PRIORITY</option>
          <option value="MED">MED PRIORITY</option>
          <option value="HIGH">HIGH PRIORITY</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
        <input 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="ENTER NEW DIRECTIVE..."
          className="flex-1 bg-black border border-[#333] px-3 theme-text outline-none focus:border-[var(--theme-color)]"
        />
        <button type="submit" className="theme-bg text-black px-4 font-bold hover:bg-white transition-colors">
          <Plus size={18} />
        </button>
      </form>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
        {renderColumn('PENDING', 'PENDING', <Clock size={16} />)}
        {renderColumn('ACTIVE', 'ACTIVE', <AlertTriangle size={16} />)}
        {renderColumn('RESOLVED', 'RESOLVED', <CheckCircle size={16} />)}
      </div>
    </div>
  );
};

export default MissionView;
