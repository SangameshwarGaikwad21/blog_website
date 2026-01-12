import { useState } from "react";
import {
  updateComment,
  deleteComment,
} from "../../services/commentService";

export default function CommentsItem({
  comment,
  currentUser,
  onUpdate,
  onDelete,
}) {
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
    <div className="border-b py-3">
      <p className="text-sm text-gray-500">
        {comment.user?.username}
      </p>

      {isEditing ? (
        <>
          <textarea
            className="w-full border rounded p-2 mt-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-black rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-800 mt-1">{comment.content}</p>
      )}

      {isOwner && !isEditing && (
        <div className="flex gap-3 mt-1 text-sm">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
