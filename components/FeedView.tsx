import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { pushData, removeData, subscribeToPath } from '../services/firebaseService';
import { Trash2, PlusSquare } from 'lucide-react';

interface FeedViewProps {
  isAdmin: boolean;
}

const FeedView: React.FC<FeedViewProps> = ({ isAdmin }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPath('posts', (data) => {
      if (data) {
        // Sort by timestamp desc
        const sorted = (data as Post[]).sort((a, b) => b.timestamp - a.timestamp);
        setPosts(sorted);
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: Omit<Post, 'id'> = {
      title: newTitle,
      content: newContent,
      author: 'ADMIN (OVERRIDE)',
      timestamp: Date.now()
    };

    await pushData('posts', post);
    setNewTitle('');
    setNewContent('');
    setIsPosting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('CONFIRM DELETION?')) {
      await removeData('posts', id);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow">SECTOR ANNOUNCEMENTS</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsPosting(!isPosting)}
            className="flex items-center gap-2 text-xs border theme-border px-3 py-1 hover:bg-[var(--theme-color)] hover:text-black transition-colors"
          >
            <PlusSquare size={14} /> {isPosting ? 'CANCEL' : 'NEW ENTRY'}
          </button>
        )}
      </div>

      {isPosting && (
        <form onSubmit={handlePost} className="mb-8 bg-[#101010] p-4 border theme-border animate-in fade-in slide-in-from-top-4">
          <input
            type="text"
            placeholder="SUBJECT HEADER"
            className="w-full bg-black border-b border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)] font-bold mb-4 placeholder-gray-700"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="TRANSMISSION CONTENT..."
            className="w-full bg-black border border-[#333] p-2 theme-text outline-none focus:border-[var(--theme-color)] h-32 placeholder-gray-700 resize-none"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button type="submit" className="mt-4 w-full theme-bg text-black font-bold py-2 hover:bg-white transition-colors">
            BROADCAST
          </button>
        </form>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center opacity-50 mt-12">-- NO ACTIVE TRANSMISSIONS --</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="relative bg-[#0a0a0a] border-l-4 theme-border p-6 hover:bg-[#111] transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold tracking-wider">{post.title}</h3>
                <div className="flex flex-col items-end text-xs opacity-60 font-mono">
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                  <span>{new Date(post.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="text-sm opacity-90 leading-relaxed whitespace-pre-wrap">{post.content}</div>
              <div className="mt-4 pt-4 border-t border-[#222] flex justify-between items-center text-xs text-gray-500">
                <span>// AUTH: {post.author}</span>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedView;