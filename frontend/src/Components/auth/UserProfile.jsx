import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Image, Loader2, Pencil } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getProfile } from "../../services/authService";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";
const fontStyle = { fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" };

const secondaryLink =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 " +
  "transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 sm:py-2.5";

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
      <main
        className="flex min-h-[100dvh] items-center justify-center bg-[#08080a] text-zinc-400"
        style={fontStyle}
      >
        <span className="inline-flex items-center gap-2 text-sm">
          <Loader2 size={18} className="animate-spin text-orange-500" />
          Loading profile...
        </span>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#08080a] px-4 text-center"
        style={fontStyle}
      >
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-50">User not found</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          We couldn't load your profile. Try signing in again.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
          style={{ backgroundColor: ACCENT }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#08080a] px-4 py-8 text-white sm:px-6 sm:py-10"
      style={fontStyle}
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
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[380px] w-[120%] max-w-[800px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.28), rgba(255,107,10,0.07) 60%, transparent)",
        }}
      />

      <div className="relative w-full max-w-md">
        <Link
          to="/home"
          className="group mb-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>

        <Motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-xl border border-white/10 bg-[#0e0e10]/90 p-5 shadow-2xl shadow-black/50 backdrop-blur sm:p-8"
        >
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={user.avatar || "/avatar.png"}
                alt={user.username}
                className="h-24 w-24 rounded-full border-2 object-cover sm:h-28 sm:w-28"
                style={{ borderColor: ACCENT, boxShadow: "0 0 28px rgba(255,107,10,0.3)" }}
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#0e0e10] bg-emerald-500" />
            </div>
          </div>

          <div className="mt-5 text-center">
            <h1 className="break-words text-2xl font-extrabold capitalize tracking-tight text-zinc-50 sm:text-3xl">
              {user.username}
            </h1>
            <p className="mt-1.5 break-all text-sm text-zinc-500">{user.email}</p>
          </div>

          <div className="my-6 border-t border-white/10 sm:my-7" />

          <dl className="grid gap-2.5 text-sm">
            <Info label="User ID" value={user._id} />
            <Info
              label="Joined"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            />
          </dl>

          <div className="mt-6 grid gap-3 sm:mt-7">
            <Link
              to="/my-blogs"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 sm:py-2.5"
              style={{ backgroundColor: ACCENT, boxShadow: "0 0 24px rgba(255,107,10,0.25)" }}
            >
              <BookOpen size={16} />
              My blogs
            </Link>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link to="/editprofile" className={secondaryLink}>
                <Pencil size={16} />
                Edit profile
              </Link>
              <Link to="/changeavatar" className={secondaryLink}>
                <Image size={16} />
                Change avatar
              </Link>
            </div>
          </div>
        </Motion.section>
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
      <dt className="shrink-0 text-xs text-zinc-500">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-zinc-200">{value}</dd>
    </div>
  );
}