import { useState } from "react";
import {
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaLightbulb,
  FaSmile,
  FaShieldAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      id: "q1",
      question: "What is ServiceEase?",
      answer:
        "ServiceEase is a comprehensive platform connecting customers with trusted service providers for a variety of needs, streamlining the booking and management of services.",
      icon: FaLightbulb,
    },
    {
      id: "q2",
      question: "How do I book a service?",
      answer:
        "To book a service, simply browse or search for the desired service category, select a provider, check availability, and confirm your booking through our platform.",
      icon: FaSmile,
    },
    {
      id: "q3",
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit cards, debit cards, and secure online payment methods. Payment is processed securely via our platform once your booking is confirmed.",
      icon: FaQuestionCircle,
    },
    {
      id: "q4",
      question: "Can I cancel or reschedule a booking?",
      answer:
        "Yes, cancellations and rescheduling are possible within the terms set by each service provider. Please check the provider’s policy before booking and contact support if you need assistance.",
      icon: FaQuestionCircle,
    },
    {
      id: "q5",
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We prioritize your privacy and protect your data using industry-standard security measures as detailed in our Privacy Policy.",
      icon: FaShieldAlt,
    },
    {
      id: "q6",
      question: "How do I contact customer support?",
      answer:
        "You can contact our 24/7 support team via the contact page, email, or phone. We are here to assist you with any questions or issues.",
      icon: FaQuestionCircle,
    },
  ];

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.h1
            className="text-5xl font-bold text-base-content mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Frequently Asked <span className="text-primary">Questions</span>
          </motion.h1>
          <motion.p
            className="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Find answers to common questions about ServiceEase. If your question
            isn’t listed, feel free to reach out to our support team.
          </motion.p>
        </section>

        {/* FAQ Section */}
        <motion.section
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="bg-base-200 p-6 mb-6 rounded-lg shadow-md cursor-pointer select-none hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div
                onClick={() => toggleQuestion(faq.id)}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <faq.icon className="text-2xl text-primary flex-shrink-0" />
                  <h3 className="text-xl font-semibold text-base-content">
                    {index + 1}. {faq.question}
                  </h3>
                </div>
                <button className="btn btn-ghost btn-sm">
                  {activeQuestion === faq.id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
              </div>
              <div
                className={`mt-4 text-base-content/80 text-lg leading-relaxed pl-11 ${
                  activeQuestion === faq.id ? "block" : "hidden"
                }`}
              >
                {faq.answer}
              </div>
            </motion.div>
          ))}
        </motion.section>
      </main>

      {/* Contact CTA */}
      <motion.section
        className="py-16 bg-gradient-to-r from-primary to-secondary text-center text-primary-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Still Have Questions?
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Our support team is ready to help and provide personalized assistance.
        </p>
        <Link to="/contact">
          <button className="btn btn-lg btn-secondary rounded-full px-8">
            Contact Support
          </button>
        </Link>
      </motion.section>
    </div>
  );
};

export default FAQ;
