import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(""); // Define the error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!text.trim()) {
        setError("Comment text cannot be empty."); // Set error if the text is empty
        return;
      }

      await onSubmit({ text }); // Pass the comment text to the parent handler
      setText(""); // Clear the input field
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to post comment. Please try again."); // Set error if the request fails
      console.error("Error posting comment:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>} {/* Display error if it exists */}
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="2"
        required
      />
      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Comment</button>
    </form>
  );
}