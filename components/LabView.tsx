import React, { useState, useEffect } from 'react';
import { LabResource } from '../types';
import { pushData, subscribeToPath } from '../services/firebaseService';
import { FileText, Link as LinkIcon, Video, PenTool, ExternalLink } from 'lucide-react';

const LabView: React.FC = () => {
  const [resources, setResources] = useState<LabResource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<LabResource['type']>('LINK');

  useEffect(() => {
    const unsubscribe = subscribeToPath('lab', (data) => {
      if (data) setResources(data as LabResource[]);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    await pushData('lab', {
      title,
      url,
      type,
      addedBy: 'Guest Researcher' // Simplified for demo
    });
    setTitle('');
    setUrl('');
    setShowForm(false);
  };

  const getIcon = (type: LabResource['type']) => {
    switch (type) {
      case 'PDF': return <FileText size={20} />;
      case 'VIDEO': return <Video size={20} />;
      case 'TOOL': return <PenTool size={20} />;
      default: return <LinkIcon size={20} />;
    }
  };

  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-[#ff9900] pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow">BLACK MESA LAB</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#151515] border border-[#ff9900] text-[#ff9900] px-4 py-1 text-sm hover:bg-[#ff9900] hover:text-black transition-colors"
        >
          {showForm ? 'CLOSE' : 'UPLOAD RESOURCE'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-dashed border-gray-700 bg-[#0a0a0a] grid gap-4">
          <input 
            className="bg-black border border-gray-700 p-2 text-[#ff9900] outline-none" 
            placeholder="Resource Title"
            value={title} onChange={e => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-black border border-gray-700 p-2 text-[#ff9900] outline-none" 
              placeholder="URL / Link"
              value={url} onChange={e => setUrl(e.target.value)}
            />
            <select 
              className="bg-black border border-gray-700 p-2 text-[#ff9900] outline-none"
              value={type} onChange={e => setType(e.target.value as any)}
            >
              <option value="LINK">LINK</option>
              <option value="PDF">PDF</option>
              <option value="VIDEO">VIDEO</option>
              <option value="TOOL">TOOL</option>
            </select>
          </div>
          <button type="submit" className="bg-[#ff9900] text-black font-bold py-2">SUBMIT TO ARCHIVES</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <a 
            key={res.id} 
            href={res.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block bg-[#0a0a0a] border border-[#222] p-4 hover:border-[#ff9900] transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <ExternalLink size={14} />
            </div>
            <div className="flex items-center gap-3 mb-3 text-[#ff9900]">
              {getIcon(res.type)}
              <span className="text-xs font-bold border border-[#ff9900] px-1 rounded-sm">{res.type}</span>
            </div>
            <h3 className="text-lg font-bold leading-tight group-hover:text-white transition-colors">{res.title}</h3>
            <p className="text-xs text-gray-500 mt-2">// Source: {res.addedBy}</p>
            <div className="absolute bottom-0 left-0 h-1 bg-[#ff9900] w-0 group-hover:w-full transition-all duration-300"></div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default LabView;
