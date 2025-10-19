'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Save, Package, Plus, X } from 'lucide-react';
import { useLoader } from '@/app/Provider/loader/loaderProvider';

export default function CollectionsAdminPage() {
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newSub, setNewSub] = useState('');
  const {hideLoader,showLoader}=useLoader();
  const addCollection = () => {
    if (!newCollection.trim()) return;
    setCollections([...collections, { name: newCollection, subs: [] }]);
    setNewCollection('');
  };

  const addSub = () => {
    if (!newSub.trim() || selectedCollection === null) return;
    const updated = [...collections];
    updated[selectedCollection].subs.push(newSub);
    setCollections(updated);
    setNewSub('');
  };

  const deleteCollection = (i) => {
    const updated = [...collections];
    updated.splice(i, 1);
    setCollections(updated);
    if (selectedCollection === i) setSelectedCollection(null);
  };

  const deleteSub = (ci, si) => {
    const updated = [...collections];
    updated[ci].subs.splice(si, 1);
    setCollections(updated);
  };
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
   showLoader()
    const res = await fetch('/api/collections');
    const data = await res.json();
    if (data.success) setCollections(data.collections);
   hideLoader()
  };

  const saveToDatabase = async () => {
    try {
      showLoader()
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collections),
      });
      const data = await res.json();
      hideLoader()
    } catch (err) {
      console.error(err);
      hideLoader()
      alert('Error saving to DB.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-slate-200 rounded-lg transition"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Package className="w-8 h-8" />
                Collections Manager
              </h1>
              <p className="text-sm text-slate-500 mt-1">Manage your product collections and subcategories</p>
            </div>
          </div>
          <button
            onClick={saveToDatabase}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition shadow-md"
          >
            <Save className="w-5 h-5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>

        {/* Add Collection Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Collection</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter collection name"
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCollection()}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <button
              onClick={addCollection}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, ci) => (
            <div key={ci} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition overflow-hidden">
              {/* Collection Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900 truncate">{col.name}</h3>
                <button
                  onClick={() => deleteCollection(ci)}
                  className="p-1 hover:bg-red-50 rounded-lg transition text-red-500"
                  aria-label="Delete collection"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subcollections List */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-500 uppercase mb-3">Subcollections</p>
                  <ul className="space-y-2">
                    {col.subs.length === 0 ? (
                      <li className="text-sm text-slate-400 italic">No subcollections yet</li>
                    ) : (
                      col.subs.map((sub, si) => (
                        <li
                          key={si}
                          className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg group hover:bg-slate-100 transition"
                        >
                          <span className="text-sm text-slate-700">{sub}</span>
                          <button
                            onClick={() => deleteSub(ci, si)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition text-red-500"
                            aria-label="Delete subcollection"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Add Subcollection */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Subcollection name"
                      value={selectedCollection === ci ? newSub : ''}
                      onFocus={() => setSelectedCollection(ci)}
                      onChange={(e) => setNewSub(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSub()}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <button
                      onClick={addSub}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Sub
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {collections.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No collections yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}