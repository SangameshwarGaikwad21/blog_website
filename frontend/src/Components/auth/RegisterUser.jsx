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

  // text input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // avatar handler
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

  // submit handler
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
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-6 w-96 rounded-lg shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">Register</h1>

        <label htmlFor="avatar" className="cursor-pointer">
          {previewImage ? (
            <img src={previewImage} className="w-24 h-24 rounded-full mx-auto" />
          ) : (
            <BsPersonCircle className="w-24 h-24 mx-auto" />
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
          className="border px-2 py-1"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border px-2 py-1"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border px-2 py-1"
          value={formData.password}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
