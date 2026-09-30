import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Pencil,
  PenLine,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { deleteBlog, getAllBlog } from "../../services/blogService";
import { getAllUser } from "../../services/authService";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";

const searchClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-base text-white " +
  "placeholder:text-zinc-500 outline-none transition sm:text-sm " +
  "focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/20";

const authorName = (author) =>
  typeof author === "object" && author !== null
    ? author.username || author.name || "Unknown"
    : author || "Unknown";

const scrollToSection = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [blogQuery, setBlogQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // login saves the token as "token"; older code used "accessToken"
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, blogsRes] = await Promise.all([getAllUser(), getAllBlog()]);
        setUsers(usersRes.data || []);
        setBlogs(blogsRes.data || []);
      } catch (err) {
        console.error(err);
        setError("We couldn't load the dashboard data. Refresh the page to try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      setDeleting(true);
      await deleteBlog(blogToDelete._id, token);
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete._id));
      toast.success("Blog deleted");
      setBlogToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  const publishedCount = blogs.filter((b) => b.status === "published").length;
  const draftCount = blogs.filter((b) => b.status === "draft").length;

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.username, u.email, u.role].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [users, userQuery]);

  const filteredBlogs = useMemo(() => {
    const q = blogQuery.trim().toLowerCase();
    return blogs.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      return [b.title, b.category, authorName(b.author)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [blogs, blogQuery, statusFilter]);

  if (loading) {
    return (
      <main
        className="flex min-h-[100dvh] items-center justify-center bg-[#08080a] text-zinc-400"
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
      >
        <span className="inline-flex items-center gap-2 text-sm">
          <Loader2 size={18} className="animate-spin text-orange-500" />
          Loading dashboard...
        </span>
      </main>
    );
  }

  return (
    <main
      className="min-h-[100dvh] bg-[#08080a] text-zinc-200 lg:flex"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* sidebar (desktop) / top bar (mobile) */}
      <aside className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0d]/90 backdrop-blur-xl lg:h-[100dvh] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-8 lg:p-5">
          <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-zinc-50">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: ACCENT, boxShadow: "0 0 12px rgba(255,107,10,0.8)" }}
            />
            Admin panel
          </div>

          <nav className="flex items-center gap-1.5 lg:flex-col lg:items-stretch lg:gap-1">
            <SideButton icon={Users} label="Users" onClick={() => scrollToSection("users")} />
            <SideButton icon={FileText} label="Blogs" onClick={() => scrollToSection("blogs")} />
            <Link
              to="/home"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 lg:mt-4 lg:border lg:border-white/10"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </nav>
        </div>
      </aside>

      <section className="relative min-w-0 flex-1 overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* orange glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-180px] h-[340px] w-[120%] max-w-[800px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,107,10,0.16), rgba(255,107,10,0.04) 60%, transparent)",
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          <header>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-50 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500">Manage your users and blog posts.</p>
          </header>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {/* stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard icon={Users} title="Total users" value={users.length} />
            <StatCard icon={FileText} title="Total blogs" value={blogs.length} />
            <StatCard icon={CheckCircle2} title="Published" value={publishedCount} />
            <StatCard icon={PenLine} title="Drafts" value={draftCount} />
          </div>

          {/* users */}
          <section id="users" className="scroll-mt-24 pt-10 lg:scroll-mt-8">
            <SectionHeader title="Users" count={filteredUsers.length}>
              <SearchBox
                value={userQuery}
                onChange={setUserQuery}
                placeholder="Search users"
                label="Search users"
              />
            </SectionHeader>

            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                {filteredUsers.map((user) => (
                  <article
                    key={user._id}
                    className="rounded-xl border border-white/10 bg-[#0e0e10] p-4 transition-colors hover:border-orange-500/30 sm:p-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={user.avatar || "https://via.placeholder.com/80"}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-zinc-50">
                          {user.username}
                        </h3>
                        <p className="truncate text-xs text-zinc-500">{user.email}</p>
                      </div>
                      <RoleBadge role={user.role} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="mt-4 w-full rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                    >
                      View details
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState text="No users match your search." />
            )}
          </section>

          {/* blogs */}
          <section id="blogs" className="scroll-mt-24 pb-6 pt-12 lg:scroll-mt-8">
            <SectionHeader title="Blogs" count={filteredBlogs.length}>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5 text-xs font-medium">
                  {[
                    ["all", "All"],
                    ["published", "Published"],
                    ["draft", "Drafts"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatusFilter(value)}
                      aria-pressed={statusFilter === value}
                      className={`flex-1 rounded-md px-3 py-1.5 transition sm:flex-none ${
                        statusFilter === value
                          ? "bg-orange-500/15 text-orange-400"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <SearchBox
                  value={blogQuery}
                  onChange={setBlogQuery}
                  placeholder="Search blogs"
                  label="Search blogs"
                />
              </div>
            </SectionHeader>

            {filteredBlogs.length > 0 ? (
              <>
                {/* table: tablet and up */}
                <div className="hidden overflow-x-auto rounded-xl border border-white/10 bg-[#0e0e10] md:block">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-white/[0.03] text-xs text-zinc-500">
                      <tr>
                        {["Title", "Author", "Status", "Category", "Created", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogs.map((blog) => (
                        <tr
                          key={blog._id}
                          className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.03]"
                        >
                          <td className="max-w-[16rem] truncate px-4 py-3 font-medium text-zinc-100">
                            {blog.title}
                          </td>
                          <td className="px-4 py-3 text-zinc-400">{authorName(blog.author)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={blog.status} />
                          </td>
                          <td className="px-4 py-3 text-zinc-400">{blog.category}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <BlogActions blog={blog} onDelete={setBlogToDelete} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* cards: phones */}
                <div className="grid gap-3 md:hidden">
                  {filteredBlogs.map((blog) => (
                    <article
                      key={blog._id}
                      className="rounded-xl border border-white/10 bg-[#0e0e10] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-50">
                          {blog.title}
                        </h3>
                        <StatusBadge status={blog.status} />
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">
                        {authorName(blog.author)} · {blog.category || "No category"} ·{" "}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-4">
                        <BlogActions blog={blog} onDelete={setBlogToDelete} full />
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState text="No blogs match your filters." />
            )}
          </section>
        </div>
      </section>

      {/* user details modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User details">
        {selectedUser && (
          <>
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar || "https://via.placeholder.com/80"}
                alt=""
                className="h-16 w-16 rounded-full border border-white/10 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-zinc-50">
                  {selectedUser.username}
                </p>
                <RoleBadge role={selectedUser.role} />
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2.5">
                <dt className="text-xs text-zinc-500">Email</dt>
                <dd className="mt-0.5 break-all text-zinc-200">{selectedUser.email}</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2.5">
                <dt className="text-xs text-zinc-500">Role</dt>
                <dd className="mt-0.5 text-zinc-200">{selectedUser.role}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            >
              Close
            </button>
          </>
        )}
      </Modal>

      {/* delete confirmation modal */}
      <Modal
        open={!!blogToDelete}
        onClose={() => !deleting && setBlogToDelete(null)}
        title="Delete this blog?"
      >
        <p className="text-sm leading-relaxed text-zinc-400">
          <span className="font-medium text-zinc-200">{blogToDelete?.title}</span> will be
          permanently removed. This can't be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setBlogToDelete(null)}
            disabled={deleting}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60 disabled:opacity-60"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {deleting ? "Deleting..." : "Delete blog"}
          </button>
        </div>
      </Modal>
    </main>
  );
};

/* ---------- small pieces ---------- */

const SideButton = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
  >
    <Icon size={16} className="text-orange-500" />
    {label}
  </button>
);

const StatCard = ({ icon: Icon, title, value }) => (
  <Motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="rounded-xl border border-white/10 bg-[#0e0e10] p-4 sm:p-5"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-xs text-zinc-500 sm:text-sm">{title}</h3>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
        <Icon size={14} aria-hidden />
      </span>
    </div>
    <p className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-50 sm:mt-3 sm:text-3xl">
      {value}
    </p>
  </Motion.div>
);

const SectionHeader = ({ title, count, children }) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2.5">
      <h2 className="text-lg font-bold tracking-tight text-zinc-50 sm:text-xl">{title}</h2>
      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-zinc-400">
        {count}
      </span>
    </div>
    {children}
  </div>
);

const SearchBox = ({ value, onChange, placeholder, label }) => (
  <div className="relative w-full sm:w-64">
    <Search
      size={15}
      aria-hidden
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
    />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className={searchClass}
      style={{ caretColor: ACCENT }}
    />
  </div>
);

const StatusBadge = ({ status }) => {
  const published = status === "published";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        published
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          : "border-amber-500/25 bg-amber-500/10 text-amber-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-400" : "bg-amber-400"}`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
};

const RoleBadge = ({ role }) => (
  <span
    className={`inline-block shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
      role === "admin"
        ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
        : "border-white/10 bg-white/[0.04] text-zinc-400"
    }`}
  >
    {role || "user"}
  </span>
);

const BlogActions = ({ blog, onDelete, full = false }) => (
  <div className={`flex gap-2 ${full ? "w-full" : ""}`}>
    <Link
      to={`/admin/update-blog/${blog._id}`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 ${
        full ? "flex-1 py-2.5" : ""
      }`}
    >
      <Pencil size={13} />
      Edit
    </Link>
    <button
      type="button"
      onClick={() => onDelete(blog)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 ${
        full ? "flex-1 py-2.5" : ""
      }`}
    >
      <Trash2 size={13} />
      Delete
    </button>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="rounded-xl border border-white/10 bg-[#0e0e10] px-6 py-10 text-center text-sm text-zinc-500">
    {text}
  </div>
);

const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0e0e10] p-5 shadow-2xl shadow-black/60 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-zinc-50 sm:text-lg">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;