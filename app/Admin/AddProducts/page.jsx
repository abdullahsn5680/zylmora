'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { CollectionContext } from '@/app/Context/contextProvider';
import { UserContext } from '@/app/Context/contextProvider';
function AddProductPage() {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    cut_price: '',
    main_image: null,
    images: [],
    sizes: [],
    category: '',
    Vendor: '',
    subcategory: '',
    description: [],
    discount:0,
  });
  const router =useRouter()
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
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [categories, setCatagories] = useContext(CollectionContext)
  const [newDescriptionLine, setNewDescriptionLine] = useState('');
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProduct({ ...product, main_image: reader.result });
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
        setProduct({ ...product, images: [...product.images, reader.result] });
        setPreviewImages([...previewImages, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSize = () => {
    if (selectedSize && !product.sizes.includes(selectedSize)) {
      setProduct({ ...product, sizes: [...product.sizes, selectedSize] });
    }
  };

  const removeSize = (sizeToRemove) => {
    setProduct({ ...product, sizes: product.sizes.filter((s) => s !== sizeToRemove) });
  };

  const calculateDiscount = () => {
    const price = parseFloat(product.price);
    const cutPrice = parseFloat(product.cut_price);
    if (!isNaN(price) && !isNaN(cutPrice) && price > 0) {
    
      return Math.round(((price - cutPrice) / price) * 100);
    }
    return 0;
  };

  useEffect(() => {
  const price = parseFloat(product.price);
  const cutPrice = parseFloat(product.cut_price);

  if (!isNaN(price) && !isNaN(cutPrice) && price > 0) {
    const discount = Math.round(((price - cutPrice) / price) * 100);
    setProduct(prev => ({ ...prev, discount }));
  } else {
    setProduct(prev => ({ ...prev, discount: 0 }));
  }
}, [product.price, product.cut_price]);

  const prepareSizes = () =>
    product.sizes.map((size, index) => ({ id: index + 1, size }));

  const handleSubmit = async () => {
    try {
      const formattedProduct = {
        ...product,
        sizes: prepareSizes(),
      };

      const res = await fetch('/api/Products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProduct),
      });

      const data = await res.json();
      if (!data.success) {
        if(data.message =="Product already exists with the same title, vendor, category, and subcategory."){
            alert("Product already exists with the same title, vendor, category, and subcategory.")
            return
        }
        alert('Failed to save product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving to DB.');
    }
  };


  const addDescriptionLine = () => {
    if (!newDescriptionLine.trim()) return;

    const nextId = product.description.length + 1;
    const updatedDescription = [
      ...product.description,
      { id: nextId, line: newDescriptionLine.trim() },
    ];

    setProduct({ ...product, description: updatedDescription });
    setNewDescriptionLine('');
  };

  const removeDescriptionLine = (id) => {
    const updatedDescription = product.description
      .filter((desc) => desc.id !== id)
      .map((desc, index) => ({ id: index + 1, line: desc.line }));

    setProduct({ ...product, description: updatedDescription });
  };

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

      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Add New Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Title"
          className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Vendor Name"
          className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm"
          value={product.Vendor}
          onChange={(e) => setProduct({ ...product, Vendor: e.target.value })}
        />

        <input
          type="text"
          placeholder="Original Price"
          className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />

        <input
          type="text"
          placeholder="Discounted Price"
          className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm"
          value={product.cut_price}
          onChange={(e) => setProduct({ ...product, cut_price: e.target.value })}
        />

        <div className="px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-300 text-gray-800 shadow-sm">
          Discount: <span className="font-semibold">{calculateDiscount()}%</span>
        </div>

        <select
          className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value, subcategory: '' })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select
          className="border-2 border-gray-300 px-4 py-3 rounded-xl shadow-sm"
          value={product.subcategory}
          onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
        >
          <option value="">Select Subcategory</option>
          {(categories.find((cat) => cat.name === product.category)?.subs || []).map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">Main Image</label>
          <input
            type="file"
            accept="image/*"
            className="border-2 border-gray-300 px-4 py-3 rounded-xl w-full shadow-sm"
            onChange={handleMainImageUpload}
          />
          {previewMainImage && (
            <img src={previewMainImage} alt="Main Preview" className="w-24 h-24 object-cover mt-3 rounded-lg border-2 border-gray-300" />
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">More Images</label>
          <input
            type="file"
            accept="image/*"
            className="border-2 border-gray-300 px-4 py-3 rounded-xl w-full shadow-sm"
            onChange={addImage}
          />
          <div className="flex gap-3 flex-wrap mt-3">
            {previewImages.map((img, index) => (
              <img key={index} src={img} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300" />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">Sizes</label>
          <div className="flex gap-2 mb-3">
            <select
              className="border-2 border-gray-300 px-4 py-2 rounded-xl flex-1 shadow-sm"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select Size</option>
              {sizeOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={addSize}
              className="bg-gray-800 text-white px-4 rounded-xl hover:bg-gray-900 shadow"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s, i) => (
              <span key={i} className="flex items-center px-3 py-1 bg-gray-100 border-2 border-gray-300 rounded-full text-sm shadow-sm">
                {s}
                <button onClick={() => removeSize(s)} className="ml-2 text-red-500 hover:text-red-700">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">Size Descriptions</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a new line..."
              className="border-2 border-gray-300 px-4 py-2 rounded-xl flex-1 shadow-sm"
              value={newDescriptionLine}
              onChange={(e) => setNewDescriptionLine(e.target.value)}
            />
            <button
              onClick={addDescriptionLine}
              className="bg-gray-800 text-white px-4 rounded-xl hover:bg-gray-900 shadow"
            >
              <Plus size={16} />
            </button>
          </div>
          {product.description.map((data) => (
            <div className="flex items-start gap-2 text-sm py-1" key={data.id}>
              {data.id === 1 ? (
                <p className="flex-1 pt-2 pb-5">{data.line}</p>
              ) : (
                <p className="flex-1">➤ {data.line}</p>
              )}
              <button
                onClick={() => removeDescriptionLine(data.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          className="bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-gray-900 shadow-lg"
        >
          💾 Save Product
        </button>
      </div>
    </div>
  );
}

export default AddProductPage;
