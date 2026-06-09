import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { BsPersonCircle } from "react-icons/bs";
import { motion as Motion } from "framer-motion";
import { registerUser } from "../../services/authService";

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
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <Motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center lg:text-left"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Start Writing
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
            Join Our Community
          </h1>
          <p className="mt-5 text-gray-400">
            Create your account and share ideas with readers everywhere.
          </p>
        </Motion.section>

        <Motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8"
        >
          <h2 className="text-center text-2xl font-bold">Create Account</h2>

          <label htmlFor="avatar" className="mt-6 flex cursor-pointer justify-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Avatar preview"
                className="h-24 w-24 rounded-full border-2 border-cyan-300 object-cover"
              />
            ) : (
              <BsPersonCircle className="h-24 w-24 text-gray-600 transition hover:text-cyan-300" />
            )}
          </label>

          <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImage} />

          <div className="mt-6 grid gap-4">
            <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="field-dark" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="field-dark" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="field-dark" />
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-300">{error}</p>}

          <Motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
          >
            <UserPlus size={18} />
            {loading ? "Creating..." : "Create Account"}
          </Motion.button>

          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-cyan-300 hover:underline">
              Login
            </Link>
          </p>
        </Motion.form>
      </div>
    </main>
  );
}
