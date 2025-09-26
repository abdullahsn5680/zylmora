import React from 'react';
import { FileText, Shield, AlertTriangle, Scale, UserCheck, Ban, Gavel } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50">
     
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Terms of Service</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These terms govern your use of Zylmora's services. Please read them carefully before using our platform.
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
                <UserCheck className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Acceptance of Terms</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using Zylmora's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

         
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Description of Service</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600">
                Zylmora is a premium clothing brand that provides fashion products and related services through our online platform.
              </p>
            </div>
          </section>

      
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">User Accounts</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Account Creation</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• You must provide accurate and complete information when creating an account</li>
                  <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>• You must notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Account Verification</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• We require email and phone number verification for all user accounts</li>
                  <li>• Providing false or fraudulent information will result in immediate account termination</li>
                </ul>
              </div>
            </div>
          </section>

        
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Prohibited Activities</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-slate-700 font-medium mb-4">Users are prohibited from:</p>
              <ul className="space-y-2 text-slate-600">
                <li>• Providing false, misleading, or fraudulent information</li>
                <li>• Engaging in any form of scam or fraudulent activity</li>
                <li>• Using the platform for any illegal purposes</li>
                <li>• Attempting to compromise the security of our systems</li>
                <li>• Creating multiple accounts to circumvent bans or restrictions</li>
              </ul>
            </div>
          </section>

         
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Fraud Prevention and Enforcement</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Detection and Prevention</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Zylmora employs various methods to detect and prevent fraudulent activities</li>
                  <li>• We maintain a database of banned users and suspicious activities</li>
                  <li>• Scam emails and phone numbers are permanently blocked from our platform</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Consequences of Violations</h3>
                <p className="text-slate-600 mb-3">Violation of these terms may result in:</p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Immediate account suspension or termination</li>
                  <li>• Permanent ban from using our services</li>
                  <li>• Legal action as deemed necessary by Zylmora</li>
                  <li>• Reporting to relevant authorities</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Legal Action</h2>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <p className="text-slate-600 mb-4">Zylmora reserves the right to pursue legal action against users who:</p>
              <ul className="space-y-2 text-slate-600 mb-4">
                <li>• Engage in fraudulent activities</li>
                <li>• Violate these Terms of Service</li>
                <li>• Cause harm to our business or other users</li>
              </ul>
              <p className="text-slate-600 font-medium">
                Legal proceedings may utilize all available information including but not limited to email addresses, phone numbers, and any associated data.
              </p>
            </div>
          </section>

         
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Limitation of Liability</h2>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600">
                Zylmora shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>
            </div>
          </section>

        
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Modifications</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-slate-600">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website.
              </p>
            </div>
          </section>

       
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600 mb-4">For questions regarding these Terms of Service, contact us at:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center">
                    <span className="text-xs">📧</span>
                  </div>
                  <a href="mailto:legal@zylmora.com" className="text-slate-800 hover:text-slate-600 transition-colors">
                    legal@zylmora.com
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
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Important Notice</h3>
              </div>
              <p className="text-slate-100">
                By continuing to use Zylmora's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Violation of these terms may result in legal consequences.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}