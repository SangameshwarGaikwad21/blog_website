import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

function Header() {
  return (
    <header className="bg-gray-50 relative py-20 overflow-hidden">
      
      <div className="mx-6 sm:mx-16 xl:mx-24 text-center">

        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-snug"
        >
          Your Own{" "}
          <span className="text-blue-600">
            <Typewriter
              words={["Blogging"]}
              loop={1}
              cursor={false}   // removed cursor line
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={500}
            />
          </span>{" "}
          Platform
        </motion.h1>

        {/* Animated Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 sm:mt-8 max-w-2xl mx-auto text-gray-600 text-base sm:text-lg"
        >
          This is your space to think and share information with the world.
          One word or a thousand, your story starts right here.
        </motion.p>

        {/* Animated Search Box */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex justify-center w-full max-w-lg mx-auto 
          bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md"
        >
          <input
            className="flex-grow px-4 py-3 text-gray-800 
            placeholder-gray-400 outline-none"
            type="text"
            placeholder="Search for blogs"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 font-medium 
            hover:bg-blue-500 transition-all"
          >
            Search
          </button>
        </motion.form>
      </div>

    </header>
  );
}

export default Header;