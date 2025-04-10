export default function PostList({ posts, onSelectPost }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => onSelectPost(post)}
          className="cursor-pointer p-4 bg-white shadow rounded hover:bg-gray-100 transition"
        >
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <p className="text-gray-600 text-sm">
            {post.author || "Anonymous"} · {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}