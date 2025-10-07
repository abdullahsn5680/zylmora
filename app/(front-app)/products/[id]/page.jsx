import { isrFetch } from '@/Utils/isrFetch';
import ProductPage from '../Productpage';


export const revalidate = 3600; 


export const dynamicParams = true; 


export async function generateStaticParams() {
 
  return [];
}

export default async function Page({ params }) {
  const {id} = await params;
  const { product } = await isrFetch(`/api/Products?id=${id}`,3600);
 
    const Query = new URLSearchParams({
        category: product.category,
        subcategory: product.subcategory,
      });
  const reviews = await isrFetch(`/api/Review?pid=${id}`,3600);
  const {products}= await isrFetch(`/api/RelatedProducts/?${Query.toString()}`,3600);

  return <ProductPage product={product}  reviews={reviews} relatedProducts={products}/>;
}
