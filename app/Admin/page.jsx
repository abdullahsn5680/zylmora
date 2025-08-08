'use client';

import { useState, useEffect, useContext } from 'react';
import { CollectionContext } from '@/app/Context/contextProvider';
import { PlusCircle, Trash2 } from 'lucide-react';
import { UserContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
export default function AdminPage() {
  const router =useRouter();
  const [collections] = useContext(CollectionContext);
  const [bannerImage, setBannerImage] = useState(null);
  const [initialBannerImage, setInitialBannerImage] = useState(null);
  const MAX_PRODUCTS = 10;
  const [entries, setEntries] = useState([]);
  const {session,status} =useContext(UserContext)
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [categorySubMap, setCategorySubMap] = useState({});
    
  const isAdmin = session?.user?.role 
 useEffect(()=>{
  if(status !== "loading"){
    if(!session){
      router.replace('/Authentication')
    }
     if(!isAdmin){
      router.replace('/')
    }
}},[status])

  
  useEffect(() => {
    const extractCategorySub = () => {
      const catMap = {};
      const uniqueCats = new Set();
      collections.forEach(col => {
        if (col.name && col.subs?.length > 0) {
          uniqueCats.add(col.name);
          catMap[col.name] = col.subs;
        }
      });
      setUniqueCategories([...uniqueCats]);
      setCategorySubMap(catMap);
    };
    extractCategorySub();
  }, [collections]);

  useEffect(() => {
    const fetchExistingEntries = async () => {
      try {
        const res = await fetch('/api/HomePage');
        let data = { success: false, entries: [] };
        try {
          data = await res.json();
        } catch (e) {
          console.error('Failed to parse JSON:', e);
        }

        if (data.success && data.entries.length > 0) {
          const preloaded = await Promise.all(
            data.entries.map(async (entry) => {
              const res = await fetch(`/api/getCollectionsProducts?page=1&category=${entry.category}&subcategory=${entry.subcategory}`);
              const prodData = await res.json();
              const details = prodData.products.filter(p => entry.productIds.includes(p._id));
              return {
                selectedCategory: entry.category,
                selectedSubCategory: entry.subcategory,
                productOptions: prodData.products,
                selectedProductIds: entry.productIds,
                selectedProductDetails: details,
              };
            })
          );

          setBannerImage(data.entries[0].banner || null);
          setInitialBannerImage(data.entries[0].banner || null);
          setEntries(preloaded);
        } else {
          setEntries([{
            selectedCategory: '',
            selectedSubCategory: '',
            productOptions: [],
            selectedProductIds: [],
            selectedProductDetails: [],
          }]);
        }
      } catch (err) {
        console.error('Failed to fetch existing entries:', err);
      }
    };
    fetchExistingEntries();
  }, []);

  const fetchProducts = async (category, subcategory, entryIndex) => {
    try {
      const res = await fetch(`/api/getCollectionsProducts?page=1&category=${category}&subcategory=${subcategory}`);
      const data = await res.json();
      if (data.success) {
        const newEntries = [...entries];
        newEntries[entryIndex].productOptions = data.products;
        setEntries(newEntries);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    }
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];

    if (field === 'selectedCategory') {
      newEntries[index] = {
        selectedCategory: value,
        selectedSubCategory: '',
        productOptions: [],
        selectedProductIds: [],
        selectedProductDetails: [],
      };
    } else if (field === 'selectedSubCategory') {
      newEntries[index].selectedSubCategory = value;
      newEntries[index].productOptions = [];
      newEntries[index].selectedProductIds = [];
      newEntries[index].selectedProductDetails = [];
      fetchProducts(newEntries[index].selectedCategory, value, index);
    } else if (field === 'selectedProductId') {
      const alreadyAdded = newEntries[index].selectedProductIds.includes(value);
      const product = newEntries[index].productOptions.find(p => p._id === value);
      if (product && !alreadyAdded && newEntries[index].selectedProductIds.length < MAX_PRODUCTS) {
        newEntries[index].selectedProductIds.push(value);
        newEntries[index].selectedProductDetails.push(product);
      }
    }
    setEntries(newEntries);
  };

  const addNewEntry = () => {
    setEntries([...entries, {
      selectedCategory: '',
      selectedSubCategory: '',
      productOptions: [],
      selectedProductIds: [],
      selectedProductDetails: [],
    }]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const removeProduct = (entryIndex, productId) => {
    const newEntries = [...entries];
    newEntries[entryIndex].selectedProductIds = newEntries[entryIndex].selectedProductIds.filter(id => id !== productId);
    newEntries[entryIndex].selectedProductDetails = newEntries[entryIndex].selectedProductDetails.filter(p => p._id !== productId);
    setEntries(newEntries);
  };

  const perfromSave = async () => {
    const simplifiedEntries = entries.map(entry => ({
      category: entry.selectedCategory,
      subcategory: entry.selectedSubCategory,
      productIds: entry.selectedProductIds,
      banner: bannerImage || initialBannerImage,
    }));

    try {
      const res = await fetch('/api/HomePage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simplifiedEntries),
      });
      const data = await res.json();
      alert('Saved successfully.');
    } catch (err) {
      console.error(err);
      alert('Error saving entries.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-20">
      <h1 className="text-center text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="mb-10">
        <label className="block font-semibold mb-2">Upload Banner Image</label>
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBannerImage(reader.result);
            reader.readAsDataURL(file);
          }
        }} className="border p-2 rounded w-full" />
        {(bannerImage || initialBannerImage) && <img src={bannerImage || initialBannerImage} className="mt-2 rounded h-48 object-cover w-full" />}
      </div>

      {entries.map((entry, index) => (
        <div key={index} className="border p-4 rounded mb-6 bg-gray-50">
          <div className="flex justify-between mb-2">
            <h2 className="font-bold">Entry {index + 1}</h2>
            {entries.length > 1 && (
              <button onClick={() => removeEntry(index)} className="text-red-600">Remove</button>
            )}
          </div>

          <select className="border p-2 rounded w-full mb-2" value={entry.selectedCategory} onChange={e => handleEntryChange(index, 'selectedCategory', e.target.value)}>
            <option value="">Select Category</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {entry.selectedCategory && (
            <select className="border p-2 rounded w-full mb-2" value={entry.selectedSubCategory} onChange={e => handleEntryChange(index, 'selectedSubCategory', e.target.value)}>
              <option value="">Select Subcategory</option>
              {categorySubMap[entry.selectedCategory]?.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          )}

          {entry.selectedSubCategory && (
            <>
              <select className="border p-2 rounded w-full mb-4" onChange={e => handleEntryChange(index, 'selectedProductId', e.target.value)}>
                <option value="">Add Product (Max {MAX_PRODUCTS})</option>
                {entry.productOptions
                  .filter(p => !entry.selectedProductIds.includes(p._id))
                  .map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entry.selectedProductDetails.map(product => (
                  <div key={product._id} className="border rounded p-2 relative bg-white">
                    <p className="font-semibold">{product.title}</p>
                    <img src={product.main_image} alt={product.title} className="h-24 w-24 object-cover rounded mt-1" />
                    <p>Rs. {product.price} (Save {product.discount}%)</p>
                    <button onClick={() => removeProduct(index, product._id)} className="absolute top-1 right-1 text-sm text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button onClick={addNewEntry} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add More
        </button>

        <button onClick={perfromSave} className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Save Entries
        </button>
      </div>
    </div>
  );
}
