import { useEffect, useState } from "react";
import { getAllUser } from "../../services/authService";
import { getAllBlog, deleteBlog } from "../../services/blogService";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await getAllUser();
        const blogsRes = await getAllBlog();

        setUsers(usersRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await deleteBlog(blogId, token);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-gray-200">

      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold text-indigo-400 mb-4 lg:mb-8">
          Admin Panel
        </h2>

        <nav className="flex lg:flex-col gap-4">
          <a href="#users" className="hover:text-indigo-400">
            Users
          </a>
          <a href="#blogs" className="hover:text-indigo-400">
            Blogs
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-10">
          <StatCard title="Total Users" value={users.length} />
          <StatCard title="Total Blogs" value={blogs.length} />
          <StatCard
            title="Published"
            value={blogs.filter((b) => b.status === "published").length}
          />
          <StatCard
            title="Drafts"
            value={blogs.filter((b) => b.status === "draft").length}
          />
        </section>

        {/* Users Section */}
        <section id="users" className="mb-12">
          <h2 className="text-xl lg:text-2xl font-semibold text-indigo-400 mb-6">
            Users
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {users.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.03 }}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={user.avatar || "https://via.placeholder.com/80"}
                    alt={user.username}
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  Role: {user.role}
                </p>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Blogs Section */}
        <section id="blogs">
          <h2 className="text-xl lg:text-2xl font-semibold text-indigo-400 mb-6">
            Blogs
          </h2>

          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-lg">
            <table className="min-w-[700px] w-full text-sm">

              <thead className="bg-slate-800 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Author</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-t border-slate-800 hover:bg-slate-800"
                  >
                    <td className="p-3">{blog.title}</td>
                    <td className="p-3">{blog.author}</td>

                    <td className="p-3">
                      {blog.status === "published" ? (
                        <span className="text-green-400">
                          Published
                        </span>
                      ) : (
                        <span className="text-yellow-400">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="p-3">{blog.category}</td>

                    <td className="p-3">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 flex flex-wrap gap-2">
                      <Link
                        to={`/admin/update-blog/${blog._id}`}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </section>

      </main>

      {/* User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-slate-900 p-6 rounded-lg w-full max-w-sm"
            >
              <h2 className="text-xl font-semibold mb-4">
                User Details
              </h2>

              <p>Name: {selectedUser.username}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Role: {selectedUser.role}</p>

              <button
                onClick={() => setSelectedUser(null)}
                className="mt-6 w-full bg-red-600 hover:bg-red-500 py-2 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;


/* Stat Card */

const StatCard = ({ title, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:p-6"
    >
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl lg:text-3xl font-bold text-white mt-2">{value}</p>
    </motion.div>
  );
};