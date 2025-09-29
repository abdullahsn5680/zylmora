import React from 'react'
import { useAddress } from '@/app/Provider/Address/AddressProvider';
import { Check, Edit3, Star, Trash2, MapPin, Home } from 'lucide-react';
import { useAlert } from '@/app/Provider/Alert/AlertProvider';

function AddressTable() {
  const {showAlert} = useAlert();
  const {  
    defaultIndex,
    editStreet, setEditStreet,
    editVillage, setEditVillage,
    editCity, setEditCity,
    editDistrict, setEditDistrict,
    editProvince, setEditProvince,
    editPostalCode, setEditPostalCode,
    editCountry, setEditCountry,
    editShowVillageField, setEditShowVillageField,
    editingIndex,
    setEditingIndex,
    handleSaveEditedAddress,
    deleteAddress,
    handleEditAddress,
    addresses,
    resetEditFields,
  } = useAddress();

  const handleDel = (index) => {
    if (addresses.length <= 1) {
      showAlert.info('At least one address is required')
    } else {
      showAlert.delete('Are you sure you want to delete this address?', () => {
        deleteAddress(index);
      }, {
        title: "Delete Address",
        confirmText: "Delete",
        cancelText: "Cancel",
        onCancel: () => {console.log('User cancel the action')}
      })
    }
  }

  return addresses.map((addr, index) => (
    <div 
      key={index} 
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-200/60 animate-fade-in-up"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      {editingIndex === index ? (
        // Edit Mode
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Edit3 className="text-white" size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">Edit Address</h3>
              <p className="text-sm text-gray-500">Update your delivery information</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="relative">
              <Home className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                value={editStreet}
                onChange={(e) => setEditStreet(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white font-medium"
                placeholder="Street Address / House No *"
                required
              />
            </div>
            
            <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
              <input
                type="checkbox"
                id="editVillageToggle"
                checked={editShowVillageField}
                onChange={(e) => {
                  setEditShowVillageField(e.target.checked);
                  if (e.target.checked) {
                    setEditVillage(editCity);
                    setEditCity('');
                  } else {
                    setEditCity(editVillage);
                    setEditVillage('');
                  }
                }}
                className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all duration-300"
              />
              <label htmlFor="editVillageToggle" className="text-gray-700 font-bold cursor-pointer">
                I live in a village
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editShowVillageField ? (
                <input
                  type="text"
                  value={editVillage}
                  onChange={(e) => setEditVillage(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white font-medium"
                  placeholder="Village *"
                  required
                />
              ) : (
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white font-medium"
                  placeholder="City *"
                  required
                />
              )}
              
              <input
                type="text"
                value={editDistrict}
                onChange={(e) => setEditDistrict(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white font-medium"
                placeholder="District *"
                required
              />
              
              <input
                type="text"
                value={editProvince}
                onChange={(e) => setEditProvince(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white font-medium"
                placeholder="Province / State *"
                required
              />
              
              <input
                type="text"
                value={editPostalCode}
                onChange={(e) => setEditPostalCode(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white font-medium"
                placeholder="Postal Code (Optional)"
              />
              
              <input
                type="text"
                value={editCountry}
                onChange={(e) => setEditCountry(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-white font-medium"
                placeholder="Country *"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
            <button
              onClick={() => {
                setEditingIndex(null);
                resetEditFields();
              }}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-bold transition-all duration-300 hover:bg-gray-100 rounded-2xl border-2 border-gray-200 hover:border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditedAddress}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Check size={20} className="relative z-10" />
              <span className="relative z-10">Save Changes</span>
            </button>
          </div>
        </div>
      ) : (
       
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-start justify-between mb-4">
                {index === defaultIndex ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                    <Star size={16} fill="currentColor" />
                    Default Address
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full text-sm font-bold">
                    <MapPin size={16} />
                    Address #{index + 1}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditAddress(index)}
                    className="group p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-blue-200"
                    title="Edit address"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => handleDel(index)}
                    className="group p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-red-200"
                    title="Delete address"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/60">
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <p className="text-gray-700 text-base leading-relaxed font-medium">
                    {addr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
     
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-3xl" />
      
     
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none rounded-3xl" />
    </div>
  ));
}

export default AddressTable;