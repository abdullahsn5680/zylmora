"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import { Plus, X, Upload, Tag, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CollectionContext } from '@/app/Context/contextProvider';
import Loader from '@/app/Components/Loader/loader';

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
const MAX_IMAGE_SIZE = 100 * 1024; // 100KB

// Image compression utility
const compressImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Reduce dimensions if too large
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress with quality reduction if needed
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        while (dataUrl.length > MAX_IMAGE_SIZE && quality > 0.3) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        if (dataUrl.length > MAX_IMAGE_SIZE) {
          reject(new Error(`Image too large even after compression (${(dataUrl.length / 1024).toFixed(2)}KB)`));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function UpdateProductClient() {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [newDescriptionLine, setNewDescriptionLine] = useState('');
  const [categories] = useContext(CollectionContext);
  const router = useRouter();
  const { session, status } = useContext(UserContext);
  const isAdmin = session?.user?.role;
  const [loadingState, setLoadingState] = useState('idle'); // idle, fetching, saving

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

  const [product, setProduct] = useState({
    previewImgToDel: [],
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
  const [previewImgToDel, setPreviewImgToDel] = useState([]);
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

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageError('');
      try {
        const compressedImage = await compressImage(file);
        setProduct((prev) => ({ ...prev, main_image: compressedImage }));
        setPreviewMainImage(compressedImage);
      } catch (error) {
        setImageError(error.message);
      }
    }
  };

  const addImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageError('');
      try {
        const compressedImage = await compressImage(file);
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, compressedImage],
        }));
        setPreviewImages((prev) => [...prev, compressedImage]);
      } catch (error) {
        setImageError(error.message);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = product.images.filter((_, i) => i !== indexToRemove);
    const oldPublicIds = product.images_public_ids[indexToRemove];
    if (oldPublicIds !== undefined) {
      setPreviewImgToDel((prev) => [...prev, oldPublicIds]);
      product.previewImgToDel = [...previewImgToDel, oldPublicIds];
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 transition-all"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 md:px-10 py-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white">✨ Edit Product</h1>
            <p className="text-indigo-100 mt-2">Update your product details and showcase</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            {/* Error Message */}
            {imageError && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-900">Image Error</p>
                  <p className="text-red-700 text-sm">{imageError}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Tag size={24} className="text-indigo-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Product Title"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Original Price"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Discounted Price"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.cut_price}
                  onChange={(e) => setProduct({ ...product, cut_price: e.target.value })}
                />
                <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Discount</span>
                  <span className="text-2xl font-bold text-green-600">{calculateDiscount()}%</span>
                </div>
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value, subcategory: '' })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.subcategory}
                  onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Vendor Name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.Vendor}
                  onChange={(e) => setProduct({ ...product, Vendor: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Product Type"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.Product_Type}
                  onChange={(e) => setProduct({ ...product, Product_Type: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={product.stock}
                  onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Images */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon size={24} className="text-indigo-600" />
                Images (Max 100KB per image)
              </h2>

              {/* Main Image */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Main Image</label>
                <div className="relative border-2 border-dashed border-indigo-300 rounded-xl p-6 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleMainImageUpload}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto text-indigo-500 mb-2" size={32} />
                    <p className="text-gray-700 font-medium">Click to upload main image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 100KB</p>
                  </div>
                </div>
                {previewMainImage && (
                  <div className="mt-4">
                    <img src={previewMainImage} alt="Main" className="h-40 w-40 object-cover rounded-lg shadow-md border-2 border-gray-200" />
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Additional Images</label>
                <div className="relative border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50 hover:bg-blue-100 transition-colors mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={addImage}
                  />
                  <div className="text-center">
                    <Plus className="mx-auto text-blue-500 mb-2" size={32} />
                    <p className="text-gray-700 font-medium">Click to add more images</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 100KB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img} className="w-full h-32 object-cover rounded-lg shadow-md border-2 border-gray-200" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📏 Available Sizes
              </h2>
              <div className="flex gap-2 mb-4">
                <select
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={18} /> Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s, i) => (
                  <span
                    key={i}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 border-2 border-indigo-300 rounded-full text-sm font-semibold text-indigo-700 shadow-sm"
                  >
                    {s}
                    <button
                      onClick={() => removeSize(s)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📝 Description Points
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add a feature or description..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  value={newDescriptionLine}
                  onChange={(e) => setNewDescriptionLine(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addDescriptionLine()}
                />
                <button
                  onClick={addDescriptionLine}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={18} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {product.description.map((data) => (
                  <div key={data.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <p className="text-gray-700">
                      <span className="font-semibold text-indigo-600">{data.id === 1 ? '•' : '◦'}</span>
                      <span className="ml-2">{data.line}</span>
                    </p>
                    <button
                      onClick={() => removeDescriptionLine(data.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-6 border-t-2 border-gray-100">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-4 rounded-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold text-lg flex items-center gap-2"
              >
                💾 Save Product Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}