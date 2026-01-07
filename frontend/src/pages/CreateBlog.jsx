import { useState } from "react";
import { createBlog } from "../services/blogService";

export default function CreateBlog({ onNewBlog }) {

  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
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

    if (!formData.title || !formData.content || !formData.category) {
      setError("Title, content, and category are required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

    try {
      setLoading(true);
      const newBlog = await createBlog(data);
      onNewBlog(newBlog.blog);
      setFormData({ title: "", content: "", category: "", thumbnail: null });
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded shadow mb-4 flex flex-col gap-3"
    >
      <h2 className="text-xl font-bold">Create a Blog</h2>

      <input
        type="text"
        name="title"
        placeholder="Blog Title"
        value={formData.title}
        onChange={handleChange}
        className="border px-2 py-1"
      />

      <textarea
        name="content"
        placeholder="Blog Content"
        value={formData.content}
        onChange={handleChange}
        className="border px-2 py-1"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="border px-2 py-1"
      />

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <img src={preview} alt="thumbnail preview" className="w-32 h-32 object-cover" />
      )}

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-2 rounded"
      >
        {loading ? "Creating..." : "Create Blog"}
      </button>
    </form>
  );
}
