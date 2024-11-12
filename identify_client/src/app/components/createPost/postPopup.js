"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import WeightSlider from "./weightSlider";
import MultiSelect from "./multiSelect";
import SizeInput from "./sizeInput";
import MediaUpload from "./mediaUpload";
import WikidataSearch from "./wikidataSearch";

export default function PostPopup({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    weight: 0,
    weightUnit: "g",
    colors: [],
    shapes: [],
    materials: [],
    size: { length: "", width: "", depth: "", unit: "cm" },
    mediaFiles: [],
    labels: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeightChange = (weight, unit) => {
    setFormData((prev) => ({ ...prev, weight, weightUnit: unit }));
  };

  const handleMultiSelect = (name, selectedItems) => {
    setFormData((prev) => ({ ...prev, [name]: selectedItems }));
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => ({ ...prev, size }));
  };

  const handleMediaChange = (files) => {
    setFormData((prev) => ({ ...prev, mediaFiles: files }));
  };

  const handleLabelChange = (labels) => {
    setFormData((prev) => ({ ...prev, labels }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "mediaFiles" && key !== "labels" && key !== "size") {
        postData.append(key, JSON.stringify(formData[key]));
      }
    });

    // Append size
    postData.append("size", JSON.stringify(formData.size));

    // Append media files
    formData.mediaFiles.forEach((file, index) => {
      postData.append(`mediaRequests[${index}].file`, file);
    });

    // Append labels
    formData.labels.forEach((label, index) => {
      postData.append(`labelRequests[${index}].wikidataId`, label.wikidataId);
      postData.append(`labelRequests[${index}].description`, label.description);
      postData.append(`labelRequests[${index}].title`, label.title);
      postData.append(
        `labelRequests[${index}].relatedLabels`,
        JSON.stringify(label.relatedLabels)
      );
    });

    onSubmit(postData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="bg-gray-700 text-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="bg-gray-700 text-gray-100"
            />
          </div>
          <div>
            <Label>Weight</Label>
            <WeightSlider
              value={formData.weight}
              unit={formData.weightUnit}
              onChange={handleWeightChange}
            />
          </div>
          <div>
            <Label>Colors</Label>
            <MultiSelect
              items={[
                "Red",
                "Blue",
                "Green",
                "Yellow",
                "Purple",
                "Orange",
                "Black",
                "White",
                "Gray",
                "Brown",
              ]}
              selectedItems={formData.colors}
              onChange={(items) => handleMultiSelect("colors", items)}
            />
          </div>
          <div>
            <Label>Shapes</Label>
            <MultiSelect
              items={[
                "Cube",
                "Sphere",
                "Pyramid",
                "Cylinder",
                "Cone",
                "Prism",
                "Irregular",
              ]}
              selectedItems={formData.shapes}
              onChange={(items) => handleMultiSelect("shapes", items)}
            />
          </div>
          <div>
            <Label>Materials</Label>
            <MultiSelect
              items={[
                "Metal",
                "Wood",
                "Plastic",
                "Glass",
                "Ceramic",
                "Stone",
                "Fabric",
                "Unknown",
              ]}
              selectedItems={formData.materials}
              onChange={(items) => handleMultiSelect("materials", items)}
            />
          </div>
          <div>
            <Label>Size</Label>
            <SizeInput value={formData.size} onChange={handleSizeChange} />
          </div>
          <div>
            <Label>Upload Media</Label>
            <MediaUpload
              files={formData.mediaFiles}
              onChange={handleMediaChange}
            />
          </div>
          <div>
            <Label>Labels</Label>
            <WikidataSearch
              selectedLabels={formData.labels}
              onChange={handleLabelChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
