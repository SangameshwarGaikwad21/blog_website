import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike } from "../../services/authService";

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
    <Link to={`/blog/${blog._id}`} className="block">
      <div
        className="relative bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden 
        transition-transform duration-300 cursor-pointer flex flex-col
        md:hover:scale-105"
      >
        <button
          onClick={handleLike}
          disabled={loading}
          className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-sm
            flex items-center gap-1 transition
            ${liked ? "bg-red-500" : "bg-gray-700"}
            active:scale-95
          `}
        >
          ❤️ <span>{likesCount}</span>
        </button>

    
        {blog.thumbnail && (
          <div className="w-full h-40 sm:h-44 md:h-48 overflow-hidden">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover 
              transition-transform duration-300
              md:hover:scale-110"
            />
          </div>
        )}

       
        <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl font-bold truncate">
            {blog.title}
          </h2>

          <span className="inline-block text-blue-400 text-xs sm:text-sm">
            {blog.category}
          </span>

          <p className="text-gray-300 text-sm sm:text-base line-clamp-3">
            {blog.context}
          </p>
        </div>
      </div>
    </Link>
  );
}
