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
  ];

  return (
    <div className="container mx-auto p-6">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold text-purple-600">FAQ Dashboard</h1>
        <p className="text-lg text-gray-700 mt-4">
          Here are some frequently asked questions about our service.
        </p>
      </motion.div>

      <div className="space-y-6">
        {faqItems.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
          >
            <motion.h3
              className="text-xl font-semibold text-purple-500"
              whileHover={{ scale: 1.02 }}
            >
              {faq.question}
            </motion.h3>
            <motion.p
              className="mt-4 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
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
