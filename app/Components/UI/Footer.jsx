'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { safeFetch } from '@/Utils/safeFetch';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight, Heart } from 'lucide-react';

export default function ZylmoraFooter() {
  const router = useRouter();
  
  const performAction = (cat, subCat) => {
    const query = new URLSearchParams({
      category: cat,
      subcategory: subCat,
    }).toString();
    router.push(`/Collections?${query}`);
  };
  
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
    <footer className="bg-white border-t border-slate-100">
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
          
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4 sm:mb-6 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-lg sm:text-xl">Z</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Zylmoraa</span>
              </div>
              
              <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed max-w-sm mx-auto sm:mx-0">
                Premium clothing brand dedicated to bringing you the latest fashion trends with exceptional quality and style.
              </p>
            
              <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>

           
            <div className="col-span-1">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6 text-center sm:text-left">Shop</h4>
              <ul className="space-y-2 sm:space-y-3">
                {categoriesData.slice(0, 6).map((category, id) => (
                  <li key={id} className="text-center sm:text-left">
                    <span 
                      onClick={() => { performAction(category.cat, category.subCat) }} 
                      className="text-slate-600 hover:text-slate-800 text-xs sm:text-sm transition-colors duration-300 relative group cursor-pointer inline-block"
                    >
                      {category.name}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                    </span>
                  </li>
                ))}
                {categoriesData.length > 6 && (
                  <li className="text-center sm:text-left">
                    <span className="text-slate-500 text-xs sm:text-sm">
                      +{categoriesData.length - 6} more
                    </span>
                  </li>
                )}
              </ul>
            </div>

           
            <div className="col-span-1">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6 text-center sm:text-left">Support</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="text-center sm:text-left">
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-xs sm:text-sm transition-colors duration-300 relative group inline-block">
                    Size Guide
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-xs sm:text-sm transition-colors duration-300 relative group inline-block">
                    Shipping Info
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-xs sm:text-sm transition-colors duration-300 relative group inline-block">
                    Returns & Exchanges
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-xs sm:text-sm transition-colors duration-300 relative group inline-block">
                    FAQ
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-xs sm:text-sm transition-colors duration-300 relative group inline-block">
                    Contact Us
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
              </ul>
            </div>

           
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6 text-center sm:text-left">Contact</h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-center sm:justify-start space-x-3 group">
                  <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300 flex-shrink-0">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      123 Fashion Street<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                  <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300 flex-shrink-0">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                  </div>
                  <Link href="tel:+1234567890" className="text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors">
                    +1 (234) 567-8900
                  </Link>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                  <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300 flex-shrink-0">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                  </div>
                  <Link href="mailto:hello@zylmora.com" className="text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors break-all">
                    hello@zylmora.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div className="border-t border-slate-100 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="flex items-center justify-center lg:justify-start text-xs sm:text-sm text-slate-600">
                © 2025 Zylmora. Made with <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 text-red-500" /> for fashion lovers.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <Link href="/Privcay_Policy" className="text-slate-600 hover:text-slate-800 transition-colors duration-300 whitespace-nowrap">Privacy Policy</Link>
              <Link href="/Terms_Conditions" className="text-slate-600 hover:text-slate-800 transition-colors duration-300 whitespace-nowrap">Terms of Service</Link>
              <Link href="/Cookie_Policy" className="text-slate-600 hover:text-slate-800 transition-colors duration-300 whitespace-nowrap">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}