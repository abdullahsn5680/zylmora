'use client';
import { safeFetch } from '@/Utils/safeFetch';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Context/contextProvider';
import Banner from '@/app/Components/UI/Banner';
import CardContainer from '@/app/Components/UI/Container/CardContainer';
import Loader from '@/app/Components/Loader/loader';

export default function HomeClient() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const {session}=useContext(UserContext)
  useEffect(() => {
    try {
      setLoading(true)
   
     const fetch= async()=> {
      const data = await safeFetch(`/api/getHome`, {}, 3600000,session);
          if (data) {
            
          setContent(data)
          setLoading(false)
          }}
          if(session){
          fetch();}else{
            setTimeout(()=>{
              fetch()

            },500)
          }
        } catch (err) {
          console.error('Error fetching collections:', err);
        }
  }, [session]);

  if (loading) return <Loader />;

  return (
    <div className="md:px-[50px]  w-full overflow-x-hidden">
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