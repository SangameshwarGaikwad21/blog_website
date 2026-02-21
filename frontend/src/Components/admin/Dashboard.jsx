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
      } catch (err) {
        console.error(err);
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
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-64 bg-white shadow-xl p-6 border-r"
      >
        <h2 className="text-3xl font-bold text-indigo-600 mb-10">
          Admin Panel
        </h2>

        <nav className="flex md:flex-col gap-4 text-lg">
          <a href="#users" className="hover:text-indigo-500 transition">
            Users
          </a>
          <a href="#blogs" className="hover:text-indigo-500 transition">
            Blogs
          </a>
        </nav>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10">
        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value={users.length} color="indigo" />
          <StatCard title="Total Blogs" value={blogs.length} color="green" />
          <StatCard
            title="Published"
            value={blogs.filter((b) => b.status === "published").length}
            color="blue"
          />
          <StatCard
            title="Drafts"
            value={blogs.filter((b) => b.status === "draft").length}
            color="yellow"
          />
        </section>

        {/* USERS */}
        <section id="users" className="mb-14">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">
            All Users
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0px 15px 35px rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow p-5 cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={user.avatar || "https://via.placeholder.com/80"}
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover border"
                  />

                  <div>
                    <h3 className="text-lg font-semibold">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {user.role}
                  </p>
                  <p>
                    <span className="font-medium">Joined:</span>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BLOGS */}
        <section id="blogs">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">
            All Blogs
          </h2>

          <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
            <table className="min-w-full">
              <thead className="bg-purple-100 text-purple-700">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {blogs.map((blog) => (
                  <motion.tr
                    key={blog._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{
                      backgroundColor: "#faf5ff",
                      scale: 1.01,
                    }}
                    transition={{ duration: 0.2 }}
                    className="border-b"
                  >
                    <td className="p-3 font-medium">{blog.title}</td>
                    <td className="p-3">{blog.author}</td>
                    <td
                      className={`p-3 font-semibold ${
                        blog.status === "published"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {blog.status}
                    </td>
                    <td className="p-3">{blog.category}</td>
                    <td className="p-3">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <Link
                        to={`/admin/update-blog/${blog._id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-indigo-600 mb-4">
                User Details
              </h2>

              <div className="flex justify-center mb-4">
                <img
                  src={selectedUser.avatar || "https://via.placeholder.com/100"}
                  alt="user"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <Input label="Name" value={selectedUser.username} />
                <Input label="Email" value={selectedUser.email} />
                <Input label="Role" value={selectedUser.role} />
                <Input
                  label="Joined"
                  value={new Date(
                    selectedUser.createdAt
                  ).toLocaleDateString()}
                />
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;

/* COMPONENTS */

const colorMap = {
  indigo: "bg-indigo-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};

const StatCard = ({ title, value, color }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
    }}
    transition={{ duration: 0.3 }}
    className={`${colorMap[color]} text-white rounded-xl shadow p-6`}
  >
    <h3 className="text-sm uppercase opacity-80">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </motion.div>
);

const Input = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <input
      value={value}
      disabled
      className="w-full border rounded px-3 py-2 bg-gray-50"
    />
  </div>
);