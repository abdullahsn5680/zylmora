export const isrFetch=async(url)=>{

const baseUrl = process.env.NODE_ENV === "development" ? process.env.DEV_URL : process.env.PRODD_URL
const res = await fetch(`${baseUrl}${url}`);
const data = await res.json()
return data
}