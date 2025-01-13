import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const navToCallForm = () => {
    navigate("/sender");
  };

  const navToFAQ = () => {
    navigate("/faq");
  };

  const navToContact = () =>{
    navigate("/contact")
  }
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full fixed top-4 px-4 z-40 flex justify-between items-center">
      {/* Left Logo */}
      <motion.div
        className={`rounded-lg p-1 mx-4 sm:hidden md:block ${
          isScrolled
            ? "bg-white shadow-lg backdrop-blur-md"
            : "bg-slate-200 opacity-90"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <a href="/">
        <img 
          src="/Call-AI-logo.png" 
          alt="Call-AI Logo" 
          className="w-8 h-8 md:w-24  md:h-14 md bg-cover"
        />
        </a>
      </motion.div>

      {/* Right Navigation */}
      <motion.nav
        className={`rounded-lg transition-colors duration-300 ${
          isScrolled
            ? "bg-white shadow-lg backdrop-blur-md"
            : "bg-slate-200 opacity-90"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-4 py-3 gap-6">
          <a
            href="/"
            className="text-lg font-bold text-gray-800 md:mr-4"
          >
            Call-AI
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-gray-900 hover:text-blue-500 transition-colors"
            >
              Home
            </a>
            <Button
              variant="default"
              className="bg-black text-white hover:bg-gray-700"
              onClick={navToContact}
            >
              Contact-US
            </Button>
            <Button
              variant="default"
              className="bg-slate-600 text-white hover:bg-gray-700"
              onClick={navToFAQ}
            >
              FAQ
            </Button>
            <Button
              variant="default"
              className="bg-purple-500 text-white hover:bg-purple-800"
              onClick={navToCallForm}
            >
              Start For Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-800 hover:text-blue-500 focus:outline-none"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-md border-t mt-2 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a
              href="/"
              className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/contact"
              className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <button
              onClick={() => {
                navToFAQ();
                setMobileMenuOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-blue-100"
            >
              FAQ
            </button>
            <button
              onClick={() => {
                navToCallForm();
                setMobileMenuOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-purple-100"
            >
              Start For Free
            </button>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
}

export default Navbar;