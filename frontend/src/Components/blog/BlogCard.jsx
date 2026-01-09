import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog._id}`}>
      <div className="bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col">
        
        
        {blog.thumbnail && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

      
        <div className="p-5 flex flex-col gap-3">
          <h2 className="text-xl font-bold truncate">{blog.title}</h2>

         
          <span className="inline-block text-blue-500 text-1xl px-2 py-1 rounded-full">
            {blog.category}
          </span>

       
          <p className="text-gray-300 line-clamp-3">
            {blog.context}
          </p>
        </div>
      </div>
    </Link>
  );
}
