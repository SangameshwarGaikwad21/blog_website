import { useEffect, useState } from "react";
import { getComments, addComment } from "../../services/commentService";
import CommentsForm from "./CommentsForm";
import CommentsItem from "./CommentsItem";

export default function CommentSection({ blogId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(blogId);
        setComments(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleAddComment = async (content) => {
    const res = await addComment(blogId, content);
    const newComment = res.data?.data;
    setComments((prev) => [newComment, ...prev]);
  };

  const handleUpdateComment = (commentId, content) => {
    setComments((prev) =>
      prev.map((comment) => (comment._id === commentId ? { ...comment, content } : comment))
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  };

  return (
    <div>
      <div className="mb-5 text-sm text-gray-400">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </div>

      {currentUser && <CommentsForm onSubmit={handleAddComment} />}
      {loading && <p className="text-gray-400">Loading comments...</p>}

      {!loading && comments.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-gray-400">
          No comments yet.
        </p>
      )}

      <div className="mt-5 space-y-4">
        {!loading &&
          comments.map((comment) => (
            <CommentsItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
      </div>
    </div>
  );
}
