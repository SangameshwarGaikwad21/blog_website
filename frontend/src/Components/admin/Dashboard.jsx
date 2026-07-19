import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { deleteBlog, getAllBlog } from "../../services/blogService";
import { getAllUser } from "../../services/authService";

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
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading Dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-gray-200 lg:flex">
      <aside className="border-b border-white/10 bg-zinc-950 p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <Link to="/home" className="text-4xl font-bold text-white">
          <h1 className="text-2xl font-bold hover:text-purple-700">
            Admin Panel
          </h1>
        </Link>
        <nav className="mt-6 flex gap-4 lg:flex-col">
          <a href="#users" className=" text-gray-400 transition hover:text-cyan-300">
            <h1 className="text-xl text-white font-bold hover:text-purple-700">
              Users
            </h1>
          </a>
          <a href="#blogs" className="text-2xl text-gray-400 transition hover:text-cyan-300">
            <h1 className="text-xl text-white font-bold hover:text-purple-700">
              Blogs
            </h1>
          </a>
        </nav>
      </aside>

      <section className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={users.length} />
          <StatCard title="Total Blogs" value={blogs.length} />
          <StatCard title="Published" value={blogs.filter((blog) => blog.status === "published").length} />
          <StatCard title="Drafts" value={blogs.filter((blog) => blog.status === "draft").length} />
        </div>

        <section id="users" className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold text-white">Users</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <Motion.article
                key={user._id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar || "https://via.placeholder.com/80"}
                    alt={user.username}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">{user.username}</h3>
                    <p className="truncate text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-400">Role: {user.role}</p>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black transition hover:bg-cyan-300"
                >
                  View Details
                </button>
              </Motion.article>
            ))}
          </div>
        </section>

        <section id="blogs" className="mt-12">
          <h2 className="mb-5 text-2xl font-semibold text-white">Blogs</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-zinc-900 text-gray-300">
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
                  <tr key={blog._id} className="border-t border-white/10 hover:bg-white/[0.04]">
                    <td className="p-3">{blog.title}</td>
                    <td className="p-3">{blog.author}</td>
                    <td className="p-3">
                      <span className={blog.status === "published" ? "text-green-300" : "text-yellow-300"}>
                        {blog.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3">{blog.category}</td>
                    <td className="p-3">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="flex flex-wrap gap-2 p-3">
                      <Link to={`/admin/update-blog/${blog._id}`} className="rounded-lg bg-cyan-400 px-3 py-1 font-semibold text-black">
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteBlog(blog._id)} className="rounded-lg bg-red-500 px-3 py-1 font-semibold text-white">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <AnimatePresence>
        {selectedUser && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
            >
              <h2 className="mb-4 text-xl font-semibold text-white">User Details</h2>
              <p className="text-gray-300">Name: {selectedUser.username}</p>
              <p className="text-gray-300">Email: {selectedUser.email}</p>
              <p className="text-gray-300">Role: {selectedUser.role}</p>
              <button
                onClick={() => setSelectedUser(null)}
                className="mt-6 w-full rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-400"
              >
                Close
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

const StatCard = ({ title, value }) => (
  <Motion.div
    whileHover={{ y: -4 }}
    className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30"
  >
    <h3 className="text-sm text-gray-400">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
  </Motion.div>
);

export default Dashboard;
