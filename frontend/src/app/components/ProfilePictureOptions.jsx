"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ProfilePictureOptions({ onClose, onDelete, onChange }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          disabled={isDeleting}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Profile Picture Options
          </h2>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer w-full px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Delete my profile picture"
            )}
          </button>
          <button
            onClick={onChange}
            disabled={isDeleting}
            className="cursor-pointer w-full px-4 py-2.5 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change my profile picture
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer w-full px-4 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
