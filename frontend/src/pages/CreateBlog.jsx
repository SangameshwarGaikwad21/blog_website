import { useState } from "react";
import { useBlog } from "../context/blogContext";

export default function CreateBlog({ onNewBlog }) {

  const { handleCreateBlog, loading } = useBlog(); 

  const [formData, setFormData] = useState({
    title: "",
    context: "",
    category: "",
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);
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

    if (
      !formData.title.trim() ||
      !formData.context.trim() ||
      !formData.category.trim()
    ) {
      setError("Title, context, and category are required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("context", formData.context);
    data.append("category", formData.category);
    if (formData.thumbnail)
      data.append("thumbnail", formData.thumbnail);

    try {
      const res = await handleCreateBlog(data); 

      if (onNewBlog && res?.blog) {
        onNewBlog(res.blog);
      }

      setFormData({
        title: "",
        context: "",
        category: "",
        thumbnail: null,
      });

      setPreview(null);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">

    {/* Card */}
    <form
      onSubmit={handleSubmit}
      className=" w-full max-w-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl
        p-5 sm:p-6 flex flex-col gap-5
      "
    >

     
      <h2 className="
        text-xl sm:text-2xl
        font-bold
        text-center
        bg-gradient-to-r
        from-blue-400 to-purple-400 bg-clip-text text-transparent
      ">
        ✍️ Create Blog
      </h2>

     
      <div className="flex flex-col items-center gap-2">

        <label
          className="
            w-full
            flex flex-col
            items-center
            justify-center
            px-4 py-6
            bg-white/5
            border border-dashed border-gray-500
            rounded-xl
            cursor-pointer
            hover:border-blue-400
            hover:bg-white/10
            transition
          "
        >
          <span className="text-gray-300 text-sm">
            📸 Upload Thumbnail
          </span>

          <span className="text-gray-500 text-xs">
            Click to upload
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

       
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="
              w-28 h-28
              object-cover
              rounded-lg
              border border-white/30
              shadow-md
            "
          />
        )}
      </div>

    
      {error && (
        <p className="text-red-400 text-center text-sm">
          {error}
        </p>
      )}

     
      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm font-medium">
          Title
        </label>

        <input
          type="text"
          name="title"
          placeholder="Enter blog title..."
          value={formData.title}
          onChange={handleChange}
          className="
            w-full
            px-3 py-2
            rounded-lg
            border border-gray-600
            bg-white/5
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            text-sm
          "
        />
      </div>

    
      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm font-medium">
          Content
        </label>

        <textarea
          name="context"
          placeholder="Write your blog..."
          value={formData.context}
          onChange={handleChange}
          rows={4}
          className="
            w-full
            px-3 py-2
            rounded-lg
            border border-gray-600
            bg-white/5
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
            resize-none
            text-sm
          "
        />
      </div>

     
      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm font-medium">
          Category
        </label>

        <input
          type="text"
          name="category"
          placeholder="Technology, AI..."
          value={formData.category}
          onChange={handleChange}
          className="
            w-full
            px-3 py-2
            rounded-lg
            border border-gray-600
            bg-white/5
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-pink-500
            text-sm
          "
        />
      </div>

      {/* Button */}
      <button type="submit"  disabled={loading}
  className={`
    w-full
    py-3
    rounded-lg
    font-semibold
    text-white
    text-base
    shadow-lg
    transition-all
    duration-300
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.03]"
    }
  `}
>
  {loading ? "Creating..." : "🚀 Create"}
  </button>
    </form>
  </div>
);

}
