import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShimmerButton } from "./magicui/shimmer-button";

function ServiceOption() {
  const options = [
    "insurance",
    "appointment scheduling",
    "reservations",
    "mundane calls",
    "customer care",
  ];

  const navigate = useNavigate();

  const navToFAQ = () => {
    navigate("/faq");
  };

  const navToCallForm = () => {
    navigate("/sender");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="container mx-auto mt-20"
    >
      <div className="flex flex-col lg:flex-row bg-transparent text-white justify-between items-center lg:items-start space-y-8 lg:space-y-0">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col w-full lg:w-2/3 h-96 text-white  border border-gray-950 rounded-lg shadow-lg p-9"
        >
          {/* Business Name */}
          <h1 className="text-4xl md:text-6xl font-bold text-white">PyraPhone.AI</h1>

          {/* Header with Typewriter Effect */}
          <h2 className="text-xl md:text-3xl flex mt-4 flex-wrap font-semibold whitespace-nowrap">
            <span className="text-gray-200">Stop wasting time with&nbsp; </span>
            <span className=" inline-block min-w-auto ">
              <span className="text-purple-500">
                <Typewriter
                  options={{
                    strings: options,
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 50,
                    cursor: "|",
                    pauseFor: 1500,
                  }}
                />
              </span>
            </span>
            <div className="text-gray-200">.</div>
          </h2>
          <div className="text-xl md:text-3xl flex mt-4 flex-wrap font-semibold whitespace-nowrap">
            Delegate to AI.
          </div>

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
              className="px-6 py-3 text-white bg-slate-600 rounded-lg "
              transition={{ type: "spring", stiffness: 300 }}
              onClick={navToFAQ}
            >
              FAQ
            </motion.button>
            {/* <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#410a4b",
                color: "#fff",
                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-lg"
              transition={{ type: "spring", stiffness: 300 }}
              onClick={navToCallForm}
            >
              Start for Free
            </motion.button> */}
            <ShimmerButton
          className="px-6 py-3  text-white rounded-lg shadow-lg"
          onClick={navToCallForm}>
          Start for Free
          </ShimmerButton>
          </div>

          <motion.div
            className="flex flex-col  m-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.p
              className="mt-4 text-md text-gray-700 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              100% secure and private
              <motion.span>
                <motion.img
                  src="/padlock.png"
                  alt="Padlock"
                  className="inline-block w-6 h-5 ml-2 bg-transparent"
                />
              </motion.span>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Video Section
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full lg:w-1/3 bg-transparent  h-96 text-white shadow-4xl rounded-lg overflow-hidden hidden lg:block"
        >
          <img
            src="bg.png"
            alt="Hero-Section Image"
            className="w-full h-full ml-2 ring-1"
          ></img>
        </motion.div> */}
      </div>
    </motion.div>
  );
}

export default ServiceOption;
