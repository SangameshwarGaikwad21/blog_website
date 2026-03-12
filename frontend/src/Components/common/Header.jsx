"use client";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

function Header() {
  return (
    <header className="relative py-28 overflow-hidden bg-gray-50">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-400 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute top-20 -right-24 w-96 h-96 bg-blue-400 opacity-30 blur-3xl rounded-full"></div>
      <div className="relative mx-6 sm:mx-16 xl:mx-24 text-center">

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-gray-800"
        >
          Your Own{" "}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            <Typewriter
             words={["Blogging","TechNotes","CodeStories"]}
              loop={0}
              cursor={false}
              typeSpeed={80}
              deleteSpeed={80}
              delaySpeed={1200}
            />
          </span>{" "}
          Platform
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl mx-auto text-gray-600 text-lg"
        >
          Share your ideas with the world. Write, publish and explore beautiful
          stories from creators everywhere.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex w-full max-w-xl bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl overflow-hidden">

            <input
              type="text"
              placeholder="Search amazing blogs..."
              className="flex-grow px-6 py-4 outline-none text-gray-700 bg-transparent"
            />

            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              Search
            </button>

          </div>
        </motion.form>

      </div>
    </header>
  );
}

export default Header;