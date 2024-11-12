import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaUpload({ files, onChange }) {
  const handleFileChange = (e) => {
    const newFiles = [...files, ...e.target.files];
    onChange(newFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="media-upload"
        />
        <label htmlFor="media-upload" className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            className="bg-gray-700 text-gray-100"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </label>
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
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
