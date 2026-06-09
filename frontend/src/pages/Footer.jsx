import { Github, Linkedin, Home } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-gray-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <Motion.h2
            whileHover={{ scale: 1.04 }}
            className="text-2xl font-bold text-white"
          >
            Sangam Blog_Website
          </Motion.h2>

          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Sharing thoughts, tutorials, and real-world web development
            experiences.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>

          <ul className="space-y-3">
            <Motion.li whileHover={{ x: 6 }}>
              <Link
                to="/home"
                className="flex items-center gap-2 text-gray-400 transition hover:text-cyan-300"
              >
                <Home size={18} />
                Home
              </Link>
            </Motion.li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Follow Me</h3>

          <div className="flex gap-5">
            <Motion.a
              whileHover={{ scale: 1.12, rotate: 5 }}
              href="https://github.com/SangameshwarGaikwad21"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-white/10 p-3 transition hover:bg-white/15"
            >
              <Github size={20} />
            </Motion.a>

            <Motion.a
              whileHover={{ scale: 1.12, rotate: -5 }}
              href="https://www.linkedin.com/in/sangameshwar-gaikwad-a83426340"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-white/10 p-3 transition hover:bg-white/15"
            >
              <Linkedin size={20} />
            </Motion.a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-500">
        Copyright {new Date().getFullYear()} Sangam Gaikwad. All rights reserved.
      </div>
    </footer>
  );
}
