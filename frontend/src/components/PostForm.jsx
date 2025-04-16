import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

export default function PostForm({ onNewPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null); // New state for file
  const { user } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the file state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !content) {
      console.error("Title and content are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      // Step 1: Create the discussion (text-only)
      const discussionResponse = await axios.post(
        "http://localhost:5000/api/discussions",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const discussion = discussionResponse.data;
  
      // Step 2: Upload the file (if provided)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("post_id", discussion.id);
  
        await axios.post("http://localhost:5000/api/discussions/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      onNewPost(discussion);
      setTitle("");
      setContent("");
      setFile(null);
    } catch (error) {
      console.error("Error creating discussion:", error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
      <h2 className="text-lg font-bold mb-2">Start a Discussion</h2>
      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="What do you want to discuss?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="4"
        required
      />
      <input
        type="file"
        className="mb-2"
        onChange={handleFileChange} // Handle file selection
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
    </form>
  );
}