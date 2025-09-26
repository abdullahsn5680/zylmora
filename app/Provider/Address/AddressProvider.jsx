"use client";
import React, { createContext, useContext } from "react";
import useAddressHandling from "@/Hooks/Location/UseAdderssHandling";

const AddressContext = createContext(null);

export function AddressProvider({ children }) {
  const addressState = useAddressHandling(); 
  return (
    <AddressContext.Provider value={addressState}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used inside an AddressProvider");
  }
  return context;
}
