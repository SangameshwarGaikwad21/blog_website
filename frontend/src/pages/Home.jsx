import { useState } from "react";
import Navbar from "../Components/common/Navbar";
import Header from "../Components/common/Header";
import BlogList from "../Components/blog/BlogList";
import Footer from "./Footer";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <BlogList searchQuery={searchQuery} />
      <Footer />
    </div>
  );
}

export default Home;
