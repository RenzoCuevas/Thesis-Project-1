export default function CommentList({ comments }) {
  return (
    <div className="space-y-3 mt-4">
      <h3 className="font-semibold">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="border-t pt-2 text-sm">
          <p>{comment.text}</p>
          <p className="text-gray-500 text-xs">
            by {comment.user || "Anonymous"} on {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}