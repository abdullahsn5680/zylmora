const DB_NAME = 'SafeFetchCache';
const STORE_NAME = 'responses';
const CACHE_VERSION = 'v1';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      cleanupExpiredCache(db);
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function cleanupExpiredCache(db) {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const now = Date.now();

  const request = store.openCursor();
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const { expiry } = cursor.value;
      if (expiry < now) {
        store.delete(cursor.key);
      }
      cursor.continue();
    }
  };
}

async function readFromCache(key) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => {
      const result = request.result;
      if (result && result.expiry > Date.now()) {
        resolve(structuredClone(result.data));
      } else {
        resolve(null);
      }
    };

    request.onerror = () => resolve(null);
  });
}

async function writeToCache(key, data, expiry) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put({ key, data, expiry });
}

const inFlight = new Map();

export async function safeFetch(url, options = {}, cacheTime = 24 * 60 * 60 * 1000) {
  const key = `${CACHE_VERSION}:${url}:${JSON.stringify(options)}`;

  if (inFlight.has(key)) return inFlight.get(key);

  const cached = await readFromCache(key);
  if (cached) return cached;

  const fetchPromise = fetch(url, options)
    .then(async (res) => {
      if (!res.ok) throw new Error('Fetch error: ' + res.status);
      const data = await res.json();
      await writeToCache(key, data, Date.now() + cacheTime);
      return structuredClone(data);
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, fetchPromise);
  return fetchPromise;
}
