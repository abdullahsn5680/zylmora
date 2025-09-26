import React from 'react';
import { Shield, Lock, Eye, Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Zylmora collects, uses, and protects your personal information.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-slate-500">
              <span>Effective Date: January 1, 2025</span>
              <span>•</span>
              <span>Last Updated: January 1, 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12 space-y-12">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Introduction</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Welcome to Zylmora ("we," "our," or "us"). We are committed to protecting your privacy and being transparent about how we handle your information. This Privacy Policy explains our data practices for our website and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Information We Collect</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Location Data</h3>
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li>• We only access your location when you explicitly choose to use our auto-location feature for address entry</li>
                  <li>• This location data is used solely to help you add your delivery address more conveniently</li>
                  <li>• We do not store or retain your location information after this process</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Contact Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-slate-700 mb-2">What we collect:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• <strong>Email Address:</strong> For user verification, product communications, and our own marketing</li>
                      <li>• <strong>Phone Number:</strong> For user verification, product communications, and safety purposes</li>
                      <li>• <strong>Address:</strong> For delivery purposes and safety/security records</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-2">How we use it:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• User account verification and authentication</li>
                      <li>• Product details, updates, and order communications</li>
                      <li>• Marketing communications about Zylmora products and services</li>
                      <li>• Safety and security purposes to protect our platform and users</li>
                      <li>• Other processes directly related to our products and services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">How We Use Your Information</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600 mb-4">We use the information we collect for the following purposes:</p>
              <ul className="space-y-2 text-slate-600">
                <li>• User account verification and authentication</li>
                <li>• Providing product information and updates</li>
                <li>• Processing and fulfilling orders</li>
                <li>• Communicating about our products and services</li>
                <li>• Preventing fraud and maintaining platform security</li>
              </ul>
            </div>
          </section>

          {/* Information Retention and Security */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Information Retention and Security</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Retention Policy</h3>
                <div className="space-y-2 text-slate-600">
                  <p>• <strong>Email addresses:</strong> We may keep your email for our own future marketing of Zylmora products and services</p>
                  <p>• <strong>Phone numbers, addresses, and location data:</strong> We retain this information for safety and security purposes</p>
                  <p>• <strong>We do not sell any personal information to other organizations for money</strong></p>
                  <p>• All retained information is stored securely and used only for the purposes stated in this policy</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Security Measures</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• All user passwords are encrypted in our database</li>
                  <li>• We implement industry-standard security measures to protect your data</li>
                  <li>• Your personal information is stored securely and access is restricted to authorized personnel only</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fraud Prevention */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Fraud Prevention and Legal Protection</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Scam Prevention</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• To protect Zylmora from fraudulent activities, we maintain records of banned users</li>
                  <li>• If a scam email or phone number is detected, the associated user account will be permanently banned</li>
                  <li>• We reserve the right to take legal action against users who engage in fraudulent activities</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Legal Action</h3>
                <p className="text-slate-600 mb-3">Zylmora may pursue legal action against users who:</p>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>• Provide false or fraudulent information</li>
                  <li>• Engage in scam activities</li>
                  <li>• Violate our terms of service</li>
                </ul>
                <p className="text-slate-600">Legal action may involve using the provided phone number, email address, and any associated information.</p>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Data Sharing and Sale</h2>
              <div className="space-y-3">
                <p className="text-green-800 font-semibold text-lg">
                  We do not sell your personal information to other organizations for money.
                </p>
                <div className="space-y-2 text-slate-600">
                  <p>• Your data is never sold to third-party companies or organizations</p>
                  <p>• We may use your email address for our own marketing of Zylmora products and services</p>
                  <p>• Phone numbers, addresses, and location data are kept for safety and security purposes only</p>
                  <p>• Your personal information remains under Zylmora's control and protection</p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Rights</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600 mb-4">You have the right to:</p>
              <ul className="space-y-2 text-slate-600">
                <li>• Request information about the data we hold about you</li>
                <li>• Request correction of inaccurate information</li>
                <li>• Request deletion of your personal information (subject to legal retention requirements)</li>
                <li>• Withdraw consent for data processing where applicable</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-slate-600 mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <a href="mailto:privacy@zylmora.com" className="text-slate-800 hover:text-slate-600 transition-colors">
                    privacy@zylmora.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-600" />
                  <a href="tel:+12345678900" className="text-slate-800 hover:text-slate-600 transition-colors">
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}