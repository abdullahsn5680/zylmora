const DB_NAME = 'SafeFetchCache';
const STORE_NAME = 'responses';
const CACHE_VERSION = 'v1';
const DEFAULT_CACHE_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

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

/**
 * Determines the response type based on content-type header
 * @param {Response} response - The fetch response object
 * @returns {string} - The response type (json, text, blob, arraybuffer)
 */
function getResponseType(response) {
  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return 'json';
  } else if (contentType.includes('text/') || contentType.includes('application/xml') || contentType.includes('application/xhtml+xml')) {
    return 'text';
  } else if (contentType.includes('image/') || contentType.includes('video/') || contentType.includes('audio/')) {
    return 'blob';
  } else if (contentType.includes('application/octet-stream') || contentType.includes('application/pdf')) {
    return 'arraybuffer';
  } else {
    // Default to text for unknown types
    return 'text';
  }
}

/**
 * Processes the response based on its type
 * @param {Response} response - The fetch response object
 * @param {string} responseType - The type of response to process
 * @returns {Promise} - The processed response data
 */
async function processResponse(response, responseType) {
  switch (responseType) {
    case 'json':
      return await response.json();
    case 'text':
      return await response.text();
    case 'blob':
      const blob = await response.blob();
      // Convert blob to base64 for storage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          type: 'blob',
          data: reader.result,
          contentType: blob.type
        });
        reader.readAsDataURL(blob);
      });
    case 'arraybuffer':
      const buffer = await response.arrayBuffer();
      // Convert arraybuffer to base64 for storage
      const bytes = new Uint8Array(buffer);
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      return {
        type: 'arraybuffer',
        data: btoa(binary),
        contentType: response.headers.get('content-type')
      };
    default:
      return await response.text();
  }
}

/**
 * Reconstructs the original data from cached format
 * @param {*} cachedData - The cached data to reconstruct
 * @returns {*} - The reconstructed data
 */
function reconstructData(cachedData) {
  if (cachedData && typeof cachedData === 'object' && cachedData.type) {
    switch (cachedData.type) {
      case 'blob':
        // Convert base64 back to blob
        const byteCharacters = atob(cachedData.data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: cachedData.contentType });
      case 'arraybuffer':
        // Convert base64 back to arraybuffer
        const binaryString = atob(cachedData.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      default:
        return cachedData;
    }
  }
  return cachedData;
}

const inFlight = new Map();

/**
 * Enhanced safeFetch with session-based caching that handles all data types
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options (headers, method, etc.)
 * @param {number} cacheTime - Cache time in milliseconds (if not provided, defaults to 1 hour)
 * @param {Object} session - Session object with user information
 * @param {string} forceResponseType - Force a specific response type (json, text, blob, arraybuffer)
 * @returns {Promise} - Returns cached or fresh data based on session
 */
export async function safeFetch(url, options = {}, cacheTime, session = null, forceResponseType = null, origin = '') {
  const actualCacheTime = cacheTime !== undefined ? cacheTime : DEFAULT_CACHE_TIME;
  const isRelative = url.startsWith('/');
  const fullUrl = isRelative && origin ? origin + url : url;

  const key = `${CACHE_VERSION}:${fullUrl}:${JSON.stringify(options)}:${forceResponseType || 'auto'}`;

  const shouldBypassCache = session?.user?.role === true;

  if (shouldBypassCache) {
    console.log('Admin user detected - fetching fresh data');
    try {
      const response = await fetch(fullUrl, options);
      if (!response.ok) throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      const responseType = forceResponseType || getResponseType(response);
      const data = await processResponse(response, responseType);
      return reconstructData(data);
    } catch (error) {
      console.error('Fresh fetch failed for admin user:', error);
      throw error;
    }
  }

  if (inFlight.has(key)) {
    console.log('Request already in flight, returning existing promise');
    return inFlight.get(key);
  }

  const cached = await readFromCache(key);
  if (cached) {
    console.log('Returning cached data');
    return reconstructData(cached);
  }

  console.log('No cached data found, fetching fresh data');

  const fetchPromise = fetch(fullUrl, options)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      const responseType = forceResponseType || getResponseType(res);
      const data = await processResponse(res, responseType);
      await writeToCache(key, data, Date.now() + actualCacheTime);
      console.log(`Data cached for ${actualCacheTime}ms`);
      return reconstructData(structuredClone(data));
    })
    .catch((error) => {
      console.error('Fetch failed:', error);
      throw error;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, fetchPromise);
  return fetchPromise;
}

// Helper function to create session object
export function createSession(user) {
  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role // true for admin, false for regular user
    }
  };
}

// Usage examples:

// Example 1: JSON API (automatic detection)
/*
const userSession = createSession({ id: 2, name: 'User', role: false });
const jsonData = await safeFetch('https://api.example.com/data', {}, 1000, userSession);
*/

// Example 2: Force JSON response type
/*
const jsonData = await safeFetch('https://api.example.com/data', {}, 1000, null, 'json');
*/

// Example 3: Image/Blob data
/*
const imageBlob = await safeFetch('https://example.com/image.jpg', {}, 5 * 60 * 1000);
// Result will be a Blob object
*/

// Example 4: Text data (HTML, XML, plain text)
/*
const htmlContent = await safeFetch('https://example.com/page.html', {}, 10000, null, 'text');
*/

// Example 5: Binary data (PDF, executables, etc.)
/*
const pdfBuffer = await safeFetch('https://example.com/document.pdf', {}, 30000, null, 'arraybuffer');
// Result will be an ArrayBuffer
*/

// Example 6: Admin user fetching image (bypasses cache)
/*
const adminSession = createSession({ id: 1, name: 'Admin', role: true });
const adminImage = await safeFetch('https://example.com/admin-image.jpg', {}, 1000, adminSession);
*/

// Example 7: CSV or other text-based data
/*
const csvData = await safeFetch('https://example.com/data.csv', {}, 60000, null, 'text');
*/