import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function CommentList({
  comments,
  loggedInUserId,
  onCommentUpdate,
}) {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const apiRequest = async (method, url, data = null) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (method === "put") await axios.put(url, data, config);
      if (method === "delete") await axios.delete(url, config);
      onCommentUpdate();
    } catch (error) {
      console.error(`Error during ${method} request:`, error);
    }
  };

  const handleEdit = (commentId) =>
    apiRequest(
      "put",
      `http://localhost:5000/api/discussions/comments/${commentId}`,
      { text: editedText }
    );

  const handleDelete = (commentId) =>
    apiRequest(
      "delete",
      `http://localhost:5000/api/discussions/comments/${commentId}`
    );

  const renderCommentContent = (comment) =>
    editingCommentId === comment.id ? (
      <div>
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
      </div>
    ) : (
      <div className="bg-gray-100 p-3 rounded-lg">
        <p className="font-medium">{comment.user || "Anonymous"}</p>
        <p className="text-gray-700">{comment.text}</p>
      </div>
    );

  const renderKebabMenu = (comment) =>
    loggedInUserId === comment.user_id &&
    !editingCommentId && (
      <div className="relative">
        <button
          onClick={() =>
            menuOpenId === comment.id
              ? setMenuOpenId(null)
              : setMenuOpenId(comment.id)
          }
          className="text-gray-500 hover:text-gray-700"
        >
          &#x22EE;
        </button>
        {menuOpenId === comment.id && (
          <div className="absolute bg-white shadow rounded p-2 right-0">
            <button
              onClick={() => {
                setEditingCommentId(comment.id);
                setEditedText(comment.text);
                setMenuOpenId(null);
              }}
              className="block text-blue-500 text-sm mb-1"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(comment.id)}
              className="block text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );

  return (
    <div className="space-y-3 mt-4">
      <h3 className="font-semibold">Comments</h3>
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start space-x-3 border-t pt-2 text-sm"
          >
            <div className="flex-shrink-0">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="flex-1">
              {comment.file_path && (
                <div className="mb-3">
                  <div
                    className="w-24 h-24 overflow-hidden rounded-lg border cursor-pointer"
                    onClick={() =>
                      setSelectedImage(
                        `http://localhost:5000${comment.file_path}`
                      )
                    }
                  >
                    <img
                      src={`http://localhost:5000${comment.file_path}`}
                      alt="Uploaded File"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              {renderCommentContent(comment)}
              <p className="text-gray-500 text-xs mt-1">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
            {renderKebabMenu(comment)}
          </motion.div>
        ))}
      </AnimatePresence>
      {selectedImage && (
  <motion.div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
  >
    {/* Clickable overlay to close the modal */}
    <div
      className="absolute inset-0"
      onClick={() => setSelectedImage(null)}
    ></div>

    {/* Image container with animation */}
    <motion.img
      src={selectedImage}
      alt="Full Image"
      className="max-w-[65%] max-h-[65%] rounded-lg shadow-lg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    />
  </motion.div>
)}
    </div>
  );
}
