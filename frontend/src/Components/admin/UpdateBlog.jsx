import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getBlogById, getSingleBlog, updateBlog } from "../../services/blogService";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";
const fontStyle = { fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" };

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-base text-white " +
  "placeholder:text-zinc-500 outline-none transition lg:py-2.5 lg:text-sm " +
  "focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/20";

const UpdateBlog = () => {
  const params = useParams();
  // works whichever name your route uses: /update-blog/:id, :postId or :blogId
  const id = params.id || params.postId || params.blogId;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [context, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // login saves the token as "token"; older code used "accessToken"
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

  useEffect(() => {
    // the API can wrap the blog in different ways, so look in each place
    const pickBlog = (res) => {
      const body = res?.data ?? res;
      return body?.data || body?.blog || body?.post || body;
    };

    const fetchBlog = async () => {
      try {
        let res;
        try {
          res = await getBlogById(id);
        } catch {
          // same call the blog details page uses
          res = await getSingleBlog(id);
        }

        const blog = pickBlog(res);
        setTitle(blog?.title ?? "");
        setContent(blog?.context ?? blog?.content ?? "");
        setCategory(blog?.category ?? "");
      } catch (err) {
        console.error(err);
        toast.error("Couldn't load this blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateBlog(id, { title, context, category }, token);
      toast.success("Blog updated successfully");
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog");
    } finally {
      setSaving(false);
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

  return (
    // laptop/desktop: one screen tall, no page scrolling. mobile/tablet: normal scrolling.
    <main
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#08080a] px-4 py-4 text-white sm:px-6 lg:h-[100dvh] lg:py-5"
      style={fontStyle}
    >
      {/* subtle grid + glow */}
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
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              Back
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold tracking-tight text-zinc-50 sm:text-2xl">
                Update blog
              </h1>
              <p className="hidden truncate text-xs text-zinc-500 sm:block">
                Edit your post and save the changes.
              </p>
            </div>
          </div>

          {/* two columns on laptop: details left, writing space right */}
          <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col gap-4 lg:justify-start">
              <Field label="Blog title" htmlFor="title">
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Category" htmlFor="category">
                <input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Technology, AI, Travel..."
                  className={inputClass}
                  required
                />
              </Field>
            </div>

            <Field label="Blog content" htmlFor="context" className="min-h-0 lg:h-full">
              <textarea
                id="context"
                rows={8}
                value={context}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content..."
                className={`${inputClass} min-h-[12rem] resize-y leading-relaxed lg:min-h-0 lg:flex-1 lg:resize-none`}
                required
              />
            </Field>
          </div>

          {/* actions */}
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 lg:py-2.5"
            >
              Cancel
            </button>

            <Motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:cursor-not-allowed disabled:opacity-60 lg:py-2.5"
              style={{ backgroundColor: ACCENT, boxShadow: "0 0 24px rgba(255,107,10,0.25)" }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Update blog"}
            </Motion.button>
          </div>
        </Motion.form>
      </div>
    </main>
  );
};

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

export default UpdateBlog;