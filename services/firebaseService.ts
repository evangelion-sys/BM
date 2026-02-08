
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, Database } from 'firebase/database';

// --- DYNAMIC CONFIGURATION SYSTEM ---

const STORAGE_KEY = 'BM_FIREBASE_CONFIG';

// 1. Try to get config from URL (Share Link)
const getUrlConfig = () => {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('uplink=')) {
      const configStr = hash.split('uplink=')[1];
      if (configStr) {
        const decoded = atob(configStr); // Base64 decode
        const config = JSON.parse(decoded);
        // Save to local storage for persistence
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        // Clean URL - removing the hash so it looks clean
        window.history.replaceState(null, '', window.location.pathname);
        return config;
      }
    }
  } catch (e) {
    console.warn("Invalid Uplink URL Format");
  }
  return null;
};

// 2. Try to get config from LocalStorage
const getStoredConfig = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

// Initialize
const config = getUrlConfig() || getStoredConfig();
let db: Database | null = null;
let isOfflineMode = true;

if (config) {
  try {
    // Prevent double initialization
    const app = !getApps().length ? initializeApp(config) : getApp();
    db = getDatabase(app);
    isOfflineMode = false;
    console.log("%c [SYSTEM] ONLINE - UPLINK ESTABLISHED ", "color: #ff9900; font-weight: bold;");
  } catch (e) {
    console.error("Connection Failed:", e);
    // If init fails, revert to offline to prevent crash
    isOfflineMode = true;
  }
} else {
  // Use a softer log message for simulation mode
  console.log("%c [SYSTEM] SIMULATION MODE ACTIVE (Local Only) ", "color: #888;");
}

export const isFirebaseOnline = () => !isOfflineMode;

// --- CONFIG MANAGEMENT TOOLS ---

export const saveConnectionConfig = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    window.location.reload(); // Reload to initialize firebase
  } catch (e) {
    alert("INVALID CONFIGURATION FORMAT");
  }
};

export const resetConnection = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};

export const generateInviteLink = () => {
  if (isOfflineMode || !config) return null;
  try {
    const str = JSON.stringify(config);
    const encoded = btoa(str);
    
    // Dynamic Base URL Construction
    // This fixes issues where the link would point to the wrong Vercel/Netlify instance
    let baseUrl = window.location.origin + window.location.pathname;
    
    // Cleanup trailing slashes or index.html
    if (baseUrl.endsWith('index.html')) {
        baseUrl = baseUrl.replace('index.html', '');
    }
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }
    
    return `${baseUrl}/#uplink=${encoded}`;
  } catch (e) {
    console.error("Error generating link", e);
    return null;
  }
};

// --- DATA METHODS (HYBRID) ---

const getLocalData = (path: string) => {
  const key = `BM_DB_${path}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};

const setLocalData = (path: string, data: any) => {
  const key = `BM_DB_${path}`;
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('bm-db-update', { detail: { path } }));
};

export const subscribeToPath = (path: string, callback: (data: any[]) => void) => {
  // A. ONLINE
  if (!isOfflineMode && db) {
    const dbRef = ref(db, path);
    return onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      const list = val ? Object.keys(val).map(key => ({ id: key, ...val[key] })) : [];
      callback(list);
    });
  }

  // B. OFFLINE SIMULATION
  const notify = () => {
    const data = getLocalData(path);
    const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
    list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    callback(list);
  };

  notify();

  const handleLocalUpdate = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail.path === path) notify();
  };
  
  const handleStorageUpdate = (e: StorageEvent) => {
    if (e.key === `BM_DB_${path}`) notify();
  };

  window.addEventListener('bm-db-update', handleLocalUpdate);
  window.addEventListener('storage', handleStorageUpdate);

  return () => {
    window.removeEventListener('bm-db-update', handleLocalUpdate);
    window.removeEventListener('storage', handleStorageUpdate);
  };
};

export const pushData = async (path: string, data: any) => {
  if (!isOfflineMode && db) {
    const dbRef = ref(db, path);
    await push(dbRef, data);
    return;
  }

  const current = getLocalData(path);
  const newId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newItem = { ...data, id: newId };
  await new Promise(r => setTimeout(r, 300));
  current[newId] = newItem;
  setLocalData(path, current);
};

export const removeData = async (path: string, id: string) => {
  if (!isOfflineMode && db) {
    const dbRef = ref(db, `${path}/${id}`);
    await remove(dbRef);
    return;
  }

  const current = getLocalData(path);
  delete current[id];
  setLocalData(path, current);
};
