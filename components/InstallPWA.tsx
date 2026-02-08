
import React, { useEffect, useState } from 'react';
import { Download, Smartphone, Globe, Apple, AlertTriangle, Package } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

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
          <Package size={16} /> PACKAGE INSTALLED
        </div>
        <p className="text-xs text-gray-500">
          Black Mesa Uplink is running natively on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[var(--theme-color)] transition-all group">
       <h3 className="text-xl font-teko mb-4 flex items-center gap-2 text-white">
         <Smartphone size={18} className="text-purple-500"/> DOWNLOAD CENTER
       </h3>
       
       <p className="text-xs text-gray-500 mb-4">
         Download and install the full Black Mesa Uplink package to your device for offline access.
       </p>

       {deferredPrompt ? (
         <div className="space-y-2">
            <div className="text-[10px] text-green-500 font-mono border border-green-900/30 bg-green-900/10 p-1 text-center">
               ANDROID SYSTEM COMPATIBLE
            </div>
            <button 
              onClick={handleInstallClick}
              className="w-full theme-bg text-black font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)] animate-pulse"
            >
              <Download size={18} /> DOWNLOAD APP PACKAGE
            </button>
         </div>
       ) : isIOS ? (
         <div className="bg-[#111] p-3 border-l-2 border-gray-500 text-xs text-gray-400 font-mono">
           <div className="flex items-center gap-2 text-white font-bold mb-2">
             <Apple size={14} /> IOS INSTALLATION
           </div>
           To install package on iOS:
           <br/>1. Tap <span className="text-[var(--theme-color)]">SHARE</span> in Safari.
           <br/>2. Select <span className="text-[var(--theme-color)]">"Add to Home Screen"</span>.
         </div>
       ) : (
         <div className="flex flex-col gap-2">
            {isAndroid ? (
                <div className="bg-[#111] p-3 border-l-2 border-yellow-600 text-xs text-gray-400 font-mono">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold mb-1">
                        <AlertTriangle size={12}/> MANUAL INSTALL REQUIRED
                    </div>
                    Tap the browser menu (⋮) and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong> to download the WebAPK.
                </div>
            ) : (
                <div className="text-xs text-gray-600 flex items-center gap-2 border border-[#222] p-2">
                   <Globe size={12}/> Running in Browser Mode
                </div>
            )}
         </div>
       )}
    </div>
  );
};

export default InstallPWA;
