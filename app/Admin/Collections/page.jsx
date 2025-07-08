'use client';
import React, { useState,useEffect } from 'react';

export default function CollectionsAdminPage() {
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newSub, setNewSub] = useState('');
  const [loading,setLoading]=useState(false);
  const [deleted,setDeleted]=useState([])
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
    const deleted_id =collections[i]._id
    setDeleted([...deleted,{id:deleted_id}])
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
    setLoading(true);
    const res = await fetch('/api/collections');
    const data = await res.json();
    if (data.success) setCollections(data.collections);
    setLoading(false);
  };



  const saveToDatabase = async () => {
    try {
      console.log('Sending to DB:'); 

  
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collections),
      });
      const data = await res.json();
    } catch (err) {
      console.error(err);
      alert('Error saving to DB.');
    }

    if(deleted){
      try {
      console.log('Deleted from DB:'); 

  
      const res = await fetch('/api/collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deleted),
      });
      const data = await res.json();
    } catch (err) {
      console.error(err);
      alert('Error saving to DB.');
    }
    }
  };
return (
  <div className="min-h-screen bg-white text-black px-4 py-6 md:px-10 md:py-8">
 <div className="mb-4">
  <button
    onClick={() => history.back()}
    className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
  >
    ← Back
  </button>
</div>

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold text-slate-700 tracking-wide">
        📦 Collections Manager
      </h1>
      <button
        onClick={saveToDatabase}
        className="bg-slate-800 text-white flex items-center gap-2 px-4 py-2 rounded shadow hover:bg-red-600 transition"
      >
        💾 <span className="hidden md:inline">Save to Database</span>
      </button>
    </div>

    <div className="border-b border-slate-300 mb-6" />

    <div className="mb-8 flex flex-col md:flex-row gap-3 md:gap-4">
      <input
        type="text"
        placeholder="Enter collection name"
        value={newCollection}
        onChange={(e) => setNewCollection(e.target.value)}
        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 w-full md:w-1/2"
      />
      <button
        onClick={addCollection}
        className="bg-slate-800 text-white px-6 py-2 rounded-md shadow hover:bg-black transition"
      >
        + Add Collection
      </button>
    </div>

  
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {collections.map((col, ci) => (
        <div key={ci} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-slate-800">{col.name}</h2>
            <button
              onClick={() => deleteCollection(ci)}
              className="text-sm text-red-500 hover:underline"
            >
              ✕
            </button>
          </div>

        
          <ul className="text-sm text-slate-600 space-y-2 mb-4">
            {col.subs.map((sub, si) => (
              <li key={si} className="flex justify-between items-center">
                <span>{sub}</span>
                <button
                  onClick={() => deleteSub(ci, si)}
                  className="text-xs text-red-400 hover:underline"
                >
                  ✕
                </button>
              </li>
            ))}
            {col.subs.length === 0 && (
              <li className="text-gray-400 italic">No subcollections</li>
            )}
          </ul>

  
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter subcollection name"
              value={selectedCollection === ci ? newSub : ''}
              onFocus={() => setSelectedCollection(ci)}
              onChange={(e) => setNewSub(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <button
              onClick={addSub}
              className="bg-red-500 text-white px-4 py-2 w-full rounded-md text-sm shadow hover:bg-red-600 transition"
            >
              + Add Sub
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}