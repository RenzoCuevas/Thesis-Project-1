// components/PostDetail.jsx
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

export default function PostDetail({ post, comments, onAddComment, onBack }) {
  return (
    <div className="bg-white p-6 shadow rounded">
      <button onClick={onBack} className="text-blue-500 mb-4">&larr; Back to posts</button>
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">Posted by {post.author} on {new Date(post.date).toLocaleString()}</p>

      <CommentList comments={comments} />
      <CommentForm onSubmit={onAddComment} />
    </div>
  );
}
