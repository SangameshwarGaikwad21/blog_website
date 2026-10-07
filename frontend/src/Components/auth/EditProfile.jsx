import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, LogOut, Save, AlertCircle } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getProfile, updateDetails, updatePassword, logout } from "../../services/authService";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-base text-white " +
  "placeholder:text-zinc-500 outline-none transition sm:py-2.5 sm:text-sm " +
  "focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/20";

function Spinner({ show, icon: Icon }) {
  return show ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "" });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(""); // "profile" | "password" | "logout"
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

  const start = (name) => {
    setLoading(true);
    setAction(name);
    setMessage("");
  };

  const finish = () => {
    setLoading(false);
    setAction("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    start("profile");

    try {
      await updateDetails(form);
      setSuccess(true);
      setMessage("Profile updated successfully");
    } catch {
      setSuccess(false);
      setMessage("Profile update failed");
    } finally {
      finish();
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    start("password");

    try {
      await updatePassword(password);
      setSuccess(true);
      setMessage("Password changed successfully");
      setPassword({ oldPassword: "", newPassword: "" });
    } catch {
      setSuccess(false);
      setMessage("Password update failed");
    } finally {
      finish();
    }
  };

  const handleLogout = async () => {
    start("logout");

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
      finish();
    }
  };

  return (
    <main
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#08080a] px-4 py-6 text-white sm:px-6 sm:py-10"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* subtle grid + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, #000 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-140px] h-[380px] w-[120%] max-w-[860px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.26), rgba(255,107,10,0.07) 60%, transparent)",
        }}
      />

      <div className="relative w-full max-w-3xl">
        <Motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-xl border border-white/10 bg-[#0e0e10]/90 p-5 shadow-2xl shadow-black/50 backdrop-blur sm:p-7"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              aria-label="Back to profile"
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to profile</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold tracking-tight text-zinc-50 sm:text-2xl">
                Account settings
              </h1>
              <p className="hidden truncate text-xs text-zinc-500 sm:block">
                Update your details and keep your account secure.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8">
            {/* profile details */}
            <form onSubmit={handleProfileSubmit} className="grid content-start gap-3">
              <h2 className="text-sm font-semibold text-zinc-100">Profile details</h2>
              <input
                name="username"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className={inputClass}
              />
              <Motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2.5"
                style={{ backgroundColor: ACCENT, boxShadow: "0 0 24px rgba(255,107,10,0.25)" }}
              >
                <Spinner show={action === "profile"} icon={Save} />
                {action === "profile" ? "Saving..." : "Update profile"}
              </Motion.button>
            </form>

            {/* password */}
            <form
              onSubmit={handlePasswordSubmit}
              className="grid content-start gap-3 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-100">Change password</h2>
                <button
                  type="button"
                  onClick={() => setShowPasswords((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-md text-xs text-zinc-500 transition hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                  aria-pressed={showPasswords}
                >
                  {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPasswords ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPasswords ? "text" : "password"}
                name="oldPassword"
                autoComplete="current-password"
                value={password.oldPassword}
                onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                placeholder="Current password"
                className={inputClass}
              />
              <input
                type={showPasswords ? "text" : "password"}
                name="newPassword"
                autoComplete="new-password"
                value={password.newPassword}
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                placeholder="New password"
                className={inputClass}
              />
              <Motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2.5"
              >
                <Spinner show={action === "password"} icon={KeyRound} />
                {action === "password" ? "Changing..." : "Change password"}
              </Motion.button>
            </form>
          </div>

          {/* feedback message */}
          {message && (
            <p
              role="status"
              className={`mt-6 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-center text-sm font-medium ${
                success
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message}
            </p>
          )}

          {/* logout */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2.5"
            >
              <Spinner show={action === "logout"} icon={LogOut} />
              {action === "logout" ? "Logging out..." : "Log out"}
            </button>
          </div>
        </Motion.section>
      </div>
    </main>
  );
}