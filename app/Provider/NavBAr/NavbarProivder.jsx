import { isrFetch } from '@/Utils/isrFetch';
import NavbarClient from './NavBarClient'

export const revalidate = 36000;

async function NavbarProivder() {

  const data = await isrFetch(`/api/collections`);


  const categories = data.collections;

 
  return (
    <NavbarClient categories={categories}/>
  )
}

export default NavbarProivder;
