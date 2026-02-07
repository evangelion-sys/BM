import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, Trash2, Save, Download } from 'lucide-react';
import { pushData, subscribeToPath } from '../services/firebaseService';

const WhiteboardView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff9900');
  const [lineWidth, setLineWidth] = useState(2);
  const [mode, setMode] = useState<'DRAW' | 'ERASE'>('DRAW');
  
  // Collaborative: Load last saved snapshot
  useEffect(() => {
    const unsubscribe = subscribeToPath('whiteboard_snapshot', (data: any[]) => {
      if (data && data.length > 0) {
        const lastSnapshot = data[data.length - 1]; // Get latest
        const img = new Image();
        img.src = lastSnapshot.dataUrl;
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0);
        };
      }
    });
    
    // Init canvas
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid lines
        ctx.strokeStyle = '#151515';
        ctx.lineWidth = 1;
        for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
        for(let i=0; i<canvas.height; i+=40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
      }
    }
    
    return () => unsubscribe();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
       x = e.touches[0].clientX - rect.left;
       y = e.touches[0].clientY - rect.top;
    } else {
       x = (e as React.MouseEvent).clientX - rect.left;
       y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = mode === 'ERASE' ? '#080808' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Re-draw grid
      ctx.strokeStyle = '#151515';
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for(let i=0; i<canvas.height; i+=40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
    }
  };

  const saveToSystem = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    await pushData('whiteboard_snapshot', {
      dataUrl,
      timestamp: Date.now(),
      author: 'User'
    });
    alert('SCHEMATIC UPLOADED TO SHARED MEMORY');
  };

  const downloadLocal = () => {
     if (!canvasRef.current) return;
     const link = document.createElement('a');
     link.download = 'black_mesa_schematic.png';
     link.href = canvasRef.current.toDataURL();
     link.click();
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-teko tracking-widest text-glow flex items-center gap-2">
           SCHEMATIC DESIGNER
        </h2>
        <div className="flex gap-2 bg-[#101010] p-1 border theme-border rounded">
           <button onClick={() => setMode('DRAW')} className={`p-2 rounded ${mode === 'DRAW' ? 'theme-bg text-black' : 'text-gray-500'}`}><PenTool size={18}/></button>
           <button onClick={() => setMode('ERASE')} className={`p-2 rounded ${mode === 'ERASE' ? 'bg-white text-black' : 'text-gray-500'}`}><Eraser size={18}/></button>
           <div className="w-px bg-gray-700 mx-1"></div>
           <button onClick={() => setColor('#ff9900')} className="w-6 h-6 rounded-full bg-[#ff9900] border border-gray-600"></button>
           <button onClick={() => setColor('#00ff00')} className="w-6 h-6 rounded-full bg-[#00ff00] border border-gray-600"></button>
           <button onClick={() => setColor('#0099ff')} className="w-6 h-6 rounded-full bg-[#0099ff] border border-gray-600"></button>
           <button onClick={() => setColor('#ffffff')} className="w-6 h-6 rounded-full bg-white border border-gray-600"></button>
        </div>
      </div>

      <div className="flex-1 relative border-2 border-[#333] cursor-crosshair overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full bg-[#080808]"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
           <button onClick={clearCanvas} className="bg-black/50 p-2 text-red-500 border border-red-900 hover:bg-red-900/20" title="Wipe System"><Trash2 size={20}/></button>
           <button onClick={saveToSystem} className="bg-black/50 p-2 theme-text border theme-border hover:bg-[var(--theme-dim)]" title="Upload to Uplink"><Save size={20}/></button>
           <button onClick={downloadLocal} className="bg-black/50 p-2 text-blue-400 border border-blue-900 hover:bg-blue-900/20" title="Download Local"><Download size={20}/></button>
        </div>
        <div className="absolute bottom-2 left-2 text-[10px] text-gray-600 font-mono pointer-events-none">
          COORD: X/Y RELATIVE // VECTOR INPUT ACTIVE
        </div>
      </div>
    </div>
  );
};

export default WhiteboardView;
