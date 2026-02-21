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

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="
          relative bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden
          flex flex-col h-full
        "
      >

        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          disabled={loading}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className={`
            absolute top-2 right-2 sm:top-3 sm:right-3 z-10
            px-3 py-1 rounded-full text-xs sm:text-sm
            flex items-center gap-1
            ${liked ? "bg-red-500" : "bg-gray-700"}
          `}
        >
          ❤️ <span>{likesCount}</span>
        </motion.button>

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="w-full h-36 sm:h-44 md:h-48 overflow-hidden">
            <motion.img
              src={blog.thumbnail}
              alt={blog.title}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
          <h2 className="text-base sm:text-lg md:text-xl font-bold line-clamp-1">
            {blog.title}
          </h2>

          <span className="text-blue-400 text-xs sm:text-sm mt-1">
            {blog.category}
          </span>

          <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mt-2 flex-1">
            {blog.context}
          </p>
        </div>

      </motion.div>
    </Link>
  );
}