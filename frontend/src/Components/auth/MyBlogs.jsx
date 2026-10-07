import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Edit, Loader2, PenLine, Trash2, X } from "lucide-react";
import { getMyBlogs, deleteBlog } from "../../services/blogService";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";
const fontStyle = { fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" };

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getMyBlogs();
        setBlogs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("We couldn't load your blogs. Refresh the page to try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      setDeleting(true);
      await deleteBlog(blogToDelete._id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete._id));
      toast.success("Blog deleted");
      setBlogToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  // close the delete window with Escape
  useEffect(() => {
    if (!blogToDelete) return;
    const onKey = (e) => e.key === "Escape" && !deleting && setBlogToDelete(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [blogToDelete, deleting]);

  if (loading) {
    return (
      <main
        className="flex min-h-[100dvh] items-center justify-center bg-[#08080a] text-zinc-400"
        style={fontStyle}
      >
        <span className="inline-flex items-center gap-2 text-sm">
          <Loader2 size={18} className="animate-spin text-orange-500" />
          Loading blogs...
        </span>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-[100dvh] overflow-hidden bg-[#08080a] px-4 py-6 text-white sm:px-6 sm:py-10"
      style={fontStyle}
    >
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
        className="pointer-events-none absolute left-1/2 top-[-160px] h-[340px] w-[120%] max-w-[800px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.2), rgba(255,107,10,0.05) 60%, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <Link
          to="/profile"
          className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to profile
        </Link>

        <Motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
              My blogs
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              {blogs.length} {blogs.length === 1 ? "post" : "posts"} published by you.
            </p>
          </div>

          <Link
            to="/createblog"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 sm:py-2.5"
            style={{ backgroundColor: ACCENT, boxShadow: "0 0 24px rgba(255,107,10,0.25)" }}
          >
            <PenLine size={16} />
            New blog
          </Link>
        </Motion.header>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {blogs.length === 0 && !error ? (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#0e0e10] px-6 py-12 text-center sm:mt-10 sm:py-16">
            <h2 className="text-lg font-semibold text-zinc-50 sm:text-xl">No blogs yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
              Write your first post and it will show up here.
            </p>
            <Link
              to="/createblog"
              className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
              style={{ backgroundColor: ACCENT }}
            >
              <PenLine size={16} />
              Create a blog
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5">
            {blogs.map((blog, i) => (
              <Motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.05 }}
                className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0e0e10] shadow-xl shadow-black/30 transition-colors hover:border-orange-500/30 md:flex-row"
              >
                {blog.thumbnail && (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover md:aspect-auto md:w-64 md:shrink-0 lg:w-72"
                  />
                )}

                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  {blog.category && (
                    <span className="w-fit rounded-md border border-orange-500/25 bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400">
                      {blog.category}
                    </span>
                  )}

                  <h2 className="mt-2.5 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-zinc-50 sm:text-xl">
                    {blog.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                    {blog.context || "No content"}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:flex sm:justify-end">
                    <button
                      type="button"
                      onClick={() => navigate(`/update-blog/${blog._id}`)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                    >
                      <Edit size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlogToDelete(blog)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </Motion.article>
            ))}
          </div>
        )}
      </div>

      {/* delete confirmation */}
      <AnimatePresence>
        {blogToDelete && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleting && setBlogToDelete(null)}
          >
            <Motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Delete this blog"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0e0e10] p-5 shadow-2xl shadow-black/60 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-zinc-50 sm:text-lg">Delete this blog?</h2>
                <button
                  type="button"
                  onClick={() => setBlogToDelete(null)}
                  disabled={deleting}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                <span className="font-medium text-zinc-200">{blogToDelete.title}</span> will be
                permanently removed. This can't be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setBlogToDelete(null)}
                  disabled={deleting}
                  className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60 disabled:opacity-60"
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {deleting ? "Deleting..." : "Delete blog"}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MyBlogs;