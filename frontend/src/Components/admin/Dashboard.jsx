import React, { useEffect, useState } from "react";
import { getAllUser } from "../../services/authService";
import { getAllBlog,deleteBlog } from "../../services/blogService";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await getAllUser();
        const blogsRes = await getAllBlog();
        setUsers(usersRes.data);
        setBlogs(blogsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteBlog = async (blogId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
  if (!confirmDelete) return;

  try {
    await deleteBlog(blogId, token);

    // Remove blog from UI without re-fetching
    setBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => blog._id !== blogId)
    );
  } catch (error) {
    console.error("Failed to delete blog", error);
    alert("Error deleting blog");
  }
};




  if (loading) return <p className="text-center mt-20 text-lg font-semibold">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-10">Admin Panel</h2>
        <nav className="flex flex-col gap-6 text-lg">
          <a href="#users" className="hover:text-indigo-500 transition-colors">All Users</a>
          <a href="#blogs" className="hover:text-indigo-500 transition-colors">All Blogs</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-indigo-500 text-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm uppercase font-medium opacity-75">Total Users</h3>
            <p className="text-3xl font-bold mt-2">{users.length}</p>
          </div>
          <div className="bg-green-500 text-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm uppercase font-medium opacity-75">Total Blogs</h3>
            <p className="text-3xl font-bold mt-2">{blogs.length}</p>
          </div>
          <div className="bg-blue-500 text-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm uppercase font-medium opacity-75">Published Blogs</h3>
            <p className="text-3xl font-bold mt-2">{blogs.filter(b => b.status === 'published').length}</p>
          </div>
          <div className="bg-yellow-500 text-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm uppercase font-medium opacity-75">Draft Blogs</h3>
            <p className="text-3xl font-bold mt-2">{blogs.filter(b => b.status === 'draft').length}</p>
          </div>
        </section>


        <section id="users" className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">All Users</h2>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Email</th>
                  <th className="p-3 text-left font-medium">Role</th>
                  <th className="p-3 text-left font-medium">Joined At</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b hover:bg-indigo-50 transition-colors">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Edit</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* All Blogs Table */}
        <section id="blogs">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">All Blogs</h2>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-purple-100 text-purple-700">
                <tr>
                  <th className="p-3 text-left font-medium">Title</th>
                  <th className="p-3 text-left font-medium">Author</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Category</th>
                  <th className="p-3 text-left font-medium">Created At</th>
                  <th className="p-3 text-left font-medium">Updated At</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog._id} className="border-b hover:bg-purple-50 transition-colors">
                    <td className="p-3 font-medium">{blog.title}</td>
                    <td className="p-3">{blog.author}</td>
                    <td className={`p-3 font-semibold ${blog.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {blog.status}
                    </td>
                    <td className="p-3">{blog.category}</td>
                    <td className="p-3">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(blog.updatedAt).toLocaleDateString()}</td>
                    <td className="p-3 space-x-2">
                       <button>
                         <Link
                        to={`/admin/update-blog/${blog._id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                       </button>

                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
    </div>
  );
};

export default Dashboard;
