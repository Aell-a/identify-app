import { Loader2 } from "lucide-react";

export default function LoadingIndicator({ hasMore, loading }) {
  return (
    <div className="text-center py-4">
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : hasMore ? (
        <p className="text-gray-400">Scroll to see more</p>
      ) : (
        <p className="text-gray-400">No more posts to load</p>
      )}
    </div>
  );
}
