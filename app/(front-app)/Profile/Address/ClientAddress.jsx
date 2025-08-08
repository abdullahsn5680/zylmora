"use client";
import React, { useState, useEffect, useContext } from "react";
import { useAddress } from "@/app/Provider/Address/AddressProvider";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/Context/contextProvider";
import Loader from "@/app/Components/Loader/loader";
import Heading from "@/app/Components/UI/Heading/Heading";
import AddressAddbutton from "@/app/Components/pages/Address/AddressAddbutton";
import AddressTable from "@/app/Components/pages/Address/AddressTable";
import EmptyMesseges from "@/app/Components/UI/Messeges/EmptyMesseges";
import AddressAdditionForm from "@/app/Components/pages/Address/AddressAdditionForm";
export default function AddressManager() {
  const router = useRouter();
  const { session, user, status } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const addressHandling = useAddress(); 
  useEffect(() => {
    if (status !== "loading") {
      if (!session) router.replace("/Authentication");
    }
  }, [status]);

  useEffect(() => {
    if (user?.address) {
      addressHandling.setAddresses(
        Array.isArray(user.address) ? user.address : []
      );
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <Heading icon={"🗺️"} name={"Address"} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {addressHandling.addresses.length === 0 ? (
          <EmptyMesseges
            icon="🧭"
            title="No Addresses Added"
            message="You haven't added any addresses yet."
            buttonText="Add Your First Address"
            onButtonClick={() => addressHandling.setShowAddForm(true)}
          />
        ) : (
          <div className="space-y-6 mb-8">
              <AddressTable />
          </div>
        )}
        {addressHandling.showAddForm ? (
          <AddressAdditionForm />
        ) : (
          addressHandling.addresses.length > 0 && <AddressAddbutton />
        )}
      </div>
    </div>
  );
}
