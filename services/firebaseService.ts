import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, Database } from 'firebase/database';

// --- CONFIGURATION ---
// IF YOU ARE A BEGINNER: Ignore this section. The app will work in "Simulation Mode" automatically.
// IF YOU WANT REAL ONLINE MULTIPLAYER: Paste your Firebase config below.
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY", 
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder-id",
  storageBucket: "placeholder.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:0000000:web:0000000",
  databaseURL: "https://placeholder-id-default-rtdb.firebaseio.com"
};

let db: Database | null = null;
let isOfflineMode = true;

// 1. Attempt Connection
try {
  if (firebaseConfig.apiKey !== "PLACEHOLDER_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    isOfflineMode = false;
    console.log("%c [SYSTEM] BLACK MESA UPLINK: ONLINE ", "background: #ff9900; color: #000; font-weight: bold;");
  } else {
    console.warn("%c [SYSTEM] CONFIG MISSING -> ACTIVATING LOCAL SIMULATION MODE ", "background: #333; color: #ff9900");
  }
} catch (e) {
  console.error("Firebase Init Failed:", e);
}

export const isFirebaseOnline = () => !isOfflineMode;

// --- LOCAL SIMULATION HELPERS ---
// These functions mimic a real database using your browser's LocalStorage.
// This allows the app to "work" immediately for testing.

const getLocalData = (path: string) => {
  const key = `BM_DB_${path}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};

const setLocalData = (path: string, data: any) => {
  const key = `BM_DB_${path}`;
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch event so other components in this tab update
  window.dispatchEvent(new CustomEvent('bm-db-update', { detail: { path } }));
};

// --- DATA METHODS ---

export const subscribeToPath = (path: string, callback: (data: any[]) => void) => {
  // A. REAL ONLINE MODE
  if (!isOfflineMode && db) {
    const dbRef = ref(db, path);
    return onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      const list = val ? Object.keys(val).map(key => ({ id: key, ...val[key] })) : [];
      callback(list);
    });
  }

  // B. LOCAL SIMULATION MODE
  // We listen to 'bm-db-update' (current tab) and 'storage' (other tabs)
  const notify = () => {
    const data = getLocalData(path);
    const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
    // Sort by timestamp if present
    list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    callback(list);
  };

  notify(); // Initial load

  const handleLocalUpdate = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail.path === path) notify();
  };
  
  const handleStorageUpdate = (e: StorageEvent) => {
    if (e.key === `BM_DB_${path}`) notify();
  };

  window.addEventListener('bm-db-update', handleLocalUpdate);
  window.addEventListener('storage', handleStorageUpdate); // Cross-tab sync

  return () => {
    window.removeEventListener('bm-db-update', handleLocalUpdate);
    window.removeEventListener('storage', handleStorageUpdate);
  };
};

export const pushData = async (path: string, data: any) => {
  // A. REAL ONLINE MODE
  if (!isOfflineMode && db) {
    const dbRef = ref(db, path);
    await push(dbRef, data);
    return;
  }

  // B. LOCAL SIMULATION MODE
  const current = getLocalData(path);
  const newId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newItem = { ...data, id: newId };
  
  // Artificial delay to feel like a network request
  await new Promise(r => setTimeout(r, 300));
  
  current[newId] = newItem;
  setLocalData(path, current);
};

export const removeData = async (path: string, id: string) => {
  // A. REAL ONLINE MODE
  if (!isOfflineMode && db) {
    const dbRef = ref(db, `${path}/${id}`);
    await remove(dbRef);
    return;
  }

  // B. LOCAL SIMULATION MODE
  const current = getLocalData(path);
  delete current[id];
  setLocalData(path, current);
};
