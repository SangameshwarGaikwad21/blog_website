import axios from "axios";
import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

const API_URL = "https://blog-website-03ql.onrender.com/api/v1/posts";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#0e0e10]">
      <div className="aspect-[16/9] w-full bg-white/[0.05]" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-5 w-16 rounded-md bg-white/[0.06]" />
        <div className="h-4 w-4/5 rounded bg-white/[0.08]" />
        <div className="h-3 w-full rounded bg-white/[0.05]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.05]" />
      </div>
    </div>
  );
}

export default function BlogList({ searchQuery = "" }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(API_URL);
        const posts = response.data.posts || response.data.data || [];

        setBlogs(posts);
      } catch (err) {
        console.log(err);
        setError("We couldn't load the blogs. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredBlogs = normalizedSearch
    ? blogs.filter((blog) => {
        const searchableText = [
          blog.title,
          blog.context,
          blog.category,
          blog.author?.name,
          blog.user?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
    : blogs;

  return (
    <section
      className="relative overflow-hidden bg-[#08080a] px-4 py-10 sm:px-6 sm:py-14"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* soft orange glow behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-160px] h-[320px] w-[120%] max-w-[800px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.18), rgba(255,107,10,0.05) 60%, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-zinc-50 sm:text-3xl lg:text-4xl">
              Latest blogs
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              Read what creators are publishing.
            </p>
          </div>

          {!loading && !error && (
            <p className="w-fit shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"} found
            </p>
          )}
        </div>

        {loading ? (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3"
            aria-busy="true"
            aria-label="Loading blogs"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-10 text-center sm:px-6 sm:py-14"
          >
            <h3 className="text-lg font-semibold text-red-200 sm:text-xl">Something went wrong</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-red-300/80">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-[#ff6b0a] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
            >
              Try again
            </button>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0e0e10] px-5 py-10 text-center sm:px-6 sm:py-14">
            <h3 className="text-lg font-semibold text-zinc-50 sm:text-xl">No blogs found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              Try another title, category, author, or keyword.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}