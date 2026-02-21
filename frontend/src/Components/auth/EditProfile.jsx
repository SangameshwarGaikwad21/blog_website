import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateDetails,
  updatePassword,
  logout,
} from "../../services/authService";
import { motion } from "framer-motion";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

 
  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setForm({
        username: res.data.username,
        email: res.data.email,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  

  const handleProfileChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPassword({ ...password, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateDetails(form);
      setSuccess(true);
      setMessage("Profile updated successfully 🚀");
    } catch {
      setSuccess(false);
      setMessage("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updatePassword(password);
      setSuccess(true);
      setMessage("Password changed successfully 🔐");
      setPassword({ oldPassword: "", newPassword: "" });
    } catch {
      setSuccess(false);
      setMessage("Password update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage("");

    try {
      await logout({});
      localStorage.removeItem("token");
      setSuccess(true);
      setMessage("Logged out successfully 👋");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch {
      setSuccess(false);
      setMessage("Logout failed ❌");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      
      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          w-full max-w-md
          backdrop-blur-xl bg-white/70
          border border-white/40
          p-8 rounded-3xl shadow-2xl
          space-y-8
        "
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Account Settings ⚙️
        </h2>

        {/* PROFILE FORM */}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Profile Details
          </h3>

          <Input
            name="username"
            value={form.username}
            onChange={handleProfileChange}
            placeholder="Username"
          />

          <Input
            name="email"
            value={form.email}
            onChange={handleProfileChange}
            placeholder="Email"
            type="email"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="
              w-full bg-indigo-600 hover:bg-indigo-700
              text-white py-2 rounded-xl shadow-lg
              transition
            "
          >
            Update Profile
          </motion.button>
        </form>

       
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Change Password
          </h3>

          <Input
            name="oldPassword"
            value={password.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Current Password"
            type="password"
          />

          <Input
            name="newPassword"
            value={password.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            type="password"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="
              w-full bg-red-600 hover:bg-red-700
              text-white py-2 rounded-xl shadow-lg
              transition
            "
          >
            Change Password
          </motion.button>
        </form>

      
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={loading}
          className="
            w-full bg-gray-700 hover:bg-gray-800
            text-white py-2 rounded-xl shadow-lg
            transition
          "
        >
          Logout
        </motion.button>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center text-sm font-medium ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}


const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <motion.input
    whileFocus={{ scale: 1.02 }}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    className="
      w-full border border-gray-300
      rounded-xl px-4 py-2
      focus:ring-2 focus:ring-indigo-500
      outline-none transition
      bg-white/80
    "
  />
);