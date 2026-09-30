import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlusCircle, User, LayoutDashboard, Menu, X, Search } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const ACCENT = "#ff6b0a";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function Navbar({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getStoredUser();
  const [open, setOpen] = useState(false);

  // close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeAndNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (pathname !== "/home") navigate("/home");
  };

  const isActive = (path) => pathname === path;

  const ghostLink = (path) =>
    `flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 ${
      isActive(path)
        ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
        : "border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
    }`;

  const avatar = user?.avatar ? (
    <img
      src={user.avatar}
      alt=""
      className="h-5 w-5 rounded-full object-cover"
    />
  ) : (
    <User size={16} />
  );

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08080a]/80 backdrop-blur-xl"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-6">
        {/* logo */}
        <Link
          to="/home"
          onClick={() => setOpen(false)}
          className="order-1 flex items-center gap-2 rounded-md text-lg font-extrabold tracking-tight text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: ACCENT, boxShadow: "0 0 12px rgba(255,107,10,0.8)" }}
          />
          Blog_App
        </Link>

        {/* mobile menu button */}
        <Motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen((v) => !v)}
          className="order-2 ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-200 transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </Motion.button>

        {/* search: full row on mobile, centered on desktop */}
        <div
          role="search"
          className="order-3 flex w-full items-center rounded-lg border border-white/10 bg-white/[0.03] px-3.5 transition focus-within:border-orange-500/70 focus-within:bg-white/[0.05] focus-within:ring-2 focus-within:ring-orange-500/20 lg:order-2 lg:max-w-md lg:flex-1"
        >
          <Search size={16} aria-hidden className="shrink-0 text-zinc-500" />
          <label htmlFor="nav-search" className="sr-only">
            Search blogs
          </label>
          <input
            id="nav-search"
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search blogs"
            className="ml-2.5 w-full bg-transparent py-2.5 text-base text-white outline-none placeholder:text-zinc-500 sm:text-sm"
            style={{ caretColor: ACCENT }}
          />
        </div>

        {/* desktop actions */}
        <div className="order-3 ml-auto hidden items-center gap-2 lg:flex">
          <Motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/createblog")}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
            style={{ backgroundColor: ACCENT, boxShadow: "0 0 20px rgba(255,107,10,0.25)" }}
          >
            <PlusCircle size={16} />
            Create blog
          </Motion.button>

          {user?.role === "admin" && (
            <Link to="/dashboard" className={ghostLink("/dashboard")}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}

          <Link to="/profile" className={ghostLink("/profile")}>
            {avatar}
            Profile
          </Link>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <Motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-[#08080a] lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => closeAndNavigate("/createblog")}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
                style={{ backgroundColor: ACCENT }}
              >
                <PlusCircle size={16} />
                Create blog
              </button>

              {user?.role === "admin" && (
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className={`${ghostLink("/dashboard")} w-full justify-center py-3`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className={`${ghostLink("/profile")} w-full justify-center py-3`}
              >
                {avatar}
                Profile
              </Link>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;