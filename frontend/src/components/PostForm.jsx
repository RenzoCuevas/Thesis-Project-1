import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

export default function PostForm({ onNewPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/discussions",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onNewPost(response.data); // Pass the new post to the parent
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error creating discussion:", error);
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
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
    </form>
  );
}