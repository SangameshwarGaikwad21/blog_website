import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getMyBlogs, deleteBlog } from "../../services/blogService";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getMyBlogs();
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-gray-300">
        Loading blogs...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold">My Blogs</h1>
        </Motion.div>

        {blogs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-gray-400">
            No blogs created yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <Motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-xl shadow-black/30"
              >
                {blog.thumbnail && (
                  <img src={blog.thumbnail} alt={blog.title} className="h-52 w-full object-cover" />
                )}

                <div className="p-5">
                  <h2 className="text-2xl font-semibold">{blog.title}</h2>
                  <p className="mt-3 line-clamp-3 text-gray-400">
                    {blog.context || "No content"}
                  </p>

                  <div className="mt-5 flex flex-wrap justify-end gap-3">
                    <button
                      onClick={() => navigate(`/update-blog/${blog._id}`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-cyan-300 transition hover:border-cyan-300/70"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-400"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </Motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBlogs;
