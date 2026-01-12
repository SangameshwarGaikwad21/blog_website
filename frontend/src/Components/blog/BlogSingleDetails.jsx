import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toggleLike } from "../../services/authService";
import { getSingleBlog } from "../../services/blogService";
import CommentSection from "../comments/CommentsSection";

export default function BlogSingleDetails() {
  const { postId } = useParams();

  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getSingleBlog(postId);
        const data = res.data?.data || res;

        setBlog(data);
        setLikesCount(data.likes?.length || 0);
        setLiked(data.isLiked || false); // 🔥 IMPORTANT
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [postId]);

  const handleLike = async () => {
    try {
      const res = await toggleLike(postId);
      setLiked(res.liked);
      setLikesCount(res.totalLikes);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!blog) return <p className="text-center">Blog not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>

      {/* LIKE BUTTON */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            liked ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          ❤️ {liked ? "Liked" : "Like"}
        </button>

        <span className="text-gray-600">
          {likesCount} Likes
        </span>
      </div>

      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="rounded-lg mb-6 w-full"
        />
      )}

      <p className="text-gray-700 text-lg leading-relaxed mb-10">
        {blog.context}
      </p>

      {/* 🔥 COMMENTS SECTION */}
      <CommentSection
        blogId={blog._id}
        currentUser={user}
      />
    </div>
  );
}
