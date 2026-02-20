import { createContext, useContext, useState } from "react";
import { createBlog } from "../services/blogService";
import toast from "react-hot-toast";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCreateBlog = async (formData) => {
    try {
      setLoading(true);
      const res = await createBlog(formData);

      if (res?.blog) {
        setBlogs((prev) => [res.blog, ...prev]);
      }

      toast.success("Blog created successfully 🚀");

      return res;

    } catch (error) {
      toast.error(error?.response?.data?.message || "Create failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        loading,
        handleCreateBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);