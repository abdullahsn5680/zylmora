'use client'
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { safeFetch } from '@/Utils/safeFetch';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight, Heart, Star, Shield, Truck, CreditCard } from 'lucide-react';
import { LoaderContext } from '@/app/Context/contextProvider';

export default function ZylmoraFooter() {
  const router = useRouter();
  const {loader} = useContext(LoaderContext)
  const [show, setShow] = useState('hidden')
  
  const performAction = (cat, subCat) => {
    const query = new URLSearchParams({
      category: cat,
      subcategory: subCat,
    }).toString();
    router.push(`/Collections?${query}`);
  };
  
  useEffect(() => {
    loader ? setShow('hidden') : setShow('block')
  }, [loader])
  
  const [categoriesData, setCategoriesData] = useState([]);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await safeFetch('/api/catagories', {}, 3600000);
      if (response.success) {
        setCategoriesData(response.categories || []);
      } 
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  return (
    <footer className={`relative bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200/60 overflow-hidden ${show}`}>
     
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-5 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-5 w-16 sm:w-28 h-16 sm:h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-40 right-20 w-12 sm:w-20 h-12 sm:h-20 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      <div className="relative py-4 sm:py-6 border-b border-gray-200/40 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="grid grid-cols-4 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-8">
            <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Shield className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-center xs:text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-800">Secure Orders</p>
                <p className="text-[8px] text-gray-500  ">SSL Protected</p>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Truck className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-center xs:text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-800">Free Shipping</p>
                <p className="text-[8px] text-gray-500 ">Orders over RS:2000</p>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Star className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-center xs:text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-800">Premium Quality</p>
                <p className="text-[8px] text-gray-500  ">Guaranteed</p>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <CreditCard className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-center xs:text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-800">Best Prices</p>
                <p className="text-[8px] text-gray-500  ">Best Price Ever</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="relative py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            
           
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 text-center lg:text-left order-1">
              <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-white font-black text-lg sm:text-2xl">Z</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 tracking-tight">
                    Zylmora
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Premium Fashion</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed max-w-xs sm:max-w-sm mx-auto lg:mx-0">
                Premium clothing brand dedicated to bringing you the latest fashion trends with exceptional quality and style.
              </p>
            
            <div className="flex justify-center lg:justify-start space-x-1.5 sm:space-x-2 mb-4 sm:mb-6">
  <Link
    href="#"
    aria-label="Facebook"
    className="group relative p-2 sm:p-3 bg-white text-gray-600 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg border border-gray-200 overflow-hidden"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <Facebook className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
  </Link>

  <Link
    href="#"
    aria-label="Instagram"
    className="group relative p-2 sm:p-3 bg-white text-gray-600 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg border border-gray-200 overflow-hidden"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
  </Link>

  <Link
    href="#"
    aria-label="Twitter"
    className="group relative p-2 sm:p-3 bg-white text-gray-600 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg border border-gray-200 overflow-hidden"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <Twitter className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
  </Link>

  <Link
    href="#"
    aria-label="Youtube"
    className="group relative p-2 sm:p-3 bg-white text-gray-600 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg border border-gray-200 overflow-hidden"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <Youtube className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
  </Link>
</div>


              {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100  w-fit rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-200/60">
                <h5 className="text-sm sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">Stay Updated</h5>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Get latest fashion trends!</p>
                <div className="flex gap-1.5 sm:gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                  <button className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md sm:rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div> */}
            </div>

            
            <div className="col-span-1 hidden md:block text-center lg:text-left order-2">
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-black text-gray-800 mb-2 flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <span className="text-sm sm:text-xl">Shop Collections</span>
                </h4>
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto lg:mx-0 rounded-full" />
              </div>
              
              <ul className="space-y-2 sm:space-y-3">
                {categoriesData.slice(0, 6).map((category, id) => (
                  <li key={id}>
                    <button 
                      onClick={() => { performAction(category.cat, category.subCat) }} 
                      className="group text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-all duration-300 relative inline-flex items-center gap-1.5 sm:gap-2 hover:translate-x-1"
                    >
                      <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 group-hover:bg-blue-500 rounded-full transition-colors duration-300" />
                      <span className="truncate max-w-[120px] sm:max-w-none">{category.name}</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0" />
                    </button>
                  </li>
                ))}
                {categoriesData.length > 6 && (
                  <li>
                    <span className="text-gray-500 text-xs sm:text-sm italic">
                      +{categoriesData.length - 6} more
                    </span>
                  </li>
                )}
              </ul>
            </div>

            
            <div className="col-span-1 hidden md:block text-center lg:text-left order-3">
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-black text-gray-800 mb-2 flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm sm:text-xl">Customer Care</span>
                </h4>
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto lg:mx-0 rounded-full" />
              </div>
              
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link href="#" className="group text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-all duration-300 relative inline-flex items-center gap-1.5 sm:gap-2 hover:translate-x-1">
                    <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 group-hover:bg-green-500 rounded-full transition-colors duration-300" />
                    Size Guide
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="group text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-all duration-300 relative inline-flex items-center gap-1.5 sm:gap-2 hover:translate-x-1">
                    <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 group-hover:bg-green-500 rounded-full transition-colors duration-300" />
                    Shipping Info
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="group text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-all duration-300 relative inline-flex items-center gap-1.5 sm:gap-2 hover:translate-x-1">
                    <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 group-hover:bg-green-500 rounded-full transition-colors duration-300" />
                    Returns & Exchanges
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="group text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-all duration-300 relative inline-flex items-center gap-1.5 sm:gap-2 hover:translate-x-1">
                    <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 group-hover:bg-green-500 rounded-full transition-colors duration-300" />
                    FAQ
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="group text-gray-600 hover:text-gray-800 text-xs sm:text-sm transition-all duration-300 relative inline-flex items-center gap-1.5 sm:gap-2 hover:translate-x-1">
                    <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 group-hover:bg-green-500 rounded-full transition-colors duration-300" />
                    Contact Us
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </li>
              </ul>
            </div>
        
            {/* Contact Info - Enhanced for 320px */}
            <div className="col-span-1 hidden md:block sm:col-span-2 lg:col-span-1 text-center lg:text-left order-4">
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl font-black text-gray-800 mb-2 flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  <span className="text-sm sm:text-xl">Get In Touch</span>
                </h4>
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto lg:mx-0 rounded-full" />
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-center lg:justify-start gap-2 sm:gap-4 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300 border border-gray-200/60 flex-shrink-0">
                    <MapPin className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs sm:text-sm font-bold text-gray-800 mb-0.5 sm:mb-1">Visit Our Store</p>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      123 Fashion Avenue<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300 border border-gray-200/60 flex-shrink-0">
                    <Phone className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs sm:text-sm font-bold text-gray-800 mb-0.5 sm:mb-1">Call Us</p>
                    <Link href="tel:+1234567890" className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      +1 (234) 567-8900
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl group-hover:from-orange-100 group-hover:to-red-100 transition-all duration-300 border border-gray-200/60 flex-shrink-0">
                    <Mail className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs sm:text-sm font-bold text-gray-800 mb-0.5 sm:mb-1">Email Us</p>
                    <Link href="mailto:hello@zylmora.com" className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors break-all">
                      hello@zylmora.com
                    </Link>
                  </div>
                </div>
              </div>

              {/* Store Hours - Compact for 320px */}
              <div className="mt-4 sm:mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/60">
                <h5 className="text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">Store Hours</h5>
                <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-600">
                  <div className="flex justify-between gap-2">
                    <span>Mon - Fri:</span>
                    <span className="font-medium">9AM - 8PM</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Saturday:</span>
                    <span className="font-medium">10AM - 6PM</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Sunday:</span>
                    <span className="font-medium">12PM - 5PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Enhanced for 320px */}
      <div className="relative border-t border-gray-200/60 py-3 sm:py-6 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="flex items-center justify-center lg:justify-start text-xs sm:text-sm text-gray-600">
                © 2025 Zylmora. Made with 
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-red-500 animate-pulse" /> 
                for fashion lovers.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <Link href="/Privacy_Policy" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 relative group">
                Privacy Policy
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/Terms_Conditions" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 relative group">
                Terms of Service
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/Cookie_Policy" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 relative group">
                Cookie Policy
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Styles for 320px */}
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Extra small screens (320px and below) */
        @media (max-width: 359px) {
          .xs\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .xs\:flex-row {
            flex-direction: row;
          }
          .xs\:text-left {
            text-align: left;
          }
          .xs\:gap-2 {
            gap: 0.5rem;
          }
          .xs\:block {
            display: block;
          }
        }
      `}</style>
    </footer>
  );
}