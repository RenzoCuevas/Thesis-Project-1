import { useState } from "react";

export default function CommentList({ comments, onCommentUpdate }) {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleEdit = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/discussions/comments/${commentId}`,
        { text: editedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      onCommentUpdate(); // Refresh comments
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/discussions/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onCommentUpdate(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <h3 className="font-semibold">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="border-t pt-2 text-sm">
          {editingCommentId === comment.id ? (
            <>
              <textarea
                className="w-full p-2 border rounded mb-2"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button
                onClick={() => handleEdit(comment.id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingCommentId(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>{comment.text}</p>
              <p className="text-gray-500 text-xs">
                by {comment.user || "Anonymous"} on {new Date(comment.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditedText(comment.text);
                }}
                className="text-blue-500 text-xs mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}