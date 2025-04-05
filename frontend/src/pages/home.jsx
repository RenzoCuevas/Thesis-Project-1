import { useState } from "react";

function PostList({ posts, onSelectPost }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => onSelectPost(post)}
          className="cursor-pointer p-4 bg-white shadow rounded hover:bg-gray-100 transition"
        >
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <p className="text-gray-600 text-sm">{post.author} · {new Date(post.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function PostForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, author: "Anonymous", date: new Date().toISOString(), comments: [] });
    setTitle("");
    setContent("");
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

function CommentList({ comments }) {
  return (
    <div className="space-y-3 mt-4">
      <h3 className="font-semibold">Comments</h3>
      {comments.map((comment, idx) => (
        <div key={idx} className="border-t pt-2 text-sm">
          <p>{comment.text}</p>
          <p className="text-gray-500 text-xs">by {comment.author} at {new Date(comment.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, author: "Anonymous", date: new Date().toISOString() });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="2"
        required
      />
      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Comment</button>
    </form>
  );
}

function PostDetail({ post, onAddComment, onBack }) {
  return (
    <div className="bg-white p-6 shadow rounded">
      <button onClick={onBack} className="text-blue-500 mb-4">&larr; Back to posts</button>
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">Posted by {post.author} on {new Date(post.date).toLocaleString()}</p>

      <CommentList comments={post.comments} />
      <CommentForm onSubmit={(comment) => onAddComment(post.id, comment)} />
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleNewPost = (post) => {
    setPosts([post, ...posts]);
  };

  const handleAddComment = (postId, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the LMS Discussion Board</h1>
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onAddComment={handleAddComment}
          onBack={() => setSelectedPost(null)}
        />
      ) : (
        <>
          <PostForm onSubmit={(post) => handleNewPost({ ...post, id: Date.now() })} />
          <PostList posts={posts} onSelectPost={setSelectedPost} />
        </>
      )}
    </div>
  );
}
