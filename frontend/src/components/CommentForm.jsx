import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null); // New state for file
  const [error, setError] = useState(""); // Define the error state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the file state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!text.trim()) {
        setError("Comment text cannot be empty."); // Set error if the text is empty
        return;
      }
  
      const formData = new FormData();
      formData.append("text", text); // Add the comment text
      if (file) {
        formData.append("file", file); // Add the file if it exists
      }
  
      await onSubmit(formData); // Pass the FormData to the parent handler
      setText("");
      setFile(null); // Reset the file state
      setError("");
    } catch (err) {
      setError("Failed to post comment. Please try again."); // Set error if the request fails
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
  
      // Assuming `commentId` is available in the formData or passed as a parameter
      const response = await axios.post(
        `http://localhost:5000/api/comments/${formData.commentId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Comment uploaded successfully:", response.data);
      fetchComments(); // Refresh the comments
    } catch (error) {
      console.error("Error posting comment:", error.response?.data || error);
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
      <input
        type="file"
        className="mb-2"
        onChange={handleFileChange} // Handle file selection
      />
      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Comment</button>
    </form>
  );
}