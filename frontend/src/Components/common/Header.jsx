"use client";
import { motion as Motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Search } from "lucide-react";

function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]"></div>

      <div className="relative mx-auto max-w-5xl text-center">
        <Motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold leading-tight text-white sm:text-6xl md:text-7xl"
          >
        Share Your{" "}
        <span className="text-cyan-300">
          <Typewriter
            words={["Blog","Stories", "Ideas"]}
            loop={0}
            cursor={false}
            typeSpeed={80}
            deleteSpeed={80}
            delaySpeed={1200}
          />
          </span>{" "}
          With the World
        </Motion.h1>
        <Motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg"
        >
          Share your ideas with the world. Write, publish and explore beautiful
          stories from creators everywhere.
        </Motion.p>

        <Motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
          onSubmit={(event) => event.preventDefault()}
        >
          
        </Motion.form>
      </div>
    </header>
  );
}

export default Header;
