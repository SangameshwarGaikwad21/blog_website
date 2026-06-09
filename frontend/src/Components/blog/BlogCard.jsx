import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike } from "../../services/authService";
import { motion as Motion } from "framer-motion";
import { Heart } from "lucide-react";

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
    <Link to={`/blog/${blog._id}`} className="block h-full">
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-xl shadow-black/30 transition-all hover:border-cyan-300/40 hover:shadow-cyan-950/30"
      >
        {blog.thumbnail && (
          <div className="relative h-44 overflow-hidden sm:h-48">
            <Motion.img
              src={blog.thumbnail}
              alt={blog.title}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
        )}

        <Motion.button
          onClick={handleLike}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          className={`absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full px-3 py-1 text-xs shadow-lg backdrop-blur-md ${
            liked ? "bg-red-500 text-white" : "bg-white/20 text-white"
          }`}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
          {likesCount}
        </Motion.button>

        <div className="flex flex-1 flex-col p-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            {blog.category || "Blog"}
          </span>

          <h2 className="mt-2 line-clamp-2 text-lg font-bold text-white sm:text-xl">
            {blog.title}
          </h2>

          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-400">
            {blog.context}
          </p>

          <Motion.div
            whileHover={{ x: 5 }}
            className="mt-5 text-sm font-semibold text-cyan-300"
          >
            Read More
          </Motion.div>
        </div>
      </Motion.div>
    </Link>
  );
}
