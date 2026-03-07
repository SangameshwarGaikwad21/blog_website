import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike } from "../../services/authService";
import { motion } from "framer-motion";

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

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden 
        bg-gray-900/80 backdrop-blur-xl 
        border border-white/10 shadow-xl
        hover:shadow-purple-500/20 transition-all
        flex flex-col h-full"
      >

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="relative h-44 sm:h-48 overflow-hidden">

            <motion.img
              src={blog.thumbnail}
              alt={blog.title}
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t 
            from-black/70 via-black/20 to-transparent"></div>

          </div>
        )}

        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          disabled={loading}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.15 }}
          className={`absolute top-3 right-3 z-10
          px-3 py-1 rounded-full text-xs
          flex items-center gap-1 backdrop-blur-md
          ${liked ? "bg-red-500 text-white" : "bg-white/20 text-white"}
          shadow-lg`}
        >
          ❤️ {likesCount}
        </motion.button>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">

          <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">
            {blog.category}
          </span>

          <h2 className="text-lg sm:text-xl font-bold mt-1 text-white line-clamp-1">
            {blog.title}
          </h2>

          <p className="text-gray-400 text-sm mt-2 line-clamp-3 flex-1">
            {blog.context}
          </p>

          {/* Read More */}
          <motion.div
            whileHover={{ x: 5 }}
            className="mt-4 text-sm text-blue-400 font-medium"
          >
            Read More →
          </motion.div>

        </div>

      </motion.div>
    </Link>
  );
}