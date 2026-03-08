import { useEffect, useState } from "react";
import { getProfile } from "../../services/authService";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <p className="text-gray-400 text-lg">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <p className="text-red-400 text-lg">User not found</p>
      </div>
    );

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
        backdrop-blur-xl bg-slate-900/80
        border border-slate-700
        rounded-3xl shadow-2xl p-8"
      >

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={user.avatar || "/avatar.png"}
              alt={user.username}
              className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
            />

            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></span>
          </div>
        </div>

        {/* Name */}
        <div className="text-center mt-4 space-y-1">
          <h2 className="text-2xl font-semibold capitalize text-white">
            {user.username}
          </h2>

          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        <div className="my-6 border-t border-slate-700"></div>

        {/* Details */}
        <div className="space-y-3 text-sm text-gray-300">

          <div className="flex justify-between">
            <span className="text-gray-400">User ID</span>
            <span className="font-medium truncate w-40 text-right">
              {user._id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Joined</span>
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-4">

          <Link to="/my-blogs">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-lg text-white 
            bg-gradient-to-r from-indigo-500 to-purple-600 
            shadow-lg hover:shadow-xl hover:opacity-90 transition mb-4">
              🔒 My Blogs
            </button>
          </Link>

          <div className="grid grid-cols-2 gap-3">

            <Link to="/editprofile">
              <button className="w-full border border-indigo-500 text-indigo-400 
              hover:bg-indigo-500/10 py-2 rounded-xl font-medium transition">
                ✏️ Edit Profile
              </button>
            </Link>

            <Link to="/changeavatar">
              <button className="w-full border border-indigo-500 text-indigo-400 
              hover:bg-indigo-500/10 py-2 rounded-xl font-medium transition">
                🖼️ Change Avatar
              </button>
            </Link>

          </div>

        </div>

      </motion.div>
    </div>
  );
}

