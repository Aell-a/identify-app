"use client";

import { useState, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ImageCropper({ image, onCropComplete }) {
  const [crop, setCrop] = useState({ aspect: 1, width: 200 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onImageLoad = useCallback((img) => {
    const aspect = 1;
    const width = Math.min(img.width, img.height);
    setCrop({ aspect, width });
  }, []);

  const handleCropComplete = useCallback(() => {
    if (completedCrop?.width && completedCrop?.height) {
      const canvas = document.createElement("canvas");
      const image = document.getElementById("cropImage");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          onCropComplete(blob);
        },
        "image/jpeg",
        1
      );
    }
  }, [completedCrop, onCropComplete]);

  return (
    <div className="flex flex-col items-center text-white">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={1}
      >
        <Image
          src={image}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          id="cropImage"
          alt="uploaded image"
          onLoad={onImageLoad}
        />
      </ReactCrop>
      <div className="mt-4 space-x-4">
        <Button
          onClick={handleCropComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Crop and Save
        </Button>
        <Button
          onClick={() => onCropComplete(null)}
          className="bg-gray-600 hover:bg-gray-700 text-white border border-gray-500"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
