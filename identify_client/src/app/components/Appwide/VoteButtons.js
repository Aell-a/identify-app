import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

export default function VoteButtons({ upvotes, downvotes, postId }) {
  const [votes, setVotes] = useState({ upvotes, downvotes });

  const handleVote = async (voteType) => {
    // Implement the voting logic here
    // You'll need to call an API to update the vote count
    // For now, we'll just update the local state
    if (voteType === "up") {
      setVotes((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
    } else {
      setVotes((prev) => ({ ...prev, downvotes: prev.downvotes + 1 }));
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVote("up")}
        className="flex items-center space-x-1 text-gray-400 hover:text-blue-500"
      >
        <ThumbsUp className="w-5 h-5" />
        <span>{votes.upvotes}</span>
      </button>
      <button
        onClick={() => handleVote("down")}
        className="flex items-center space-x-1 text-gray-400 hover:text-red-500"
      >
        <ThumbsDown className="w-5 h-5" />
        <span>{votes.downvotes}</span>
      </button>
    </div>
  );
}
