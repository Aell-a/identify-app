import { useState } from "react";
import Image from "next/image";
import VoteButtons from "../Appwide/VoteButtons";
import MiniUserProfile from "../Appwide/MiniUserProfile";
import AddComment from "./AddComment";
import placeholder from "../../../../public/placeholder.png";
import { useAuth } from "@/lib/auth";

export default function Comment({
  comment,
  onAddReply,
  postOwner,
  depth,
  onMarkAsResolution,
  className,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user, id } = useAuth();

  const handleAddReply = (replyContent) => {
    onAddReply(comment.id, replyContent);
    setShowReplyForm(false);
  };

  const handleCancel = () => {
    setShowReplyForm(false);
  };

  const handleMarkAsResolution = () => {
    onMarkAsResolution(comment.id);
  };

  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 ${className} ${
        depth > 0 ? "ml-4 border-l-2 border-gray-600" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <MiniUserProfile user={comment.user}>
          <div className="flex items-center mb-4">
            <Image
              src={comment.user.profilePicture || placeholder}
              alt={comment.user.nickname}
              width={50}
              height={50}
              className="rounded-full mr-4"
            />
            <div>
              <p className="font-semibold text-gray-100">
                {comment.user.nickname}
              </p>
            </div>
          </div>
        </MiniUserProfile>
      </div>
      <p className="text-gray-300 mb-2">{comment.content}</p>
      {depth === 0 && comment.type && (
        <span
          className={`inline-block text-white text-xs px-2 py-1 rounded-full mb-2 ${
            comment.type.toLowerCase() === "question"
              ? "bg-red-600"
              : comment.type.toLowerCase() === "guess"
              ? "bg-green-600"
              : comment.type.toLowerCase() === "discussion"
              ? "bg-yellow-600"
              : comment.type.toLowerCase() === "deep dive"
              ? "bg-purple-600"
              : "bg-blue-600"
          }`}
        >
          {comment.type.charAt(0).toUpperCase() +
            comment.type.slice(1).toLowerCase().replace("pd", "p D")}
        </span>
      )}
      {user && (
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="hover:text-gray-200"
          >
            Reply
          </button>
          <VoteButtons
            upvotes={comment.upvotes || 0}
            downvotes={comment.downvotes || 0}
            type="comment"
            postId={comment.postId}
            commentId={comment.id}
            upvotedUserIds={comment.upvotedUserIds}
            downvotedUserIds={comment.downvotedUserIds}
          />
          {id == postOwner &&
            !comment.isResolution &&
            comment.type?.toLowerCase() === "guess" && (
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <button
                  onClick={handleMarkAsResolution}
                  className="hover:text-gray-200"
                >
                  Mark as Resolution
                </button>
              </div>
            )}
        </div>
      )}
      {showReplyForm && (
        <div className="mt-4">
          <AddComment onSubmit={handleAddReply} isReply={true} />
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
              depth={depth + 1}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
