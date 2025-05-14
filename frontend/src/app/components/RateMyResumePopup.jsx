"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { aiService } from "@/app/api/aiService";

export default function RateMyResumePopup({ onClose, userId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (result?.score) {
      let start = 0;
      const end = parseInt(result.score);
      if (isNaN(end)) return;
      const duration = 800;
      const step = Math.max(1, Math.round(end / (duration / 16)));
      let raf;
      function animate() {
        start += step;
        if (start >= end) {
          setAnimatedScore(end);
        } else {
          setAnimatedScore(start);
          raf = requestAnimationFrame(animate);
        }
      }
      setAnimatedScore(0);
      raf = requestAnimationFrame(animate);
      return () => raf && cancelAnimationFrame(raf);
    }
  }, [result?.score]);

  const handleRateResume = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await aiService.rateMyResume(userId);
      setResult(response);
    } catch (error) {
      console.error("Error rating resume:", error);
      setError("Failed to rate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore <= 35) return "#ef4444"; // red-500
    if (numScore <= 70) return "#f59e42"; // yellow-500
    return "#22c55e"; // green-500
  };

  const getScoreBackground = (score) => {
    const numScore = parseInt(score);
    if (numScore <= 35) return "bg-red-50";
    if (numScore <= 70) return "bg-yellow-50";
    return "bg-green-50";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[80vh] overflow-y-auto overscroll-contain">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-700 mb-2">
            Rate My Resume
          </h2>
          <p className="text-gray-600">
            Get an AI-powered analysis of your resume
          </p>
        </div>

        {!result ? (
          <div className="flex flex-col items-center">
            <button
              onClick={handleRateResume}
              disabled={isLoading}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Analyze My Resume"
              )}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                  className="block"
                >
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="18"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    fill="none"
                    stroke={getScoreColor(animatedScore)}
                    strokeWidth="18"
                    strokeDasharray={2 * Math.PI * 65}
                    strokeDashoffset={
                      2 * Math.PI * 65 * (1 - animatedScore / 100)
                    }
                    strokeLinecap="round"
                    style={{
                      transition:
                        "stroke-dashoffset 0.5s cubic-bezier(.4,2,.6,1)",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-bold`}
                    style={{ color: getScoreColor(animatedScore) }}
                  >
                    {animatedScore}
                  </span>
                  <p className="text-sm text-gray-600">out of 100</p>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Strengths
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {result.strengths}
              </p>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Suggestions for Improvement
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {result.suggestions}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
