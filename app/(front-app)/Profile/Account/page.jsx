'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { PencilLine, Save } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '@/app/Context/contextProvider';
import Loader from '@/app/Components/Loader/loader';
export default function ProfilePage() {
  const {  session,status } =useContext(UserContext)
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const {user, setUser} = useContext(UserContext);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
  };
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialValues);
useEffect(()=>{
    if(status !== "loading"){
     if(!session) router.replace('/Authentication')
    }
    
  },[status])
  useEffect(() => {
    if (user) {
      setTimeout(() => {
            setLoading(false)
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
    setLoading(true)
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
            setLoading(false)
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
<div className="min-h-screen bg-gradient-to-br from-slate-50 pb-20 via-gray-50 to-stone-50 px-4 py-10 flex flex-col items-center gap-6">

  <div className="w-full max-w-xl flex justify-start mb-2">
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-slate-700 hover:text-slate-800 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
    >
      <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="text-sm font-medium">Back</span>
    </button>
  </div>

 
  <div className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl rounded-2xl w-full max-w-xl p-8 border border-gray-100 transition-all duration-500">
 
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">My Profile</h2>
      </div>
      <button
        onClick={() => {
          if (isEditing) {
            document.getElementById('profile-form-submit').click();
          }
          setIsEditing((prev) => !prev);
        }}
        className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
      >
        {isEditing ? <Save size={16} /> : <PencilLine size={16} />}
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>

 
    <Formik
      enableReinitialize
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={handleSave}
    >
      {({ values, handleSubmit }) => (
        <Form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'email', 'phone'].map((field) => (
            <div key={field} className="group">
              <label className="block text-sm font-semibold text-slate-600 mb-2 capitalize">
                {field}
              </label>
              {isEditing ? (
                <div className="relative">
                  <Field
                    type="text"
                    name={field}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white hover:border-gray-300"
                    placeholder={`Enter your ${field}`}
                  />
                  <ErrorMessage 
                    name={field} 
                    component="div" 
                    className="text-sm text-red-500 mt-2 flex items-center gap-1"
                  />
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-gray-100">
                  <p className="text-base font-medium text-slate-800">{values[field]}</p>
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Change Password
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Current Password
                  </label>
                  <Field
                    type="password"
                    name="oldPassword"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white hover:border-gray-300"
                    placeholder="Enter current password"
                  />
                  <ErrorMessage
                    name="oldPassword"
                    component="div"
                    className="text-sm text-red-500 mt-2 flex items-center gap-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white hover:border-gray-300"
                    placeholder="Enter new password"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-sm text-red-500 mt-2 flex items-center gap-1"
                  />
                </div>

                <button
                  type="submit"
                  id="profile-form-submit"
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </Form>
      )}
    </Formik>

    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 rounded-t-2xl"></div>
  </div>
</div>
  );
}
