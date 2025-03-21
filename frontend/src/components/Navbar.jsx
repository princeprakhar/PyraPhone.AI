import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShimmerButton } from "./magicui/shimmer-button";

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

  const navToContact = () => {
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
      <motion.div>
      </motion.div>

      {/* Right Navigation with Moving Shimmer Effect */}
      <div className="relative shimmer-container">
        <motion.nav
          className={`rounded-lg transition-colors duration-300 relative z-10 ${
            isScrolled
              ? "bg-black shadow-lg backdrop-blur-md"
              : "bg-black opacity-90"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* The rest of your navbar content remains the same */}
          <div className="flex items-center justify-between px-4 py-3 gap-6">
            
            <a
              href="/"
              className="text-lg  font-bold text-gray-200 md:mr-4"
            >
              PyraPhone.AI
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="/"
                className="text-gray-200 hover:text-blue-500 transition-colors"
              >
                Home
              </a>
              <Button
                variant="default"
                className="bg-black text-white hover:bg-gray-700"
                onClick={navToContact}
              >
                Contact Us
              </Button>
              <Button
                variant="default"
                className="bg-slate-600 text-white hover:bg-gray-700"
                onClick={navToFAQ}
              >
                FAQ
              </Button>
              {/* <Button
                variant="default"
                className="bg-purple-500 text-white hover:bg-purple-800"
                onClick={navToCallForm}
              >
                Start For Free
              </Button> */}
              <ShimmerButton
              onClick={navToCallForm}
              >
                  Start for Free
              </ShimmerButton>

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
              
              <>
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
              </>
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
        
        {/* Moving Shimmer border effect */}
        <div className="moving-shimmer-border"></div>
      </div>
    </div>
  );
}

export default Navbar;