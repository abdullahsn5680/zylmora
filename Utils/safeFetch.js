const DB_NAME = 'SafeFetchCache';
const STORE_NAME = 'responses';
const INVALIDATION_STORE_NAME = 'invalidations';
const CACHE_VERSION = 'v1';
const DEFAULT_CACHE_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Increment version for new store
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create responses store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
      
      // Create invalidations store if it doesn't exist
      if (!db.objectStoreNames.contains(INVALIDATION_STORE_NAME)) {
        db.createObjectStore(INVALIDATION_STORE_NAME, { keyPath: 'endpoint' });
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

/**
 * Extract the base endpoint from a URL (without query parameters)
 * @param {string} url - The full URL
 * @returns {string} - The base endpoint
 */
function getBaseEndpoint(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.origin + urlObj.pathname;
  } catch (error) {
    // If URL parsing fails, return the URL as is
    return url.split('?')[0];
  }
}

/**
 * Mark an endpoint as invalidated (fresh fetch required on next GET)
 * @param {string} endpoint - The endpoint to invalidate
 */
async function markEndpointInvalidated(endpoint) {
  const db = await openDB();
  const tx = db.transaction(INVALIDATION_STORE_NAME, 'readwrite');
  const store = tx.objectStore(INVALIDATION_STORE_NAME);
  
  store.put({
    endpoint,
    invalidatedAt: Date.now(),
    freshFetchCompleted: false
  });
}

/**
 * Check if an endpoint needs fresh fetch and mark as completed
 * @param {string} endpoint - The endpoint to check
 * @returns {Promise<boolean>} - True if fresh fetch is needed
 */
async function checkAndMarkFreshFetch(endpoint) {
  const db = await openDB();
  const tx = db.transaction(INVALIDATION_STORE_NAME, 'readwrite');
  const store = tx.objectStore(INVALIDATION_STORE_NAME);
  
  return new Promise((resolve) => {
    const request = store.get(endpoint);
    
    request.onsuccess = () => {
      const result = request.result;
      
      if (result && !result.freshFetchCompleted) {
        // Mark as completed
        store.put({
          ...result,
          freshFetchCompleted: true
        });
        resolve(true); // Fresh fetch needed
      } else {
        resolve(false); // No fresh fetch needed
      }
    };
    
    request.onerror = () => resolve(false);
  });
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
 * Enhanced safeFetch with session-based caching and method-based cache invalidation
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options (headers, method, etc.)
 * @param {number} cacheTime - Cache time in milliseconds (if not provided, defaults to 1 hour)
 * @param {Object} session - Session object with user information
 * @param {string} forceResponseType - Force a specific response type (json, text, blob, arraybuffer)
 * @param {string} origin - Origin for relative URLs
 * @returns {Promise} - Returns cached or fresh data based on session and method
 */
export async function safeFetch(url, options = {}, cacheTime, session = null, forceResponseType = null, origin = '') {
  const actualCacheTime = cacheTime !== undefined ? cacheTime : DEFAULT_CACHE_TIME;
  const isRelative = url.startsWith('/');
  const fullUrl = isRelative && origin ? origin + url : url;
  const method = (options.method || 'GET').toUpperCase();
  const baseEndpoint = getBaseEndpoint(fullUrl);
   console.log(`session:${session}`)
  const key = `${CACHE_VERSION}:${fullUrl}:${JSON.stringify({...options, method})}:${forceResponseType || 'auto'}`;

  const shouldBypassCache = session?.user?.role === true;

  // Handle POST, PUT, DELETE requests
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    console.log(`${method} request detected - invalidating cache for endpoint: ${baseEndpoint}`);
    
    // Mark the endpoint as invalidated for future GET requests
    await markEndpointInvalidated(baseEndpoint);
    
    // Execute the request (no caching for modifying requests)
    try {
      const response = await fetch(fullUrl, options);
      if (!response.ok) throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      const responseType = forceResponseType || getResponseType(response);
      const data = await processResponse(response, responseType);
      return reconstructData(data);
    } catch (error) {
      console.error(`${method} request failed:`, error);
      throw error;
    }
  }

  // Handle GET requests
  if (method === 'GET') {
    // Check if this endpoint needs a fresh fetch due to recent modifications
    const needsFreshFetch = await checkAndMarkFreshFetch(baseEndpoint);
    
    if (needsFreshFetch) {
      console.log('Endpoint was invalidated - fetching fresh data once');
      try {
        const response = await fetch(fullUrl, options);
        if (!response.ok) throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        const responseType = forceResponseType || getResponseType(response);
        const data = await processResponse(response, responseType);
        
        // Cache the fresh data
        await writeToCache(key, data, Date.now() + actualCacheTime);
        console.log(`Fresh data cached for ${actualCacheTime}ms`);
        
        return reconstructData(data);
      } catch (error) {
        console.error('Fresh fetch failed:', error);
        throw error;
      }
    }
  }

  // Admin bypass logic
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

  // Check for in-flight requests
  if (inFlight.has(key)) {
    console.log('Request already in flight, returning existing promise');
    return inFlight.get(key);
  }

  // Check cache for GET requests
  if (method === 'GET') {
    const cached = await readFromCache(key);
    if (cached) {
      console.log('Returning cached data');
      return reconstructData(cached);
    }
  }

  console.log('No cached data found, fetching fresh data');

  const fetchPromise = fetch(fullUrl, options)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      const responseType = forceResponseType || getResponseType(res);
      const data = await processResponse(res, responseType);
      
      // Only cache GET requests
      if (method === 'GET') {
        await writeToCache(key, data, Date.now() + actualCacheTime);
        console.log(`Data cached for ${actualCacheTime}ms`);
      }
      
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

// Helper function to manually invalidate cache for an endpoint
export async function invalidateEndpoint(url) {
  const baseEndpoint = getBaseEndpoint(url);
  await markEndpointInvalidated(baseEndpoint);
  console.log(`Cache invalidated for endpoint: ${baseEndpoint}`);
}

// Usage examples:

// Example 1: POST request (invalidates cache)
/*
const userSession = createSession({ id: 2, name: 'User', role: false });
const postData = await safeFetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
}, 1000, userSession);
*/

// Example 2: GET request after POST (will fetch fresh data once)
/*
const userData = await safeFetch('https://api.example.com/users', {}, 1000, userSession);
// This will bypass cache and fetch fresh data
*/

// Example 3: Another GET request (will use cache with timer)
/*
const userData2 = await safeFetch('https://api.example.com/users', {}, 1000, userSession);
// This will use cached data if within cache time
*/

// Example 4: PUT request (invalidates cache)
/*
const updateData = await safeFetch('https://api.example.com/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John Updated' })
}, 1000, userSession);
*/

// Example 5: DELETE request (invalidates cache)
/*
const deleteResult = await safeFetch('https://api.example.com/users/1', {
  method: 'DELETE'
}, 1000, userSession);
*/

// Example 6: Manual cache invalidation
/*
await invalidateEndpoint('https://api.example.com/users');
*/