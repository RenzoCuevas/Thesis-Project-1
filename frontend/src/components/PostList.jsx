import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";

import PostDetail from "./PostDetail";
import PostForm from "./PostForm";
import axios from "axios";

export default function PostList({ posts, onNewPost, setPosts }) {
  const { user } = useContext(AuthContext);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]); // State to store comments for the selected post

  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
    setSelectedPost(null);
  };

  const handlePostDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    setSelectedPost(null);
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/discussions/${postId}/comments`);
      setComments(response.data); // Update the comments state
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post.id); // Fetch comments for the selected post
  };

  return (
    <div className="space-y-4">
      {!selectedPost && <PostForm onNewPost={onNewPost} />}

      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          comments={comments} // Pass comments to PostDetail
          onBack={() => setSelectedPost(null)}
          loggedInUserId={user?.id}
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
          onCommentUpdate={() => fetchComments(selectedPost.id)} // Refresh comments
        />
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            onClick={() => handlePostClick(post)} // Fetch comments when clicking on a post
            className="cursor-pointer p-4 bg-white shadow rounded hover:bg-gray-100 transition"
          >
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600 text-sm">
              {post.author || "Anonymous"} · {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}