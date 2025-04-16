import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function PostDetail({
  post: initialPost,
  onBack,
  loggedInUserId,
  onPostUpdate,
  onPostDelete,
}) {
  const [post, setPost] = useState(initialPost);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [menuOpen, setMenuOpen] = useState(false); // Track kebab menu state
  const [comments, setComments] = useState([]); // Track comments

  // Fetch comments when the component mounts

  useEffect(() => {
    console.log("Post object in PostDetail:", post); // Debugging log
    fetchComments();
    fetchPostDetails();
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/discussions/${post.id}/comments`
      );
      console.log("Fetched comments:", response.data); // Debugging log
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/discussions/${post.id}`
      );
      console.log("Fetched post details:", response.data); // Debugging log
      setPost(response.data); // Ensure `file_path` is included in the response
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const handleCommentSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      // Ensure the post ID is passed correctly
      const response = await axios.post(
        `http://localhost:5000/api/comments/${post.id}/upload`, // Ensure `post.id` is defined
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

  const handleEditDiscussion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/discussions/${post.id}`,
        { title: editedTitle, content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing discussion:", error);
    }
  };

  const handleDeleteDiscussion = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/discussions/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onPostDelete(post.id);
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded relative">
      <button onClick={onBack} className="text-blue-500 mb-4">
        &larr; Back to posts
      </button>
      {isEditing ? (
        <>
          <input
            className="w-full p-2 border rounded mb-2"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEditDiscussion}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Kebab Menu for Post */}
          {loggedInUserId === post.user_id && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                &#x22EE; {/* Kebab menu icon */}
              </button>
              {menuOpen && (
                <div className="absolute bg-white shadow rounded p-2 right-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="block text-blue-500 text-sm mb-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteDiscussion}
                    className="block text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.content}</p>

          {/* Render Uploaded File */}
          {post.file_path && (
            <div className="mb-4">
              {[".jpg", ".jpeg", ".png", ".gif"].some((ext) =>
                post.file_path.endsWith(ext)
              ) ? (
                <img
                  src={`http://localhost:5000${post.file_path}`}
                  alt="Uploaded File"
                  className="w-full h-auto rounded-lg shadow"
                  onError={(e) =>
                    console.error("Image failed to load:", e.target.src)
                  }
                />
              ) : (
                <a
                  href={`http://localhost:5000${post.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Uploaded File
                </a>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 mb-4">
            Posted by {post.author || "Anonymous"} on{" "}
            {new Date(post.created_at).toLocaleString()}
          </p>
          <CommentForm onSubmit={handleCommentSubmit} />
          <CommentList
            comments={comments}
            loggedInUserId={loggedInUserId}
            onCommentUpdate={fetchComments}
          />
        </>
      )}
    </div>
  );
}