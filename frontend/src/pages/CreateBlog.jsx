import { useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useBlog } from "../context/blogContext";

export default function CreateBlog({ onNewBlog }) {
  const { handleCreateBlog, loading } = useBlog();

  const [formData, setFormData] = useState({
    title: "",
    context: "",
    category: "",
    thumbnail: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, thumbnail: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.context.trim() || !formData.category.trim()) {
      setError("Title, content, and category are required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("context", formData.context);
    data.append("category", formData.category);
    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

    try {
      const res = await handleCreateBlog(data);
      if (onNewBlog && res?.blog) onNewBlog(res.blog);

      setFormData({ title: "", context: "", category: "", thumbnail: null });
      setPreview(null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <Motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/40 sm:p-8"
      >
        <h1 className="text-center text-3xl font-bold text-white">Create Blog</h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          Publish a fresh post with a clean dark editor.
        </p>

        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700 bg-zinc-900/70 px-4 py-8 text-center transition hover:border-cyan-300/70 hover:bg-zinc-900">
          <ImagePlus className="mb-3 text-cyan-300" size={30} />
          <span className="text-sm font-semibold text-gray-200">Upload thumbnail</span>
          <span className="mt-1 text-xs text-gray-500">Click to choose an image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mx-auto mt-5 h-32 w-32 rounded-xl border border-white/10 object-cover"
          />
        )}

        {error && <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-300">{error}</p>}

        <div className="mt-6 grid gap-5">
          <Field label="Title">
            <input
              type="text"
              name="title"
              placeholder="Enter blog title..."
              value={formData.title}
              onChange={handleChange}
              className="field-dark"
            />
          </Field>

          <Field label="Content">
            <textarea
              name="context"
              placeholder="Write your blog..."
              value={formData.context}
              onChange={handleChange}
              rows={6}
              className="field-dark resize-none"
            />
          </Field>

          <Field label="Category">
            <input
              type="text"
              name="category"
              placeholder="Technology, AI..."
              value={formData.category}
              onChange={handleChange}
              className="field-dark"
            />
          </Field>
        </div>

        <Motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={18} />
          {loading ? "Creating..." : "Create Blog"}
        </Motion.button>
      </Motion.form>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-gray-300">
      {label}
      {children}
    </label>
  );
}
