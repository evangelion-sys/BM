
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { pushData, subscribeToPath } from '../services/firebaseService';
import { FileText, Download, Upload, Bell, Paperclip } from 'lucide-react';

interface AcademicViewProps {
  level: string; // e.g., 'Licence Year 1'
  isAdmin: boolean;
  username: string;
}

const AcademicView: React.FC<AcademicViewProps> = ({ level, isAdmin, username }) => {
  const [activeTab, setActiveTab] = useState<'NEWS' | 'RESOURCES'>('NEWS');
  const [posts, setPosts] = useState<Post[]>([]);
  const [files, setFiles] = useState<any[]>([]); // Mock file list
  
  // News Form
  const [newsContent, setNewsContent] = useState('');
  
  // Upload Form
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const dbPathPrefix = level.replace(/\s+/g, '_');

  useEffect(() => {
    // Subscribe to sector specific news
    const unsubNews = subscribeToPath(`news/${dbPathPrefix}`, (data) => {
      setPosts((data as Post[]).sort((a, b) => b.timestamp - a.timestamp));
    });
    // Subscribe to sector resources
    const unsubFiles = subscribeToPath(`resources/${dbPathPrefix}`, (data) => {
      setFiles(data as any[]);
    });
    return () => { unsubNews(); unsubFiles(); };
  }, [level]);

  const postNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsContent) return;
    await pushData(`news/${dbPathPrefix}`, {
      title: 'SECTOR UPDATE',
      content: newsContent,
      author: isAdmin ? 'ADMIN' : username,
      timestamp: Date.now()
    });
    setNewsContent('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName || !uploadUrl) return;
    await pushData(`resources/${dbPathPrefix}`, {
      name: uploadName,
      url: uploadUrl,
      type: 'LINK', // Simplified for no-backend
      author: username,
      timestamp: Date.now()
    });
    setUploadName('');
    setUploadUrl('');
  };

  // Convert text to speech
  const readAnnouncement = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow uppercase">{level} SECTOR</h2>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('NEWS')} className={`px-4 py-1 text-sm border theme-border ${activeTab === 'NEWS' ? 'theme-bg text-black' : ''}`}>
             <Bell size={14} className="inline mr-2"/> ANNOUNCEMENTS
          </button>
          <button onClick={() => setActiveTab('RESOURCES')} className={`px-4 py-1 text-sm border theme-border ${activeTab === 'RESOURCES' ? 'theme-bg text-black' : ''}`}>
             <Upload size={14} className="inline mr-2"/> RESOURCES
          </button>
        </div>
      </div>

      {activeTab === 'NEWS' ? (
        <div className="flex-1 flex flex-col gap-4">
          {isAdmin && (
            <form onSubmit={postNews} className="bg-[#101010] p-4 border theme-border">
              <textarea 
                className="w-full bg-black border border-[#333] p-2 theme-text text-sm mb-2" 
                placeholder="Broadcast message to sector..."
                value={newsContent} onChange={e => setNewsContent(e.target.value)}
              />
              <button className="theme-bg text-black px-4 py-1 font-bold text-xs">TRANSMIT</button>
            </form>
          )}
          <div className="flex-1 overflow-y-auto space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-[#0a0a0a] border-l-4 theme-border p-4 hover:bg-[#111]">
                 <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                   <span>FROM: {post.author}</span>
                   <span>{new Date(post.timestamp).toLocaleString()}</span>
                 </div>
                 <p className="text-sm mb-2">{post.content}</p>
                 <button onClick={() => readAnnouncement(post.content)} className="text-[10px] border border-gray-700 px-2 py-0.5 hover:bg-white hover:text-black">
                    PLAY AUDIO
                 </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <form onSubmit={handleUpload} className="bg-[#101010] p-4 border theme-border flex flex-col gap-2">
            <div className="text-xs font-bold mb-2">UPLOAD RESOURCE LINK</div>
            <input className="bg-black border border-[#333] p-2 theme-text text-sm" placeholder="File Name / Title" value={uploadName} onChange={e => setUploadName(e.target.value)} />
            <input className="bg-black border border-[#333] p-2 theme-text text-sm" placeholder="Google Drive / Direct Link URL" value={uploadUrl} onChange={e => setUploadUrl(e.target.value)} />
            <button className="theme-bg text-black px-4 py-2 font-bold text-xs flex items-center justify-center gap-2">
               <Upload size={14}/> UPLOAD TO ARCHIVE
            </button>
            <div className="text-[9px] text-gray-500">* Files are linked externally to save bandwidth. Use Google Drive or Dropbox links.</div>
          </form>

          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
             {files.map((file, idx) => (
               <div key={idx} className="border border-[#333] p-3 flex items-center justify-between hover:border-[var(--theme-color)] group">
                  <div className="flex items-center gap-3">
                    <FileText className="text-gray-500" />
                    <div>
                      <div className="font-bold text-sm">{file.name}</div>
                      <div className="text-[10px] text-gray-500">BY {file.author}</div>
                    </div>
                  </div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#222] rounded-full">
                    <Download size={16} />
                  </a>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicView;
