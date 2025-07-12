'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { PencilLine, Save } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '@/app/Context/contextProvider';
import Loader from '@/app/Components/Loader/loader';
export default function ProfilePage() {
  const {  session } =useContext(UserContext)
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
    if(!session){
      router.replace('/Authentication')
    }
    
  },[])
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
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col items-center gap-6">
      <div className="w-full max-w-xl flex justify-start mb-2">
        <button
          onClick={() => router.back()}
          className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
          <button
            onClick={() => {
              if (isEditing) {
                document.getElementById('profile-form-submit').click();
              }
              setIsEditing((prev) => !prev);
            }}
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
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
            <Form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'email', 'phone'].map((field) => (
                <div key={field}>
                  <p className="text-sm text-gray-500 capitalize">{field}</p>
                  {isEditing ? (
                    <>
                      <Field
                        type="text"
                        name={field}
                        className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                      />
                      <ErrorMessage name={field} component="div" className="text-sm text-red-500" />
                    </>
                  ) : (
                    <p className="text-base font-medium text-gray-900">{values[field]}</p>
                  )}
                </div>
              ))}

              {/* Password change section */}
              {isEditing && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Old Password</p>
                    <Field
                      type="password"
                      name="oldPassword"
                      className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">New Password</p>
                    <Field
                      type="password"
                      name="newPassword"
                      className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    id="profile-form-submit"
                    className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                  >
                    Submit Changes
                  </button>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
