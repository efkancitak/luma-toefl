import { createState, validateBackup, salvageBackup, salvageSummary } from './core.js';

const scope = new URL('./', import.meta.url).pathname;
const KEY = `luma-study-v1:${scope}`;
let warning = '';
let recoveryRaw = '';
let recoveryProtected = true;

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? validateBackup(JSON.parse(raw)) : createState();
  } catch (error) {
    try {
      recoveryRaw=localStorage.getItem(KEY)||'';
      if(recoveryRaw)localStorage.setItem(`${KEY}:recovery`,recoveryRaw);
    } catch { recoveryProtected=false; }
    console.warn('Local state could not be loaded:', error.message);
    // One unexpected value must not reset everything: keep every part that
    // still validates and drop only the entries that do not.
    if(recoveryRaw){
      try{
        const {state,dropped}=salvageBackup(recoveryRaw);
        const summary=salvageSummary(dropped);
        warning=`Kayıtlı verinin bir bölümü okunamadı${summary?` (${summary})`:''}. Geri kalan ilerlemen korundu. Özgün kopya Ayarlar’dan indirilebilir.`;
        return state;
      }catch(salvageError){console.warn('Local state could not be salvaged:', salvageError.message);}
    }
    warning = 'Kayıtlı veri okunamadı. Kurtarma kopyası Ayarlar’dan indirilebilir. Bir yedeği geri yükleyebilirsin.';
    return createState();
  }
}

export function saveState(state) {
  if(!recoveryProtected)return false;
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
  catch { warning = 'Cihazda kayıt yapılamadı. Depolama alanını kontrol et ve hemen yedek indir.'; return false; }
}

export function storageWarning() { return warning; }
export function hasRecovery() { try{return !!(recoveryRaw||localStorage.getItem(`${KEY}:recovery`));}catch{return !!recoveryRaw;} }
export function exportRecovery() {
  let raw=recoveryRaw;
  try{raw ||= localStorage.getItem(`${KEY}:recovery`);}catch{}
  if(raw)downloadBlob(new Blob([raw],{type:'application/json'}),'luma-kurtarma-yedek.json');
}

let dbPromise;
function database() {
  if (!globalThis.indexedDB) return Promise.reject(new Error('Bu tarayıcı ses deposunu desteklemiyor.'));
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(`luma-recordings:${scope}`, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('recordings', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { dbPromise = null; reject(request.error); };
  });
  return dbPromise;
}

export async function saveRecording(id, itemId, blob) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recordings', 'readwrite');
    tx.objectStore('recordings').put({ id, itemId, blob, createdAt: new Date().toISOString() });
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Kayıt tamamlanamadı.'));
  });
}

export async function getRecording(id) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const req = db.transaction('recordings').objectStore('recordings').get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listRecordings() {
  const db = await database();
  return new Promise((resolve, reject) => {
    const req = db.transaction('recordings').objectStore('recordings').getAll();
    req.onsuccess = () => resolve(req.result.map(r => ({ id: r.id, itemId: r.itemId, createdAt: r.createdAt, size: r.blob?.size || 0 })));
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRecordings(ids) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recordings', 'readwrite');
    const store = tx.objectStore('recordings');
    for (const id of ids) store.delete(id);
    tx.oncomplete = () => resolve(ids.length);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Silme tamamlanamadı.'));
  });
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = name; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/**
 * Hands a file to the user. On a phone the share sheet ("Dosyalara Kaydet",
 * AirDrop, Mail) is the dependable way out of a home-screen web app; elsewhere
 * a normal download. Resolves false only when the user cancels the share sheet.
 * Must be called directly from a tap so the share sheet is allowed to open.
 */
export async function saveFile(blob, name) {
  const touch = globalThis.matchMedia?.('(pointer: coarse)').matches;
  if (touch && navigator.canShare) {
    try {
      const file = new File([blob], name, { type: blob.type || 'application/octet-stream' });
      if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return true; }
    } catch (error) {
      if (error?.name === 'AbortError') return false;
    }
  }
  downloadBlob(blob, name);
  return true;
}

export function lastBackupAt() { try { return localStorage.getItem(`${KEY}:backup-at`) || ''; } catch { return ''; } }

export async function exportProgress(state) {
  const saved = await saveFile(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), `luma-yedek-${new Date().toISOString().slice(0,10)}.json`);
  if (saved) { try { localStorage.setItem(`${KEY}:backup-at`, new Date().toISOString()); } catch {} }
  return saved;
}

// Device preferences (voice, speed, mode) live outside the progress backup:
// a voice name or a microphone habit belongs to this phone, not to the learner's record.
export function loadPrefs() {
  try { const value = JSON.parse(localStorage.getItem(`${KEY}:prefs`) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  catch { return {}; }
}
export function savePrefs(prefs) { try { localStorage.setItem(`${KEY}:prefs`, JSON.stringify(prefs)); } catch {} }
