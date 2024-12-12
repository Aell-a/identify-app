import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { handleVote } from "@/lib/middleware";
import { useAuth } from "@/lib/auth";

export default function VoteButtons({
  upvotes,
  downvotes,
  type,
  postId,
  commentId,
  upvotedUserIds,
  downvotedUserIds,
}) {
  const { token, id } = useAuth();
  const [votes, setVotes] = useState({ upvotes, downvotes });
  const [hasUpvoted, setHasUpvoted] = useState(upvotedUserIds.includes(id));
  const [hasDownvoted, setHasDownvoted] = useState(
    downvotedUserIds.includes(id)
  );

  const handleVoteClick = async (voteType) => {
    const voteRequest = {
      userId: id,
      postId,
      commentId,
      targetType: type,
      voteType,
    };
    let updatedPost;
    try {
      const response = await handleVote(voteRequest, token);
      updatedPost = response.data;
    } catch (error) {
      console.error(`Error while ${voteType}ing:`, error);
    }
    if (voteType === "upvote") {
      setHasUpvoted(true);
    } else {
      setHasDownvoted(true);
    }
    setVotes({
      upvotes: updatedPost.upvotes,
      downvotes: updatedPost.downvotes,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVoteClick("upvote")}
        disabled={hasUpvoted || hasDownvoted}
        className={`flex items-center space-x-1 ${
          hasUpvoted ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
        }`}
      >
        {hasUpvoted ? (
          <ThumbsUp className="w-5 h-5 fill-blue-500" />
        ) : (
          <ThumbsUp className="w-5 h-5" />
        )}
        <span>{votes.upvotes}</span>
      </button>
      <button
        onClick={() => handleVoteClick("downvote")}
        disabled={hasUpvoted || hasDownvoted}
        className={`flex items-center space-x-1 ${
          hasDownvoted ? "text-red-500" : "text-gray-400 hover:text-red-500"
        }`}
      >
        {hasDownvoted ? (
          <ThumbsDown className="w-5 h-5 fill-red-500" />
        ) : (
          <ThumbsDown className="w-5 h-5" />
        )}
        <span>{votes.downvotes}</span>
      </button>
    </div>
  );
}
