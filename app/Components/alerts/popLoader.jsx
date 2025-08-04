import React from 'react'

function PopLoader() {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 flex flex-col items-center">
       
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading</h3>
        <p className="text-gray-600">Please wait while we process your request...</p>
      </div>
    </div>
  )
}

export default PopLoader
