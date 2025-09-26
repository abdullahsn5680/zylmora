'use client';
import { safeFetch } from '@/Utils/safeFetch';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Context/contextProvider';
import Banner from '@/app/Components/UI/Banner';
import CardContainer from '@/app/Components/UI/Container/CardContainer';
import Loader from '@/app/Components/Loader/loader';
import { LoaderContext } from '@/app/Context/contextProvider';
import { FilterContext } from './Context/contextProvider';
export default function HomeClient() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useContext(LoaderContext)
  const {session}=useContext(UserContext)
 
    const {
       selectedCategory,
            setSelectedCategory,
            selectedSubCategory,
            setSelectedSubCategory,
            selectedSizes,
            setSelectedSizes,
            selectedSortBy,
            setSelectedSortBy,
            selectedMinPrice,
            setSelectedMinPrice,
            selectedHighPrice,
            setSelectedHighPrice,
    } = useContext(FilterContext);
    useEffect(()=>{
setSelectedCategory('');
setSelectedSubCategory('');
setSelectedHighPrice('');
setSelectedMinPrice('');
setSelectedSizes('');
setSelectedSortBy('');
    },[])
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
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 w-full overflow-x-hidden">
  <div className="banner w-full">
    <Banner url={content?.banner_Url} />
  </div>
  <div className="containers w-full px-1 md:px-[50px] py-8">
    {content?.Items?.map((data) => (
      <CardContainer key={data.id} prop={data} />
    ))}
  </div>
</div>
  );
}