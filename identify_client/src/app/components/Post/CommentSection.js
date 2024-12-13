import { useState, useMemo, useEffect } from "react";
import Comment from "./Comment";
import AddComment from "./AddComment";
import { useAuth } from "@/lib/auth";
import { addComment } from "@/lib/middleware";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Upvotes", value: "upvotes" },
];

export default function CommentSection({
  postId,
  postOwner,
  loadedComments,
  onMarkAsResolution,
  resolutionId,
}) {
  const [comments, setComments] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const { id, token } = useAuth();

  useEffect(() => {
    if (loadedComments && loadedComments.length > 0) {
      setComments(loadedComments);
    }
  }, [loadedComments]);

  const sortComments = (commentsToSort) => {
    return commentsToSort.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "upvotes") {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      return 0;
    });
  };

  const organizeComments = (commentsArray) => {
    const commentMap = {};
    const rootComments = [];

    commentsArray.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    commentsArray.forEach((comment) => {
      if (comment.parentId) {
        commentMap[comment.parentId].replies.push(commentMap[comment.id]);
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return sortComments(rootComments);
  };

  const sortedComments = useMemo(() => {
    const organizedComments = organizeComments(comments);
    const resolutionComment = comments.find(
      (comment) => comment.id === resolutionId
    );

    if (resolutionComment) {
      organizedComments.forEach((comment) => {
        if (comment.id === resolutionId) {
          comment.isResolution = true;
        }
      });
    }

    return organizedComments;
  }, [comments, resolutionId]);

  const handleAddComment = async (newComment) => {
    const commentRequest = {
      parentId: null,
      postId: parseInt(postId),
      userId: id,
      content: newComment.content,
      type: newComment.type,
    };
    try {
      const res = await addComment(commentRequest, postId, token);
      if (res.success) {
        setComments((prevComments) => [...prevComments, res.data]);
      }
    } catch (error) {
      console.log("Error adding comment:", error);
    }
  };

  const handleReplyComment = async (parentId, replyComment) => {
    const commentRequest = {
      parentId: parentId,
      postId: parseInt(postId),
      userId: id,
      content: replyComment.content,
    };
    try {
      const res = await addComment(commentRequest, postId, token);
      if (res.success) {
        setComments((prevComments) => [...prevComments, res.data]);
      }
    } catch (error) {
      console.log("Error adding reply:", error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Comments</h2>
      {id && <AddComment onSubmit={handleAddComment} />}
      <div className="mb-4">
        <label
          htmlFor="sortComments"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Sort by:
        </label>
        <select
          id="sortComments"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-36 p-2 rounded-md bg-gray-700 text-gray-100"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {sortedComments.length > 0 ? (
          sortedComments.map((comment) => (
            <Comment
              key={comment.id}
              postOwner={postOwner}
              comment={comment}
              onAddReply={handleReplyComment}
              depth={0}
              onMarkAsResolution={onMarkAsResolution}
              className={comment.isResolution ? "border border-green-500" : ""}
            />
          ))
        ) : (
          <p className="text-gray-300">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
