import HomeClient from './HomeClient';
import { headers } from 'next/headers';

export const revalidate = 3600;
export const metadata = {
  title: "Zylmora – Home",
  description: "Shop stylish shirts, trousers, and accessories at Zylmora. High-quality fashion with fast delivery and trusted service.",
};
export default async function Page() {

  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/getHome`, {
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  return <HomeClient content={data} />;
}
