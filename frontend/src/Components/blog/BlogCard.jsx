import { Link } from "react-router-dom";


export default function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog._id}`}>
    <div className="border rounded shadow p-4">
      <h2 className="text-lg font-bold">{blog.title}</h2>
      <p>{blog.context}</p>

      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt={blog.title}
          style={{ width: "100%", marginTop: "10px" }}
        />
      )}
    </div>
    </Link>
  );
}
