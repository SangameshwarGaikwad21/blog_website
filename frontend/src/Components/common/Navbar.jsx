import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  User,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full 
    backdrop-blur-xl bg-gray-900/70 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="text-2xl font-extrabold tracking-wide cursor-pointer 
          bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500
          bg-clip-text text-transparent"
        >
          Blog_App
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">

          {/* Create Blog */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/createblog")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-purple-500 to-blue-500
            hover:shadow-lg hover:shadow-purple-500/30
            transition-all text-white"
          >
            <PlusCircle size={18} />
            Create Blog
          </motion.button>

          {/* Dashboard */}
          {user?.role === "admin" && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-indigo-500 to-purple-500
                hover:shadow-lg hover:shadow-indigo-500/30
                transition-all text-white"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </motion.div>
          )}

          {/* Profile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-white/90 hover:bg-white
            text-gray-900 font-medium shadow-md transition-all"
          >
            <User size={18} />
            Profile
          </motion.button>

        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-gray-900/95 border-t border-white/10 px-6 py-6 space-y-4"
          >

            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => {
                navigate("/createblog");
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl
              bg-gradient-to-r from-purple-500 to-blue-500
              text-white shadow-md"
            >
              <PlusCircle size={18} />
              Create Blog
            </motion.button>

            {user?.role === "admin" && (
              <motion.div whileHover={{ scale: 1.04 }}>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  text-white shadow-md"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl
              bg-white text-gray-900 shadow-md"
            >
              <User size={18} />
              Profile
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;