export const isrFetch = async (url,time) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.DEV_URL
      : process.env.PRODD_URL;

  const res = await fetch(`${baseUrl}${url}`, {
    
    next: { revalidate: time },
  });

  if (!res) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
};
