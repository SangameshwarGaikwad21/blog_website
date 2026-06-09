import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Image, Pencil } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getProfile } from "../../services/authService";

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-gray-300">
        Loading profile...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-red-300">
        User not found
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <Motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={user.avatar || "/avatar.png"}
              alt={user.username}
              className="h-28 w-28 rounded-full border-4 border-cyan-300 object-cover"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-zinc-950 bg-green-500"></span>
          </div>
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-3xl font-bold capitalize text-white">{user.username}</h1>
          <p className="mt-2 text-sm text-gray-400">{user.email}</p>
        </div>

        <div className="my-7 border-t border-white/10"></div>

        <div className="grid gap-3 text-sm text-gray-300">
          <Info label="User ID" value={user._id} />
          <Info label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
        </div>

        <div className="mt-7 grid gap-3">
          <Link to="/my-blogs" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300">
            <BookOpen size={18} />
            My Blogs
          </Link>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link to="/editprofile" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-cyan-300/70">
              <Pencil size={16} />
              Edit Profile
            </Link>
            <Link to="/changeavatar" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-cyan-300/70">
              <Image size={16} />
              Avatar
            </Link>
          </div>
        </div>
      </Motion.section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 rounded-xl bg-black/30 p-3">
      <span className="text-gray-500">{label}</span>
      <span className="truncate text-right font-medium">{value}</span>
    </div>
  );
}
