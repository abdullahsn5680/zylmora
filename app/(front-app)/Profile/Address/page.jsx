'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Trash, Pencil, Check, X, ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import Loader from '@/app/Components/Loader/loader';
export default function AddressManager() {
  const router = useRouter();
  const { session } = useContext(UserContext)
  const {user, setUser} = useContext(UserContext);
  const [laoding,setLoading]=useState(true)
  const [addresses, setAddresses] = useState([]);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [editedAddress, setEditedAddress] = useState('');

  useEffect(() => {
    if (user?.address) {
      setAddresses(Array.isArray(user.address) ? user.address : []);
    
    }
  }, [user]);
useEffect(()=>{
    if(!session){
      router.replace('/Authentication')
    }
    
  },[])
  const addAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses([...addresses, newAddress.trim()]);
    setNewAddress('');
  };

  const deleteAddress = (index) => {
    if (addresses.length === 1) return alert('At least one address required.');
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
    if (index === defaultIndex) setDefaultIndex(0);
  };

  const saveEdited = (index) => {
    const updated = [...addresses];
    updated[index] = editedAddress.trim();
    setAddresses(updated);
    setEditingIndex(null);
  };

  const handleSaveToDB = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/User', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Id: session?.user?.id,
          updateData: {
            address: addresses,
          },
        }),
      });

      const result = await res.json();
          setLoading(false)
      if (!res.ok) {
        alert(result.message || 'Failed to save');
        return;
      }

      setUser(result.data);
      alert('Addresses updated!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Something went wrong.');
    }
  };
  useEffect(() => {
    setTimeout(() => {
    setLoading(false)  
    },1000);
    
  }, []);
if(laoding) return <Loader/>;
  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm mb-4 text-gray-700 hover:underline"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Manage Addresses</h2>

      <div className="space-y-4">
        {addresses.map((addr, index) => (
          <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
            {editingIndex === index ? (
              <>
                <textarea
                  className="w-full p-2 border rounded"
                  value={editedAddress}
                  onChange={(e) => setEditedAddress(e.target.value)}
                />
                <div className="flex justify-end mt-2 gap-2">
                  <button className="text-green-600" onClick={() => saveEdited(index)}>
                    <Check />
                  </button>
                  <button className="text-gray-500" onClick={() => setEditingIndex(null)}>
                    <X />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm mb-2">
                  {addr}
                  {index === defaultIndex && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-200 text-green-800 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  {index !== defaultIndex && (
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setDefaultIndex(index)}
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    className="text-xs text-yellow-600 hover:underline"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditedAddress(addr);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => deleteAddress(index)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Add New Address</h3>
        <textarea
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter new address"
        />
        <button
          onClick={addAddress}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Add Address
        </button>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSaveToDB}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Save size={16} />
          Save to Changes
        </button>
      </div>
    </div>
  );
}
