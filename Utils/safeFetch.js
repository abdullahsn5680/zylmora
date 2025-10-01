

const DB_NAME = 'SafeFetchCache';
const STORE_NAME = 'responses';
const IMAGE_STORE_NAME = 'images';
const INVALIDATION_STORE_NAME = 'invalidations';
const CACHE_VERSION = 'v1';
const DEFAULT_CACHE_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
const DEFAULT_IMAGE_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours for images

// Storage thresholds
const INDEXEDDB_THRESHOLD = 50 * 1024; // 50KB - use IndexedDB for larger images
const MAX_LOCALSTORAGE_SIZE = 5 * 1024 * 1024; // 5MB localStorage limit
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB max image size

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3); // Increment version for image store
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create responses store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
      
      // Create images store if it doesn't exist
      if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
        const imageStore = db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'url' });
        imageStore.createIndex('expiry', 'expiry', { unique: false });
        imageStore.createIndex('size', 'size', { unique: false });
      }
      
      // Create invalidations store if it doesn't exist
      if (!db.objectStoreNames.contains(INVALIDATION_STORE_NAME)) {
        db.createObjectStore(INVALIDATION_STORE_NAME, { keyPath: 'endpoint' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      cleanupExpiredCache(db);
      cleanupExpiredImages(db);
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

function cleanupExpiredImages(db) {
  const tx = db.transaction(IMAGE_STORE_NAME, 'readwrite');
  const store = tx.objectStore(IMAGE_STORE_NAME);
  const now = Date.now();
  
  const request = store.openCursor();
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const { expiry } = cursor.value;
      if (expiry < now) {
        store.delete(cursor.key);
        // Also remove from localStorage if exists
        const localKey = `img_cache_${cursor.value.url}`;
        localStorage.removeItem(localKey);
      }
      cursor.continue();
    }
  };
}

// Helper function to estimate localStorage usage
function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length;
    }
  }
  return total * 2; // Each character takes 2 bytes in UTF-16
}

// Helper function to check if image should use localStorage or IndexedDB
function shouldUseLocalStorage(imageSize) {
  const currentSize = getLocalStorageSize();
  return (imageSize < INDEXEDDB_THRESHOLD && 
          (currentSize + imageSize) < MAX_LOCALSTORAGE_SIZE);
}

/**
 * Normalize URL by sorting query parameters and removing empty values
 */
function normalizeURL(url) {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams();
    
    const sortedParams = Array.from(urlObj.searchParams.entries())
      .filter(([key, value]) => value !== '')
      .sort(([a], [b]) => a.localeCompare(b));
    
    sortedParams.forEach(([key, value]) => {
      params.append(key, value);
    });
    
    urlObj.search = params.toString();
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

/**
 * Extract the base endpoint from a URL
 */
function getBaseEndpoint(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.origin + urlObj.pathname;
  } catch (error) {
    return url.split('?')[0];
  }
}
function shouldInvalidateKey(cacheKey, invalidatedEndpoints) {
  // Extract URL from cache key (format: "v1:url:options:responseType")
  const parts = cacheKey.split(':');
  if (parts.length < 2) return false;
  
  const cachedUrl = parts[1];
  const cachedBaseEndpoint = getBaseEndpoint(cachedUrl);
  
  // Check if this cached URL's base endpoint matches any invalidated endpoint
  return invalidatedEndpoints.includes(cachedBaseEndpoint);
}
/**
 * Check if URL is an image based on extension or content-type
 */
function isImageURL(url, contentType = '') {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  const urlLower = url.toLowerCase();
  const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
  const hasImageContentType = contentType.startsWith('image/');
  
  return hasImageExtension || hasImageContentType;
}

/**
 * Store image in localStorage
 */
function storeImageInLocalStorage(url, dataUrl, expiry, size) {
  try {
    const key = `img_cache_${url}`;
    const data = {
      dataUrl,
      expiry,
      size,
      cached: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Failed to store image in localStorage:', error);
    return false;
  }
}

/**
 * Get image from localStorage
 */
function getImageFromLocalStorage(url) {
  try {
    const key = `img_cache_${url}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    if (parsed.expiry < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.dataUrl;
  } catch (error) {
    console.warn('Failed to get image from localStorage:', error);
    return null;
  }
}

/**
 * Store image in IndexedDB
 */
async function storeImageInIndexedDB(url, dataUrl, expiry, size) {
  try {
    const db = await openDB();
    const tx = db.transaction(IMAGE_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IMAGE_STORE_NAME);
    
    await store.put({
      url,
      dataUrl,
      expiry,
      size,
      cached: Date.now()
    });
    
    return true;
  } catch (error) {
    console.warn('Failed to store image in IndexedDB:', error);
    return false;
  }
}

/**
 * Get image from IndexedDB
 */
async function getImageFromIndexedDB(url) {
  try {
    const db = await openDB();
    const tx = db.transaction(IMAGE_STORE_NAME, 'readonly');
    const store = tx.objectStore(IMAGE_STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(url);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiry > Date.now()) {
          resolve(result.dataUrl);
        } else {
          if (result) {
            // Clean up expired entry
            const deleteTx = db.transaction(IMAGE_STORE_NAME, 'readwrite');
            deleteTx.objectStore(IMAGE_STORE_NAME).delete(url);
          }
          resolve(null);
        }
      };
      
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.warn('Failed to get image from IndexedDB:', error);
    return null;
  }
}

/**
 * Get cached image from either localStorage or IndexedDB
 */
async function getCachedImage(url) {
  // First try localStorage (faster)
  const localImage = getImageFromLocalStorage(url);
  if (localImage) {
    return localImage;
  }
  
  // Then try IndexedDB
  const dbImage = await getImageFromIndexedDB(url);
  return dbImage;
}

/**
 * Cache image intelligently (localStorage for small, IndexedDB for large)
 */
async function cacheImage(url, blob, cacheTime = DEFAULT_IMAGE_CACHE_TIME) {
  try {
    const size = blob.size;
    
    // Skip caching if image is too large
    if (size > MAX_IMAGE_SIZE) {
      console.warn(`Image too large to cache: ${size} bytes`);
      return false;
    }
    
    // Convert blob to data URL
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    
    const expiry = Date.now() + cacheTime;
    
    // Decide storage method based on size and current usage
    if (shouldUseLocalStorage(size)) {
      const success = storeImageInLocalStorage(url, dataUrl, expiry, size);
      if (success) {
        console.log(`Image cached in localStorage: ${url} (${size} bytes)`);
        return true;
      }
    }
    
    // Fall back to IndexedDB for larger images or if localStorage fails
    const success = await storeImageInIndexedDB(url, dataUrl, expiry, size);
    if (success) {
      console.log(`Image cached in IndexedDB: ${url} (${size} bytes)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to cache image:', error);
    return false;
  }
}


async function markEndpointInvalidated(endpoint) {
  const db = await openDB();
  
  // Mark in invalidation store
  const invalidationTx = db.transaction(INVALIDATION_STORE_NAME, 'readwrite');
  const invalidationStore = invalidationTx.objectStore(INVALIDATION_STORE_NAME);
  
  await invalidationStore.put({
    endpoint,
    invalidatedAt: Date.now(),
    freshFetchCompleted: false
  });
  
  // Clear all cache entries that match this endpoint pattern
  const cacheTx = db.transaction(STORE_NAME, 'readwrite');
  const cacheStore = cacheTx.objectStore(STORE_NAME);
  
  const request = cacheStore.openCursor();
  let deletedCount = 0;
  
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const cacheKey = cursor.key;
      if (shouldInvalidateKey(cacheKey, [endpoint])) {
        cacheStore.delete(cursor.key);
        deletedCount++;
        console.log(`Invalidated cache key: ${cacheKey}`);
      }
      cursor.continue();
    } else {
      console.log(`Invalidated ${deletedCount} cache entries for endpoint: ${endpoint}`);
    }
  };
}

// Check and mark fresh fetch
async function checkAndMarkFreshFetch(endpoint) {
  const db = await openDB();
  const tx = db.transaction(INVALIDATION_STORE_NAME, 'readwrite');
  const store = tx.objectStore(INVALIDATION_STORE_NAME);
  
  return new Promise((resolve) => {
    const request = store.get(endpoint);
    
    request.onsuccess = () => {
      const result = request.result;
      
      if (result && !result.freshFetchCompleted) {
        // Mark as completed but don't remove the invalidation record yet
        store.put({
          ...result,
          freshFetchCompleted: true,
          completedAt: Date.now()
        });
        resolve(true);
      } else {
        // Check if invalidation is recent (within last 5 minutes)
        if (result && result.invalidatedAt && (Date.now() - result.invalidatedAt < 5 * 60 * 1000)) {
          resolve(true); // Still treat as needing fresh fetch
        } else {
          resolve(false);
        }
      }
    };
    
    request.onerror = () => resolve(false);
  });
}
// Cache read/write functions (existing)
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

// Response type detection and processing (existing functions)
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
    return 'text';
  }
}

async function processResponse(response, responseType) {
  switch (responseType) {
    case 'json':
      return await response.json();
    case 'text':
      return await response.text();
    case 'blob':
      const blob = await response.blob();
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

function reconstructData(cachedData) {
  if (cachedData && typeof cachedData === 'object' && cachedData.type) {
    switch (cachedData.type) {
      case 'blob':
        const byteCharacters = atob(cachedData.data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: cachedData.contentType });
      case 'arraybuffer':
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
 * Enhanced safeFetch with image caching support
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} cacheTime - Cache time in milliseconds
 * @param {Object} session - Session object with user information
 * @param {string} forceResponseType - Force a specific response type
 * @param {string} origin - Origin for relative URLs
 * @param {boolean} enableImageCache - Enable special image caching (default: auto-detect)
 * @returns {Promise} - Returns cached or fresh data
 */
export async function safeFetch(url, options = {}, cacheTime, session = null, forceResponseType = null, origin = '', enableImageCache = null) {
  const actualCacheTime = cacheTime !== undefined ? cacheTime : DEFAULT_CACHE_TIME;
  const isRelative = url.startsWith('/');
  const fullUrl = isRelative && origin ? origin + url : url;
  const normalizedUrl = normalizeURL(fullUrl);
  const method = (options.method || 'GET').toUpperCase();
  const baseEndpoint = getBaseEndpoint(normalizedUrl);
    const shouldBypassCache = session?.user?.role === true;
  console.log(`SafeFetch - URL: ${normalizedUrl}, Method: ${method}`);

  // Auto-detect if this is an image request
  const isImageRequest = enableImageCache === true || 
    (enableImageCache !== false && isImageURL(normalizedUrl));

  // Handle image requests with special caching
  if (isImageRequest && method === 'GET') {
    console.log('Image request detected, checking image cache');
    
    // Admin users always get fresh images
    if (!shouldBypassCache) {
      // Check image cache first for non-admin users
      const cachedImage = await getCachedImage(normalizedUrl);
      if (cachedImage) {
        console.log('Returning cached image');
        return cachedImage; // Return data URL directly
      }
    } else {
      console.log('Admin user - skipping image cache, fetching fresh image');
    }
    
    // Fetch fresh image
    console.log('Fetching fresh image');
    try {
      // Add cache-busting headers for admin users
      const imageOptions = shouldBypassCache ? {
        ...options,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      } : options;
      
      const response = await fetch(normalizedUrl, imageOptions);
      if (!response.ok) throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      
      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || '';
      
      // Verify it's actually an image
      if (contentType.startsWith('image/')) {
        // Cache the image only for non-admin users
        if (!shouldBypassCache) {
          await cacheImage(normalizedUrl, blob, actualCacheTime);
        } else {
          console.log('Admin user - image not cached to ensure freshness');
        }
        
        // Convert to data URL for immediate use
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        
        return dataUrl;
      } else {
        // Not actually an image, fall through to regular handling
        console.log('URL looked like image but content-type is:', contentType);
      }
    } catch (error) {
      console.error('Image fetch failed:', error);
      throw error;
    }
  }

  // Regular safeFetch logic (existing code)
  const key = `${CACHE_VERSION}:${normalizedUrl}:${JSON.stringify({...options, method})}:${forceResponseType || 'auto'}`;


  // Handle POST, PUT, DELETE requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    console.log(`${method} request detected - invalidating cache for endpoint: ${baseEndpoint}`);
    await markEndpointInvalidated(baseEndpoint);
    
    try {
      const response = await fetch(normalizedUrl, options);
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
    // For admin users, always mark endpoint as needing fresh fetch
    const needsFreshFetch = shouldBypassCache ? true : await checkAndMarkFreshFetch(baseEndpoint);
    
    if (needsFreshFetch) {
      const logMessage = shouldBypassCache 
        ? 'Admin user detected - forcing fresh data fetch'
        : 'Endpoint was invalidated - fetching fresh data once';
      console.log(logMessage);
      
      try {
        // Add cache-busting headers for admin users
        const freshOptions = shouldBypassCache ? {
          ...options,
          headers: {
            ...options.headers,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        } : options;
        
        const response = await fetch(normalizedUrl, freshOptions);
        if (!response.ok) throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        const responseType = forceResponseType || getResponseType(response);
        const data = await processResponse(response, responseType);
        
        // Only cache for non-admin users
        if (!shouldBypassCache) {
          await writeToCache(key, data, Date.now() + actualCacheTime);
          console.log(`Fresh data cached for ${actualCacheTime}ms`);
        } else {
          console.log('Admin user - data not cached to ensure freshness');
        }
        
        return reconstructData(data);
      } catch (error) {
        console.error('Fresh fetch failed:', error);
        throw error;
      }
    }
  }

  // Admin bypass logic - ALWAYS fetch fresh data for admin
  if (shouldBypassCache) {
    console.log('Admin user detected - fetching fresh data and invalidating cache');
    
    // For admin users, always invalidate the endpoint first to ensure fresh data
    await markEndpointInvalidated(baseEndpoint);
    
    try {
      // Add cache-busting headers to ensure fresh data from server
      const adminOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      };
      
      const response = await fetch(normalizedUrl, adminOptions);
      if (!response.ok) throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      const responseType = forceResponseType || getResponseType(response);
      const data = await processResponse(response, responseType);
      
      // Don't cache admin requests to ensure they always get fresh data
      console.log('Admin request completed - data not cached to ensure freshness');
      
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

  // Check cache for GET requests (skip cache check for admin users)
  if (method === 'GET' && !shouldBypassCache) {
    const cached = await readFromCache(key);
    if (cached) {
      console.log('Returning cached data');
      return reconstructData(cached);
    }
  } else if (method === 'GET' && shouldBypassCache) {
    console.log('Admin user - skipping cache check for fresh data');
  }

  console.log('No cached data found, fetching fresh data');

  // Add cache-busting headers for admin users
  const finalOptions = shouldBypassCache ? {
    ...options,
    headers: {
      ...options.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  } : options;

  const fetchPromise = fetch(normalizedUrl, finalOptions)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      const responseType = forceResponseType || getResponseType(res);
      const data = await processResponse(res, responseType);
      
      // Only cache for non-admin users
      if (method === 'GET' && !shouldBypassCache) {
        await writeToCache(key, data, Date.now() + actualCacheTime);
        console.log(`Data cached for ${actualCacheTime}ms`);
      } else if (shouldBypassCache) {
        console.log('Admin user - data not cached to ensure freshness');
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

/**
 * Specialized function for fetching images with caching
 * Returns data URL that can be used directly in img src or Next.js Image
 * Admin users always get fresh images
 */
export async function safeFetchImage(url, cacheTime = DEFAULT_IMAGE_CACHE_TIME, origin = '', session = null) {
  return safeFetch(url, {}, cacheTime, session, null, origin, true);
}

/**
 * Hook for React components to use cached images
 * Usage: const imageUrl = useCachedImage('/api/images/product.jpg', DEFAULT_IMAGE_CACHE_TIME, session);
 * Admin users will always get fresh images
 */
export function useCachedImage(url, cacheTime = DEFAULT_IMAGE_CACHE_TIME, session = null) {
  const [imageUrl, setImageUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!url) {
      setImageUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    safeFetchImage(url, cacheTime, '', session)
      .then(dataUrl => {
        setImageUrl(dataUrl);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
        console.error('Failed to load cached image:', err);
      });
  }, [url, cacheTime, session]);

  return { imageUrl, loading, error };
}

// Helper functions
export function createSession(user) {
  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  };
}

export async function invalidateEndpoint(url) {
  const baseEndpoint = getBaseEndpoint(url);
  await markEndpointInvalidated(baseEndpoint);
  console.log(`Cache invalidated for endpoint: ${baseEndpoint}`);
}

export async function clearEndpointCache(endpointPattern) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  const request = store.openCursor();
  let deletedCount = 0;
  
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const key = cursor.key;
      if (key.includes(endpointPattern)) {
        store.delete(key);
        deletedCount++;
      }
      cursor.continue();
    } else {
      console.log(`Cleared ${deletedCount} cache entries for pattern: ${endpointPattern}`);
    }
  };
}

/**
 * Clear image cache (both localStorage and IndexedDB)
 */
export async function clearImageCache(urlPattern = '') {
  // Clear from localStorage
  const keysToRemove = [];
  for (let key in localStorage) {
    if (key.startsWith('img_cache_') && key.includes(urlPattern)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Clear from IndexedDB
  const db = await openDB();
  const tx = db.transaction(IMAGE_STORE_NAME, 'readwrite');
  const store = tx.objectStore(IMAGE_STORE_NAME);
  
  let deletedCount = keysToRemove.length;
  
  const request = store.openCursor();
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      if (cursor.value.url.includes(urlPattern)) {
        store.delete(cursor.key);
        deletedCount++;
      }
      cursor.continue();
    } else {
      console.log(`Cleared ${deletedCount} image cache entries for pattern: ${urlPattern}`);
    }
  };
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  const db = await openDB();
  
  // Get regular cache stats
  const regularTx = db.transaction(STORE_NAME, 'readonly');
  const regularStore = regularTx.objectStore(STORE_NAME);
  const regularCount = await new Promise((resolve) => {
    const request = regularStore.count();
    request.onsuccess = () => resolve(request.result);
  });
  
  // Get image cache stats
  const imageTx = db.transaction(IMAGE_STORE_NAME, 'readonly');
  const imageStore = imageTx.objectStore(IMAGE_STORE_NAME);
  const imageCount = await new Promise((resolve) => {
    const request = imageStore.count();
    request.onsuccess = () => resolve(request.result);
  });
  
  // Calculate localStorage image cache
  let localStorageImages = 0;
  let localStorageSize = 0;
  for (let key in localStorage) {
    if (key.startsWith('img_cache_')) {
      localStorageImages++;
      localStorageSize += localStorage[key].length * 2;
    }
  }
  
  return {
    regularCache: regularCount,
    imageCache: {
      indexedDB: imageCount,
      localStorage: localStorageImages,
      localStorageSize: `${(localStorageSize / 1024 / 1024).toFixed(2)} MB`
    },
    totalEntries: regularCount + imageCount + localStorageImages
  };
}

// Usage Examples:

/*
// Example 1: Regular API calls (unchanged)
const userSession = createSession({ id: 1, name: 'Admin', role: true }); // Admin user
const products = await safeFetch('/api/products', {}, undefined, userSession); // Always fresh for admin

// Example 2: Image fetching with automatic caching
const adminSession = createSession({ id: 1, name: 'Admin', role: true });
const regularSession = createSession({ id: 2, name: 'User', role: false });

// Admin gets fresh image (not cached)
const adminImageDataUrl = await safeFetchImage('/api/images/product1.jpg', undefined, '', adminSession);

// Regular user gets cached image
const userImageDataUrl = await safeFetchImage('/api/images/product1.jpg', undefined, '', regularSession);

// Example 3: React Hook for images with admin support
function ProductCard({ productId, userSession }) {
  const { imageUrl, loading, error } = useCachedImage(`/api/images/${productId}.jpg`, undefined, userSession);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load image</div>;
  
  return <img src={imageUrl} alt="Product" />;
}

// Example 4: Next.js Image component with cached images and admin support
function ProductImage({ src, userSession }) {
  const { imageUrl, loading } = useCachedImage(src, undefined, userSession);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <Image
      src={imageUrl || '/placeholder.jpg'}
      alt="Product"
      width={300}
      height={200}
    />
  );
}

// Example 5: Admin user - all endpoints return fresh data
const adminSession = createSession({ id: 1, name: 'Admin', role: true });

// All these will fetch fresh data for admin (no cache used)
const adminProducts = await safeFetch('/api/products', {}, undefined, adminSession);
const adminImages = await safeFetch('/api/images/hero.jpg', {}, undefined, adminSession);
const adminUserData = await safeFetch('/api/users/profile', {}, undefined, adminSession);

// Example 6: Regular user - uses cache normally
const userSession = createSession({ id: 2, name: 'User', role: false });

// These will use cache if available
const userProducts = await safeFetch('/api/products', {}, undefined, userSession);
const userImages = await safeFetch('/api/images/hero.jpg', {}, undefined, userSession);

// Example 7: Admin making changes invalidates cache for all users
const adminSession = createSession({ id: 1, name: 'Admin', role: true });

// Admin updates product (this invalidates cache)
await safeFetch('/api/products/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated Product' })
}, undefined, adminSession);

// Next regular user request will get fresh data
const userSession = createSession({ id: 2, name: 'User', role: false });
const freshProducts = await safeFetch('/api/products', {}, undefined, userSession); // Fresh data due to invalidation

// Example 8: Clear cache for maintenance
await clearImageCache('product'); // Clears all cached images with 'product' in URL
await clearEndpointCache('products'); // Clears all cached API responses with 'products' in URL

// Example 9: Monitor cache usage
const stats = await getCacheStats();
console.log('Current cache usage:', stats);
// Output: { regularCache: 25, imageCache: { indexedDB: 15, localStorage: 8, localStorageSize: "2.3 MB" }, totalEntries: 48 }
*/