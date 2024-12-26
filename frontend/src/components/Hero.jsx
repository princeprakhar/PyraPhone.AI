import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


function Hero() {
  const nav = useNavigate("/");

  const navToMakeCall = ()=>{
    nav("/initiate-call")
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 border rounded-lg mb-5 ring-2 bg-white
      bg-gradient-to-bl from-blue-800 to-red-900 bg-opacity-30

    ">
      <motion.div
        className="text-center p-10 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-bold"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
        >
          Stop Wasting Time with Customer Care
        </motion.h1>
        <motion.p
          className="mt-4 text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Let AI handle it for you.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#1E40AF" }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg"
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={navToMakeCall}
        >
          Start for Free
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Hero;
