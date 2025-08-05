'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '@/app/Components/alerts/Alert';
import { useLoader } from '../loader/loaderProvider';
export const AlertContext = createContext();

export function AlertProvider({ children }) {
  const {hideLoader}=useLoader();
  const [alert, setAlert] = useState({
    isVisible: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    data: null,
    autoClose: false,
    duration: 3000
  });

  const hideAlert = useCallback(() => {
    console.log('hideAlert called - hiding alert');
    setAlert(prev => ({ ...prev, isVisible: false }));
  }, []);

  const [alertQueue, setAlertQueue] = useState([]);

  const queueAlert = useCallback((alertConfig) => {
    if (alert.isVisible) {
      setAlertQueue(prev => [...prev, alertConfig]);
    } else {
      setAlert(alertConfig);
    }
  }, [alert.isVisible]);

  const processQueue = useCallback(() => {
    if (alertQueue.length > 0) {
      const nextAlert = alertQueue[0];
      setAlertQueue(prev => prev.slice(1));
      setAlert(nextAlert);
    }
  }, [alertQueue]);

  const hideAlertWithQueue = useCallback(() => {
    console.log('hideAlertWithQueue called');
    hideAlert();
    setTimeout(processQueue, 100); 
  }, [hideAlert, processQueue]);

  const showAlert = {
    success: (message, options = {}) =>{
           hideLoader();
      setAlert({ 
        isVisible: true, 
        type: 'success', 
        message, 
        title: options.title || 'Success',
        confirmText: 'OK',
        onConfirm: options.onConfirm || hideAlertWithQueue, 
        autoClose: options.autoClose !== false,
        ...options 
      })},
    
    error: (message, options = {}) =>{
           hideLoader();
      setAlert({ 
        isVisible: true, 
        type: 'error', 
        message, 
        title: options.title || 'Error',
        confirmText: 'OK',
        onConfirm: options.onConfirm || hideAlertWithQueue, 
        autoClose: false,
        ...options 
      })},
    
    warning: (message, options = {}) =>{
           hideLoader();
      setAlert({ 
        isVisible: true, 
        type: 'warning', 
        message, 
        title: options.title || 'Warning',
        confirmText: 'OK',
        onConfirm: options.onConfirm || hideAlertWithQueue, 
        autoClose: options.autoClose !== false,
        ...options 
      })},
    
    info: (message, options = {}) =>{
           hideLoader();
      setAlert({ 
        isVisible: true, 
        type: 'info', 
        message, 
        title: options.title || 'Information',
        confirmText: 'OK',
        onConfirm: options.onConfirm || hideAlertWithQueue, 
        autoClose: options.autoClose !== false,
        ...options 
      })},
    
    confirm: (message, onConfirm, options = {}) => {
           hideLoader();
     
      
      const confirmHandler = () => {
        console.log('Confirm button clicked');
        onConfirm(); 
        hideAlertWithQueue(); 
      };

      const cancelHandler = () => {
       
        hideAlertWithQueue();
        
        if (options.onCancel) {
          options.onCancel();
        }
      };

      setAlert({
        isVisible: true,
        type: 'confirm',
        message,
        title: options.title || 'Confirm Action',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        showCancel: true,
        autoClose: false,
        onConfirm: confirmHandler,
        onCancel: cancelHandler,
      
        ...options,
  
        onConfirm: confirmHandler,
        onCancel: cancelHandler
      });
    },
    
    delete: (message, onConfirm, data = null, options = {}) => {
           hideLoader();
      const cancelHandler = () => {
        console.log('Delete cancelled');
        hideAlertWithQueue();
        if (options.onCancel) {
          options.onCancel();
        }
      };

      const confirmHandler = (data) => {
        console.log('Delete confirmed');
        onConfirm(data); 
        hideAlertWithQueue(); 
      };

      setAlert({
        isVisible: true,
        type: 'delete',
        message,
        title: options.title || 'Delete Item',
        confirmText: options.confirmText || 'Delete',
        cancelText: options.cancelText || 'Cancel',
        data,
        showCancel: true,
        autoClose: false,
        
        ...options,
        onConfirm: confirmHandler,
        onCancel: cancelHandler
      });
    }
  };

  return (
    <AlertContext.Provider value={{ 
      showAlert, 
      hideAlert: hideAlertWithQueue,
      queueAlert,
      isAlertVisible: alert.isVisible 
    }}>
      {children}
      <Alert 
        {...alert} 
        onClose={hideAlertWithQueue}
        onCancel={alert.onCancel} 
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}