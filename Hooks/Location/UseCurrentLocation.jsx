'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useLoader } from '@/app/Provider/loader/loaderProvider';
import { useAlert } from '@/app/Provider/Alert/AlertProvider';
export default function UseCurrentLocation({  setNewStreet,
  setNewVillage,
  setNewCity,
  setNewDistrict,
  setNewProvince,
  setNewPostalCode,
  setNewCountry,
  setShowVillageField}) {
  const {showLoader,hideLoader}=useLoader();
  const {showAlert} =useAlert();

  const getLocation = async () => {
    try {
      
      showLoader();
      if (!navigator.geolocation) {
        showAlert.info("Geolocation is not supported by your browser.");
        
        hideLoader();
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
          hideLoader();
          
        } catch (error) {
          console.error('Error processing location data:', error);
          showAlert.info("Unable to process location data. Please enter address manually.");
          
          hideLoader();
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
        
        showAlert.info(errorMessage);
        hideLoader();
        
      }, options);
    } catch (error) {
      console.error('Error in handleUseCurrentLocation:', error);
      showAlert.info("Something went wrong while retrieving the address. Please enter manually.");
      hideLoader();
      ;
    }
  };
  return{getLocation}
}