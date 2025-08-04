"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/app/Context/contextProvider";
import ProdcutInfo from "@/app/Components/pages/prodcuts/ProdcutInfo";
import { useRouter } from "next/navigation";
import ImageViewer from "@/app/Components/UI/Img/ImageViewer";
import Loader from "@/app/Components/Loader/loader";
import { safeFetch } from "@/Utils/safeFetch";
import ProductReviews from "@/app/Components/pages/prodcuts/Review";
import RelatedProdcuts from "@/app/Components/pages/prodcuts/RelatedProdcuts";
import ProdcutDescription from "@/app/Components/pages/prodcuts/ProductDescription";
import NotLogin from "@/app/Components/alerts/NotLogin";
import Sucess from "@/app/Components/alerts/Sucess";
import Order_Summary from "@/app/Components/pages/Order/Order_Summary";
import Pop_Loader from "@/app/Components/alerts/popLoader";
import Complete_Order from "@/app/Components/pages/Order/Complete_Order";
function ProductPage() {
  const router = useRouter();
  const [finalAddress, setFinalAddresses] = useState("");
  const { session } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const searchParams = useSearchParams();
  const [Counter, setCounter] = useState(1);
  const [Size, setSize] = useState(0);

  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [province, setProvince] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [confirmLogin, setConfirmLogin] = useState(true);
  const [sucess, setSucess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
    const [popLoader, setPopLoader] = useState(false);
  const [update, setUpdate] = useState(0);

  const parseAddressString = (addressString) => {
    if (!addressString) return {};

    const parts = addressString.split(",").map((part) => part.trim());
    const length = parts.length;

    if (length < 4) return {};

    const country = parts[length - 1];
    const postalCode = parts[length - 2];
    const province = parts[length - 3];
    const district = parts[length - 4];
    const city = parts[length - 5];

    const streetParts = parts.slice(0, length - 5);
    const streetAddress = streetParts.join(", ");

    return {
      country: country || "",
      postalCode: postalCode || "",
      province: province || "",
      district: district || "",
      city: city || "",
      streetAddress: streetAddress || "",
    };
  };

  useEffect(() => {
    if (selectedAddress && update == 0) {
      const parsed = parseAddressString(selectedAddress);
      setCountry(parsed.country || "");
      setPostalCode(parsed.postalCode || "");
      setProvince(parsed.province || "");
      setDistrict(parsed.district || "");
      setCity(parsed.city || "");
      setStreetAddress(parsed.streetAddress || "");
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || session?.user?.email || "");
      setPhone(user.phone || "");

      if (user.address && user.address.length > 0 && update == 0) {
        setSelectedAddress(user.address[0]);
      }
    }
  }, [user, session]);

  useEffect(() => {
    if (product && product.sizes?.length > 0) {
      const defaultSize = product.sizes[0];
      setSize(defaultSize);
    }
  }, [product]);

  const slug = searchParams.get("url");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await safeFetch(`/api/Products?id=${slug}`, {}, 360000);
        const data = res;
        setProduct(data.product);
        if (data.success) {
          setTimeout(() => setLoading(false), 2000);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getProduct();
  }, [slug]);

  if (loading) return <Loader />;

  if (showOrderForm) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
        <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🛒</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  Checkout
                </h1>
              </div>
              <div className="w-20"></div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="">
              <Complete_Order
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                streetAddress={streetAddress}
                setStreetAddress={setStreetAddress}
                city={city}
                setCity={setCity}
                district={district}
                setDistrict={setDistrict}
                province={province}
                setProvince={setProvince}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                country={country}
                setCountry={setCountry}
                update={update}
                setUpdate={setUpdate}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                user={user}
                setShowOrderForm={setShowOrderForm}
              />
            </div>
            <div className="">
             <Order_Summary
  product={product}
  Counter={Counter}
  Size={Size}

  firstName={firstName}
  lastName={lastName}
  email={email}
  phone={phone}
  selectedAddress={selectedAddress}
  streetAddress={streetAddress}
  city={city}
  district={district}
  province={province}
  postalCode={postalCode}
  country={country}
  paymentMethod={paymentMethod}

  setFinalAddresses={setFinalAddresses}
  setShowOrderForm={setShowOrderForm}
  setLoading={setLoading}
  setSucess={setSucess}
  setShowAlert={setShowAlert}

  loading={loading}
  user={user}
/>

            </div>
          </div>
        </div>

        {sucess == true && <Sucess setSucess={setSucess}/>}
        {Alert == true && <Alert setShowAlert={setShowAlert} />}
        {popLoader == true && <Pop_Loader setPopLoader={setPopLoader} />}

      </div>
    );
  }
  return (
    <div className="mt-12 pb-15  max-w-7xl mx-auto">
      <div className="navigation px-6 flex items-center gap-3 text-sm text-gray-600 mb-8">
        <div className="home font-medium hover:text-gray-900 cursor-pointer transition-colors">
          Home
        </div>
        <span className="text-gray-400">•</span>
        <div className="title text-gray-900 font-medium">
          {product?.title || "Product Title"}
        </div>
      </div>

      <div className="">
   <ProdcutInfo
  product={product}
  Size={Size}
  setSize={setSize}
  Counter={Counter}
  setCounter={setCounter}
  session={session}
  setConfirmLogin={setConfirmLogin}
  setSucess={setSucess}
  setShowAlert={setShowAlert}
  setShowOrderForm={setShowOrderForm}
/>

      </div>
      <div className="more_img mb-20 w-full ">
        <ImageViewer images={product?.images || []} />{" "}
      </div>
      <div className="description">
        <ProdcutDescription product={product?.description} />
      </div>
      <div className="">
        <ProductReviews setPopLoader={setPopLoader} prop ={{pid:product._id,uid:user?._id}} setSucess={setSucess}   setShowAlert={setShowAlert}/>
      </div>
      <div className="realetd">
        <RelatedProdcuts
          prop={{
            pid: product._id,
            category: product.category,
            subcategory: product.subcategory,
          }}
        />
      </div>
      {confirmLogin !== true && <NotLogin />}
       {sucess == true && <Sucess setSucess={setSucess}/>}
        {showAlert == true && <Alert setShowAlert={setShowAlert} />}
        {popLoader == true && <Pop_Loader setPopLoader={setPopLoader} />}
    </div>
  );
}

export default ProductPage;
