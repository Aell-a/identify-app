import Image from "next/image";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import Gallery from "./Gallery";
import LabelHolder from "./Label";
import { useCallback } from "react";

export default function PostDetails({ post }) {
  const timeSinceLastActivity = useCallback((dateArray) => {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";
    return Math.floor(seconds) + " seconds";
  }, []);

  const formatDate = useCallback((dateArray) => {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );
    return date.toLocaleDateString();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Image
          src={post.user.profilePicture}
          alt={post.user.nickname}
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <div>
          <p className="font-semibold text-gray-100">{post.user.nickname}</p>
          <p className="text-sm text-gray-400">
            Points: {post.user.totalPoints}
          </p>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-gray-100">{post.title}</h1>
      <Gallery media={post.imageUrls} />
      <div className="mt-6">
        <p className="text-gray-300 mb-4">{post.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.upvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-4 h-4" />
              <span>{post.downvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentCount}</span>
            </div>
          </div>
          <div>
            <p>Created: {timeSinceLastActivity(post.createdAt)} ago</p>
            {formatDate(post.updatedAt) !== formatDate(post.createdAt) && (
              <p>Updated: {timeSinceLastActivity(post.updatedAt)} ago</p>
            )}
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4">
          <h2 className="text-xl font-bold mb-2 text-gray-100">
            Mystery Object Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-300">Size</h3>
              <p className="text-gray-400">
                Length: {post.sizeX} cm{" "}
                {post.sizeY != 0 && `Width: ${post.sizeY} cm`}{" "}
                {post.sizeZ != 0 && `Depth: ${post.sizeZ} cm`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Weight</h3>
              <p className="text-gray-400">{post.weight}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Colors</h3>
              <p className="text-gray-400">{post.colors.join(", ")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Shapes</h3>
              <p className="text-gray-400">{post.shapes.join(", ")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Materials</h3>
              <p className="text-gray-400">{post.materials.join(", ")}</p>
            </div>
          </div>
          {post.wikidataLabels && post.wikidataLabels.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-300">Labels</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.wikidataLabels.map((label, index) => (
                  <LabelHolder
                    key={index}
                    index={index}
                    title={label.title}
                    description={label.description}
                    wikidataId={label.wikidataId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
