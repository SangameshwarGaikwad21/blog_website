import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Loader2, Send, X } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useBlog } from "../context/blogContext";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-base text-white " +
  "placeholder:text-zinc-500 outline-none transition lg:py-2.5 lg:text-sm " +
  "focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/20";

export default function CreateBlog({ onNewBlog }) {
  const navigate = useNavigate();
  const { handleCreateBlog, loading } = useBlog();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    context: "",
    category: "",
    thumbnail: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // free the temporary image URL when it changes or the page closes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }

    setError("");
    setFormData({ ...formData, thumbnail: file });
    setPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setFormData({ ...formData, thumbnail: null });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    }
  };

  return (
    // laptop/desktop: exactly one screen tall, no page scrolling. mobile/tablet: normal scrolling.
    <main
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#08080a] px-4 py-4 text-white sm:px-6 lg:h-[100dvh] lg:py-5"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 45% at 50% 20%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 45% at 50% 20%, #000 30%, transparent 75%)",
        }}
      />
      {/* orange glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-140px] h-[360px] w-[120%] max-w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.26), rgba(255,107,10,0.07) 60%, transparent)",
        }}
      />

      <div className="relative mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
        <Motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/10 bg-[#0e0e10]/90 p-4 shadow-2xl shadow-black/50 backdrop-blur sm:p-6 lg:p-5"
        >
          {/* header row: back button + title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/home")}
              aria-label="Back to home"
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to home</span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold tracking-tight text-zinc-50 sm:text-2xl">
                Create a blog
              </h1>
              <p className="hidden truncate text-xs text-zinc-500 sm:block">
                Write your post, add a thumbnail, and publish it for readers.
              </p>
            </div>
          </div>

          {/* two columns on laptop: details left, writing space right */}
          <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            {/* left column */}
            <div className="flex min-h-0 flex-col gap-4">
              <div className="flex min-h-0 flex-col gap-2 lg:flex-1">
                <span className="text-sm font-medium text-zinc-300">Thumbnail</span>

                {preview ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10 lg:aspect-auto lg:min-h-0 lg:flex-1">
                    <img
                      src={preview}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      aria-label="Remove thumbnail"
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="thumbnail"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center transition hover:border-orange-500/60 hover:bg-orange-500/[0.04] lg:min-h-0 lg:flex-1 lg:py-4"
                  >
                    <ImagePlus className="mb-2 text-orange-500" size={26} />
                    <span className="text-sm font-semibold text-zinc-200">Upload thumbnail</span>
                    <span className="mt-1 text-xs text-zinc-500">Click to choose an image (optional)</span>
                  </label>
                )}

                <input
                  ref={fileInputRef}
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <Field label="Title" htmlFor="title">
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Category" htmlFor="category">
                <input
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Technology, AI, Travel..."
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* right column: content fills the remaining height */}
            <Field label="Content" htmlFor="context" className="min-h-0 lg:h-full">
              <textarea
                id="context"
                name="context"
                placeholder="Write your blog..."
                value={formData.context}
                onChange={handleChange}
                rows={8}
                className={`${inputClass} min-h-[10rem] resize-y leading-relaxed lg:min-h-0 lg:flex-1 lg:resize-none`}
              />
            </Field>
          </div>

          {/* footer: error + actions */}
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 lg:flex-1">
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-300 lg:text-left"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 lg:py-2.5"
              >
                Cancel
              </button>

              <Motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:cursor-not-allowed disabled:opacity-60 lg:py-2.5"
                style={{ backgroundColor: ACCENT, boxShadow: "0 0 24px rgba(255,107,10,0.25)" }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Publishing..." : "Publish blog"}
              </Motion.button>
            </div>
          </div>
        </Motion.form>
      </div>
    </main>
  );
}

function Field({ label, htmlFor, className = "", children }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      {children}
    </div>
  );
}