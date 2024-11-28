import { useState } from "react";
import Image from "next/image";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteButtons from "../Appwide/VoteButtons";
import MiniUserProfile from "../Appwide/MiniUserProfile";

export default function Comment({ comment, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(depth < 2);
  const [isReplying, setIsReplying] = useState(false);
  const maxDepth = 6;

  return (
    <div className={`relative ${depth > 0 ? "mt-4" : ""}`}>
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 border-l-2 border-gray-700"
          style={{ left: "24px" }}
        />
      )}
      <div
        className={`relative flex gap-4 ${depth > 0 ? "ml-12" : ""}`}
        style={{ marginLeft: depth > 0 ? `${depth * 3}rem` : "" }}
      >
        <div className="flex-shrink-0 mt-1">
          <Image
            src={comment.user.profilePicture}
            alt={comment.user.nickname}
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <div className="flex-grow">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="relative group">
                  <span className="font-semibold text-gray-200 hover:underline cursor-pointer">
                    {comment.user.nickname}
                  </span>
                  <MiniUserProfile user={comment.user} />
                </div>
                <span className="text-sm text-gray-400">• 2h ago</span>
              </div>
              <VoteButtons
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
                postId={comment.id}
              />
            </div>
            <p className="text-gray-300">{comment.content}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Reply
              </Button>
              {comment.replies?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "reply" : "replies"}
                </Button>
              )}
            </div>
          </div>
          {isReplying && (
            <div className="mt-4">
              <textarea
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-gray-500"
                placeholder="Write a reply..."
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button size="sm">Reply</Button>
              </div>
            </div>
          )}
          {showReplies && comment.replies && depth < maxDepth && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
