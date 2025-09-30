'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { PencilLine, Save, Lock, Mail, Phone, User, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '@/app/Context/contextProvider';
import Loader from '@/app/Components/Loader/loader';

export default function Account() {
  const { session, status } = useContext(UserContext);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
  };
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (status !== "loading") {
      if (!session) router.replace('/Authentication');
    }
  }, [status]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setFormData({
        name: user.Username || '',
        email: user.email || '',
        phone: user.phone || '',
        oldPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{11}$/, 'Phone number must be 11 digits')
      .required('Phone number is required'),
    newPassword: Yup.string().min(6, 'New password must be at least 6 characters'),
    oldPassword: Yup.string().when('newPassword', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required('Old password is required to change password'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSave = async (values) => {
    setIsEditing(false);
    setLoading(true);
    try {
      const updatePayload = {
        Id: session.user.id,
        updateData: {
          Username: values.name,
          email: values.email,
          phone: values.phone,
        },
      };

      if (values.newPassword) {
        updatePayload.updateData.oldPassword = values.oldPassword;
        updatePayload.updateData.newPassword = values.newPassword;
      }

      const res = await fetch('/api/User', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const result = await res.json();
      setTimeout(() => {
        setLoading(false);
      }, 500);

      if (!res.ok) {
        alert(result.message || 'Update failed');
        return;
      }

      setUser(result.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Something went wrong while updating.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8 md:py-12 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto pb-20">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/80 backdrop-blur-md hover:bg-white border border-gray-200/50 hover:border-indigo-300 rounded-2xl text-slate-700 hover:text-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Back</span>
        </button>

        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-indigo-200/50">
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <User className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    My Profile
                  </h1>
                  <p className="text-slate-600 mt-1 font-medium">Manage your account settings</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isEditing) {
                    document.getElementById('profile-form-submit').click();
                  }
                  setIsEditing((prev) => !prev);
                }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isEditing ? <Save className="w-5 h-5" /> : <PencilLine className="w-5 h-5" />}
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <Formik
              enableReinitialize
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSave}
            >
              {({ values, errors, touched }) => (
                <Form className="space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pb-2 border-b-2 border-indigo-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Profile Information
                    </h2>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <User className="w-4 h-4 text-indigo-500" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Field
                            type="text"
                            name="name"
                            className={`w-full px-5 py-4 border-2 ${
                              errors.name && touched.name ? 'border-red-300' : 'border-gray-200'
                            } rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 bg-white hover:border-indigo-200 font-medium`}
                            placeholder="Enter your full name"
                          />
                          <ErrorMessage name="name">
                            {msg => (
                              <div className="text-sm text-red-500 mt-2 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-4 h-4" />
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      ) : (
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 group-hover:border-indigo-200 transition-all duration-300">
                          <p className="text-lg font-semibold text-slate-800">{values.name}</p>
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Field
                            type="email"
                            name="email"
                            className={`w-full px-5 py-4 border-2 ${
                              errors.email && touched.email ? 'border-red-300' : 'border-gray-200'
                            } rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 bg-white hover:border-indigo-200 font-medium`}
                            placeholder="Enter your email"
                          />
                          <ErrorMessage name="email">
                            {msg => (
                              <div className="text-sm text-red-500 mt-2 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-4 h-4" />
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      ) : (
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 group-hover:border-indigo-200 transition-all duration-300">
                          <p className="text-lg font-semibold text-slate-800">{values.email}</p>
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <Phone className="w-4 h-4 text-indigo-500" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Field
                            type="text"
                            name="phone"
                            className={`w-full px-5 py-4 border-2 ${
                              errors.phone && touched.phone ? 'border-red-300' : 'border-gray-200'
                            } rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 bg-white hover:border-indigo-200 font-medium`}
                            placeholder="Enter your phone number"
                          />
                          <ErrorMessage name="phone">
                            {msg => (
                              <div className="text-sm text-red-500 mt-2 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-4 h-4" />
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      ) : (
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 group-hover:border-indigo-200 transition-all duration-300">
                          <p className="text-lg font-semibold text-slate-800">{values.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-10 pt-8 border-t-2 border-gray-200 space-y-6">
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pb-2 border-b-2 border-pink-100">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                        Security Settings
                      </h2>

                      <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6 border-2 border-pink-100">
                        <div className="space-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                              <Lock className="w-4 h-4 text-pink-500" />
                              Current Password
                            </label>
                            <Field
                              type="password"
                              name="oldPassword"
                              className={`w-full px-5 py-4 border-2 ${
                                errors.oldPassword && touched.oldPassword ? 'border-red-300' : 'border-gray-200'
                              } rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300 bg-white hover:border-pink-200 font-medium`}
                              placeholder="Enter current password"
                            />
                            <ErrorMessage name="oldPassword">
                              {msg => (
                                <div className="text-sm text-red-500 mt-2 flex items-center gap-1 font-medium">
                                  <AlertCircle className="w-4 h-4" />
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                              <Lock className="w-4 h-4 text-pink-500" />
                              New Password
                            </label>
                            <Field
                              type="password"
                              name="newPassword"
                              className={`w-full px-5 py-4 border-2 ${
                                errors.newPassword && touched.newPassword ? 'border-red-300' : 'border-gray-200'
                              } rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300 bg-white hover:border-pink-200 font-medium`}
                              placeholder="Enter new password"
                            />
                            <ErrorMessage name="newPassword">
                              {msg => (
                                <div className="text-sm text-red-500 mt-2 flex items-center gap-1 font-medium">
                                  <AlertCircle className="w-4 h-4" />
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        id="profile-form-submit"
                        className="w-full mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-300/50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        Save All Changes
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}