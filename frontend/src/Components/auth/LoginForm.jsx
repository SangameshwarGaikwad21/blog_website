import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import { loginUser } from "../../services/authService";

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
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <Motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center lg:text-left"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Blog_App
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
            Welcome Back
          </h1>
          <p className="mt-5 text-gray-400">
            Login to keep writing, reading, and managing your blogs.
          </p>
        </Motion.section>

        <Motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8"
        >
          <h2 className="text-center text-2xl font-bold">Login to your account</h2>

          <div className="mt-6 grid gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={formData.username}
              onChange={handleChange}
              className="field-dark"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="field-dark"
            />
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-300">{error}</p>}

          <Motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </Motion.button>

          <p className="mt-5 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/" className="font-semibold text-cyan-300 hover:underline">
              Register
            </Link>
          </p>
        </Motion.form>
      </div>
    </main>
  );
}
