import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getBlogById, updateBlog } from "../../services/blogService";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [context, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        setTitle(res.data.title);
        setContent(res.data.context);
        setCategory(res.data.category);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateBlog(id, { title, context, category }, token);
      alert("Blog updated successfully");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Failed to update blog");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-gray-300">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <Motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8"
      >
        <h1 className="text-center text-3xl font-bold">Update Blog</h1>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-gray-300">
            Blog Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title..." className="field-dark" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-300">
            Blog Content
            <textarea rows={6} value={context} onChange={(e) => setContent(e.target.value)} placeholder="Write your blog content..." className="field-dark resize-none" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-300">
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Technology, AI..." className="field-dark" required />
          </label>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300">
            <Save size={18} />
            Update Blog
          </Motion.button>
          <button type="button" onClick={() => navigate("/home")} className="rounded-xl border border-white/10 px-4 py-3 font-semibold text-gray-200 transition hover:bg-white/10">
            Cancel
          </button>
        </div>
      </Motion.form>
    </main>
  );
};

export default UpdateBlog;
