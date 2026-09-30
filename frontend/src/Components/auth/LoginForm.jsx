import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import { loginUser } from "../../services/authService";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-base text-white sm:py-2.5 sm:text-sm " +
  "placeholder:text-zinc-500 outline-none transition " +
  "focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/20";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await loginUser(formData);
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      toast.success("Welcome back!");
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
        <Motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            Write it down.
            <br />
            Put it out there.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm sm:mt-5 leading-relaxed text-zinc-400 lg:mx-0">
            Sign in to keep writing, reading, and managing your blogs. Your drafts,
            published posts, and the stories you follow are all waiting for you.
          </p>

          <ul className="mx-auto mt-6 grid max-w-md gap-2.5 sm:mt-8 sm:gap-3 text-left text-sm text-zinc-300 lg:mx-0">
            {[
              "Write and edit posts in minutes",
              "Manage drafts and published blogs in one place",
              "Read ideas shared by other writers",
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

        <Motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-sm rounded-xl border border-white/10 bg-[#0e0e10]/90 p-5 shadow-2xl sm:p-6 shadow-black/50 backdrop-blur"
        >
          <h2 className="mb-5 text-center text-lg font-semibold text-zinc-100">
            Sign in to your account
          </h2>
          <div className="grid gap-3">
            <input
              type="text"
              name="username"
              placeholder="Username or email"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
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
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? "Signing in..." : "Sign in"}
          </Motion.button>

          <p className="mt-5 text-center text-xs text-zinc-500">
            Don't have an account?{" "}
            <Link to="/" className="font-semibold text-orange-500 hover:underline">
              Create one
            </Link>
          </p>
        </Motion.form>
      </div>
    </main>
  );
}