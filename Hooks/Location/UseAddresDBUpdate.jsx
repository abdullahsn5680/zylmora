'use client'
import React,{useContext} from 'react'
import { UserContext } from "@/app/Context/contextProvider";
import { useLoader } from '@/app/Provider/loader/loaderProvider';
import { useAlert } from '@/app/Provider/Alert/AlertProvider';
import { safeFetch } from '@/Utils/safeFetch';
function UseAddresDBUpdate() {
const {showLoader,hideLoader} =useLoader();
const {showAlert}=useAlert();
 const { session, user, setUser, status } = useContext(UserContext);
const Save = async (addresses) => {
    if(!addresses || addresses ==[] || addresses ==''){
      return
     }
    try {
      showLoader();
  
      const res = await safeFetch('/api/User', {
     
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Id: session?.user?.id,
          updateData: {
            address: addresses,
          },
        }),
      });
    
      const result =await  res
      hideLoader();
      
      if (!res) {
    
        showAlert.error('Unable to save address')
        return;
      }

      setUser(result.data);
      showAlert.success('Addresses updated!');
    } catch (error) {
      if(error.name !== "AbortError"){
      console.error('Failed to save:', error);
      showAlert.error('Something went wrong');}
      hideLoader();
    }
    
  };
 return {Save}
}

export default UseAddresDBUpdate
