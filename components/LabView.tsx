import React, { useState, useEffect } from 'react';
import { LabResource } from '../types';
import { pushData, subscribeToPath } from '../services/firebaseService';
import { FileText, Link as LinkIcon, Video, PenTool, ExternalLink, AlertTriangle } from 'lucide-react';

const LabView: React.FC = () => {
  const [resources, setResources] = useState<LabResource[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<LabResource['type']>('LINK');
  
  // Upload State
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToPath('lab', (data) => {
      if (data) setResources(data as LabResource[]);
    });
    return () => unsubscribe();
  }, []);

  const validateUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const simulateUpload = async () => {
    return new Promise<void>((resolve) => {
      let curr = 0;
      const timer = setInterval(() => {
        curr += Math.random() * 20;
        if (curr >= 100) {
          curr = 100;
          clearInterval(timer);
          resolve();
        }
        setProgress(curr);
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title) { setError('ERROR: TITLE_REQUIRED'); return; }
    if (!url) { setError('ERROR: DESTINATION_MISSING'); return; }
    if (!validateUrl(url)) { setError('ERROR: INVALID_UPLINK_PROTOCOL (Invalid URL)'); return; }

    // Simulating File Size Check for PDF/Video types (even if it's just a URL, logic applies to "Asset")
    // In a real app with <input type="file">, we would check file.size > 5MB
    if (type === 'PDF' || type === 'VIDEO') {
       // Mock check: Just for UI demonstration
       const mockSize = Math.random() * 10; // 0-10MB
       if (mockSize > 8) { // Limit 8MB
         setError('ERROR: PAYLOAD_EXCEEDS_CAPACITY (>8MB)');
         return;
       }
    }

    setIsUploading(true);
    await simulateUpload();

    await pushData('lab', {
      title,
      url,
      type,
      addedBy: 'Guest Researcher'
    });
    
    // Reset
    setTitle('');
    setUrl('');
    setProgress(0);
    setIsUploading(false);
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
      <div className="flex justify-between items-center mb-8 border-b theme-border pb-2">
        <h2 className="text-3xl font-teko tracking-widest text-glow">BLACK MESA LAB</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#151515] border theme-border theme-text px-4 py-1 text-sm hover:bg-[var(--theme-color)] hover:text-black transition-colors"
        >
          {showForm ? 'CLOSE' : 'UPLOAD RESOURCE'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-dashed border-gray-700 bg-[#0a0a0a] grid gap-4 relative overflow-hidden">
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center">
              <div className="text-xs font-mono mb-2 theme-text">ESTABLISHING UPLINK... {Math.round(progress)}%</div>
              <div className="w-1/2 h-1 bg-gray-800">
                <div className="h-full theme-bg transition-all" style={{width: `${progress}%`}}></div>
              </div>
            </div>
          )}

          <input 
            className="bg-black border border-gray-700 p-2 theme-text outline-none focus:border-[var(--theme-color)]" 
            placeholder="Resource Title"
            value={title} onChange={e => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-black border border-gray-700 p-2 theme-text outline-none focus:border-[var(--theme-color)]" 
              placeholder="Secure URL / Link (https://...)"
              value={url} onChange={e => setUrl(e.target.value)}
            />
            <select 
              className="bg-black border border-gray-700 p-2 theme-text outline-none"
              value={type} onChange={e => setType(e.target.value as any)}
            >
              <option value="LINK">LINK</option>
              <option value="PDF">PDF (Max 8MB)</option>
              <option value="VIDEO">VIDEO (Max 8MB)</option>
              <option value="TOOL">TOOL</option>
            </select>
          </div>
          
          {error && (
            <div className="text-red-500 text-xs font-mono flex items-center gap-2">
              <AlertTriangle size={12} /> {error}
            </div>
          )}

          <button type="submit" className="theme-bg text-black font-bold py-2 hover:bg-white transition-colors">SUBMIT TO ARCHIVES</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <a 
            key={res.id} 
            href={res.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block bg-[#0a0a0a] border border-[#222] p-4 hover:border-[var(--theme-color)] transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <ExternalLink size={14} />
            </div>
            <div className="flex items-center gap-3 mb-3 theme-text">
              {getIcon(res.type)}
              <span className="text-xs font-bold border theme-border px-1 rounded-sm">{res.type}</span>
            </div>
            <h3 className="text-lg font-bold leading-tight group-hover:text-white transition-colors">{res.title}</h3>
            <p className="text-xs text-gray-500 mt-2">// Source: {res.addedBy}</p>
            <div className="absolute bottom-0 left-0 h-1 theme-bg w-0 group-hover:w-full transition-all duration-300"></div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default LabView;
