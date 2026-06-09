import { useState } from "react";
import { Send } from "lucide-react";
import { motion as Motion } from "framer-motion";

export default function CommentsForm({ onSubmit }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await onSubmit(content);
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        className="field-dark min-h-28 resize-none"
        rows="3"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-50"
      >
        <Send size={16} />
        {loading ? "Posting..." : "Post Comment"}
      </Motion.button>
    </form>
  );
}
