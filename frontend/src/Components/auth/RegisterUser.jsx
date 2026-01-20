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
    reader.readAsDataURL(file);
    reader.onload = () => setPreviewImage(reader.result);
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
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-900 text-white px-4 md:px-20 gap-10">
      <div className="text-center md:text-left md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold">Welcome to the Blogging Platform!</h1>
        <p className="text-gray-300">
          Register to create an account and start sharing your thoughts with the world.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 gap-4 bg-gray-800 p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

       
        <label htmlFor="avatar" className="cursor-pointer self-center">
          {previewImage ? (
            <img
              src={previewImage}
              className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
            />
          ) : (
            <BsPersonCircle className="w-24 h-24 text-gray-400" />
          )}
        </label>
        <input
          type="file"
          id="avatar"
          className="hidden"
          accept="image/*"
          onChange={handleImage}
        />

    
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border border-gray-600 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border border-gray-600 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-600 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          value={formData.password}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
