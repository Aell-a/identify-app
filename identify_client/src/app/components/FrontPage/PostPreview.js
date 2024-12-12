import Image from "next/image";
import { MessageSquare, ThumbsUp } from "lucide-react";
import placeholder from "../../../../public/placeholder.png";
import { useCallback } from "react";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export default function PostPreview({ post }) {
  const formatDate = useCallback((dateArray) => {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );
    return date.toLocaleDateString("en-GB");
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 max-w-2xl mx-auto mb-8">
      <div className="relative h-64 w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Image
            src={post.user.profilePicture || placeholder}
            alt={post.user.nickname}
            width={40}
            height={40}
            className="rounded-full mr-2"
          />
          <div>
            <p className="font-semibold text-gray-100">{post.user.nickname}</p>
            <p className="text-sm text-gray-400">
              Points: {post.user.totalPoints}
            </p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-100">{post.title}</h2>
        <p className="text-gray-300 mb-4">
          {truncateText(post.description, 100)}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.totalPoints}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentCount}</span>
            </div>
            <div>
              <p>Posted at: {formatDate(post.createdAt)}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
