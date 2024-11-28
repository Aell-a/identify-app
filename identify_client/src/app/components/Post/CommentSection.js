import { useState } from "react";
import { Button } from "@/components/ui/button";
import Comment from "./Comment";
import { useAuth } from "@/lib/auth";

export default function CommentSection({ postId, comments }) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Backend connection
    console.log("Submitting comment:", newComment);
    setNewComment("");
  };

  const topLevelComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Discussion</h2>
      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-gray-500"
            placeholder="Start a discussion..."
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <Button type="submit">Comment</Button>
          </div>
        </form>
      )}
      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
