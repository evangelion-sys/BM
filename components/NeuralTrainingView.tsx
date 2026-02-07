import React, { useState, useEffect } from 'react';
import { subscribeToPath, pushData, removeData } from '../services/firebaseService';
import { Brain, RotateCcw, Check, Plus, Trash2 } from 'lucide-react';
import { Flashcard } from '../types';

const NeuralTrainingView: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [mode, setMode] = useState<'TRAIN' | 'EDIT'>('TRAIN');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Edit Mode Inputs
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToPath('flashcards', (data) => {
      setCards(data as Flashcard[]);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newQ || !newA) return;
    await pushData('flashcards', {
      question: newQ,
      answer: newA,
      mastered: false
    });
    setNewQ('');
    setNewA('');
  };

  const handleDelete = async (id: string) => {
    if(confirm('DELETE MEMORY ENGRAM?')) await removeData('flashcards', id);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           <Brain /> NEURAL TRAINING
        </h2>
        <div className="flex gap-2">
           <button onClick={() => setMode('TRAIN')} className={`px-4 py-1 text-sm border theme-border ${mode === 'TRAIN' ? 'theme-bg text-black' : ''}`}>TRAIN</button>
           <button onClick={() => setMode('EDIT')} className={`px-4 py-1 text-sm border theme-border ${mode === 'EDIT' ? 'theme-bg text-black' : ''}`}>EDIT DATA</button>
        </div>
      </div>

      {mode === 'TRAIN' ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           {cards.length === 0 ? (
             <div className="opacity-50 text-center">MEMORY BANKS EMPTY. SWITCH TO 'EDIT DATA' TO UPLOAD.</div>
           ) : (
             <div className="w-full max-w-2xl perspective-1000">
               <div 
                 onClick={() => setIsFlipped(!isFlipped)}
                 className="relative min-h-[300px] border-2 theme-border bg-[#0a0a0a] cursor-pointer flex flex-col items-center justify-center p-8 text-center hover:bg-[#111] transition-all group"
                 style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
               >
                 {/* Front */}
                 <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-4" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="text-xs font-mono text-gray-500 mb-4">QUESTION // ENGRAM {currentCardIndex + 1}</div>
                    <div className="text-2xl font-bold">{cards[currentCardIndex].question}</div>
                    <div className="absolute bottom-4 text-[10px] text-[var(--theme-color)] animate-pulse">CLICK TO REVEAL</div>
                 </div>
                 
                 {/* Back */}
                 <div className="absolute inset-0 backface-hidden bg-[#151515] flex flex-col items-center justify-center p-4" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="text-xs font-mono text-gray-500 mb-4">ANSWER</div>
                    <div className="text-xl text-green-400">{cards[currentCardIndex].answer}</div>
                 </div>
               </div>

               <div className="flex justify-center gap-4 mt-8">
                 <button onClick={nextCard} className="flex items-center gap-2 px-6 py-3 border border-red-900 text-red-500 hover:bg-red-900/20">
                    <RotateCcw size={18} /> REPEAT
                 </button>
                 <button onClick={nextCard} className="flex items-center gap-2 px-6 py-3 border border-green-900 text-green-500 hover:bg-green-900/20">
                    <Check size={18} /> MASTERED
                 </button>
               </div>
             </div>
           )}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
          <form onSubmit={handleAdd} className="flex gap-4 mb-4 bg-[#101010] p-4 border theme-border">
            <input className="flex-1 bg-black border border-[#333] p-2 theme-text outline-none" placeholder="Question / Term" value={newQ} onChange={e => setNewQ(e.target.value)} />
            <input className="flex-1 bg-black border border-[#333] p-2 theme-text outline-none" placeholder="Answer / Definition" value={newA} onChange={e => setNewA(e.target.value)} />
            <button type="submit" className="theme-bg text-black px-4"><Plus/></button>
          </form>
          <div className="flex-1 overflow-y-auto space-y-2">
            {cards.map(card => (
              <div key={card.id} className="flex justify-between items-center bg-[#080808] border border-[#222] p-3">
                 <div>
                   <div className="font-bold text-sm">{card.question}</div>
                   <div className="text-xs text-gray-500">{card.answer}</div>
                 </div>
                 <button onClick={() => handleDelete(card.id)} className="text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralTrainingView;
