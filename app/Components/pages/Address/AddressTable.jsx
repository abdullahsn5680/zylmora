import React,{useEffect} from 'react'
import { useAddress } from '@/app/Provider/Address/AddressProvider';
import { Check, Edit3, Star, Trash2 } from 'lucide-react';
import { useAlert } from '@/app/Provider/Alert/AlertProvider';
function AddressTable() {
  const {showAlert}=useAlert();
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
    resetEditFields,} =useAddress();
  const handleDel =(index)=>{

 if (addresses.length <= 1) {
   showAlert.info('At least one address is required')

  }else showAlert.delete('Are you wan to delete this address',()=>{
  deleteAddress(index); },{
    title: "Delete Address",
    confirmText: "Delete",
    cancelText: "Cancel",
    onCancel: () => {console.log('User cancel the action')}
  }
)
}

  return  addresses.map((addr,index)=>(
    <div key={index} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-gray-100">
                {editingIndex === index ? (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                        <Edit3 className="text-white" size={20} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">Edit Address</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editStreet}
                        onChange={(e) => setEditStreet(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                        placeholder="Street Address / House No *"
                        required
                      />
                      
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
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
                          className="w-5 h-5 text-slate-600 rounded focus:ring-slate-500"
                        />
                        <label htmlFor="editVillageToggle" className="text-slate-700 font-medium">
                          I live in a village
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {editShowVillageField ? (
                          <input
                            type="text"
                            value={editVillage}
                            onChange={(e) => setEditVillage(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                            placeholder="Village *"
                            required
                          />
                        ) : (
                          <input
                            type="text"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                            placeholder="City *"
                            required
                          />
                        )}
                        
                        <input
                          type="text"
                          value={editDistrict}
                          onChange={(e) => setEditDistrict(e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                          placeholder="District *"
                          required
                        />
                        
                        <input
                          type="text"
                          value={editProvince}
                          onChange={(e) => setEditProvince(e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                          placeholder="Province / State *"
                          required
                        />
                        
                        <input
                          type="text"
                          value={editPostalCode}
                          onChange={(e) => setEditPostalCode(e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                          placeholder="Postal Code (Optional)"
                        />
                        
                        <input
                          type="text"
                          value={editCountry}
                          onChange={(e) => setEditCountry(e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-white"
                          placeholder="Country *"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-8">
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          resetEditFields();
                        }}
                        className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 hover:bg-slate-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEditedAddress}
                        className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-xl hover:from-slate-700 hover:to-slate-900 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                      >
                        <Check size={18} />
                        Save 
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="flex flex-col items-start justify-between">
                      <div className="flex  justify-between w-full">
                        {index === defaultIndex && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-sm font-semibold mb-4 shadow-sm">
                            <Star size={14} fill="currentColor" />
                            Default 
                          </div>
                        )}
                         {index !== defaultIndex && (
                          <div className=" ">
                           
                          </div>
                        )}
                          <div className="flex items-center gap-2 ml-6">
                      
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="group p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                          title="Edit address"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button
                          onClick={() =>{ handleDel() }
}
                          className="group p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110"
                          title="Delete address"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                       
                      </div>
                     <p className="text-slate-700 text-md leading-relaxed font-medium">{addr}</p>
                    </div>
                  </div>
                )}
                
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-3xl"></div>
              </div>  ))
  
}

export default AddressTable
