import { useEffect, useState } from "react";
import { getComments, addComment } from "../../services/commentService";
import CommentsForm from "./CommentsForm";
import CommentsItem from "./CommentsItem";

export default function CommentSection({ blogId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddComment = async (content) => {
    const res = await addComment(blogId, content);
    const newComment = res.data?.data;

    setComments((prev) => [newComment, ...prev]);
  };

  const handleUpdateComment = (commentId, content) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, content:content } : c
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) =>
      prev.filter((c) => c._id !== commentId)
    );
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add comment */}
      {currentUser && <CommentsForm onSubmit={handleAddComment} />}

      {/* Loading */}
      {loading && <p>Loading comments...</p>}

      {/* No comments */}
      {!loading && comments.length === 0 && (
        <p className="text-gray-500">No comments yet</p>
      )}

      {/* Comments list (ONLY ONE MAP) */}
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
  );
}
