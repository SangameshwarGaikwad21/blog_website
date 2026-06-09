import axios from "axios";
import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

export default function BlogList({ searchQuery = "" }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://blog-website-03ql.onrender.com/api/v1/posts");
        const posts = response.data.posts || response.data.data || [];

        setBlogs(posts);
      } catch (error) {
        console.log(error);
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

  if (loading) {
    return (
      <section className="bg-black px-4 py-16 sm:px-6">
        <p className="mx-auto max-w-7xl text-gray-300">Loading blogs...</p>
      </section>
    );
  }

  return (
    <section className="bg-black px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Latest Blogs
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Read what creators are publishing
            </h2>
          </div>
          <p className="text-sm text-gray-400">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"} found
          </p>
        </div>

        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
            <h3 className="text-2xl font-bold text-white">No blogs found</h3>
            <p className="mt-3 text-gray-400">
              Try another title, category, author, or keyword.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
