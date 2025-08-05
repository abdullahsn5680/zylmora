import React, { useState, useEffect } from 'react'

function PopLoader({ 
  isVisible = true, 
  message = "We're working on your request. Almost there!",
  title = "Loading...",
  showProgress = true,
  autoProgress = true,
  initialProgress = 0,
  onComplete
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [currentMessage, setCurrentMessage] = useState(message);

  const loadingStages = [
    { progress: 0, message: "Initializing your request..." },
    { progress: 20, message: "Connecting to server..." },
    { progress: 40, message: "Processing data..." },
    { progress: 60, message: "Validating information..." },
    { progress: 80, message: "Finalizing results..." },
    { progress: 100, message: "Complete!" }
  ];

  useEffect(() => {
    let interval;
    let stageIndex = 0;

    if (isVisible && autoProgress) {
      interval = setInterval(() => {
        if (stageIndex < loadingStages.length) {
          const stage = loadingStages[stageIndex];
          setProgress(stage.progress);
          setCurrentMessage(stage.message);
          
          if (stage.progress === 100) {
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 1000);
          }
          
          stageIndex++;
        }
      }, 800 + Math.random() * 600); 
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, autoProgress, onComplete]);


  useEffect(() => {
    if (isVisible && autoProgress) {
      setProgress(initialProgress);
      setCurrentMessage(message);
    }
  }, [isVisible, autoProgress, initialProgress, message]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform animate-in zoom-in-90 duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="animate-pulse">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {autoProgress ? currentMessage : message}
          </p>
          
          {showProgress && (
            <>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                 
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
           
              <div className="text-sm font-semibold text-indigo-600 mb-4">
                {Math.round(progress)}%
              </div>
            </>
          )}
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out;
        }
        
        .zoom-in-90 {
          transform: scale(0.9);
        }
      `}</style>
    </div>
  );
}

export default PopLoader;
