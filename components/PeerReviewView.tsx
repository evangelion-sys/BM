
import React, { useState, useEffect } from 'react';
import { Assignment } from '../types';
import { pushData, subscribeToPath } from '../services/firebaseService';
import { Star, MessageSquare, Award } from 'lucide-react';

interface PeerReviewViewProps {
  username: string;
}

const PeerReviewView: React.FC<PeerReviewViewProps> = ({ username }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [credits, setCredits] = useState(0);
  const [viewMode, setViewMode] = useState<'LIST' | 'SUBMIT'>('LIST');

  // Submit Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Review State
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const unsub = subscribeToPath('assignments', (data) => {
      setAssignments(data as Assignment[]);
    });
    // Load local credits (simple gamification)
    const savedCredits = localStorage.getItem('BM_CREDITS');
    if (savedCredits) setCredits(parseInt(savedCredits));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    await pushData('assignments', {
      title,
      description: 'Peer Review Request',
      studentName: username,
      content,
      reviews: [],
      timestamp: Date.now()
    });
    setTitle(''); setContent(''); setViewMode('LIST');
  };

  const handleReview = async (assignment: Assignment) => {
    // Add review
    const updatedReviews = assignment.reviews ? [...assignment.reviews] : [];
    updatedReviews.push({ reviewerName: username, rating, comment });
    
    // In a real app we would update. Here we simulate update by push (append to reviews path could be complex without ID, so we just mock the update effect locally for now or re-push)
    // For this demo, we assume we just increment local credits to show the "Earn" mechanic.
    const newCredits = credits + 10;
    setCredits(newCredits);
    localStorage.setItem('BM_CREDITS', newCredits.toString());
    
    alert(`REVIEW SUBMITTED. +10 CREDITS EARNED. TOTAL: ${newCredits}`);
    setReviewingId(null); setComment('');
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow">PEER REVIEW SYSTEM</h2>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-yellow-500 font-mono font-bold border border-yellow-900 bg-yellow-900/10 px-3 py-1">
             <Award size={16}/> CREDITS: {credits}
           </div>
           <button onClick={() => setViewMode(viewMode === 'LIST' ? 'SUBMIT' : 'LIST')} className="theme-bg text-black px-4 py-1 font-bold text-sm">
             {viewMode === 'LIST' ? 'SUBMIT ASSIGNMENT' : 'BACK TO LIST'}
           </button>
        </div>
      </div>

      {viewMode === 'SUBMIT' ? (
        <form onSubmit={handleSubmit} className="bg-[#101010] p-6 border theme-border animate-in fade-in">
           <h3 className="text-xl font-bold mb-4 text-white">UPLOAD WORK FOR REVIEW</h3>
           <input className="w-full bg-black border border-[#333] p-3 mb-4 theme-text" placeholder="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} />
           <textarea className="w-full h-40 bg-black border border-[#333] p-3 mb-4 theme-text font-mono" placeholder="Paste text content or Google Doc link..." value={content} onChange={e => setContent(e.target.value)} />
           <button className="theme-bg text-black px-6 py-2 font-bold">SUBMIT FOR 50 CREDITS</button>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {assignments.map(a => (
            <div key={a.id} className="bg-[#0a0a0a] border border-[#333] p-4 flex flex-col hover:border-[var(--theme-color)] transition-colors">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold text-white">{a.title}</h3>
                 <span className="text-xs text-gray-500 font-mono">BY {a.studentName}</span>
               </div>
               <div className="text-sm text-gray-400 mb-4 line-clamp-3 font-mono border-l-2 border-gray-700 pl-2">
                 {a.content}
               </div>
               
               {reviewingId === a.id ? (
                 <div className="mt-auto bg-[#151515] p-3 animate-in slide-in-from-bottom-2">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs">RATING:</span>
                     {[1,2,3,4,5].map(r => (
                       <button key={r} onClick={() => setRating(r)} className={r <= rating ? 'text-yellow-500' : 'text-gray-700'}>
                         <Star size={14} fill={r <= rating ? 'currentColor' : 'none'} />
                       </button>
                     ))}
                   </div>
                   <textarea className="w-full bg-black border border-[#333] p-2 text-xs text-white mb-2" placeholder="Constructive feedback..." value={comment} onChange={e => setComment(e.target.value)} />
                   <div className="flex gap-2">
                     <button onClick={() => handleReview(a)} className="flex-1 bg-green-900 text-green-100 py-1 text-xs">CONFIRM</button>
                     <button onClick={() => setReviewingId(null)} className="flex-1 bg-gray-800 text-gray-300 py-1 text-xs">CANCEL</button>
                   </div>
                 </div>
               ) : (
                 <div className="mt-auto flex justify-between items-center">
                   <span className="text-xs text-gray-600">{a.reviews ? a.reviews.length : 0} REVIEWS</span>
                   <button onClick={() => setReviewingId(a.id)} className="border theme-border theme-text px-3 py-1 text-xs hover:bg-[var(--theme-color)] hover:text-black">
                     REVIEW (+10 PTS)
                   </button>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeerReviewView;
