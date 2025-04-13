import React, { useState } from "react";
import axios from "axios";

export default function PostDetail({ post, onBack, loggedInUserId, onPostUpdate, onPostDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleEditDiscussion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/discussions/${post.id}`,
        { title: editedTitle, content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Updated Post Data from Backend:", response.data); // Debugging log
      onPostUpdate(response.data); // Pass the updated post data to the parent component
      setIsEditing(false); // Exit editing mode
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
      onPostDelete(post.id); // Remove the post in the parent component
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded">
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
          <button
            onClick={handleEditDiscussion}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.content}</p>
          <p className="text-sm text-gray-500 mb-4">
            Posted by {post.author || "Anonymous"} on{" "}
            {new Date(post.created_at).toLocaleString()}
          </p>
          {loggedInUserId === post.user_id && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteDiscussion}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}