'use client';
import { safeFetch } from '@/Utils/safeFetch';
import { useEffect, useState } from 'react';
import Banner from '@/app/Components/UI/Banner';
import CardContainer from '@/app/Components/UI/Container/CardContainer';
import Loader from '@/app/Components/Loader/loader';
import { useRouter } from 'next/navigation';
export default function HomeClient() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      setLoading(true)
      const origin = window.location.origin;
     const fetch= async()=> {
      const data = await safeFetch(`/api/getHome`, {}, 3600000);
          if (data) {
            
          setContent(data)
          setLoading(false)
          }}
          fetch();
        } catch (err) {
          console.error('Error fetching collections:', err);
        }
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="md:px-[50px] px-2 w-full overflow-x-hidden">
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