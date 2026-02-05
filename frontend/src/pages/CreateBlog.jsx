import { useState } from "react";
import { createBlog } from "../services/blogService";
import toast from "react-hot-toast";

export default function CreateBlog({ onNewBlog }) {
  const [formData, setFormData] = useState({
    title: "",
    context: "",
    category: "",
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, thumbnail: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.context.trim() || !formData.category.trim()) {
      setError("Title, context, and category are required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("context", formData.context);
    data.append("category", formData.category);
    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

    try {
      setLoading(true);
      const newBlog = await createBlog(data);
      if (onNewBlog && newBlog?.blog) onNewBlog(newBlog.blog);
      setFormData({ title: "", context: "", category: "", thumbnail: null });
      setPreview(null);
      toast("blog was created")
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">

  {/* Card */}
  <form
    onSubmit={handleSubmit}
    className="
      w-full 
      max-w-2xl 
      backdrop-blur-xl 
      bg-white/10 
      border border-white/20 
      shadow-2xl 
      rounded-3xl 
      p-6 
      sm:p-8 
      md:p-10 
      flex flex-col 
      gap-6
    "
  >

    {/* Heading */}
    <h2 className="
      text-2xl 
      sm:text-3xl 
      font-extrabold 
      text-center 
      bg-gradient-to-r 
      from-blue-400 
      to-purple-400 
      bg-clip-text 
      text-transparent
    ">
      ✍️ Create New Blog
    </h2>

    {/* Thumbnail Upload */}
    <div className="flex flex-col items-center gap-3">

      <label
        className="
          w-full 
          flex flex-col 
          items-center 
          justify-center 
          px-4 
          py-8 
          sm:py-10 
          bg-white/5 
          border-2 
          border-dashed 
          border-gray-500 
          rounded-2xl 
          cursor-pointer 
          hover:border-blue-400 
          hover:bg-white/10 
          transition
        "
      >
        <span className="text-gray-300 text-base sm:text-lg">
          📸 Upload Thumbnail
        </span>

        <span className="text-gray-500 text-xs sm:text-sm">
          Click or drag image here
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="
            w-32 h-32 
            sm:w-40 sm:h-40 
            md:w-44 md:h-44 
            object-cover 
            rounded-xl 
            border-2 
            border-white/30 
            shadow-lg
          "
        />
      )}
    </div>

    {/* Error */}
    {error && (
      <p className="text-red-400 text-center text-sm sm:text-base">
        {error}
      </p>
    )}

    {/* Title */}
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 font-semibold text-sm sm:text-base">
        Blog Title
      </label>

      <input
        type="text"
        name="title"
        placeholder="Enter blog title..."
        value={formData.title}
        onChange={handleChange}
        className="
          w-full 
          px-4 
          py-2.5 
          sm:py-3 
          rounded-xl 
          border 
          border-gray-600 
          bg-white/5 
          text-white 
          placeholder-gray-400 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          transition
        "
      />
    </div>

    {/* Content */}
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 font-semibold text-sm sm:text-base">
        Blog Content
      </label>

      <textarea
        name="context"
        placeholder="Write your blog content..."
        value={formData.context}
        onChange={handleChange}
        rows={5}
        className="
          w-full 
          px-4 
          py-2.5 
          sm:py-3 
          rounded-xl 
          border 
          border-gray-600 
          bg-white/5 
          text-white 
          placeholder-gray-400 
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-500 
          resize-none 
          transition
        "
      />
    </div>

    {/* Category */}
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 font-semibold text-sm sm:text-base">
        Category
      </label>

      <input
        type="text"
        name="category"
        placeholder="Technology, AI, Coding..."
        value={formData.category}
        onChange={handleChange}
        className="
          w-full 
          px-4 
          py-2.5 
          sm:py-3 
          rounded-xl 
          border 
          border-gray-600 
          bg-white/5 
          text-white 
          placeholder-gray-400 
          focus:outline-none 
          focus:ring-2 
          focus:ring-pink-500 
          transition
        "
      />
    </div>

    {/* Button */}
    <button
      type="submit"
      disabled={loading}
      className={`
        w-full 
        py-2.5 
        sm:py-3 
        rounded-xl 
        font-semibold 
        text-white 
        shadow-lg 
        transition-all 
        duration-300 
        ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]"
        }
      `}
    >
      {loading ? "Creating..." : "🚀 Create Blog"}
    </button>

  </form>
</div>
 

  );
}
