import React from 'react'

function Alert() {
  return (
      <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
              <p className="text-gray-600 mb-6">Some Thing Went Wrong.</p>
              <div className="flex justify-end gap-3">
            
                <button
                  onClick={() => setAlert(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
  )
}

export default Alert
