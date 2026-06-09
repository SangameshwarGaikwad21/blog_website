import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Save } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getProfile, updateDetails, updatePassword, logout } from "../../services/authService";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "" });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setForm({ username: res.data.username, email: res.data.email });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateDetails(form);
      setSuccess(true);
      setMessage("Profile updated successfully");
    } catch {
      setSuccess(false);
      setMessage("Profile update failed");
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
      setMessage("Password changed successfully");
      setPassword({ oldPassword: "", newPassword: "" });
    } catch {
      setSuccess(false);
      setMessage("Password update failed");
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
      setMessage("Logged out successfully");
      setTimeout(() => navigate("/login"), 1000);
    } catch {
      setSuccess(false);
      setMessage("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <Motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8"
      >
        <h1 className="text-center text-3xl font-bold">Account Settings</h1>

        <div className="mt-8 grid gap-8">
          <form onSubmit={handleProfileSubmit} className="grid gap-4">
            <h2 className="text-lg font-semibold text-cyan-300">Profile Details</h2>
            <input name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="field-dark" />
            <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="field-dark" />
            <Motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black disabled:opacity-60">
              <Save size={18} />
              Update Profile
            </Motion.button>
          </form>

          <form onSubmit={handlePasswordSubmit} className="grid gap-4">
            <h2 className="text-lg font-semibold text-cyan-300">Change Password</h2>
            <input type="password" name="oldPassword" value={password.oldPassword} onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })} placeholder="Current Password" className="field-dark" />
            <input type="password" name="newPassword" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} placeholder="New Password" className="field-dark" />
            <Motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} disabled={loading} className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400 disabled:opacity-60">
              Change Password
            </Motion.button>
          </form>

          <button onClick={handleLogout} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 font-semibold text-gray-200 transition hover:bg-white/10 disabled:opacity-60">
            <LogOut size={18} />
            Logout
          </button>

          {message && (
            <p className={`rounded-xl p-3 text-center text-sm font-medium ${success ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
              {message}
            </p>
          )}
        </div>
      </Motion.section>
    </main>
  );
}
