import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, ImagePlus, Loader2, Upload, UserRound } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getProfile, updateProfile } from "../../services/authService";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";

export default function ChangeAvatar() {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const blobUrl = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setPreview(res.data.avatar || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();

    // free any temporary preview URL when leaving the page
    return () => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    };
  }, []);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSuccess(false);
      setMessage("Only image files allowed");
      return;
    }

    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = URL.createObjectURL(file);

    setMessage("");
    setAvatar(file);
    setPreview(blobUrl.current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      await updateProfile(formData);
      setSuccess(true);
      setMessage("Avatar updated successfully");
      setAvatar(null);
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setMessage("Avatar update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#08080a] px-4 py-8 text-white sm:px-6 sm:py-10"
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
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[380px] w-[120%] max-w-[800px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.28), rgba(255,107,10,0.07) 60%, transparent)",
        }}
      />

      <div className="relative w-full max-w-md">
        <Link
          to="/profile"
          className="group mb-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to profile
        </Link>

        <Motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full rounded-xl border border-white/10 bg-[#0e0e10]/90 p-5 text-center shadow-2xl shadow-black/50 backdrop-blur sm:p-8"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-50 sm:text-3xl">
            Change avatar
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">Pick a new photo for your profile.</p>

          <div className="mt-6 flex justify-center sm:mt-7">
            {preview ? (
              <img
                src={preview}
                alt="Avatar preview"
                className="h-28 w-28 rounded-full border-2 object-cover sm:h-32 sm:w-32"
                style={{ borderColor: ACCENT, boxShadow: "0 0 28px rgba(255,107,10,0.3)" }}
              />
            ) : (
              <span className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-600 sm:h-32 sm:w-32">
                <UserRound size={44} aria-hidden />
              </span>
            )}
          </div>

          <label
            htmlFor="avatar-file"
            className="mt-6 flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 transition hover:border-orange-500/60 hover:bg-orange-500/[0.04]"
          >
            <ImagePlus className="mb-2 text-orange-500" size={26} />
            <span className="text-sm font-semibold text-zinc-200">
              {avatar ? "Choose a different photo" : "Choose new avatar"}
            </span>
            <span className="mt-1 max-w-full truncate text-xs text-zinc-500">
              {avatar ? avatar.name : "PNG or JPG, tap to browse"}
            </span>
          </label>
          <input
            id="avatar-file"
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />

          <Motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading || !avatar}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5"
            style={{ backgroundColor: ACCENT, boxShadow: avatar ? "0 0 24px rgba(255,107,10,0.25)" : "none" }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {loading ? "Uploading..." : "Update avatar"}
          </Motion.button>

          {message && (
            <p
              role="status"
              className={`mt-4 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                success
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message}
            </p>
          )}
        </Motion.form>
      </div>
    </main>
  );
}