import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import PostDetail from "./PostDetail";
import PostForm from "./PostForm";

export default function PostList({ posts, onNewPost, setPosts }) {
  const { user } = useContext(AuthContext); 
  const [selectedPost, setSelectedPost] = useState(null); 

  const handlePostUpdate = (updatedPost) => {
    console.log("Updating Post in State:", updatedPost); 
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

  return (
    <div className="space-y-4">
      {/* Conditionally render the PostForm only if no post is selected */}
      {!selectedPost && <PostForm onNewPost={onNewPost} />}

      {selectedPost ? (
        // Render PostDetail if a post is selected
        <PostDetail
          post={selectedPost}
          onBack={() => setSelectedPost(null)} 
          loggedInUserId={user?.id} 
          onPostUpdate={handlePostUpdate} 
          onPostDelete={handlePostDelete}
        />
      ) : (
        // Render the list of posts
        posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)} // Set the selected post
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