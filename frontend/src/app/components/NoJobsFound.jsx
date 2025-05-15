"use client";

import Image from "next/image";

export default function NoJobsFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-3 text-center">
        No Jobs Found
      </h2>
      <p className="text-cyan-600 text-center max-w-md mb-6">
        We couldn't find any jobs matching your search criteria. Try adjusting
        your search terms or check back later for new opportunities.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer"
        >
          Refresh Page
        </button>
        <button
          onClick={() => (window.location.href = "/home")}
          className="px-6 py-3 bg-white/90 hover:bg-white text-cyan-600 rounded-lg transition-colors duration-200 font-medium border border-cyan-200 cursor-pointer"
        >
          Clear Search
        </button>
      </div>
    </div>
  );
}
