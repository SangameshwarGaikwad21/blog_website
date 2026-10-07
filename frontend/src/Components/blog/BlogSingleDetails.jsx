import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, Heart, Link2, Loader2, MessageCircle } from "lucide-react";
import { motion as Motion, useScroll, useSpring } from "framer-motion";
import { toggleLike } from "../../services/authService";
import { getSingleBlog } from "../../services/blogService";
import CommentSection from "../comments/CommentsSection";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";
const fontStyle = { fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" };

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

const authorName = (blog) => {
  const a = blog?.author || blog?.user;
  if (!a) return "";
  return typeof a === "object" ? a.username || a.name || "" : a;
};

const readingTime = (text = "") => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));

export default function BlogSingleDetails() {
  const { postId } = useParams();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const user = getStoredUser();

  // reading progress bar at the top of the page
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main
        className="flex min-h-[100dvh] items-center justify-center bg-[#08080a] text-zinc-400"
        style={fontStyle}
      >
        <span className="inline-flex items-center gap-2 text-sm">
          <Loader2 size={18} className="animate-spin text-orange-500" />
          Loading blog...
        </span>
      </main>
    );
  }

  if (!blog) {
    return (
      <main
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#08080a] px-4 text-center"
        style={fontStyle}
      >
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-50">Blog not found</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          This post may have been removed or the link is incorrect.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
          style={{ backgroundColor: ACCENT }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </main>
    );
  }

  const author = authorName(blog);
  const date = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <main
      className="relative min-h-[100dvh] overflow-hidden bg-[#08080a] px-4 pb-16 pt-5 text-white sm:px-6 sm:pt-8"
      style={fontStyle}
    >
      {/* reading progress */}
      <Motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
        style={{ scaleX: progress, backgroundColor: ACCENT, boxShadow: "0 0 10px rgba(255,107,10,0.7)" }}
      />

      {/* subtle grid + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 40% at 50% 0%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 40% at 50% 0%, #000 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-160px] h-[360px] w-[120%] max-w-[860px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.22), rgba(255,107,10,0.06) 60%, transparent)",
        }}
      />

      <Motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto max-w-3xl"
      >
        <Link
          to="/home"
          className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>

        <span className="mt-8 inline-block rounded-md border border-orange-500/25 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
          {blog.category || "Blog"}
        </span>

        <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-zinc-50 sm:text-5xl">
          {blog.title}
        </h1>

        {/* meta */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
          {author && <span className="font-medium text-zinc-300">{author}</span>}
          {date && <span>{date}</span>}
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden />
            {readingTime(blog.context)} min read
          </span>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={handleLike}
            disabled={likeLoading}
            aria-pressed={liked}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:opacity-70 ${
              liked
                ? "border-transparent text-white"
                : "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-orange-500/40 hover:text-orange-400"
            }`}
            style={liked ? { backgroundColor: ACCENT, boxShadow: "0 0 20px rgba(255,107,10,0.3)" } : undefined}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {liked ? "Liked" : "Like"}
            <span className={liked ? "text-white/80" : "text-zinc-500"}>{likesCount}</span>
          </Motion.button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Link2 size={16} />}
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>

        {blog.thumbnail && (
          <Motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0e0e10] shadow-2xl shadow-black/50 sm:mt-10"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </Motion.div>
        )}

        {/* post body */}
        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 sm:mt-10"
        >
          <p className="whitespace-pre-line break-words text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            {blog.context}
          </p>
        </Motion.div>

        <hr className="mt-12 border-white/10" />

        {/* comments */}
        <Motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 rounded-xl border border-white/10 bg-[#0e0e10] p-4 shadow-xl shadow-black/30 sm:p-6"
        >
          <h2 className="mb-5 inline-flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-50">
            <MessageCircle size={18} className="text-orange-500" />
            Comments
          </h2>

          <CommentSection blogId={blog._id} currentUser={user} />
        </Motion.section>
      </Motion.article>
    </main>
  );
}