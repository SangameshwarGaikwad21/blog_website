import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike } from "../../services/authService";
import { motion as Motion } from "framer-motion";
import { Heart } from "lucide-react";

const ACCENT = "#ff6b0a";

export default function BlogCard({ blog }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const res = await toggleLike(blog._id);
      setLiked(res.liked);
      setLikesCount(res.totalLikes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/blog/${blog._id}`}
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <Motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0e0e10] shadow-xl shadow-black/40 transition-colors group-hover:border-orange-500/40"
      >
        {blog.thumbnail && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
        )}

        <Motion.button
          type="button"
          onClick={handleLike}
          disabled={loading}
          whileTap={{ scale: 0.92 }}
          aria-label={liked ? "Unlike this post" : "Like this post"}
          aria-pressed={liked}
          className={`absolute right-3 top-3 z-10 flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 disabled:opacity-70 ${
            liked ? "text-white" : "bg-black/50 text-white hover:bg-black/70"
          }`}
          style={liked ? { backgroundColor: ACCENT } : undefined}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
          {likesCount}
        </Motion.button>

        <div
          className={`flex flex-1 flex-col p-4 sm:p-5 ${
            blog.thumbnail ? "" : "pt-14 sm:pt-14"
          }`}
        >
          <span className="w-fit rounded-md border border-orange-500/25 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400">
            {blog.category || "Blog"}
          </span>

          <h2 className="mt-3 line-clamp-2 text-base font-bold leading-snug tracking-tight text-zinc-50 sm:text-lg">
            {blog.title}
          </h2>

          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
            {blog.context}
          </p>

          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-500 transition-transform group-hover:translate-x-1 sm:mt-5">
            Read more
          </span>
        </div>
      </Motion.article>
    </Link>
  );
}