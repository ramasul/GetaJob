"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePicturePopup({ onClose }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  const handleLater = () => {
    setIsVisible(false);
    onClose();
  };

  const handleOkay = () => {
    setIsVisible(false);
    onClose();
    router.push("/applicant/profile");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          onClick={handleLater}
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
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Image
              src="/image/3DHero.png"
              alt="Profile Picture"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-2xl font-bold text-cyan-700 mb-3">
            Add Your Profile Picture
          </h2>

          <p className="text-gray-600 mb-8">
            Make your profile stand out by adding a professional photo. This
            helps recruiters recognize you better.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleLater}
              className="px-6 py-2.5 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition font-medium cursor-pointer"
            >
              Later
            </button>
            <button
              onClick={handleOkay}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
