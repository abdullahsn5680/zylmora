'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CollectionContext } from '@/app/Context/contextProvider';
import { UserContext } from '@/app/Context/contextProvider';

function AddProductPage() {
  const initialProductState = {
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
    discount: 0,
  };

  const [product, setProduct] = useState(initialProductState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { session, status } = useContext(UserContext);
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

  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [categories, setCatagories] = useContext(CollectionContext);
  const [newDescriptionLine, setNewDescriptionLine] = useState('');
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100KB = 102400 bytes)
      if (file.size > 102400) {
        alert('Image size must be less than 100KB. Please choose a smaller image or compress it.');
        e.target.value = ''; // Reset input
        return;
      }
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
      // Check file size (100KB = 102400 bytes)
      if (file.size > 102400) {
        alert('Image size must be less than 100KB. Please choose a smaller image or compress it.');
        e.target.value = ''; // Reset input
        return;
      }
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
      setSelectedSize('');
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

  const clearForm = () => {
    setProduct(initialProductState);
    setPreviewMainImage(null);
    setPreviewImages([]);
    setSelectedSize('');
    setNewDescriptionLine('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
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
        if (data.message == "Product already exists with the same title, vendor, category, and subcategory.") {
          alert("Product already exists with the same title, vendor, category, and subcategory.");
          return;
        }
        alert('Failed to save product.');
      } else {
        alert('Product saved successfully!');
        clearForm();
      }
    } catch (err) {
      console.error(err);
      alert('Error saving to DB.');
    } finally {
      setIsLoading(false);
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

  const isFormValid = () => {
    return product.title && product.price && product.cut_price && product.category && product.Vendor && product.main_image;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => history.back()}
            disabled={isLoading}
            className="text-sm px-5 py-2.5 bg-white hover:bg-gray-50 rounded-lg text-gray-700 shadow-sm border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            <p className="text-gray-300 mt-1">Fill in the details to add a new product to your inventory</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Product Title *</label>
                <input
                  type="text"
                  placeholder="Enter product title"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Vendor Name *</label>
                <input
                  type="text"
                  placeholder="Enter vendor name"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  value={product.Vendor}
                  onChange={(e) => setProduct({ ...product, Vendor: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Category *</label>
                <select
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value, subcategory: '' })}
                  disabled={isLoading}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Subcategory</label>
                <select
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  value={product.subcategory}
                  onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
                  disabled={isLoading || !product.category}
                >
                  <option value="">Select Subcategory</option>
                  {(categories.find((cat) => cat.name === product.category)?.subs || []).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Original Price *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Discounted Price */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Discounted Price *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  value={product.cut_price}
                  onChange={(e) => setProduct({ ...product, cut_price: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Discount Display */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 px-6 py-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Calculated Discount:</span>
                    <span className="text-2xl font-bold text-green-600">{calculateDiscount()}%</span>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Main Product Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="main-image"
                    onChange={handleMainImageUpload}
                    disabled={isLoading}
                  />
                  <label htmlFor="main-image" className="cursor-pointer">
                    {previewMainImage ? (
                      <img src={previewMainImage} alt="Main Preview" className="w-32 h-32 object-cover mx-auto rounded-lg border-2 border-gray-300" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-gray-600 font-medium">Click to upload main image</span>
                        <span className="text-gray-400 text-sm mt-1">PNG, JPG up to 100kb</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Additional Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Additional Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="additional-images"
                    onChange={addImage}
                    disabled={isLoading}
                  />
                  <label htmlFor="additional-images" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-gray-600 font-medium">Click to add more images</span>
                    </div>
                  </label>
                </div>
                {previewImages.length > 0 && (
                  <div className="flex gap-3 flex-wrap mt-4">
                    {previewImages.map((img, index) => (
                      <img key={index} src={img} alt="Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow-sm" />
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Available Sizes</label>
                <div className="flex gap-2 mb-3">
                  <select
                    className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Select Size</option>
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={addSize}
                    disabled={isLoading || !selectedSize}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s, i) => (
                    <span key={i} className="flex items-center px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-medium shadow-sm">
                      {s}
                      <button onClick={() => removeSize(s)} className="ml-2 text-red-500 hover:text-red-700" disabled={isLoading}>
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Size & Product Descriptions</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a description line..."
                    className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-lg shadow-sm focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                    value={newDescriptionLine}
                    onChange={(e) => setNewDescriptionLine(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDescriptionLine()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={addDescriptionLine}
                    disabled={isLoading || !newDescriptionLine.trim()}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[100px]">
                  {product.description.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No descriptions added yet</p>
                  ) : (
                    product.description.map((data) => (
                      <div className="flex items-start gap-3 py-2 border-b border-gray-200 last:border-0" key={data.id}>
                        {data.id === 1 ? (
                          <p className="flex-1 text-gray-700 font-medium">{data.line}</p>
                        ) : (
                          <p className="flex-1 text-gray-600">➤ {data.line}</p>
                        )}
                        <button
                          onClick={() => removeDescriptionLine(data.id)}
                          disabled={isLoading}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={clearForm}
                disabled={isLoading}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Form
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid()}
                className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving Product...
                  </>
                ) : (
                  <>
                    💾 Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;