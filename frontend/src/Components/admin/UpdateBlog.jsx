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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
    <div className="w-full max-w-3xl backdrop-blur-lg bg-white/70 shadow-2xl rounded-2xl p-10 border border-white/40">
      
      <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
        ✏️ Update Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Blog Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            required
          />
        </div>

       
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Blog Content
          </label>
          <textarea
            rows="7"
            value={context}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
            required
          />
        </div>

      
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Technology, AI, Coding..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition duration-300"
          >
            🚀 Update Blog
          </button>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex-1 py-3 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

        </div>
      </form>
    </div>
  </div>
);

};

export default UpdateBlog;
