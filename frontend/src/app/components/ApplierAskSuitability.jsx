"use client";

import { useState, useEffect } from "react";
import { aiService } from "@/app/api/aiService";

export default function ApplierAskSuitability({ applierId, jobId, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuitability = async () => {
      try {
        setIsLoading(true);
        const response = await aiService.askIsJobSuitable(applierId, jobId);
        setResult(response);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching suitability:", err);
        setError("Failed to analyze job suitability. Please try again later.");
        setIsLoading(false);
      }
    };

    if (applierId && jobId) {
      fetchSuitability();
    }
  }, [applierId, jobId]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 sm:p-8 relative">
          <h2 className="text-xl font-bold text-red-600 mb-3">
            Please Try Again
          </h2>
          <button
            onClick={handleClose}
            className="mt-6 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[80vh] overflow-y-auto overscroll-contain">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center">
          {isLoading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing job suitability...</p>
            </div>
          ) : error ? (
            <div className="py-8">
              <h2 className="text-xl font-bold text-red-600 mb-3">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2
                className={`text-4xl font-bold ${
                  result?.suitability === "Yes"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {result?.suitability}
              </h2>

              <div className="space-y-4 text-left">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-700 mb-2 whitespace-pre-line">
                    Explanation
                  </h3>
                  <p className="text-gray-700">{result?.explanation}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-cyan-700 mb-2 whitespace-pre-line">
                    Suggestions
                  </h3>
                  <p className="text-gray-700">{result?.suggestions}</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
