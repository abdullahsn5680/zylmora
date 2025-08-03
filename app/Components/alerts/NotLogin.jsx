import React from 'react'

function NotLogin() {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Requires Login</h3>
              <p className="text-gray-600 mb-6">You are not logged in please login first.</p>
              <div className="flex justify-end gap-3">
            
                <button
                  onClick={() => router.push('./Authentication')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
  )
}

export default NotLogin
