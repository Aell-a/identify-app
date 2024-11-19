import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StepSlider from "@/app/components/createPost/stepSlider";
import MultiSelect from "@/app/components/createPost/multiSelect";
import SizeInput from "@/app/components/createPost/sizeInput";
import WikidataSearch from "@/app/components/createPost/wikidataSearch";
import MediaUpload from "./mediaUpload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";

const unitConversions = {
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
};

export default function PostPopup({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaFiles: [],
    weightRange: "",
    colors: [],
    shapes: [],
    materials: [],
    size: { length: "", width: "", depth: "", unit: "cm" },
    labels: [],
  });
  const { id } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeightChange = (value) => {
    setFormData((prev) => ({ ...prev, weightRange: value }));
  };

  const handleMultiSelect = (name, selectedItems) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedItems,
    }));
  };
  const handleSizeChange = (size) => {
    setFormData((prev) => ({ ...prev, size }));
  };

  const handleLabelChange = (labels) => {
    setFormData((prev) => ({ ...prev, labels }));
  };

  const handleMediaChange = (files) => {
    setFormData((prev) => ({ ...prev, mediaFiles: files }));
  };

  const convertToCm = (value, unit) => {
    return parseFloat(value) * unitConversions[unit];
  };

  const formatDataForEndpoint = () => {
    const { length, width, depth, unit } = formData.size;
    return {
      userId: id,
      title: formData.title,
      description: formData.description,
      weight: formData.weightRange,
      colors: formData.colors,
      shapes: formData.shapes,
      materials: formData.materials,
      sizeX: convertToCm(length, unit),
      sizeY: width ? convertToCm(width, unit) : undefined,
      sizeZ: depth ? convertToCm(depth, unit) : undefined,
      mediaRequests: formData.mediaFiles.map((file) => ({ file })),
      labelRequests: formData.labels.map((label) => ({
        wikidataId: label.wikidataId,
        description: label.description,
        title: label.title,
        relatedLabels: label.relatedLabels,
      })),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = formatDataForEndpoint();
    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Creating a Post</DialogTitle>
      <DialogContent
        className="sm:max-w-[900px] bg-gray-800 text-gray-100 border-none flex"
        description="object identification"
      >
        <div className="w-1/2 pr-4 space-y-4">
          <h1 className="text-2xl">Create a New Post</h1>
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="bg-gray-700 text-gray-100 border-none"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="bg-gray-700 text-gray-100 border-none"
            />
          </div>
          <div className="">
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
          <div className="place-self-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 mt-4"
                    onClick={handleSubmit}
                  >
                    Create Post
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Every post should have a title, description and a media
                    file.
                  </p>
                  <p>
                    Please add as many identifiers and labels as you can to help
                    your community identify the object.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="w-1/2 pl-4 space-y-4">
          <div>
            <Label>Weight Range</Label>
            <StepSlider
              value={formData.weightRange}
              onChange={handleWeightChange}
            />
          </div>
          <div>
            <Label>Colors</Label>
            <MultiSelect
              items={[
                "White",
                "Black",
                "Gray",
                "Red",
                "Blue",
                "Green",
                "Yellow",
                "Purple",
                "Orange",
                "Brown",
                "Silver",
                "Gold",
                "Clear/Transparent",
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
                "Cylinder",
                "Cone",
                "Pyramid",
                "Rectangular",
                "Flat/Circular",
                "Irregular",
                "L-Shaped",
                "Curved",
                "Modular",
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
                "Fabric",
                "Leather",
                "Paper/Cardboard",
                "Rubber",
                "Stone",
                "Carbon Fiber",
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
