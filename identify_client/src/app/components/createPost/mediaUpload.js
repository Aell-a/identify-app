import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaUpload({ files, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = [...files, ...Array.from(e.target.files)];
    onChange(newFiles);
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
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          className="bg-green-500 hover:bg-green-600 text-gray-100 border-none mt-1"
        >
          <Upload className=" h-4 w-4" />
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
