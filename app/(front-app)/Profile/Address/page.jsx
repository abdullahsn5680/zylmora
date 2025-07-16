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

  const [sucess, setSucess] = useState('');
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
      setSucess('Addresses updated!');
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
    <div className="min-h-screen bg-gray-50 py-6 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="operations flex w-full justify-between">
            <button
              onClick={() => router.back()}
              className="px-3 py-1.5 flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
          </div>
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

        <div className="space-y-4 mb-6">
          {addresses.map((addr, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {editingIndex === index ? (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Address</h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editStreet}
                      onChange={(e) => setEditStreet(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Street Address / House No *"
                      required
                    />
                    
                    <div className="flex items-center gap-2 mb-2">
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
                        className="rounded"
                      />
                      <label htmlFor="editVillageToggle" className="text-sm text-gray-600">
                        I live in a village
                      </label>
                    </div>
                    
                    {editShowVillageField ? (
                      <input
                        type="text"
                        value={editVillage}
                        onChange={(e) => setEditVillage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Village *"
                        required
                      />
                    ) : (
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City *"
                        required
                      />
                    )}
                    
                    <input
                      type="text"
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="District *"
                      required
                    />
                    <input
                      type="text"
                      value={editProvince}
                      onChange={(e) => setEditProvince(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Province / State *"
                      required
                    />
                    <input
                      type="text"
                      value={editPostalCode}
                      onChange={(e) => setEditPostalCode(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Postal Code (Optional)"
                    />
                    <input
                      type="text"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Country *"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setEditingIndex(null);
                        resetEditFields();
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEditedAddress}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      Save Changes
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
                      <p className="text-gray-800 leading-relaxed">{addr}</p>
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
                        onClick={() => handleEditAddress(index)}
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

        {showAddForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Address</h3>

            <button
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="w-full mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
            >
              {locationLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin size={16} />
                  Use Current Location
                </>
              )}
            </button>

            <div className="space-y-3">
              <input
                type="text"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street Address / House No *"
                required
              />
              
              <div className="flex items-center gap-2 mb-2">
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
                  className="rounded"
                />
                <label htmlFor="villageToggle" className="text-sm text-gray-600">
                  I live in a village
                </label>
              </div>
              
              {showVillageField ? (
                <input
                  type="text"
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Village *"
                  required
                />
              ) : (
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City *"
                  required
                />
              )}
              
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="District *"
                required
              />
              <input
                type="text"
                value={newProvince}
                onChange={(e) => setNewProvince(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Province / State *"
                required
              />
              <input
                type="text"
                value={newPostalCode}
                onChange={(e) => setNewPostalCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Postal Code (Optional)"
              />
              <input
                type="text"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Country *"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  resetFormFields();
                  setShowAddForm(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFormattedAddress}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
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

        {deleteConfirm !== null && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
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
               {sucess && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sucess</h3>
              <p className="text-gray-600 mb-6">{sucess}</p>
              <div className="flex justify-end gap-3">
            
                <button
                  onClick={() => setSucess('')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
            {Alert  && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Caution</h3>
              <p className="text-gray-600 mb-6">{Alert}</p>
              <div className="flex justify-end gap-3">
            
                <button
                  onClick={() => setAlert('')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveToDB}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 font-medium transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}