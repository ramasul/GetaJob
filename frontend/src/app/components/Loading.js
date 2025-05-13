"use client";

import React from "react";

const Loading = ({ fullScreen = true }) => {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "min-h-[200px]"} w-full bg-gradient-to-tr from-cyan-400 to-cyan-200 flex flex-col items-center justify-center`}
    >
      <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-8 flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>

        <h2 className="mt-6 text-blue-600 font-medium text-xl">Loading</h2>
        <p className="text-blue-800 opacity-80 mt-2 text-center">
          Please wait while we process your request
        </p>

        <div className="flex mt-4 space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

// Best practicenya sih taruh di file css terpisah
const styles = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animation-delay-150 {
    animation-delay: 150ms;
  }
  
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  
  .animation-delay-400 {
    animation-delay: 400ms;
  }
`;

export default Loading;
