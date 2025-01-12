import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaUpload({ files, onChange, onError }) {
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const VALID_TYPES = ["image/jpeg", "image/png"];

    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds maximum size of 10MB`;
    }

    if (!VALID_TYPES.includes(file.type)) {
      return `File "${file.name}" is not a valid format. Supported formats: JPG, PNG`;
    }

    return null;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let hasError = false;

    selectedFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        onError(error);
        hasError = true;
      }
    });

    if (!hasError) {
      const newFiles = [...files, ...selectedFiles];
      onChange(newFiles);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          accept="image/jpeg,image/png"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          className="bg-green-500 hover:bg-green-600 text-gray-100 border-none mt-1"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-700 p-2 rounded"
            >
              <span className="truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                className="bg-red-600 hover:bg-red-400"
              >
                <X className="h-4 w-4 text-gray-100" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
