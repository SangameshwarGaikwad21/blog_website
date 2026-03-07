import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";

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
    <div className="min-h-screen flex items-center justify-center 
    bg-slate-950 relative overflow-hidden px-4">

      {/* Glow Background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute top-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT TEXT */}
        <div className="text-white text-center md:text-left space-y-5 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold 
          bg-gradient-to-r from-indigo-400 to-purple-500 
          bg-clip-text text-transparent">
            Join Our Community 🚀
          </h1>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Create your account and start sharing your ideas,
            tutorials, and experiences with developers worldwide.
          </p>
        </div>

        {/* REGISTER CARD */}
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl 
        border border-slate-700 p-8 rounded-2xl shadow-2xl mx-auto">

          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Avatar Upload */}
            <label htmlFor="avatar" className="flex justify-center cursor-pointer">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full border-2 
                  border-indigo-500 object-cover"
                />
              ) : (
                <BsPersonCircle className="w-24 h-24 text-gray-500 hover:text-indigo-400 transition" />
              )}
            </label>

            <input
              type="file"
              id="avatar"
              className="hidden"
              accept="image/*"
              onChange={handleImage}
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 
              text-white border border-slate-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 
              text-white border border-slate-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Password */}
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

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              hover:opacity-90 text-white transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {/* Login link */}
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:underline">
                Login
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

