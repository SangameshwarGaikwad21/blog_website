import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, User, LayoutDashboard, Menu, X, Search } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

function Navbar({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  const closeAndNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    navigate("/home");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between">
          <Motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => closeAndNavigate("/home")}
            className="cursor-pointer text-2xl font-extrabold tracking-wide text-white"
          >
            Blog_App
          </Motion.div>

          <Motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(!open)}
            className="rounded-full border border-white/10 p-2 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </Motion.button>
        </div>

        <div className="flex w-full items-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl shadow-black/30 transition focus-within:border-cyan-400/70 lg:max-w-xl">
          <Search size={20} className="shrink-0 text-cyan-300" />
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search blogs by title, content, category, or author"
            className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500 sm:text-base"
          />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/createblog")}
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 font-semibold text-black transition hover:bg-cyan-300"
          >
            <PlusCircle size={18} />
            Create Blog
          </Motion.button>

          {user?.role === "admin" && (
            <Motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-white transition hover:border-cyan-300/60 hover:bg-white/10"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </Motion.div>
          )}

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 font-medium text-white transition hover:bg-white/15"
          >
            <User size={18} />
            Profile
          </Motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 border-t border-white/10 bg-black px-6 py-6 lg:hidden"
          >
            <Motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => closeAndNavigate("/createblog")}
              className="flex w-full items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-black shadow-md"
            >
              <PlusCircle size={18} />
              Create Blog
            </Motion.button>

            {user?.role === "admin" && (
              <Motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-white shadow-md"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              </Motion.div>
            )}

            <Motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => closeAndNavigate("/profile")}
              className="flex w-full items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-white shadow-md"
            >
              <User size={18} />
              Profile
            </Motion.button>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
