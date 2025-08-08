"use client";
import React from "react";
import { Plus } from "lucide-react";
import { useAddress } from "@/app/Provider/Address/AddressProvider";
function AddressAddbutton({}) {
  const { setShowAddForm } = useAddress();
  return (
    <button
      onClick={() => setShowAddForm(true)}
      className="group w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden relative"
    >
      <div className="flex items-center justify-center gap-4 text-slate-600 group-hover:text-slate-800">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-600 group-hover:to-slate-800 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
          <Plus
            size={24}
            className="group-hover:text-white transition-colors duration-300"
          />
        </div>
        <span className="text-xl font-semibold">Add New Address</span>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-3xl"></div>
    </button>
  );
}

export default AddressAddbutton;
