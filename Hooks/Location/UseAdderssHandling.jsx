'use client'
import { useState } from "react";
import { useAlert } from "@/app/Provider/Alert/AlertProvider";
import UseCurrentLocation from "./UseCurrentLocation";
import UseAddresDBUpdate from "./UseAddresDBUpdate";
function useAddressHandling() {;
  const {Save} =UseAddresDBUpdate();
  const { showAlert } = useAlert();
  const [addresses, setAddresses] = useState([]);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newVillage, setNewVillage] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newProvince, setNewProvince] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [showVillageField, setShowVillageField] = useState(false);
  const [editStreet, setEditStreet] = useState("");
  const [editVillage, setEditVillage] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editProvince, setEditProvince] = useState("");
  const [editPostalCode, setEditPostalCode] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editShowVillageField, setEditShowVillageField] = useState(false);
  const resetFormFields = () => {
    setNewStreet("");
    setNewVillage("");
    setNewCity("");
    setNewDistrict("");
    setNewProvince("");
    setNewPostalCode("");
    setNewCountry("");
    setShowVillageField(false);
  };
  const resetEditFields = () => {
    setEditStreet("");
    setEditVillage("");
    setEditCity("");
    setEditDistrict("");
    setEditProvince("");
    setEditPostalCode("");
    setEditCountry("");
    setEditShowVillageField(false);
  };


    

  const handleAddFormattedAddress = () => {
    const requiredFields = [newStreet, newDistrict, newProvince, newCountry];
    const requiredFieldNames = ["Street", "District", "Province", "Country"];

    if (showVillageField) {
      requiredFields.push(newVillage);
      requiredFieldNames.push("Village");
    } else {
      requiredFields.push(newCity);
      requiredFieldNames.push("City");
    }

    if (requiredFields.some((field) => !field.trim())) {
      return showAlert.info(
        `Please fill required fields (${requiredFieldNames.join(", ")}).`
      );
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

    const formatted = addressParts.join(", ");
  
    const updatedAddresses = [...addresses, formatted]; 
  setAddresses(updatedAddresses);
  resetFormFields();
  setShowAddForm(false);
  Save(updatedAddresses); 
  
  };

  const handleSaveEditedAddress = () => {
    const requiredFields = [
      editStreet,
      editDistrict,
      editProvince,
      editCountry,
    ];
    const requiredFieldNames = ["Street", "District", "Province", "Country"];

    if (editShowVillageField) {
      requiredFields.push(editVillage);
      requiredFieldNames.push("Village");
    } else {
      requiredFields.push(editCity);
      requiredFieldNames.push("City");
    }

    if (requiredFields.some((field) => !field.trim())) {
      return showAlert.info(
        `Please fill required fields (${requiredFieldNames.join(", ")}).`
      );
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

    const formatted = addressParts.join(", ");
    const updated = [...addresses];
    updated[editingIndex] = formatted;
   setAddresses(updated);
    setEditingIndex(null);
    resetEditFields();
    Save(updated)
  };

  const deleteAddress = async(index) => {

    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
 Save(updated)
    if (index === defaultIndex) {
      setDefaultIndex(0);
    } else if (index < defaultIndex) {
      setDefaultIndex((prev) => prev - 1);
    }
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
      setEditVillage("");
      setEditShowVillageField(false);
    }

    setEditingIndex(index);
  };

  const parseAddressString = (addressString) => {
    const parts = addressString.split(", ").map((part) => part.trim());

    return {
      street: parts[0] || "",
      cityOrVillage: parts[1] || "",
      district: parts[2] || "",
      province: parts[3] || "",
      postalCode: parts[4] && !isNaN(parts[4]) ? parts[4] : "",
      country: parts[parts.length - 1] || "",
      isVillage: false,
    };
  };
  const { getLocation } = UseCurrentLocation({
    setNewStreet,
    setNewVillage,
    setNewCity,
    setNewDistrict,
    setNewProvince,
    setNewPostalCode,
    setNewCountry,
    setShowVillageField,
  });
  return {
    setAddresses,
    getLocation,
    addresses,
    showAddForm,
    setShowAddForm,
    defaultIndex,
    setDefaultIndex,
    newStreet,
    setNewStreet,
    newVillage,
    setNewVillage,
    newCity,
    setNewCity,
    newDistrict,
    setNewDistrict,
    newProvince,
    setNewProvince,
    newPostalCode,
    setNewPostalCode,
    newCountry,
    setNewCountry,
    showVillageField,
    setShowVillageField,
    editStreet,
    setEditStreet,
    editVillage,
    setEditVillage,
    editCity,
    setEditCity,
    editDistrict,
    setEditDistrict,
    editProvince,
    setEditProvince,
    editPostalCode,
    setEditPostalCode,
    editCountry,
    setEditCountry,
    setEditingIndex,
    editShowVillageField,
    setEditShowVillageField,
    editingIndex,
    handleAddFormattedAddress,
    handleSaveEditedAddress,
    deleteAddress,
    handleEditAddress,
    resetFormFields,
    resetEditFields,
  };
}

export default useAddressHandling;
