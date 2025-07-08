'use client';
import React, { useState, useEffect } from 'react';
import Banner from './Components/UI/Banner';
import CardContainer from './Components/UI/Container/CardContainer';
import Loader from './Components/Loader/loader';

function Page() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchP = async () => {
      try {
        const res = await fetch('/api/getHome');
        const data = await res.json();
        console.log(data);
        setContent(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchP();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading || !content) {
    return <Loader />;
  }

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

export default Page;