import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Step = ({ stepNumber, description }) => (
  <motion.div
    className="flex items-start space-x-6 p-6 rounded-lg bg-black/10 backdrop-blur-sm border border-gray-700/30"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale:1.02, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
    transition={{ 
      duration: 0.5, 
      ease: "easeOut",
      scale: {
        type: "spring",
        damping: 15
      }
    }}
  >
    <motion.div 
      className="flex items-center justify-center w-8 h-8 bg-purple-600/80 text-white rounded-full text-sm"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      {stepNumber}
    </motion.div>

    <p className="text-gray-200 text-base leading-relaxed flex-1 pt-1">{description}</p>
  </motion.div>
);

const HowDoesItWork = () => {
  const navigate = useNavigate();
  const containerVariants = {
    
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3
          }
        }
      };
      const navToCallForm = () => {
        navigate("/sender");
      };
    
  return (
    <div className="w-full bg-transparent  py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-2xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How does it work:
        </motion.h2>
        
        <div className="space-y-4">
          <Step
            stepNumber="1"
            description="Give us the phone number that we need to call"
          />
          <Step
            stepNumber="2"
            description="Provide us the objective of the call and any additional details that we need to know, and that's it!"
          />
          <Step
            stepNumber="3"
            description="Our AI will take it from there"
          />
          <Step
            stepNumber="4"
            description="After the call, we will report back to you over email and work with you to figure out consequent actions."
          />
          {/* <Step
            stepNumber="5"
            description="CTA: Continue for free!"
          /> */}
          <motion.button
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
              Continue for Free!
            </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default HowDoesItWork;