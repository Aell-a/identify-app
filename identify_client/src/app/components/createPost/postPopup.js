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

export default function PostPopup({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaFiles: [],
    weightRange: 0,
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

  const formatDataForEndpoint = () => {
    const weightRanges = [
      "<50g",
      "50-100g",
      "100-250g",
      "250-500g",
      "500-750g",
      "750g-1kg",
      "1-2kg",
      "2-5kg",
      ">5kg",
    ];

    return {
      userId: id,
      title: formData.title,
      description: formData.description,
      weight: weightRanges[formData.weightRange],
      colors: formData.colors,
      shapes: formData.shapes,
      materials: formData.materials,
      sizeX: parseFloat(formData.size.length),
      sizeY: parseFloat(formData.size.width),
      sizeZ: parseFloat(formData.size.depth),
      mediaRequests: formData.mediaFiles.map((file) => ({ file })),
      labelRequests: formData.labels.map((label) => ({
        wikidataId: label.id,
        description: label.description,
        title: label.label,
        relatedLabels: label.aliases,
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
