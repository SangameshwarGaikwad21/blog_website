import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { toggleLike } from "../../services/authService";
import { getSingleBlog } from "../../services/blogService";
import CommentSection from "../comments/CommentsSection";

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-gray-300">
        Loading blog...
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-gray-300">
        Blog not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
      <Motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-4xl"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          {blog.category || "Blog"}
        </p>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
          {blog.title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ y: -2 }}
            onClick={handleLike}
            disabled={likeLoading}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition ${
              liked
                ? "bg-red-500 text-white"
                : "border border-white/10 bg-zinc-900 text-gray-200 hover:border-cyan-300/60"
            }`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            {liked ? "Liked" : "Like"}
          </Motion.button>

          <span className="text-sm text-gray-400">{likesCount} likes</span>
        </div>

        {blog.thumbnail && (
          <Motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="max-h-[520px] w-full object-cover"
            />
          </Motion.div>
        )}

        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-10 rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30 sm:p-8"
        >
          <p className="whitespace-pre-line text-lg leading-8 text-gray-300">
            {blog.context}
          </p>
        </Motion.div>

        <Motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="mt-10 rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30 sm:p-8"
        >
          <h2 className="mb-5 inline-flex items-center gap-2 text-xl font-semibold text-white">
            <MessageCircle size={20} className="text-cyan-300" />
            Comments
          </h2>

          <CommentSection blogId={blog._id} currentUser={user} />
        </Motion.section>
      </Motion.article>
    </main>
  );
}
