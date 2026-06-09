import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { updateComment, deleteComment } from "../../services/commentService";

export default function CommentsItem({ comment, currentUser, onUpdate, onDelete }) {
  const isOwner = currentUser?._id === comment.user?._id;
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      await updateComment(comment._id, content);
      onUpdate(comment._id, content);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-black/30 p-4"
    >
      <p className="text-sm font-semibold text-cyan-300">
        {comment.owner?.name || comment.user?.username || "Reader"}
      </p>

      {isEditing ? (
        <div className="mt-3">
          <textarea
            className="field-dark min-h-24 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-black disabled:opacity-60"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-gray-300">{comment.content}</p>
      )}

      {isOwner && !isEditing && (
        <div className="mt-3 flex gap-3 text-sm">
          <button onClick={() => setIsEditing(true)} className="text-cyan-300">
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-400">
            Delete
          </button>
        </div>
      )}
    </Motion.div>
  );
}
