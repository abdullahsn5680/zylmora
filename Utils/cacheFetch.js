
const memoryCache = {};


export async function cacheFetch(url) {

  if (memoryCache[url]) {
    return memoryCache[url];
  }

  const response = await fetch(url);
  const data = await response.json();


  memoryCache[url] = data;


  return data;
}
