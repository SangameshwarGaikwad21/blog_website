import { Github, Linkedin, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 text-gray-300 overflow-hidden">

      {/* Glow background */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute top-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <motion.h2
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r 
            from-blue-400 via-purple-500 to-pink-500 
            bg-clip-text text-transparent"
          >
            Sangam Blog_Website
          </motion.h2>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Sharing thoughts, tutorials, and real-world web development
            experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3">

            <motion.li whileHover={{ x: 6 }}>
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
              >
                <Home size={18} />
                Home
              </Link>
            </motion.li>

          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Follow Me
          </h3>

          <div className="flex gap-5">

            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="https://github.com/SangameshwarGaikwad21"
              target="_blank"
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <Github size={20} />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              href="https://www.linkedin.com/in/sangameshwar-gaikwad-a83426340"
              target="_blank"
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <Linkedin size={20} />
            </motion.a>

          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sangam Gaikwad. All rights reserved.
      </div>

    </footer>
  );
}