import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
    <div className="min-h-screen flex items-center justify-center 
    bg-slate-950 relative overflow-hidden px-4">

      {/* Glow Background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute top-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE TEXT */}
        <div className="text-white text-center md:text-left space-y-5 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold 
          bg-gradient-to-r from-indigo-400 to-purple-500 
          bg-clip-text text-transparent">
            Welcome Back 👋
          </h1>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Login to your account and continue sharing and exploring
            amazing blogs from creators around the world.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl 
        border border-slate-700 p-8 rounded-2xl shadow-2xl mx-auto">

          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 
              text-white border border-slate-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 
              text-white border border-slate-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold 
              transition-all duration-300 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              hover:opacity-90 text-white ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* REGISTER LINK */}
            <p className="text-center text-sm text-gray-400 pt-2">
              Don’t have an account?{" "}
              <Link
                to="/"
                className="text-indigo-400 hover:underline"
              >
                Register
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

