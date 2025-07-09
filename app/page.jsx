// ✅ Revalidate every 1 hour
export const revalidate = 3600;

import Banner from './Components/UI/Banner';
import CardContainer from './Components/UI/Container/CardContainer';
import { headers } from 'next/headers';

async function getData() {
  const time = new Date().toLocaleTimeString();
  console.log(`🧠 [Server] Page rendered at: ${time}`);

  // Dynamically detect base URL
  const host = headers().get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  // ✅ Remove revalidate from fetch (you already use `export const revalidate`)
  const res = await fetch(`${baseUrl}/api/getHome`);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function HomePage() {
  const content = await getData();

  return (
    <div className="md:px-[50px] px-1 w-full overflow-x-hidden">
      <div className="banner w-full">
        <Banner url={content.banner_Url} />
      </div>
      <div className="conatiners w-full">
        {content.Items.map((data) => (
          <CardContainer key={data.id} prop={data} />
        ))}
      </div>
    </div>
  );
}
