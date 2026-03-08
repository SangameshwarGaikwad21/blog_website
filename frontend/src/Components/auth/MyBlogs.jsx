import { useEffect, useState } from "react";
import { getMyBlogs, deleteBlog } from "../../services/blogService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete blog");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <p className="text-gray-400 text-lg">Loading blogs...</p>
      </div>
    );

  if (blogs.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <p className="text-gray-400 text-lg">No blogs created yet.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute top-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <h2 className="text-4xl font-bold mb-10 text-center 
      bg-gradient-to-r from-indigo-400 to-purple-500 
      bg-clip-text text-transparent">
        📚 My Blogs
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">

        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/80 backdrop-blur-xl
            border border-slate-700
            rounded-2xl shadow-xl overflow-hidden"
          >

            {blog.thumbnail && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            )}

            <div className="p-5">

              <h3 className="text-xl font-semibold mb-2 text-white">
                {blog.title}
              </h3>

              <p className="text-gray-400">
                {blog.context?.slice(0, 150) || "No content"}...
              </p>

              <div className="flex justify-end gap-3 mt-4">

                <button
                  onClick={() => navigate(`/update-blog/${blog._id}`)}
                  className="px-4 py-2 rounded-lg 
                  border border-indigo-500 
                  text-indigo-400 
                  hover:bg-indigo-500/10 transition"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-4 py-2 rounded-lg 
                  bg-red-600 text-white 
                  hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default MyBlogs;

