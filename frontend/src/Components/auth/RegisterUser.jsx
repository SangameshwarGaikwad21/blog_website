import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Loader2 } from "lucide-react";
import { BsPersonCircle } from "react-icons/bs";
import { motion as Motion } from "framer-motion";
import { registerUser } from "../../services/authService";

// Add once in index.html (or index.css) so the Inter look from the screenshot applies:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-base text-white sm:py-2.5 sm:text-sm " +
  "placeholder:text-zinc-500 outline-none transition " +
  "focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/20";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }

    setError("");
    setFormData({ ...formData, avatar: file });
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password || !formData.avatar) {
      setError("All fields are required");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("avatar", formData.avatar);

    try {
      setLoading(true);
      await registerUser(data);
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#08080a] px-4 py-8 text-white sm:py-12"
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
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, #000 30%, transparent 75%)",
        }}
      />
      {/* orange glow behind heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[360px] w-[120%] max-w-[860px] sm:h-[460px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.32), rgba(255,107,10,0.08) 60%, transparent)",
        }}
      />

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-sm rounded-xl border border-white/10 bg-[#0e0e10]/90 p-5 shadow-2xl sm:p-6 shadow-black/50 backdrop-blur"
        >
          <h2 className="mb-5 text-center text-lg font-semibold text-zinc-100">
            Create your account
          </h2>

          <label
            htmlFor="avatar"
            className="group flex cursor-pointer flex-col items-center gap-2"
            title="Choose a profile photo"
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Avatar preview"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 object-cover"
                style={{ borderColor: ACCENT }}
              />
            ) : (
              <BsPersonCircle className="h-16 w-16 sm:h-20 sm:w-20 text-zinc-700 transition group-hover:text-orange-500" />
            )}
            <span className="text-xs text-zinc-500 transition group-hover:text-zinc-300">
              {previewImage ? "Change photo" : "Add a profile photo"}
            </span>
          </label>

          <input
            type="file"
            id="avatar"
            className="hidden"
            accept="image/*"
            onChange={handleImage}
          />

          <div className="mt-5 grid gap-3">
            <input
              name="username"
              placeholder="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-300"
            >
              {error}
            </p>
          )}

          <Motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white sm:py-2.5 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: ACCENT, boxShadow: "0 0 24px rgba(255,107,10,0.25)" }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {loading ? "Creating account..." : "Create account"}
          </Motion.button>

          <p className="mt-5 text-center text-xs text-zinc-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-orange-500 hover:underline">
              Sign in
            </Link>
          </p>
        </Motion.form>

        <Motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="order-first text-center lg:order-none lg:text-left"
        >
          <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            Your ideas
            <br />
            deserve readers.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm sm:mt-5 leading-relaxed text-zinc-400 lg:mx-0">
            Create your account and share your writing with readers everywhere.
            Start a blog, build an audience, and keep every post in one place.
          </p>

          <ul className="mx-auto mt-6 grid max-w-md gap-2.5 sm:mt-8 sm:gap-3 text-left text-sm text-zinc-300 lg:mx-0">
            {[
              "Publish your first post in minutes",
              "Build a profile readers can follow",
              "Keep drafts and published blogs organized",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                {item}
              </li>
            ))}
          </ul>
        </Motion.section>
      </div>
    </main>
  );
}