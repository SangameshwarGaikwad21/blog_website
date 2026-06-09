import { useEffect, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { getProfile, updateProfile } from "../../services/authService";

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

  const handleFile = (file) => {
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
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
      setMessage("Avatar updated successfully");
      setAvatar(null);
    } catch (err) {
      console.error(err);
      setMessage("Avatar update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <Motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center shadow-2xl shadow-black/40 sm:p-8"
      >
        <h1 className="text-3xl font-bold">Change Avatar</h1>

        {preview && (
          <img
            src={preview}
            alt="avatar"
            className="mx-auto mt-7 h-32 w-32 rounded-full border-4 border-cyan-300 object-cover"
          />
        )}

        <label className="mt-7 flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-gray-700 bg-black/30 p-6 transition hover:border-cyan-300/70">
          <ImagePlus className="mb-3 text-cyan-300" size={28} />
          <span className="text-sm font-semibold text-gray-200">Choose new avatar</span>
          <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
        </label>

        <Motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
        >
          <Upload size={18} />
          {loading ? "Uploading..." : "Update Avatar"}
        </Motion.button>

        {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
      </Motion.form>
    </main>
  );
}
