import React from 'react';
import { AiOutlineRobot } from "react-icons/ai"; 

function Header() {
  return (
    <header className="bg-gray-50 relative py-20">
      <div className="mx-6 sm:mx-16 xl:mx-24 text-center">

       
        <div className="inline-flex items-center justify-center gap-2 px-6 py-1.5 mb-6 border border-blue-300 bg-blue-100 rounded-full text-sm text-blue-700 font-medium animate-pulse">
          <AiOutlineRobot size={18} />
          <span>New AI Feature Integrated</span>
        </div>

       
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-snug">
          Your Own <span className="text-blue-600">Blogging</span> Platform
        </h1>

       
        <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-gray-600 text-base sm:text-lg">
          This is your space to think and share information with the world.  
          One word or a thousand, your story starts right here.
        </p>

        <form className="mt-8 flex justify-center w-full max-w-lg mx-auto bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <input
            className="flex-grow px-4 py-3 text-gray-800 placeholder-gray-400 outline-none"
            type="text"
            placeholder="Search for blogs"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-500 transition-all"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
