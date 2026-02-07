
import React, { useEffect, useState } from 'react';
import { Download, Smartphone, Globe, Apple, AlertTriangle } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    // Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Capture Chrome/Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) {
    return (
      <div className="bg-[#0a0a0a] border border-green-900 p-4 text-center">
        <div className="text-green-500 font-bold mb-2 flex justify-center items-center gap-2">
          <Download size={16} /> SYSTEM INSTALLED
        </div>
        <p className="text-xs text-gray-500">
          Platform is running in dedicated standalone mode. Performance optimal.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[var(--theme-color)] transition-all group">
       <h3 className="text-xl font-teko mb-4 flex items-center gap-2 text-white">
         <Smartphone size={18} className="text-purple-500"/> LOCAL DEPLOYMENT (PWA)
       </h3>
       
       <p className="text-xs text-gray-500 mb-4">
         Install Black Mesa Uplink directly to your device for offline access and full-screen immersion.
       </p>

       {deferredPrompt ? (
         <button 
           onClick={handleInstallClick}
           className="w-full theme-bg text-black font-bold py-2 px-4 flex items-center justify-center gap-2 hover:bg-white transition-colors"
         >
           <Download size={16} /> INITIALIZE INSTALLATION
         </button>
       ) : isIOS ? (
         <div className="bg-[#111] p-3 border-l-2 border-gray-500 text-xs text-gray-400 font-mono">
           <div className="flex items-center gap-2 text-white font-bold mb-2">
             <Apple size={14} /> IOS MANUAL OVERRIDE
           </div>
           1. Tap the <span className="text-[var(--theme-color)]">SHARE</span> button in Safari.<br/>
           2. Scroll down and select <span className="text-[var(--theme-color)]">"Add to Home Screen"</span>.<br/>
           3. Confirm name as "Black Mesa".
         </div>
       ) : (
         <div className="flex flex-col gap-2">
            <div className="text-xs text-red-400 flex items-center gap-2 border border-red-900/50 bg-red-900/10 p-2">
              <AlertTriangle size={12}/> AUTO-INSTALL UNAVAILABLE
            </div>
            <p className="text-[10px] text-gray-600">
              Browser does not support automatic installation trigger. Check your browser menu (three dots) for "Install App" or "Add to Home Screen".
            </p>
         </div>
       )}
    </div>
  );
};

export default InstallPWA;
