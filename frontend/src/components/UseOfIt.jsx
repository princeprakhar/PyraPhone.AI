import { motion } from "framer-motion";

const UseOfIt = () => {
  return (
    <div className="w-full bg-transparent py-8 px-6">
      <motion.div
        className="w-full mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h3 
          className="text-2xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What can I use this for?
        </motion.h3>
        
        <motion.div
          className="flex items-start space-x-6 p-6 rounded-lg bg-black/10 backdrop-blur-sm border border-gray-700/30"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale:1.02, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center justify-center w-8 h-8 bg-purple-600/80 text-white rounded-full text-sm"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            1
          </motion.div>
          <p className="text-gray-200 text-base leading-relaxed flex-1 pt-1">
            You can use our service to delegate a wide variety of tasks: customer service, getting refunds, doctor appointments, reservations, or anything else that needs a phone call and can save you time.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UseOfIt;