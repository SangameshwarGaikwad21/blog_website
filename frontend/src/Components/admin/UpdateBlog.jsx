import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, updateBlog } from "../../services/blogService";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [context, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        setTitle(res.data.title);
        setContent(res.data.context);
        setCategory(res.data.category);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateBlog(id, { title, context, category }, token);
      alert("Blog updated successfully");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Failed to update blog");
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">

    {/* Card */}
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        max-w-xl
        backdrop-blur-lg
        bg-white/10
        border border-white/20
        shadow-2xl
        rounded-2xl
        p-5 sm:p-6
        flex flex-col
        gap-5
      "
    >

      {/* Heading */}
      <h2 className="
        text-xl sm:text-2xl
        font-bold
        text-center
        bg-gradient-to-r
        from-blue-400
        to-purple-400
        bg-clip-text
        text-transparent
      ">
        ✏️ Update Blog
      </h2>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm font-medium">
          Blog Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title..."
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
          required
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm font-medium">
          Blog Content
        </label>

        <textarea
          rows={4}
          value={context}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content..."
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
          required
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-300 text-sm font-medium">
          Category
        </label>

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Technology, AI..."
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
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">

        <button
          type="submit"
          className="
            flex-1
            py-2.5
            rounded-lg
            font-semibold
            text-white
            text-sm
            shadow-md
            transition-all
            duration-300
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            hover:scale-[1.03]
          "
        >
          🚀 Update Blog
        </button>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="
            flex-1
            py-2.5
            rounded-lg
            font-semibold
            text-sm
            text-white
            bg-gray-600 hover:bg-gray-700
            transition
          "
        >
          Cancel
        </button>

      </div>

    </form>
  </div>
);


};

export default UpdateBlog;
