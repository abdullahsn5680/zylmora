import React from 'react'
import { Plus, Loader2, MapPin } from 'lucide-react';
import { useAddress } from '@/app/Provider/Address/AddressProvider';
import { useAlert } from '@/app/Provider/Alert/AlertProvider';
import { useLoader } from '@/app/Provider/loader/loaderProvider';
function AddressAdditionForm() {
  const { showLoader, hideLoader } = useLoader();
  const showAlert =useAlert();
  const {
    getLocation,
    locationLoading,
    setShowAddForm,
    newStreet, setNewStreet,
    newVillage, setNewVillage,
    newCity, setNewCity,
    newDistrict, setNewDistrict,
    newProvince, setNewProvince,
    newPostalCode, setNewPostalCode,
    newCountry, setNewCountry,
    showVillageField, setShowVillageField,
    handleAddFormattedAddress,
    resetFormFields,
  } = useAddress(showAlert, showLoader, hideLoader); 

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center">
                  <Plus className="text-white" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Add New Address</h3>
              </div>

              <button
                onClick={()=>getLocation()}
                disabled={locationLoading}
                className="w-full mb-6 p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 disabled:from-blue-400 disabled:to-blue-500 transition-all duration-300 flex items-center justify-center gap-3 font-medium shadow-lg transform hover:scale-[1.02]"
              >
                {locationLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin size={20} />
                    Use Current Location
                  </>
                )}
              </button>

              <div className="space-y-4">
                <input
                  type="text"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  placeholder="Street Address / House No *"
                  required
                />
                
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="villageToggle"
                    checked={showVillageField}
                    onChange={(e) => {
                      setShowVillageField(e.target.checked);
                      if (e.target.checked) {
                        setNewVillage(newCity);
                        setNewCity('');
                      } else {
                        setNewCity(newVillage);
                        setNewVillage('');
                      }
                    }}
                    className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                  />
                  <label htmlFor="villageToggle" className="text-slate-700 font-medium">
                    I live in a village
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showVillageField ? (
                    <input
                      type="text"
                      value={newVillage}
                      onChange={(e) => setNewVillage(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      placeholder="Village *"
                      required
                    />
                  ) : (
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      placeholder="City *"
                      required
                    />
                  )}
                  
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="District *"
                    required
                  />
                  
                  <input
                    type="text"
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="Province / State *"
                    required
                  />
                  
                  <input
                    type="text"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="Postal Code (Optional)"
                  />
                  
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="Country *"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    resetFormFields();
                    setShowAddForm(false);
                  }}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFormattedAddress}
                  className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-xl hover:from-slate-700 hover:to-slate-900 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                   Address
                </button>
              </div>
            </div>
          </div>
  )
}

export default AddressAdditionForm
