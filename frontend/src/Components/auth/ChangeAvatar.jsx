import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/authService";
import { motion } from "framer-motion";

export default function ChangeAvatar() {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      setPreview(res.data.avatar);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      await updateProfile(formData);
      setMessage("Avatar updated successfully ✅");
      setAvatar(null);
    } catch (err) {
      console.error(err);
      setMessage("Avatar update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-slate-950 relative overflow-hidden px-4">

      {/* Glow background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute top-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md
        bg-slate-900/80 backdrop-blur-xl
        border border-slate-700
        p-8 rounded-3xl shadow-2xl text-center"
      >

        <h2 className="text-2xl font-bold mb-6 
        bg-gradient-to-r from-indigo-400 to-purple-500 
        bg-clip-text text-transparent">
          Change Avatar
        </h2>

        {preview && (
          <img
            src={preview}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 
            border-indigo-500 object-cover 
            mx-auto mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full text-sm text-gray-300 
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-indigo-500 file:text-white
            hover:file:bg-indigo-600"
          />

          <button
            disabled={loading}
            className="w-full py-2 rounded-xl text-white font-semibold
            bg-gradient-to-r from-indigo-500 to-purple-600
            hover:opacity-90 transition"
          >
            {loading ? "Uploading..." : "Update Avatar"}
          </button>

          {message && (
            <p className="text-sm text-gray-300 mt-2">
              {message}
            </p>
          )}

        </form>

      </motion.div>
    </div>
  );
}
