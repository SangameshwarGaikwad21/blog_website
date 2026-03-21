import axios from "axios";
import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://blog-website-03ql.onrender.com/api/v1/posts");

        const posts = response.data.posts || response.data.data || [];

        setBlogs(posts);
        setFilteredBlogs(posts);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filterByCategory = (category) => {
    setActiveCategory(category);

    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter((blog) => blog.category === category)
      );
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      
      <div className="grid grid-cols-3 gap-6 mb-5">
        {filteredBlogs?.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </>
  );
}
