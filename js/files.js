// ============================================================
// Files — class handouts stored on THIS device in IndexedDB.
// PDFs, photos of the board, worksheets. No size ceiling worth
// worrying about (hundreds of MB), and it all works offline.
// Links are kept in the synced store instead, since they are tiny.
// ============================================================
(function () {
'use strict';

const DB = 'mathkitty-files', STORE = 'files';
let dbp = null;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      if (!d.objectStoreNames.contains(STORE)) {
        const st = d.createObjectStore(STORE, { keyPath: 'id' });
        st.createIndex('unit', 'unit', { unique: false });
      }
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}

function tx(mode) {
  return open().then(d => d.transaction(STORE, mode).objectStore(STORE));
}
function wrap(req) {
  return new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });
}

async function add(unit, file, name) {
  const rec = {
    id: 'f' + Date.now() + Math.random().toString(36).slice(2, 7),
    unit: unit,
    name: name || file.name || 'pasted-image.png',
    type: file.type || 'application/octet-stream',
    size: file.size,
    added: Date.now(),
    blob: file,
  };
  const st = await tx('readwrite');
  await wrap(st.add(rec));
  return rec;
}

async function list(unit) {
  const st = await tx('readonly');
  const all = await wrap(st.index('unit').getAll(unit));
  return (all || []).sort((a, b) => a.added - b.added);
}

async function remove(id) {
  const st = await tx('readwrite');
  return wrap(st.delete(id));
}

async function usage() {
  const st = await tx('readonly');
  const all = await wrap(st.getAll());
  return (all || []).reduce((n, r) => n + (r.size || 0), 0);
}

function sizeText(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

window.FILES = { add, list, remove, usage, sizeText, available: 'indexedDB' in window };
})();
