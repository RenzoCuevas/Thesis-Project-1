import { useState, useEffect } from "react";
import axios from "axios";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import PostDetail from "../components/PostDetail"; // Add this import

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/discussions");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the LMS Discussion Board</h1>
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
        />
      ) : (
        <>
          <PostForm onNewPost={handleNewPost} />
          <PostList posts={posts} onSelectPost={setSelectedPost} />
        </>
      )}
    </div>
  );
}