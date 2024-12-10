import { useState } from "react";

const COMMENT_TYPES = ["Question", "Guess", "Discussion", "Deep Dive"];

export default function AddComment({ onSubmit, isReply = false, onCancel }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState(COMMENT_TYPES[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ content, type });
    setContent("");
    setType(COMMENT_TYPES[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 rounded-md bg-gray-700 text-gray-100 mb-2"
        placeholder={isReply ? "Write a reply..." : "Write a comment..."}
        rows="3"
      ></textarea>
      {!isReply && (
        <div className="mb-2">
          <label
            htmlFor="commentType"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Comment Type:
          </label>
          <select
            id="commentType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-gray-100"
          >
            {COMMENT_TYPES.map((commentType) => (
              <option key={commentType} value={commentType}>
                {commentType}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isReply ? "Reply" : "Submit Comment"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
