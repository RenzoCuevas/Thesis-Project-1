// components/CommentForm.jsx
import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    onSubmit({ text });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
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
