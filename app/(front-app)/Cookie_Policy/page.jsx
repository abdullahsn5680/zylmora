'use client'
import React, { useState } from 'react';
import { Cookie, Settings, Shield, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function CookiePolicyPage() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-slate-50">
    
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                <Cookie className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Cookie Policy</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Learn about how Zylmora uses cookies to enhance your browsing experience and maintain security.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-slate-500">
              <span>Effective Date: January 1, 2025</span>
              <span>•</span>
              <span>Last Updated: January 1, 2025</span>
            </div>
          </div>
        </div>
      </div>

    
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12 space-y-12">
         
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">What Are Cookies</h2>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better user experience and allow certain features to function properly.
              </p>
            </div>
          </section>


          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Types of Cookies We Use</h2>
            
            <div className="space-y-4">
            
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('essential')}
                  className="w-full flex items-center justify-between p-6 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Essential Cookies</h3>
                  </div>
                  {expandedSection === 'essential' ? 
                    <ChevronUp className="w-5 h-5 text-slate-600" /> : 
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  }
                </button>
                {expandedSection === 'essential' && (
                  <div className="p-6 bg-white border-t border-slate-200">
                    <ul className="space-y-2 text-slate-600">
                      <li>• Required for the website to function properly</li>
                      <li>• Enable core functionality such as security, network management, and accessibility</li>
                      <li>• Cannot be disabled without affecting website functionality</li>
                    </ul>
                  </div>
                )}
              </div>

            
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('functional')}
                  className="w-full flex items-center justify-between p-6 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Functional Cookies</h3>
                  </div>
                  {expandedSection === 'functional' ? 
                    <ChevronUp className="w-5 h-5 text-slate-600" /> : 
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  }
                </button>
                {expandedSection === 'functional' && (
                  <div className="p-6 bg-white border-t border-slate-200">
                    <ul className="space-y-2 text-slate-600">
                      <li>• Remember your preferences and settings</li>
                      <li>• Enable personalized features</li>
                      <li>• Improve your overall user experience</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('security')}
                  className="w-full flex items-center justify-between p-6 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Security Cookies</h3>
                  </div>
                  {expandedSection === 'security' ? 
                    <ChevronUp className="w-5 h-5 text-slate-600" /> : 
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  }
                </button>
                {expandedSection === 'security' && (
                  <div className="p-6 bg-white border-t border-slate-200">
                    <ul className="space-y-2 text-slate-600">
                      <li>• Help us identify and prevent security threats</li>
                      <li>• Protect against fraudulent activity</li>
                      <li>• Maintain the integrity of user accounts</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>

         
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">How We Use Cookies</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600 mb-4">We use cookies to:</p>
              <ul className="space-y-2 text-slate-600">
                <li>• Maintain your login session</li>
                <li>• Remember your preferences</li>
                <li>• Enhance website security</li>
                <li>• Prevent fraudulent activities</li>
                <li>• Improve website performance and functionality</li>
              </ul>
            </div>
          </section>

         
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Data Collection Through Cookies</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Important</h3>
              <p className="text-slate-600 mb-3">Our cookies do not collect personal identifying information such as:</p>
              <ul className="space-y-2 text-slate-600 mb-4">
                <li>• Email addresses</li>
                <li>• Phone numbers</li>
                <li>• Personal names</li>
                <li>• Financial information</li>
              </ul>
              <p className="text-slate-600">
                Cookies only store technical information necessary for website functionality and security.
              </p>
            </div>
          </section>

         
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Managing Cookies</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Browser Settings</h3>
                <p className="text-slate-600">
                  You can control and manage cookies through your browser settings. However, disabling certain cookies may affect website functionality.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Opt-Out</h3>
                <p className="text-slate-600 mb-3">While you can disable cookies, please note that some essential cookies are required for:</p>
                <ul className="space-y-2 text-slate-600">
                  <li>• User authentication</li>
                  <li>• Security features</li>
                  <li>• Basic website functionality</li>
                </ul>
              </div>
            </div>
          </section>

         
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Third-Party Cookies</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800 font-semibold mb-2">
                We do not use third-party tracking cookies or analytics services that collect personal information for advertising purposes.
              </p>
              <p className="text-slate-600">
                All cookies used on our website are managed directly by Zylmora for functionality and security purposes only.
              </p>
            </div>
          </section>

        
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Cookie Retention</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <ul className="space-y-2 text-slate-600">
                <li>• <strong>Session cookies</strong> are deleted when you close your browser</li>
                <li>• <strong>Persistent cookies</strong> remain on your device for a specified period or until manually deleted</li>
                <li>• <strong>Security-related cookies</strong> may be retained longer to prevent fraudulent activities</li>
              </ul>
            </div>
          </section>

        
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Updates to This Policy</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-slate-600">
                We may update this Cookie Policy periodically. Any changes will be posted on this page with an updated effective date.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Us</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600 mb-4">If you have questions about our use of cookies, please contact us at:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center">
                    <span className="text-xs">📧</span>
                  </div>
                  <a href="mailto:cookies@zylmora.com" className="text-slate-800 hover:text-slate-600 transition-colors">
                    cookies@zylmora.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center">
                    <span className="text-xs">📞</span>
                  </div>
                  <a href="tel:+12345678900" className="text-slate-800 hover:text-slate-600 transition-colors">
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-gradient-to-r from-slate-800 to-slate-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
              </div>
              <p className="text-slate-100 mb-4">
                You can manage your cookie preferences at any time through your browser settings. For the best experience on Zylmora, we recommend allowing essential and functional cookies.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                  Browser Settings
                </button>
                <button className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}