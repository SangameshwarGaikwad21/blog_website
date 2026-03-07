import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toggleLike } from "../../services/authService";
import { getSingleBlog } from "../../services/blogService";
import CommentSection from "../comments/CommentsSection";
import { motion } from "framer-motion";

export default function BlogSingleDetails() {
  const { postId } = useParams();

  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getSingleBlog(postId);
        const data = res.data?.data || res.data || res;

        setBlog(data);
        setLikesCount(data.likes?.length || 0);
        setLiked(Boolean(data.isLiked));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [postId]);

  const handleLike = async () => {
    if (likeLoading) return;

    try {
      setLikeLoading(true);

      const res = await toggleLike(postId);
      const data = res.data || res;

      setLiked(data.liked);
      setLikesCount(data.totalLikes);
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400">
        Loading blog...
      </div>
    );

  if (!blog)
    return (
      <div className="text-center py-20 text-gray-400">
        Blog not found
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-5 py-12"
    >

      {/* TITLE */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-extrabold mb-6 
        leading-tight bg-gradient-to-r from-indigo-500 to-purple-500 
        bg-clip-text text-transparent"
      >
        {blog.title}
      </motion.h1>

      {/* LIKE SECTION */}
      <div className="flex items-center gap-4 mb-10">

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          onClick={handleLike}
          disabled={likeLoading}
          className={`
          flex items-center gap-2 px-6 py-2 rounded-full font-medium
          transition-all shadow-md
          ${
            liked
              ? "bg-red-500 text-white shadow-red-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
          `}
        >
          ❤️ {liked ? "Liked" : "Like"}
        </motion.button>

        <span className="text-gray-500 text-sm">
          {likesCount} likes
        </span>

      </div>

      {/* IMAGE */}
      {blog.thumbnail && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 overflow-hidden rounded-xl shadow-xl"
        >
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full max-h-[450px] object-cover hover:scale-105 transition duration-500"
          />
        </motion.div>
      )}

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-lg max-w-none text-gray-800 mb-14"
      >
        <p className="whitespace-pre-line text-lg leading-relaxed">
          {blog.context}
        </p>
      </motion.div>

      {/* COMMENTS */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-xl rounded-xl p-6 border"
      >
        <h2 className="text-xl font-semibold mb-5">
          💬 Comments
        </h2>

        <CommentSection blogId={blog._id} currentUser={user} />
      </motion.div>

    </motion.div>
  );
}

