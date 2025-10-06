
import HomeClient from "./HomeClient"

export const revalidate = 3600;          


export default async function Page() {
   const baseUrl = process.env.NODE_ENV === "development" ? process.env.DEV_URL :  process.env.PRODD_URL 
  const res = await fetch(`${baseUrl}/api/getHome`);
  const data = await res.json();
  return <HomeClient content={data} />;
}