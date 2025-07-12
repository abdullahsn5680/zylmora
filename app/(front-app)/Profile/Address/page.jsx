'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Trash2, Edit3, Check, Plus, ArrowLeft, MapPin, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/Context/contextProvider';
import Loader from '@/app/Components/Loader/loader';

export default function AddressManager() {
  const router = useRouter();
  const { session, user, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
console.log(addresses
)
console.log(user)
  useEffect(() => {
    if (user?.address) {
      setAddresses(Array.isArray(user.address) ? user.address : []);
    
    }
  }, [user]);

    const addAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses([...addresses, newAddress.trim()]);
    setNewAddress('');
  };


  const deleteAddress = (index) => {
    if (addresses.length === 1) {
      alert('At least one address is required.');
      return;
    }

    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);

    if (index === defaultIndex) {
      setDefaultIndex(0);
    } else if (index < defaultIndex) {
      setDefaultIndex(prev => prev - 1);
    }

    setDeleteConfirm(null);
  };

  const saveEdited = (index) => {
    const trimmed = editedAddress.trim();
    if (!trimmed) return alert("Address can't be empty.");

    const updated = [...addresses];
    updated[index] = trimmed;
    setAddresses(updated);
    setEditingIndex(null);
    setEditedAddress('');
  };

  const handleSetDefault = (index) => {
    setDefaultIndex(index);
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
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
              <p className="text-gray-600">Manage your delivery addresses</p>
            </div>
          </div>
        </div>

        {/* Address Cards */}
        <div className="space-y-4 mb-6">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {editingIndex === index ? (
                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edit Address</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    placeholder="Enter your address..."
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => {
                        setEditingIndex(null);
                        setEditedAddress('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdited(index)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {index === defaultIndex && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-2">
                          <Star size={12} fill="currentColor" />
                          Default
                        </div>
                      )}
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">{addr}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {index !== defaultIndex && (
                        <button
                          onClick={() => handleSetDefault(index)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Set as default"
                        >
                          <Star size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditedAddress(addr);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit address"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete address"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Address Form */}
        {showAddForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Address</h3>
            <textarea
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Enter your new address..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setNewAddress('');
                  setShowAddForm(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addAddress}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Add Address
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-center gap-3 text-gray-600 group-hover:text-blue-600">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Plus size={20} />
              </div>
              <span className="font-medium">Add New Address</span>
            </div>
          </button>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveToDB}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
          >
            <Check size={18} />
            Save All Changes
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Address</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteAddress(deleteConfirm)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
