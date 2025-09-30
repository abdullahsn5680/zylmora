'use client';
import { signOut } from 'next-auth/react';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
import { LoaderContext } from '@/app/Context/contextProvider';
import {
  User,
  Package,
  Heart,
  LogOut,
  ShoppingBag,
  Shield,
  PlusCircle,
  Layers3,
  Edit,
  Home,
  ChevronRight,
  Sparkles,
  Crown,
  MapPin,
  Briefcase
} from 'lucide-react';

export default function ProfilePage() {
  const { session, status } = useContext(UserContext);
  const [loader, setLoading] = useContext(LoaderContext);
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (!session) router.replace('/Authentication');
    }
  }, [status]);

  const isAdmin = session?.user?.role === true;

  useEffect(() => {
    if (!session) {
      router.push('/Authentication');
    }
  }, []);

  useEffect(() => {

    router.prefetch('/Profile/Orders');
    router.prefetch('/Profile/Wishlist');
    router.prefetch('/Profile/Cart');
    router.prefetch('/Profile/Address');
  }, []);

  useEffect(() => {
    if (isAdmin) {
      router.prefetch('/Admin/AddProducts');
      router.prefetch('/Admin/Collections');
      router.prefetch('/Admin/Order');
      router.prefetch('/Admin/Products');
      router.prefetch('/Admin/UpdateProduct');
    }
  }, []);

  const userMenuOptions = [
    {
      label: 'Manage My Account',
      icon: <User size={20} />,
      path: '/Profile/Account',
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      description: 'Update your personal information'
    },
    {
      label: 'My Orders',
      icon: <Package size={20} />,
      path: '/Profile/Orders',
      gradient: 'from-emerald-400 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      description: 'Track and manage your orders'
    },
    {
      label: 'My Wishlist',
      icon: <Heart size={20} />,
      path: '/Profile/Wishlist',
      gradient: 'from-pink-400 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      description: 'View your saved items'
    },
    {
      label: 'My Cart',
      icon: <ShoppingBag size={20} />,
      path: '/Profile/Cart',
      gradient: 'from-purple-400 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      description: 'Review items in your cart'
    },
    {
      label: 'Address Book',
      icon: <MapPin size={20} />,
      path: '/Profile/Address',
      gradient: 'from-orange-400 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
      description: 'Manage delivery addresses'
    }
  ];

  const adminMenuOptions = [
    {
      label: 'Dashboard Home',
      icon: <Home size={20} />,
      path: '/Admin',
      gradient: 'from-slate-400 to-gray-600',
      bgGradient: 'from-slate-50 to-gray-50',
      description: 'Admin dashboard overview'
    },
    {
      label: 'Add Products',
      icon: <PlusCircle size={20} />,
      path: '/Admin/AddProducts',
      gradient: 'from-teal-400 to-cyan-500',
      bgGradient: 'from-teal-50 to-cyan-50',
      description: 'Add new products to store'
    },
    {
      label: 'All Products',
      icon: <Briefcase size={20} />,
      path: '/Admin/Products',
      gradient: 'from-violet-400 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50',
      description: 'Manage product inventory'
    },
    {
      label: 'Collections',
      icon: <Layers3 size={20} />,
      path: '/Admin/Collections',
      gradient: 'from-fuchsia-400 to-pink-500',
      bgGradient: 'from-fuchsia-50 to-pink-50',
      description: 'Organize product collections'
    },
    {
      label: 'All Orders',
      icon: <Package size={20} />,
      path: '/Admin/Order',
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      description: 'Manage customer orders'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden pb-20">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}} />
      </div>

     
      <div className="relative z-1 bg-white/70 backdrop-blur-xl shadow-xl border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <User className="w-12 h-12 text-white" />
              </div>
              {isAdmin && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl mb-4 border border-gray-200/60 shadow-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
                {isAdmin ? 'Admin Panel' : 'User Profile'}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-4 tracking-tight">
              {session?.user?.name || 'My Profile'}
            </h1>

            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
              {isAdmin 
                ? 'Manage your store, products, and customer orders from your admin dashboard'
                : 'Access and manage your account, orders, wishlist, and preferences in one place'}
            </p>
          </div>
        </div>
      </div>

    
      <div className="relative z-1 max-w-6xl mx-auto px-6 py-16">
       
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 tracking-tight">
              My Account
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userMenuOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => router.push(option.path)}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-200/60 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                
                <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-40`} />

               
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      {option.icon}
                    </div>
                    
                    <div className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {option.label}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </div>

              
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${option.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-3xl`} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl" />
              </div>
            ))}
          </div>
        </div>

      
        {isAdmin && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl mb-4 border border-orange-200/60 shadow-lg">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold uppercase tracking-wider text-orange-700">
                  Admin Controls
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 tracking-tight">
                Store Management
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminMenuOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => router.push(option.path)}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-200/60 animate-fade-in-up"
                  style={{
                    animationDelay: `${(index + userMenuOptions.length) * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-40`} />
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {option.icon}
                      </div>
                      
                      <div className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                      {option.label}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${option.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-3xl`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <div
            onClick={() => signOut()}
            className="group relative bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer border border-red-200/60"
          >
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-pink-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <LogOut size={20} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                      Logout
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sign out of your account
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl" />
          </div>
        </div>
      </div>

 
    </div>
  );
}