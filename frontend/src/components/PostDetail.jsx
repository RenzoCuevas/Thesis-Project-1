import { useState, useEffect } from "react";
import axios from "axios";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

export default function PostDetail({ post, onBack }) {
  const [comments, setComments] = useState([]);

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/discussions/${post.id}/comments`);
        setComments(response.data); // Update the comments list
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post.id]);

  const handleAddComment = async (comment) => {
    try {
      const token = localStorage.getItem("token"); // Ensure this retrieves the token
      if (!token) {
        console.error("No token found in local storage.");
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5000/api/discussions/${post.id}/comments`,
        comment,
        { headers: { Authorization: `Bearer ${token}` } } // Ensure the token is included
      );
      setComments((prevComments) => [...prevComments, response.data]); // Add the new comment to the list
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <button onClick={onBack} className="text-blue-500 mb-4">&larr; Back to posts</button>
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">
        Posted by {post.author || "Anonymous"} on {new Date(post.created_at).toLocaleString()}
      </p>

      <CommentList comments={comments} />
      <CommentForm onSubmit={handleAddComment} />
    </div>
  );
}