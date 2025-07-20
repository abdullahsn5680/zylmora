"use client";

import React, { useState, useEffect,useContext } from 'react';
import { useRouter } from 'next/navigation'; 
import Loader from '@/app/Components/Loader/loader';
import { UserContext } from '@/app/Context/contextProvider';
function ProductsTablePage() {
  const router = useRouter();
  const [loader,setloader]=useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const  {session}=useContext(UserContext)
const isAdmin = session?.user?.role 
 useEffect(()=>{
    if(!session){
      router.replace('/Authentication')
    }
     if(!isAdmin){
      router.replace('/')
    }
  },[])
  useEffect(() => {
    if (!isSearching) {
      fetchProducts();
    }
  }, [isSearching]);

  const fetchProducts = async () => {
    try {
      setloader(true)
      const res = await fetch('/api/searchProducts');
      const data = await res.json();
      setTimeout(() => {
         setloader(false)
      }, 500);
        console.log(data)
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleSearch = async () => {
    setloader(true)
    const trimmed = search.trim();
    if (!trimmed) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(`/api/searchProducts?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
        setTimeout(() => {
         setloader(false)
      }, 500);
      if (data.success) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setProducts([]);
    }
  };

  const confirmDelete = async () => {
    try {
      setloader(true)
      const res = await fetch(`/api/Products?id=${deleteProductId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== deleteProductId));
      } else {
        alert('Delete failed: ' + data.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteProductId(null);
    }
      setTimeout(() => {
         setloader(false)
      }, 500);
  };

  const calculateDiscount = (price, cut_price) => {
    return Math.round(((price - cut_price) / price) * 100);
  };
if(loader) return <Loader/>
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      <div className="mb-4">
        <button
          onClick={() => history.back()}
          className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">All Products</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search product by name..."
          className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-800 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-5 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 shadow"
        >
          Search
        </button>
      </div>

      {isSearching && products.length === 0 && (
        <p className="text-center text-gray-500 mb-4">No results found for "{search}"</p>
      )}

      <div className="overflow-x-auto rounded-xl border-2 border-gray-300 shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subcategory</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cut Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Discount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sold</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Remaining</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length ? (
              products.map((product) => (
                <tr key={product._id} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.image || product.main_image}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-md border"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{product.title}</td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-gray-600">{product.subcategory}</td>
                  <td className="px-6 py-4 text-gray-800">Rs.{product.price}</td>
                  <td className="px-6 py-4 text-gray-800">Rs.{product.cut_price}</td>
                  <td className="px-6 py-4 text-red-500 font-semibold">
                    {calculateDiscount(product.price, product.cut_price)}%
                  </td>
                  <td className="px-6 py-4">{product.sold}</td>
                  <td className="px-6 py-4">{product.stock - product.sold}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      onClick={() => { const Query = new URLSearchParams({
       product:product._id,
      });

         router.push(`/Admin/UpdateProduct?${Query.toString()}`)}} 
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteProductId(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-10 text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Are you sure?</h2>
            <p className="text-gray-600 mb-6">Do you really want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteProductId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsTablePage;
