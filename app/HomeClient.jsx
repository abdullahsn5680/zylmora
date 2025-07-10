'use client';

import { useEffect, useState, useRef } from 'react';
import { safeFetch } from '@/Utils/safeFetch';
import Banner from './Components/UI/Banner';
import CardContainer from './Components/UI/Container/CardContainer';

export default function HomeClient() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      const lastFetched = localStorage.getItem('home_fetched_at');
      const now = Date.now();

     
      if (hasFetchedRef.current || (lastFetched && now - lastFetched < 3600 * 1000)) {
        console.log('⚡️ Using cached data (no re-fetch)');
        setLoading(false);
        return;
      }

      hasFetchedRef.current = true;

      try {
        const origin = window.location.origin;
        const data = await fetch(`/api/getHome`);
        if (!data) throw new Error('Empty data');

        localStorage.setItem('home_fetched_at', now.toString());
        setContent(data);
      } catch (err) {
        console.error('❌ Failed to load content:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="p-4 text-lg">Loading...</div>;
  if (!content) return <div className="p-4 text-red-500">No content available.</div>;

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
