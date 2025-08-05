import React from 'react';
import { Trash2, Check, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

function Alert({ 
  type = 'info',
  title,
  message,
  isVisible = false,
  onClose,
  onConfirm,
  onCancel,
  confirmText,
  cancelText = 'Cancel',
  showCancel = false,
  data = null
}) {

  if (!isVisible) return null;

  const alertConfigs = {
    delete: {
      icon: <Trash2 className="text-white" size={24} />,
      bgGradient: 'from-red-500 to-red-700',
      title: title || 'Delete Address',
      buttonBg: 'from-red-600 to-red-700',
      buttonHover: 'hover:from-red-700 hover:to-red-800',
      confirmText: confirmText || 'Delete Address',
      showCancel: true
    },
    success: {
      icon: <Check className="text-white" size={24} />,
      bgGradient: 'from-green-500 to-emerald-700',
      title: title || 'Success!',
      buttonBg: 'from-slate-600 to-slate-800',
      buttonHover: 'hover:from-slate-700 hover:to-slate-900',
      confirmText: confirmText || 'Continue',
      showCancel: false
    },
    warning: {
      icon: <span className="text-white text-2xl">⚠️</span>,
      bgGradient: 'from-amber-500 to-orange-600',
      title: title || 'Attention Required',
      buttonBg: 'from-slate-600 to-slate-800',
      buttonHover: 'hover:from-slate-700 hover:to-slate-900',
      confirmText: confirmText || 'Got it',
      showCancel: false
    },
    error: {
      icon: <AlertCircle className="text-white" size={24} />,
      bgGradient: 'from-red-500 to-red-700',
      title: title || 'Error',
      buttonBg: 'from-red-600 to-red-700',
      buttonHover: 'hover:from-red-700 hover:to-red-800',
      confirmText: confirmText || 'OK',
      showCancel: false
    },
    info: {
      icon: <Info className="text-white" size={24} />,
      bgGradient: 'from-blue-500 to-blue-700',
      title: title || 'Information',
      buttonBg: 'from-blue-600 to-blue-700',
      buttonHover: 'hover:from-blue-700 hover:to-blue-800',
      confirmText: confirmText || 'OK',
      showCancel: false
    },
    confirm: {
      icon: <AlertTriangle className="text-white" size={24} />,
      bgGradient: 'from-indigo-500 to-purple-700',
      title: title || 'Confirm Action',
      buttonBg: 'from-indigo-600 to-indigo-700',
      buttonHover: 'hover:from-indigo-700 hover:to-indigo-800',
      confirmText: confirmText || 'Confirm',
      showCancel: true
    }
  };

  const config = alertConfigs[type] || alertConfigs.info;
  const shouldShowCancel = showCancel !== undefined ? showCancel : config.showCancel;

  const handleConfirm = () => {
    console.log('Confirm button clicked in Alert component');
    if (onConfirm) {
      onConfirm(data);
    } else if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked in Alert component');
    // Call onCancel first (which contains your custom logic + hide function)
    if (onCancel) {
      onCancel();
    }
    // If no onCancel is provided, fallback to onClose
    else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform animate-in zoom-in-90 duration-300">
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${config.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            {config.icon}
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-3">{config.title}</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>
          
          <div className="flex justify-center gap-4">
            {shouldShowCancel && (
              <button
                onClick={handleCancel}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 hover:bg-slate-100 rounded-xl"
              >
                {cancelText}
              </button>
            )}
            
            <button
              onClick={handleConfirm}
              className={`px-8 py-3 bg-gradient-to-r ${config.buttonBg} text-white rounded-xl ${config.buttonHover} font-medium transition-all duration-300 transform hover:scale-105 shadow-lg`}
            >
              {config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alert;