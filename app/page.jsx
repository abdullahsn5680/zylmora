
import { isrFetch } from "@/Utils/isrFetch";
import HomeClient from "./HomeClient"

export const revalidate = 3600;

export default async function Page() {

const data = await isrFetch('/api/getHome',3600)

  return <HomeClient content={data} />;
}