"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import { Plus, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CollectionContext } from '@/app/Context/contextProvider';
import Loader from '@/app/Components/Loader/loader';

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
export default function UpdateProductClient()  {
  const [loading, setLoading] = useState(false);
  const [newDescriptionLine, setNewDescriptionLine] = useState('');
  const [categories] = useContext(CollectionContext);
 const router =useRouter()
  const  {session,status}=useContext(UserContext)
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
  const [product, setProduct] = useState({
    previewImgToDel:[],
    _id: '',
    title: '',
    price: '',
    cut_price: '',
    main_image: null,
    main_image_public_id: '',
    images: [],
    images_public_ids: [],
    sizes: [],
    category: '',
    subcategory: '',
    description: [],
    Vendor: '',
    Product_Type: '',
    discount: 0,
    sold: 0,
    stock: 0,
  });

  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [previewImgToDel,setPreviewImgToDel]=useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const params = useSearchParams();
  const id = params.get('product');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/Products?id=${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.product;
          setProduct({
            ...p,
            price: p.price.toString(),
            cut_price: p.cut_price.toString(),
            sizes: p.sizes.map((s) => s.size || s),
            description: p.description || [],
          });
          setPreviewMainImage(p.main_image);
          setPreviewImages(p.images);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

 
  const handleSubmit = async () => {
    const updated = {
      ...product,
      price: parseFloat(product.price),
      cut_price: parseFloat(product.cut_price),
      discount: calculateDiscount(),
      size: product.sizes.map((s) => ({ size: s })),
    };

    setLoading(true);
    try {
      const res = await fetch('/api/Products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Product updated successfully!');
      } else {
        alert(result.message || 'Error updating product');
      }
    } catch (error) {
      alert('Update failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProduct((prev) => ({ ...prev, main_image: reader.result }));
        setPreviewMainImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = reader.result;
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }));
        setPreviewImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = product.images.filter((_, i) => i !== indexToRemove);
  console.log(indexToRemove)
     const oldPublicIds = product.images_public_ids[indexToRemove]
     if(oldPublicIds!==undefined){
   setPreviewImgToDel(prev=>[...prev,oldPublicIds])
   product.previewImgToDel=[...previewImgToDel,oldPublicIds]
  }else{
    console.log('not public id')
   }
    const newPublicIds = product.images_public_ids?.filter((_, i) => i !== indexToRemove) || [];
    setProduct((prev) => ({
      ...prev,
      images: newImages,
      images_public_ids: newPublicIds,
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const addSize = () => {
    if (selectedSize && !product.sizes.includes(selectedSize)) {
      setProduct((prev) => ({
        ...prev,
        sizes: [...prev.sizes, selectedSize],
      }));
    }
  };

  const removeSize = (sizeToRemove) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove),
    }));
  };

  const calculateDiscount = () => {
    const price = parseFloat(product.price);
    const cutPrice = parseFloat(product.cut_price);
    if (!isNaN(price) && !isNaN(cutPrice) && price > 0) {
      return Math.round(((price - cutPrice) / price) * 100);
    }
    return 0;
  };

  const addDescriptionLine = () => {
    if (!newDescriptionLine.trim()) return;

    const nextId = product.description.length + 1;
    const updatedDescription = [
      ...product.description,
      { id: nextId, line: newDescriptionLine.trim() },
    ];

    setProduct((prev) => ({ ...prev, description: updatedDescription }));
    setNewDescriptionLine('');
  };

  const removeDescriptionLine = (id) => {
    const updatedDescription = product.description
      .filter((desc) => desc.id !== id)
      .map((desc, index) => ({ id: index + 1, line: desc.line }));

    setProduct((prev) => ({ ...prev, description: updatedDescription }));
  };

  const subcategories = categories.find((cat) => cat.name === product.category)?.subs || [];

  
  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white border-2 mt-5 border-gray-300 shadow-md rounded-2xl">
         <div className="mb-4">
  <button
    onClick={() => history.back()}
    className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
  >
    ← Back
  </button>
</div>

      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Edit Product</h1>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <input type="text" placeholder="Title" className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm" value={product.title} onChange={(e) => setProduct({ ...product, title: e.target.value })} />
        <input type="text" placeholder="Original Price" className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
        <input type="text" placeholder="Discounted Price" className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm" value={product.cut_price} onChange={(e) => setProduct({ ...product, cut_price: e.target.value })} />
        <div className="px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-300 text-gray-800 shadow-sm">
          Discount: <span className="font-semibold">{calculateDiscount()}%</span>
        </div>
        <select className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value, subcategory: '' })}>
          <option value="">Select Category</option>
          {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
        </select>
        <select className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm" value={product.subcategory} onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}>
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
        </select>
        <input type="text" placeholder="Vendor Name" className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm" value={product.Vendor} onChange={(e) => setProduct({ ...product, Vendor: e.target.value })} />
        <input type="text" placeholder="Product Type" className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm" value={product.Product_Type} onChange={(e) => setProduct({ ...product, Product_Type: e.target.value })} />
        <input type="number" placeholder="Stock" className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm w-full" value={product.stock} onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })} />


        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">Main Image</label>
          <input type="file" accept="image/*" className="border-2 border-gray-300 px-4 py-3 rounded-xl w-full shadow-sm" onChange={handleMainImageUpload} />
          {previewMainImage && <img src={previewMainImage} alt="Main" className="w-24 h-24 mt-3 rounded-lg border" />}
        </div>

   
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">More Images</label>
          <input type="file" accept="image/*" className="border-2 border-gray-300 px-4 py-3 rounded-xl w-full shadow-sm" onChange={addImage} />
          <div className="flex flex-wrap gap-3 mt-3">
            {previewImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} className="w-20 h-20 object-cover rounded-lg border" />
                <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">Sizes</label>
          <div className="flex gap-2 mb-3">
            <select className="border-2 border-gray-300 px-4 py-2 rounded-xl flex-1 shadow-sm" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              <option value="">Select Size</option>
              {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={addSize} className="bg-gray-800 text-white px-4 rounded-xl hover:bg-gray-900 shadow"><Plus size={16} /></button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s, i) => (
              <span key={i} className="flex items-center px-3 py-1 bg-gray-100 border-2 border-gray-300 rounded-full text-sm shadow-sm">
                {s}
                <button onClick={() => removeSize(s)} className="ml-2 text-red-500 hover:text-red-700"><X size={14} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2 mt-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Size Descriptions</label>
          <div className="flex gap-2 mb-3">
            <input type="text" placeholder="Add a new line..." className="border-2 border-gray-300 px-4 py-2 rounded-xl flex-1 shadow-sm" value={newDescriptionLine} onChange={(e) => setNewDescriptionLine(e.target.value)} />
            <button onClick={addDescriptionLine} className="bg-gray-800 text-white px-4 rounded-xl hover:bg-gray-900 shadow"><Plus size={16} /></button>
          </div>
          {product.description.map((data) => (
            <div className="flex items-start gap-2 text-sm py-1" key={data.id}>
              <p className="flex-1">{data.id === 1 ? data.line : `➤ ${data.line}`}</p>
              <button onClick={() => removeDescriptionLine(data.id)} className="text-red-500 hover:text-red-700"><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center mt-10">
        <button onClick={handleSubmit} className="bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-gray-900 shadow-lg">💾 Save Product</button>
      </div>
    </div>
  );
}