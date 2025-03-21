// import { motion } from "framer-motion";

// function FAQDashboard() {
//   const faqItems = [
//     {
//       question: "How much does it cost after the free trial?",
//       answer: "$1 per call!",
//     },
//     {
//       question: "What if it takes more calls?",
//       answer:
//         "If we have to make multiple calls, 60 mins of talk time is included in this fee, and the cost will increase for any additional calls beyond that.",
//     },
//     {
//       question: "Is there a limit to how many calls can be made?",
//       answer:
//         "There is no specific limit, but charges apply based on the number of calls and the duration of each call beyond the included 60 minutes.",
//     },
//     {
//       question: "Is my information confidential?",
//       answer:
//         "Yes. Your information is 100% secure and private. We do not share your information with any third parties.",
//     },
//   ];

//   return (
//     <div className="container  p-6 ">
//       <motion.div
//         className="text-center mb-10"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <h1 className="text-4xl font-bold text-purple-600">FAQ Dashboard</h1>
//         <p className="text-lg text-gray-700 mt-4">
//           Here are some frequently asked questions about our service.
//         </p>
//       </motion.div>

//       <div className="space-y-6">
//         {faqItems.map((faq, index) => (
//           <motion.div
//             key={index}
//             className="bg-white p-6 rounded-lg shadow-md border hover:shadow-md"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 * index, duration: 0.5 }}
//           >
//             <motion.h3
//               className="text-xl font-semibold text-purple-500"
//               whileHover={{ scale: 1.02 }}
//             >
//               {faq.question}
//             </motion.h3>
//             <motion.p
//               className="mt-4 text-gray-600"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               {faq.answer}
//             </motion.p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FAQDashboard;



import { motion } from "framer-motion";

function FAQDashboard() {
  const faqItems = [
    {
      question: "How much does it cost after the free trial?",
      answer: "$1 per call!",
    },
    {
      question: "What if it takes more calls?",
      answer:
        "If we have to make multiple calls, 60 mins of talk time is included in this fee, and the cost will increase for any additional calls beyond that.",
    },
    {
      question: "Is there a limit to how many calls can be made?",
      answer:
        "There is no specific limit, but charges apply based on the number of calls and the duration of each call beyond the included 60 minutes.",
    },
    {
      question: "Is my information confidential?",
      answer:
        "Yes. Your information is 100% secure and private. We do not share your information with any third parties.",
    },
  ];

  return (
    <div className="w-full pt-24 px-4 md:px-6 lg:px-8 min-h-screen">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600">FAQ Dashboard</h1>
        <p className="text-base md:text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
          Here are some frequently asked questions about our service.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {faqItems.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * index, duration: 0.5 }}
          >
            <motion.h3
              className="text-lg md:text-xl font-semibold text-purple-500"
              whileHover={{ scale: 1.01 }}
            >
              {faq.question}
            </motion.h3>
            <motion.p
              className="mt-3 text-sm md:text-base text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {faq.answer}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FAQDashboard;