'use client';

import { useState, useEffect, useContext } from 'react';
import { CollectionContext } from '@/app/Context/contextProvider';
import { PlusCircle, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { UserContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [collections] = useContext(CollectionContext);
  const [bannerImage, setBannerImage] = useState(null);
  const [initialBannerImage, setInitialBannerImage] = useState(null);
  const MAX_PRODUCTS = 10;
  const [entries, setEntries] = useState([]);
  const { session, status } = useContext(UserContext);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [categorySubMap, setCategorySubMap] = useState({});
    
  const isAdmin = session?.user?.role;

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.replace('/Authentication');
      }
      if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [status]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your homepage content and product showcases</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Banner Image</h2>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center gap-3">
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Click to upload banner image</span>
                <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setBannerImage(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} 
                className="hidden" 
              />
            </label>
          </div>
          
          {(bannerImage || initialBannerImage) && (
            <div className="mt-6">
              <img 
                src={bannerImage || initialBannerImage} 
                className="rounded-lg h-64 object-cover w-full shadow-md" 
                alt="Banner preview"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex justify-between items-center">
                <h2 className="font-bold text-white text-lg">Entry {index + 1}</h2>
                {entries.length > 1 && (
                  <button 
                    onClick={() => removeEntry(index)} 
                    className="text-red-400 hover:text-red-300 font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none" 
                    value={entry.selectedCategory} 
                    onChange={e => handleEntryChange(index, 'selectedCategory', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {entry.selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                    <select 
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none" 
                      value={entry.selectedSubCategory} 
                      onChange={e => handleEntryChange(index, 'selectedSubCategory', e.target.value)}
                    >
                      <option value="">Select Subcategory</option>
                      {categorySubMap[entry.selectedCategory]?.map((sub, i) => (
                        <option key={i} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}

                {entry.selectedSubCategory && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Products ({entry.selectedProductIds.length}/{MAX_PRODUCTS})
                      </label>
                      <select 
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none" 
                        onChange={e => handleEntryChange(index, 'selectedProductId', e.target.value)}
                      >
                        <option value="">Add Product</option>
                        {entry.productOptions
                          .filter(p => !entry.selectedProductIds.includes(p._id))
                          .map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                      </select>
                    </div>

                    {entry.selectedProductDetails.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Selected Products</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {entry.selectedProductDetails.map(product => (
                            <div key={product._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                              <div className="flex gap-4">
                                <img 
                                  src={product.main_image} 
                                  alt={product.title} 
                                  className="h-24 w-24 object-cover rounded-lg flex-shrink-0" 
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate mb-1">{product.title}</p>
                                  <p className="text-lg font-bold text-gray-900">Rs. {product.price}</p>
                                  <p className="text-sm text-green-600">Save {product.discount}%</p>
                                </div>
                                <button 
                                  onClick={() => removeProduct(index, product._id)} 
                                  className="text-red-500 hover:text-red-700 transition-colors h-fit"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
          <button 
            onClick={addNewEntry} 
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" /> 
            Add More Entry
          </button>

          <button 
            onClick={perfromSave} 
            className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" /> 
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}