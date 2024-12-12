import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ media }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

  return (
    <div className="relative">
      <div className="relative h-96 w-full">
        <Image
          src={media[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-lg"
          priority
        />
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={prevImage}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={nextImage}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="flex justify-center mt-4">
        {media.map((item, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-1 ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
