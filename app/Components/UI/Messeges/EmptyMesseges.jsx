import React from "react";
function EmptyMesseges({
  icon,
  title,
  message,
  actionText,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 md:p-16 text-center">
      {icon && (
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
          <span className="text-5xl sm:text-6xl opacity-60">{icon}</span>
        </div>
      )}

      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700 mb-3 sm:mb-4">
        {title}
      </h3>

      <p className="text-slate-500 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
        {message}
      </p>

      {actionText ? (
        <div className="mt-10 px-4 py-2 w-fit bg-slate-100 mx-auto text-slate-600 rounded-full text-sm">
          {actionText}
        </div>
      ) : (
        buttonText && (
          <button
            onClick={() => onButtonClick()}
            className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl sm:rounded-2xl hover:from-slate-800 hover:to-slate-950 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
          >
            {buttonText}
          </button>
        )
      )}
    </div>
  );
}

export default EmptyMesseges;
