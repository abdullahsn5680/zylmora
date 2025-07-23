'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Trash2, Edit3, Check, Plus, ArrowLeft, MapPin, Star, Loader2 } from 'lucide-react';
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [newStreet, setNewStreet] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newProvince, setNewProvince] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [showVillageField, setShowVillageField] = useState(false);

  const [success, setSuccess] = useState('');
   const [Alert, setAlert] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editVillage, setEditVillage] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editProvince, setEditProvince] = useState('');
  const [editPostalCode, setEditPostalCode] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editShowVillageField, setEditShowVillageField] = useState(false);

  useEffect(()=>{
      if(!session){
        router.replace('/Authentication')
      }
      
    },[session])
  useEffect(() => {
    if (user?.address) {
      setAddresses(Array.isArray(user.address) ? user.address : []);
    }
  }, [user]);

  const resetFormFields = () => {
    setNewStreet('');
    setNewVillage('');
    setNewCity('');
    setNewDistrict('');
    setNewProvince('');
    setNewPostalCode('');
    setNewCountry('');
    setShowVillageField(false);
  };

  const resetEditFields = () => {
    setEditStreet('');
    setEditVillage('');
    setEditCity('');
    setEditDistrict('');
    setEditProvince('');
    setEditPostalCode('');
    setEditCountry('');
    setEditShowVillageField(false);
  };

  const parseAddressString = (addressString) => {
    const parts = addressString.split(', ').map(part => part.trim());
    
    return {
      street: parts[0] || '',
      cityOrVillage: parts[1] || '',
      district: parts[2] || '',
      province: parts[3] || '',
      postalCode: parts[4] && !isNaN(parts[4]) ? parts[4] : '',
      country: parts[parts.length - 1] || '',
      isVillage: false 
    };
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      if (!navigator.geolocation) {
        setAlert("Geolocation is not supported by your browser.");
        setLocationLoading(false);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'YourAppName/1.0'
              }
            }
          );
          if (!res.ok) {
            throw new Error('Failed to fetch address data');
          }
          
          const data = await res.json();
          const address = data.address || {};

          const city = address.city || address.town || '';
          const village = address.village || address.hamlet || '';
          const district = address.suburb || address.neighbourhood || address.district || address.county || '';
          const province = address.state || address.region || '';
          const postalCode = address.postcode || '';
          const country = address.country || '';
          const street = address.road || address.house_number || '';

          const isInVillage = !city && village;
          
          if (isInVillage) {
            setNewVillage(village);
            setNewCity('');
            setShowVillageField(true);
          } else {
            setNewCity(city);
            setNewVillage('');
            setShowVillageField(false);
          }

          setNewStreet(street);
          setNewDistrict(district);
          setNewProvince(province);
          setNewPostalCode(postalCode);
          setNewCountry(country);
          
          setLocationLoading(false);
        } catch (error) {
          console.error('Error processing location data:', error);
          setAlert("Unable to process location data. Please enter address manually.");
          setLocationLoading(false);
        }
      }, (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Unable to retrieve your location. ";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Please enter address manually.";
            break;
        }
        
        setAlert(errorMessage);
        setLocationLoading(false);
      }, options);
    } catch (error) {
      console.error('Error in handleUseCurrentLocation:', error);
      setAlert("Something went wrong while retrieving the address. Please enter manually.");
      setLocationLoading(false);
    }
  };

  const handleAddFormattedAddress = () => {
    const requiredFields = [newStreet, newDistrict, newProvince, newCountry];
    const requiredFieldNames = ['Street', 'District', 'Province', 'Country'];
    
    if (showVillageField) {
      requiredFields.push(newVillage);
      requiredFieldNames.push('Village');
    } else {
      requiredFields.push(newCity);
      requiredFieldNames.push('City');
    }

    if (requiredFields.some(field => !field.trim())) {
      return setAlert(`Please fill required fields (${requiredFieldNames.join(', ')}).`);
    }

    const addressParts = [newStreet.trim()];
    
    if (showVillageField) {
      addressParts.push(newVillage.trim());
    } else {
      addressParts.push(newCity.trim());
    }
    
    addressParts.push(newDistrict.trim(), newProvince.trim());
    if (newPostalCode.trim()) addressParts.push(newPostalCode.trim());
    addressParts.push(newCountry.trim());
    
    const formatted = addressParts.join(', ');
    setAddresses([...addresses, formatted]);
    resetFormFields();
    setShowAddForm(false);
  };

  const handleEditAddress = (index) => {
    const addressString = addresses[index];
    const parsed = parseAddressString(addressString);
    
    setEditStreet(parsed.street);
    setEditDistrict(parsed.district);
    setEditProvince(parsed.province);
    setEditPostalCode(parsed.postalCode);
    setEditCountry(parsed.country);
    
    
    if (parsed.cityOrVillage) {
      setEditCity(parsed.cityOrVillage);
      setEditVillage('');
      setEditShowVillageField(false);
    }
    
    setEditingIndex(index);
  };

  const handleSaveEditedAddress = () => {
    const requiredFields = [editStreet, editDistrict, editProvince, editCountry];
    const requiredFieldNames = ['Street', 'District', 'Province', 'Country'];
    
    if (editShowVillageField) {
      requiredFields.push(editVillage);
      requiredFieldNames.push('Village');
    } else {
      requiredFields.push(editCity);
      requiredFieldNames.push('City');
    }

    if (requiredFields.some(field => !field.trim())) {
      return setAlert(`Please fill required fields (${requiredFieldNames.join(', ')}).`);
    }

    const addressParts = [editStreet.trim()];
    
    if (editShowVillageField) {
      addressParts.push(editVillage.trim());
    } else {
      addressParts.push(editCity.trim());
    }
    
    addressParts.push(editDistrict.trim(), editProvince.trim());
    if (editPostalCode.trim()) addressParts.push(editPostalCode.trim());
    addressParts.push(editCountry.trim());
    
    const formatted = addressParts.join(', ');
    
    const updated = [...addresses];
    updated[editingIndex] = formatted;
    setAddresses(updated);
    setEditingIndex(null);
    resetEditFields();
  };

  const deleteAddress = (index) => {
    if (addresses.length === 1) {
      setAlert('At least one address is required.');
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

  const handleSetDefault = (index) => {
    setDefaultIndex(index);
  };

  const handleSaveToDB = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
      if (!res.ok) {
        setAlert(result.message || 'Failed to save');
        return;
      }

      setUser(result.data);
      setSuccess('Addresses updated!');
    } catch (error) {
      console.error('Failed to save:', error);
      setAlert('Something went wrong.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
 
  
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
    <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-white/80 hover:bg-slate-100 rounded-xl sm:rounded-xl md:rounded-2xl text-slate-700 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm sm:text-base font-medium">Back</span>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-lg sm:text-xl md:text-2xl"> <MapPin className="text-white" size={28} /></span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
            Our Address
          </h1>
        </div>
      </div>
    </div>
  </div>


         

      <div className="max-w-4xl mx-auto px-4 py-12">
       
        <div className="space-y-6 mb-8">
          {addresses.map((addr, index) => (
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
                        onClick={() => setDeleteConfirm(index)}
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
            </div>
          ))}
        </div>

       
        {showAddForm ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center">
                  <Plus className="text-white" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Add New Address</h3>
              </div>

              <button
                onClick={handleUseCurrentLocation}
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
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="group w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden relative"
          >
            <div className="flex items-center justify-center gap-4 text-slate-600 group-hover:text-slate-800">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-600 group-hover:to-slate-800 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                <Plus size={24} className="group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-xl font-semibold">Add New Address</span>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-3xl"></div>
          </button>
        )}

        <div className="flex justify-end mt-12">
          <button
            onClick={handleSaveToDB}
            disabled={loading}
            className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:from-green-400 disabled:to-emerald-500 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </div>

     
      {deleteConfirm !== null && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform animate-in zoom-in-90 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Delete Address</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">Are you sure you want to delete this address? This action cannot be undone and will remove it permanently.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteAddress(deleteConfirm)}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Delete Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform animate-in zoom-in-90 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Check className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Success!</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">{success}</p>
              <button
                onClick={() => setSuccess('')}
                className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-xl hover:from-slate-700 hover:to-slate-900 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {Alert && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform animate-in zoom-in-90 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Attention Required</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">{Alert}</p>
              <button
                onClick={() => setAlert('')}
                className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-xl hover:from-slate-700 hover:to-slate-900 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 