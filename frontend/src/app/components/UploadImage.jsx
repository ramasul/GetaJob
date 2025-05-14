"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import ImageCropper from "./ImageCropper";

export default function UploadImage({ onClose, onSave }) {
  const [image, setImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedFile, setCroppedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile) => {
    setCroppedFile(croppedFile);
    setImage(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  };

  const handleCancel = () => {
    setShowCropper(false);
    setImage(null);
    setCroppedFile(null);
  };

  const handleSave = async () => {
    if (croppedFile) {
      try {
        setIsSaving(true);
        await onSave(croppedFile);
      } catch (error) {
        console.error("Error saving image:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-700 mb-2">
            Update Profile Picture
          </h2>
          <p className="text-gray-600">Upload and crop your profile picture</p>
        </div>

        <div className="mb-6">
          {!showCropper ? (
            <div className="flex justify-center">
              <div
                className="relative w-48 h-48 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-cyan-500 transition-colors overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 text-sm">Click to upload</p>
                    <p className="text-gray-500 text-xs mt-1">
                      JPG, PNG (max. 2MB)
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm">Click to change</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-hidden">
              <ImageCropper
                imageUrl={image}
                onCropComplete={handleCropComplete}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>

        {!showCropper && image && (
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="cursor-pointer px-6 py-2.5 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="cursor-pointer px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
