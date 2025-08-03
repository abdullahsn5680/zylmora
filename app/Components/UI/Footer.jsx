'use client'
import React, { useState} from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight, Heart } from 'lucide-react';

export default function ZylmoraFooter() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
   
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-slate-100">
    
     

      <div className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
         
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6 group">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <span className="text-2xl font-bold text-slate-800 tracking-tight">Zylmoraa</span>
              </div>
              
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Premium clothing brand dedicated to bringing you the latest fashion trends with exceptional quality and style.
              </p>
              
             
              <div className="flex space-x-3">
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-300 hover:scale-110">
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>

            
            <div className="col-span-1">
              <h4 className="text-lg font-bold text-slate-800 mb-6">Shop</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Men's Collection
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Women's Collection
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Accessories
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    New Arrivals
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Sale Items
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
              </ul>
            </div>

    
            <div className="col-span-1">
              <h4 className="text-lg font-bold text-slate-800 mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Size Guide
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Shipping Info
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Returns & Exchanges
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    FAQ
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-slate-800 text-sm transition-colors duration-300 relative group">
                    Contact Us
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-300 to-slate-800 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
              </ul>
            </div>

          
            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-lg font-bold text-slate-800 mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      123 Fashion Street<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <Link href="tel:+1234567890" className="text-sm text-slate-600 hover:text-slate-800 transition-colors">
                    +1 (234) 567-8900
                  </Link>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <Link href="mailto:hello@zylmora.com" className="text-sm text-slate-600 hover:text-slate-800 transition-colors">
                    hello@zylmora.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div className="border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-600">
              <p className="flex items-center">
                © 2025 Zylmora. Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for fashion lovers.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center space-x-6 text-sm">
              <Link href="/Privcay_Policy" className="text-slate-600 hover:text-slate-800 transition-colors duration-300">Privacy Policy</Link>
              <Link href="/Terms_Conditions" className="text-slate-600 hover:text-slate-800 transition-colors duration-300">Terms of Service</Link>
              <Link href="/Cookie_Policy" className="text-slate-600 hover:text-slate-800 transition-colors duration-300">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}