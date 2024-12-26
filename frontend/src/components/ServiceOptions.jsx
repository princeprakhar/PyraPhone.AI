import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ServiceOption() {
  const options = [
    " insurance",
    " appointment scheduling",
    " reservations",
    " mundane calls",
  ];

  const navigate = useNavigate();

  const navToFAQ = () => {
    navigate("/faq");
  };

  const navToCallForm = () => {
    navigate("/initiate-call");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="container mx-auto p-4"
    >
      <div className="flex flex-col lg:flex-row bg-transparent text-white justify-between items-center lg:items-start space-y-8 lg:space-y-0">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col w-full lg:w-2/3  text-white border rounded-lg shadow-md ring-1 p-6"
        >
          {/* Business Name */}
          <h1 className="text-4xl md:text-6xl font-bold text-white">Call-AI</h1>

          {/* Header with Typewriter Effect */}
          <h2 className="mt-4 text-lg flex flex-row md:text-2xl font-semibold text-gray-200">
            Stop wasting time with{" "}
            <span className="text-purple-500">
              
              <Typewriter
                options={{
                  strings: options,
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                }}
              />
            </span>
            , Delegate to AI.
          </h2>

          {/* Buttons */}
          <div className="flex flex-wrap justify-start space-x-3 mt-6">
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#000000",
                color: "#fff",
                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-slate-400 text-white rounded-lg shadow-lg"
              transition={{ type: "spring", stiffness: 300 }}
              onClick={navToFAQ}
            >
              FAQ
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#410a4a",
                color: "#fff",
                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-lg"
              transition={{ type: "spring", stiffness: 300 }}
              onClick={navToCallForm}
            >
              Start for Free
            </motion.button>
          </div>

          {/* Service Options
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className="flex items-center p-4 bg-gray-50 opacity-80 rounded-lg border shadow-sm hover:bg-blue-50 transition-transform transform hover:scale-105"
              >
                <div className="text-purple-700 font-semibold text-lg capitalize">
                  {option}
                </div>
              </motion.div>
            ))}
          </div>*/}
        </motion.div> 

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full lg:w-1/3 bg-transparent text-white shadow-4xl rounded-lg overflow-hidden hidden lg:block"
        >
          <video
            src="animation.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          ></video>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ServiceOption;
