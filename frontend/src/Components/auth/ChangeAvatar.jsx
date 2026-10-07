import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Upload } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getProfile, updateProfile } from "../../services/authService";

export default function ChangeAvatar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      setPreview(res.data.avatar);
    };
    fetchProfile();
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      await updateProfile(formData);
      setMessage("Avatar updated successfully");
      setAvatar(null);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Avatar update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080a] px-4 py-10 text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,106,0,0.22), transparent 70%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        backgroundPosition: "center top, center top, center top",
      }}
    >
      <Motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0e]/95 p-6 shadow-2xl shadow-black/60 backdrop-blur sm:p-8"
      >
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-gray-200 transition hover:border-orange-500/50 hover:bg-white/[0.06]"
          >
            <ArrowLeft size={16} />
            Back to profile
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">Change avatar</h1>
            <p className="mt-0.5 text-xs text-gray-400">
              Pick a new photo for your profile.
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Your avatar"
              className="h-32 w-32 rounded-full border-4 border-orange-500 object-cover shadow-[0_0_32px_rgba(255,106,0,0.3)]"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/10 bg-white/[0.03] text-gray-500">
              <ImagePlus size={32} />
            </div>
          )}
        </div>

        <label className="mt-7 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-white/15 bg-black/40 p-6 transition hover:border-orange-500/70 hover:bg-orange-500/[0.04]">
          <ImagePlus className="mb-3 text-orange-500" size={28} />
          <span className="text-sm font-semibold text-gray-200">
            {avatar ? avatar.name : "Choose new avatar"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <Motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading || !avatar}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(255,106,0,0.3)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          <Upload size={18} />
          {loading ? "Uploading..." : "Update avatar"}
        </Motion.button>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              isError ? "text-red-400" : "text-gray-300"
            }`}
          >
            {message}
          </p>
        )}
      </Motion.form>
    </main>
  );
}