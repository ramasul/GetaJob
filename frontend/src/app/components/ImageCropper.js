"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function ImageCropper({ imageUrl, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function onImageLoad(e) {
      const { width, height } = e.currentTarget;

      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 80,
          },
          1,
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
    }

    if (imgRef.current) {
      imgRef.current.addEventListener("load", onImageLoad);
      return () => {
        if (imgRef.current) {
          imgRef.current.removeEventListener("load", onImageLoad);
        }
      };
    }
  }, [imgRef]);

  const handleCropClick = () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.scale(1, 1);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }

        const croppedFile = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });

        onCropComplete(croppedFile);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg p-3 sm:p-4 max-w-lg w-full flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-cyan-700 mb-1 sm:mb-2">
          Crop your photo
        </h3>
        <p className="text-sm text-cyan-700 mb-2">
          Drag the image and corners to adjust your profile picture
        </p>

        <div
          ref={containerRef}
          className="flex-1 overflow-hidden flex justify-center items-center"
        >
          <div className="flex justify-center items-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={false}
              keepSelection
              className="max-h-[60vh]"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop me"
                className="max-h-[60vh] max-w-full object-contain"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center",
                }}
                draggable="true"
              />
            </ReactCrop>
          </div>
        </div>

        <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div className="text-xs text-cyan-700 mb-2 sm:mb-0">
            <ul>
              <li>• Drag the image to position it</li>
              <li>• Drag corners to resize crop area</li>
            </ul>
          </div>
          <div className="flex space-x-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropClick}
              className="px-4 py-2 text-sm font-medium bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
