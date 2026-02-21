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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-gray-900/90 border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="text-2xl font-extrabold tracking-wide cursor-pointer 
          bg-gradient-to-r from-blue-400 to-purple-500 
          bg-clip-text text-transparent"
        >
          Blog_App
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/createblog")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
              bg-gradient-to-r from-purple-500 to-blue-500
              hover:opacity-90 transition-all shadow-md text-white"
          >
            <PlusCircle size={18} />
            Create Blog
          </motion.button>

          {user?.role === "admin" && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-purple-500 to-blue-500
                hover:opacity-90 transition-all shadow-md text-white"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-4 py-2 rounded-full
              bg-gray-100 hover:bg-gray-200 transition-all shadow-sm
              text-gray-900"
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
          {open ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </div>

      {/* Mobile Dropdown with Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 border-t border-gray-800 px-6 py-4 space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                navigate("/createblog");
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg
              bg-gradient-to-r from-purple-500 to-blue-500
              text-white"
            >
              <PlusCircle size={18} />
              Create Blog
            </motion.button>

            {user?.role === "admin" && (
              <motion.div whileHover={{ scale: 1.03 }}>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-gradient-to-r from-purple-500 to-blue-500
                  text-white"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg
              bg-gray-100 text-gray-900"
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